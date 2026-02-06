import OpenAI from "openai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { MongoClient, ObjectId } from "mongodb";
import { getOpenAIEmbeddingModel } from "../utilities/ragIntegrationHelpers.js";

const clientOpenAI = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const mongoClient = new MongoClient(process.env.MONGODB_URI || "");
const public_notes_collection = mongoClient
  .db(process.env.DB_NAME)
  .collection(process.env.PUBLIC_NOTES_VECTOR_COLLECTION);
const private_notes_collection = mongoClient
  .db(process.env.DB_NAME)
  .collection(process.env.PRIVATE_NOTES_VECTOR_COLLECTION);

const embedding = getOpenAIEmbeddingModel();

const public_notes_vectorStore = new MongoDBAtlasVectorSearch(embedding, {
  collection: public_notes_collection,
  indexName: "public_notes_chunks_vector",
  textKey: "chunk_text",
  embeddingKey: "embedding",
});

const private_notes_vectorStore = new MongoDBAtlasVectorSearch(embedding, {
  collection: private_notes_collection,
  indexName: "private_notes_chunks_vector",
  textKey: "chunk_text",
  embeddingKey: "embedding",
});

export const chatWithRAGMODEL = async ({
  conversationId,
  summary = "",
  messages = [],
  allowed_sources = [],
  private_notes_allowed = false,
  user_query = "",
}) => {
  const allowedSourceObjectIds = allowed_sources
    .filter((id) => id && ObjectId.isValid(id))
    .map((id) => new ObjectId(id));

  const publicNotesFilter =
    allowedSourceObjectIds.length > 0
      ? {
        preFilter: {
          note_id: { $in: allowedSourceObjectIds },
        },
      }
      : {};

  // console.log("publicNotesFilter:", JSON.stringify(publicNotesFilter, null, 2));

  const public_chunks = await public_notes_vectorStore.similaritySearch(
    user_query,
    5,
    publicNotesFilter
  );

  // console.log("public_chunks count:", public_chunks.length);
  // console.log("public_chunks:", public_chunks);

  let private_chunks = [];
  if (private_notes_allowed && allowed_sources.length > 0) {
    private_chunks = await private_notes_vectorStore.similaritySearch(
      user_query,
      5
    );
  }

  const all_chunks = [...public_chunks, ...private_chunks];

  const context = all_chunks
    .map((chunk, index) => `[${index + 1}] ${chunk.pageContent}`)
    .join("\n\n");

  const SYSTEM_PROMPT = `You are a helpful AI assistant that answers questions based on the user's notes. 
Use the following context from the user's notes to answer their question. 
If the context doesn't contain relevant information to answer the question, say so honestly.
Always be concise and accurate in your responses.

${summary ? `Conversation Summary:\n${summary}\n\n` : ""}Context from notes:
${context || "No relevant context found in the selected notes."}

Instructions:
- Answer based on the provided context from the user's notes
- If you cite information, reference the source number in brackets like [1]
- If the context doesn't help answer the question, let the user know
- Be helpful, accurate, and concise`;

  const openAIMessages = [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
  ];

  if (Array.isArray(messages) && messages.length > 0) {
    messages.forEach((msg) => {
      openAIMessages.push({
        role: msg.role,
        content: msg.content,
      });
    });
  }

  openAIMessages.push({
    role: "user",
    content: user_query,
  });

  // console.log("Full chats Array : ", openAIMessages);

  const response = await clientOpenAI.chat.completions.create({
    model: "gpt-4o-mini",
    messages: openAIMessages,
  });

  return {
    message: response.choices[0]?.message?.content || "",
    // sources: all_chunks.map((chunk) => ({
    //   content: chunk.pageContent,
    //   metadata: chunk.metadata,
    // })),
  };
};
