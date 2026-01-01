import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";

function getTextSplitter(chunkSize) {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap: 0,
  });

  return textSplitter;
}

function getOpenAIEmbeddingModel() {
  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-large",
    apiKey: process.env.OPENAI_API_KEY,
  });

  return embeddings;
}

export { getTextSplitter, getOpenAIEmbeddingModel };
