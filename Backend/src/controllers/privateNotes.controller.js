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
  try {
    const data = req?.body;

    if (
      !data.title ||
      !data.type ||
      !data.contentText ||
      !data.contentJson ||
      [data.title, data.type, data.contentJson, data.contentText].some(
        (field) => typeof field !== "string" || field.trim() === ""
      )
    ) {
      throw new apiError(400, "All Fields are Required");
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

    const documents = [];
    const textSplitter = getTextSplitter(500);
    const texts = await textSplitter.splitText(data?.contentText);
    for (let i = 0; i < texts.length; i++) {
      const vector = await OpenAIembeddings.embedQuery(texts[i]);

      documents.push({
        note_id: notes?._id,
        owner: req.user?._id,
        chunk_index: i + 1,
        chunk_text: texts[i],
        embedding: vector,
      });
    }

    if (!documents.length) {
      throw new apiError(500, "Something Went Wrong whle Chunking");
    }

    await PrivateNotesChunks.insertMany(documents);

    return res
      .status(200)
      .json(
        new apiResponse(200, notes, "Private Notes Created Successfully !!")
      );
  } catch (error) {
    throw new apiError(500, "Something went wrong", error);
  }
});

export { createPrivateNotes };
