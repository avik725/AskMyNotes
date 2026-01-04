import { apiError } from "../utilities/apiError.js";
import { asyncHandler } from "../utilities/asyncHandler.js";
import { PrivateNotes } from "../models/privateNotes.model.js";
import { PrivateNotesChunks } from "../models/privateNotesChunks.js";
import { apiResponse } from "../utilities/apiResponse.js";
import {
  getOpenAIEmbeddingModel,
  getTextSplitter,
} from "../utilities/RagIntegrationHelpers.js";

const OpenAIembeddings = getOpenAIEmbeddingModel();

const createPrivateNotes = asyncHandler(async (req, res, next) => {
  //get data from frontend
  //validate the data
  //create chunks of the content text
  //create an object and add an document mongodb
  //return response

  const data = req?.body;

  if (
    !data.title ||
    !data.type ||
    !data.contentText ||
    !data.contentJson ||
    [data.title, data.type, data.contentText].some(
      (field) => typeof field !== "string" || field.trim() === ""
    )
  ) {
    throw new apiError(400, "All Fields are Required");
  }

  if (
    ![
      "pkm",
      "study",
      "thought",
      "task",
      "project",
      "journal",
      "memory",
      "other",
    ].includes(data?.type)
  ) {
    throw new apiError(400, "Invalid Private Note Type");
  }

  const notes = await PrivateNotes.create({
    title: data?.title.toLowerCase(),
    type: data?.type,
    owner: req.user?._id,
    contentText: data.contentText,
    contentJson: data.contentJson,
  });

  if (!notes) {
    throw new apiError(500, "Something went wrong while saving notes in DB");
  }

  const textSplitter = getTextSplitter(500);
  const texts = await textSplitter.splitText(data?.contentText);

  const vectors = await Promise.all(
    texts.map((text) => OpenAIembeddings.embedQuery(text))
  );

  const documents = texts.map((text, i) => ({
    note_id: notes._id,
    owner: req.user._id,
    chunk_index: i + 1,
    chunk_text: text,
    embedding: vectors[i],
  }));

  if (!documents.length) {
    throw new apiError(500, "Something Went Wrong whle Chunking");
  }

  await PrivateNotesChunks.insertMany(documents);

  return res
    .status(200)
    .json(new apiResponse(200, notes, "Private Notes Created Successfully !!"));
});

const getPrivateNotes = asyncHandler(async (req, res, next) => {
  const notes = await PrivateNotes.find({
    owner: req?.user?._id,
  }).select("-owner -is_deleted -deleted_at");

  return res
    .status(200)
    .json(new apiResponse(200, notes, "Private Notes Fetched Successfully !!"));
});

const updatePrivateNotes = asyncHandler(async (req, res, next) => {
  const {
    _id,
    title = "",
    type = "",
    contentJson,
    contentText = "",
  } = req?.body;

  if (!_id) {
    throw new apiError(400, "Id is required !!");
  }

  if (
    (contentText && typeof contentText !== "string") ||
    (title && typeof title !== "string") ||
    (type && typeof type !== "string")
  ) {
    throw new apiError(
      400,
      "Title, Type and Text Content should be in String !!"
    );
  }

  const updates = {
    ...(title && { title }),
    ...(type && { type }),
    ...(contentJson && { contentJson }),
    ...(contentText && { contentText }),
  };

  const updatedNote = await PrivateNotes.findByIdAndUpdate(
    _id,
    { $set: updates },
    { new: true }
  ).select("-owner -is_deleted -deleted_at");

  if (!updatedNote) {
    throw new apiError(
      500,
      "Something went wrong while updates private notes !!"
    );
  }

  if (contentText && contentJson) {
    PrivateNotesChunks.deleteMany({ note_id: _id }).catch((error) =>
      console.error(error)
    );

    const textSplitter = getTextSplitter(500);
    const texts = await textSplitter.splitText(contentText);

    const vectors = await Promise.all(
      texts.map((text) => OpenAIembeddings.embedQuery(text))
    );

    const documents = texts.map((text, i) => ({
      note_id: updatedNote._id,
      owner: req.user._id,
      chunk_index: i + 1,
      chunk_text: text,
      embedding: vectors[i],
    }));

    if (!documents.length) {
      throw new apiError(500, "Something Went Wrong whle Chunking");
    }
    await PrivateNotesChunks.insertMany(documents);
  }

  return res
    .status(200)
    .json(new apiResponse(200, updatedNote, "Notes Updated Successfully !!"));
});

const deletePrivateNotes = asyncHandler(async (req, res, next) => {
  const { id } = req?.params;

  if (!id) {
    throw new apiError(400, "Note Id is Required !!");
  }

  const result = await PrivateNotes.softDeleteById(id);

  await PrivateNotesChunks.deleteMany({ note_id: id });

  if (result.matchedCount === 0) {
    throw new apiError(404, "Note not found or already deleted");
  }

  return res
    .status(200)
    .json(new apiResponse(200, null, "Note deleted Successfully !!"));
});

export {
  createPrivateNotes,
  getPrivateNotes,
  updatePrivateNotes,
  deletePrivateNotes,
};
