import mongoose from "mongoose";
import { asyncHandler } from "../utilities/asyncHandler.js";
import { apiError } from "../utilities/apiError.js";
import { apiResponse } from "../utilities/apiResponse.js";
import clearFiles from "../utilities/clearFiles.js";
import { Notes } from "../models/notes.model.js";
import { NotesChunks } from "../models/notesChunks.model.js";
import { uploadOnCloudinary } from "../utilities/cloudinary.js";
import { User } from "../models/user.model.js";
import { Stream } from "../models/streams.model.js";
import { Course } from "../models/courses.model.js";
import path from "path";
import {
  getOpenAIEmbeddingModel,
  getTextSplitter,
  extractText,
} from "../utilities/ragIntegrationHelpers.js";

const OpenAIembeddings = getOpenAIEmbeddingModel();

const uploadNotes = asyncHandler(async (req, res, next) => {
  //get data from frontend
  //validate the data
  //check if notes_file exist
  //upload notes_file and thumbnail to cloudinary
  //create an object and add document in mongodb
  //return response

  try {
    const data = req?.body;

    if (
      !data.title ||
      !data.stream ||
      !data.course ||
      [data.title, data.stream, data.course].some(
        (field) => typeof field !== "string" || field.trim() === ""
      )
    ) {
      clearFiles(req);
      throw new apiError(400, "All Fields Are Required");
    }

    let notesFileLocalPath;
    if (
      req.files &&
      Array.isArray(req.files.notes_file) &&
      req.files.notes_file.length > 0
    ) {
      notesFileLocalPath = req.files.notes_file[0].path;
    }

    if (!notesFileLocalPath) {
      clearFiles(req);
      throw new apiError(400, "Notes File is required");
    }

    let thumbnailLocalPath;
    if (
      req.files &&
      Array.isArray(req.files.thumbnail) &&
      req.files.thumbnail.length > 0
    ) {
      thumbnailLocalPath = req.files.thumbnail[0].path;
    }

    let notes_file;
    if (notesFileLocalPath) {
      notes_file = await uploadOnCloudinary(
        notesFileLocalPath,
        "public_notes/documents"
      );
      if (!notes_file) {
        clearFiles(req);
        throw new apiError(400, "Something went wrong with cloudinary");
      }
    }

    let thumbnail;
    if (thumbnailLocalPath) {
      thumbnail = await uploadOnCloudinary(
        thumbnailLocalPath,
        "public_notes/thumbnails"
      );
      if (!thumbnail) {
        clearFiles(req);
        throw new apiError(400, "Something went wrong with cloudinary");
      }
    }

    const notes = await Notes.create({
      title: data.title.toLowerCase(),
      stream: data.stream,
      course: data.course,
      semester: data.semester || null,
      description: data.description || "",
      owner: req.user?._id,
      thumbnail: thumbnail ? thumbnail.url : "",
      file_url: notes_file ? notes_file.url : "",
    });

    if (!notes) {
      throw new apiError(500, "Something went wrong while uploading notes");
    }

    const cleanUrl = notes_file.url.split("?")[0];
    const ext = path.extname(cleanUrl).slice(1).toLowerCase();
    console.log({ ext });

    const text = await extractText(notes_file.url, ext);
    //console.log( text.length)
    const textSplitter = getTextSplitter(500);
    //console.log({ textSplitter })

    const chunks = await textSplitter.splitText(text);
    console.log(chunks.length);
    console.log("Chunks type:", Array.isArray(chunks));
    console.log("Chunks length:", chunks.length);
    console.log("First chunk:", chunks[0]);
    console.log("First chunk type:", typeof chunks[0]);

    const vectors = await Promise.all(
      chunks.map((chunk) => OpenAIembeddings.embedQuery(chunk))
    );
    console.log("Vectors created:", vectors.length);

    const documents = chunks.map((chunk, i) => ({
      note_id: notes._id,
      owner: req.user._id,
      chunk_index: i + 1,
      chunk_text: chunk,
      embedding: Array.from(vectors[i]),
    }));
    console.log({ documents });

    if (!documents.length) {
      throw new apiError(500, "Something Went Wrong while Chunking");
    }

    await NotesChunks.insertMany(documents);

    return res
      .status(200)
      .json(new apiResponse(200, notes, "Notes Uploaded Successfully !!"));
  } catch (error) {
    throw new apiError(500, "Something went wrong", error);
  }
});

const getMyUploads = asyncHandler(async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      column = "createdAt",
      dir = "desc",
    } = req.query;

    let sortingOrder;
    if (column && dir) {
      const allowedColumns = ["title", "course"];
      if (allowedColumns.includes(column)) {
        const sortDir = String(dir).toLowerCase() === "desc" ? -1 : 1;
        sortingOrder = { [column]: sortDir };
      }
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sortingOrder || { createdAt: -1 },
    };

    const myAggregate = Notes.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(req.user._id),
          ...(search && { title: { $regex: search, $options: "i" } }),
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "course",
        },
      },
      {
        $unwind: {
          path: "$course",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "streams",
          localField: "stream",
          foreignField: "_id",
          as: "stream",
        },
      },
      {
        $unwind: {
          path: "$stream",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          course: { _id: "$course._id", name: "$course.name" },
          stream: { _id: "$stream._id", name: "$stream.name" },
          file_url: 1,
          thumbnail: 1,
          title: 1,
          semester: 1,
          description: 1,
          is_verified: 1,
          // owner: 1,
          // downloads: 1,
        },
      },
    ]);

    //pipeline to calculate downloads
    const downloadsPipeline = [
      {
        $match: {
          owner: new mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $group: {
          _id: null,
          totalDownloads: { $sum: "$downloads" },
        },
      },
    ];

    const [notes, totalDownloadsResult] = await Promise.all([
      Notes.aggregatePaginate(myAggregate, options),
      Notes.aggregate(downloadsPipeline),
    ]);

    if (!notes) {
      throw new apiError(500, "Something went wrong");
    }

    // Return 0 Downloads if user has No uploads
    const total_downloads =
      totalDownloadsResult.length > 0
        ? totalDownloadsResult[0].totalDownloads
        : 0;

    return res.status(200).json(
      new apiResponse(
        200,
        {
          total_uploads: notes.totalDocs,
          total_downloads: total_downloads,
          uploads: notes,
        },
        "Data Fetched Successfully !!"
      )
    );
  } catch (error) {
    throw new apiError(500, error.message, [error]);
  }
});

