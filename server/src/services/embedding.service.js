import path from "path";
import { NotesChunks } from "../models/notesChunks.model.js";
import { apiError } from "../utilities/apiError.js";
import {
  getOpenAIEmbeddingModel,
  getTextSplitter,
  extractText,
} from "../utilities/ragIntegrationHelpers.js";

const OpenAIembeddings = getOpenAIEmbeddingModel();

export const generateEmbeddings = async ({
  note_id,
  user_id,
  notes_file_url,
}) => {
  const cleanUrl = notes_file_url.split("?")[0];
  const ext = path.extname(cleanUrl).slice(1).toLowerCase();
  // console.log({ ext });

  const text = await extractText(notes_file_url, ext);
  //console.log( text.length)
  const textSplitter = getTextSplitter(500);
  //console.log({ textSplitter })

  const chunks = await textSplitter.splitText(text);
  // console.log(chunks.length);
  // console.log("Chunks type:", Array.isArray(chunks));
  // console.log("Chunks length:", chunks.length);
  // console.log("First chunk:", chunks[0]);
  // console.log("First chunk type:", typeof chunks[0]);

  const vectors = await Promise.all(
    chunks.map((chunk) => OpenAIembeddings.embedQuery(chunk))
  );
  // console.log("Vectors created:", vectors.length);

  const documents = chunks.map((chunk, i) => ({
    note_id: note_id,
    owner: user_id,
    chunk_index: i + 1,
    chunk_text: chunk,
    embedding: Array.from(vectors[i]),
  }));
  // console.log({ documents });

  if (!documents.length) {
    throw new apiError(500, "Something Went Wrong while Chunking");
  }

  await NotesChunks.insertMany(documents);

  return;
};
