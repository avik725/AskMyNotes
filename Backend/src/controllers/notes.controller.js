import mongoose from "mongoose";
import { asyncHandler } from "../utilities/asyncHandler.js";
import { apiError } from "../utilities/apiError.js";
import { apiResponse } from "../utilities/apiResponse.js";
import clearFiles from "../utilities/clearFiles.js";
import { Notes } from "../models/notes.model.js";
import { uploadOnCloudinary } from "../utilities/cloudinary.js";
import { User } from "../models/user.model.js";
import { Stream } from "../models/streams.model.js";
import { Course } from "../models/courses.model.js";

const uploadNotes = asyncHandler(async (req, res, next) => {
  //get data from frontend
  //validate the data
  //check if notes_file exist
  //upload notes_file and thumbnail to cloudinary
  //create an object and add document in mongodb
  //return response

  try {
    const data = req.body;

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
      notes_file = await uploadOnCloudinary(notesFileLocalPath);
      if (!notes_file) {
        clearFiles(req);
        throw new apiError(400, "Something went wrong with cloudinary");
      }
    }

    let thumbnail;
    if (thumbnailLocalPath) {
      thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
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

    return res
      .status(200)
      .json(new apiResponse(200, notes, "Notes Uploaded Successfully !!"));
  } catch (error) {
    throw new apiError(500, "Something went wrong", error);
  }
});

const getMyUploads = asyncHandler(async (req, res, next) => {
  //get userid from request
  //fetch notes from db by user_id
  //return response
  try {
    const { page = 1, limit = 10 } = req.query;

    const filters = {
      owner: req.user._id,
    };

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: [
        { path: "stream", select: "name" },
        { path: "course", select: "name" },
      ],
    };
    const notes = await Notes.paginate(filters, options);

    if (!notes) {
      throw new apiError(500, "Something went wrong");
    }

    let downloads = 0;
    notes.docs.map((upload) => (downloads += upload.downloads));

    return res.status(200).json(
      new apiResponse(
        200,
        {
          total_uploads: notes.docs.length,
          total_downloads: downloads,
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
    const streams = await Stream.find().select("name");
    const all_notes = await Notes.find().populate({path: "course", select: "name"});

    let streamWiseNotes = [];

    streams.map((stream) => {
      let notes = all_notes.filter((note) => {
        return ((String(note.stream) === String(stream._id)) && note.thumbnail);
      });
      if (Array.isArray(notes) && notes.length > 0) {
        streamWiseNotes.push({ stream: stream.name, notes: notes });
      }
    });

    const top2 = streamWiseNotes
      .sort((a, b) => b.notes.length - a.notes.length)
      .slice(0, 2);

    return res
      .status(200)
      .json(
        new apiResponse(200, top2, "Data Fetched Successfully !!")
      );
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
      sort,
      search,
    } = req.query;

    const filters = {};
    if (stream) filters.stream = stream;
    if (course) filters.course = course;
    if (semester) filters.semester = semester;
    if (search) filters.title = { $regex: search, $options: "i" };

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort:
        sort == 2
          ? { createdAt: 1 }
          : sort == 3
            ? { title: 1 }
            : { createdAt: -1 },
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

export {
  uploadNotes,
  getMyUploads,
  getNotes,
  getFiltersData,
  getFeaturesNotes,
  getStreams,
  getCourses,
  getStreamWiseNotes,
};