const getStreamWiseNotes = asyncHandler(async (req, res, next) => {
  try {
    const pipeline = [
      {
        $match: {
          $expr: {
            $ne: [{ $ifNull: ["$thumbnail", ""] }, ""],
          },
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "course",
        },
      },
      {
        $unwind: {
          path: "$course",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$stream",
          notesCount: { $sum: 1 },
          notes: {
            $push: {
              _id: "$_id",
              title: "$title",
              thumbnail: "$thumbnail",
              file_url: "$file_url",
              is_verified: "$is_verified",
              semester: "$semester",
              year: "$year",
              course: {
                _id: "$course._id",
                name: "$course.name",
              },
            },
          },
        },
      },
      { $sort: { notesCount: -1 } },
      { $limit: 2 },
      {
        $lookup: {
          from: "streams",
          localField: "_id",
          foreignField: "_id",
          as: "stream",
        },
      },
      { $unwind: "$stream" },
      {
        $project: {
          _id: 0,
          stream: {
            _id: "$stream._id",
            name: "$stream.name",
          },
          notes: { $slice: ["$notes", 10] }, //slices notes to 10
        },
      },
    ];

    const data = await Notes.aggregate(pipeline);

    return res
      .status(200)
      .json(new apiResponse(200, data, "Data Fetched Successfully !!"));
  } catch (error) {
    throw new apiError(500, "Something went wrong", error);
  }
});

const getNotes = asyncHandler(async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      stream,
      course,
      semester,
      search,
      column = "createdAt",
      dir = "desc",
    } = req.query;

    const filters = {};
    if (stream) filters.stream = stream;
    if (course) filters.course = course;
    if (semester) filters.semester = semester;
    if (search) filters.title = { $regex: search, $options: "i" };

    let sortingOrder;
    if (column && dir) {
      const allowedColumns = ["title", "course", "createdAt"];
      if (allowedColumns.includes(column)) {
        const sortDir = String(dir).toLowerCase() === "desc" ? -1 : 1;
        sortingOrder = { [column]: sortDir };
      }
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sortingOrder || { createdAt: -1 },
      populate: [
        { path: "stream", select: "name" },
        { path: "course", select: "name" },
      ],
    };

    const result = await Notes.paginate(filters, options);

    if (!result) {
      throw new apiError(500, "Something went wrong");
    }

    return res
      .status(200)
      .json(new apiResponse(200, result, "Data Fetched Successfully"));
  } catch (error) {
    throw new apiError(500, "Something went wrong", error);
  }
});

const getFeaturesNotes = asyncHandler(async (req, res, next) => {
  try {
    const notes = await Notes.find()
      .populate("stream", "name")
      .populate("course", "name");

    if (!notes) {
      throw new apiError(500, "Something Went Wrong with Database");
    }

    let featuredNotes = [];
    notes.forEach((note) => {
      if (note.thumbnail !== "" || note.thumbnail === null)
        featuredNotes.push(note);
    });

    return res
      .status(200)
      .json(new apiResponse(200, featuredNotes, "Data Fetched Successfully"));
  } catch (error) {
    throw new apiError(500, "Something went wrong", error);
  }
});

const getFiltersData = asyncHandler(async (req, res, next) => {
  try {
    const filterData = await Stream.find().populate("courses");

    return res
      .status(200)
      .json(new apiResponse(200, filterData, "Data Fetched Successfully"));
  } catch (error) {
    throw new apiError(500, "Something went wrong", error);
  }
});

const getStreams = asyncHandler(async (req, res, next) => {
  try {
    const streams = await Stream.find().select("name");

    if (!streams) {
      throw new apiError(500, "Something went wrong with database");
    }

    return res
      .status(200)
      .json(new apiResponse(200, streams, "Streams Fetched Successfully"));
  } catch (error) {
    throw new apiError(500, "Something went wrong", error);
  }
});

const getCourses = asyncHandler(async (req, res, next) => {
  try {
    const { stream } = req.query;

    let courses;

    if (stream) {
      const stream_object = await Stream.findById(stream).populate("courses");
      courses = stream_object.courses;
    } else {
      courses = await Course.find();
    }

    if (!courses) {
      throw new apiError(500, "Something went wrong with database");
    }
    return res
      .status(200)
      .json(new apiResponse(200, courses, "Courses Fetched Successfully !!"));
  } catch (error) {
    throw new apiError(500, "Something went wrong", error);
  }
});

const incrementNoteDownload = asyncHandler(async (req, res, next) => {
  const { noteId } = req?.query;

  await Notes.findByIdAndUpdate(noteId, {
    $inc: { ["downloads"]: 1 },
  });

  return res.status(200).json(new apiResponse(200, null, "Request Success !!"));
});

export {
  uploadNotes,
  getMyUploads,
  getNotes,
  getFiltersData,
  getFeaturesNotes,
  getStreams,
  getCourses,
  getStreamWiseNotes,
  incrementNoteDownload,
};
