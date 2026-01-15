import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";

import fs from "fs";
import pdf from "pdf-parse";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { DocxLoader } from "langchain/document_loaders/fs/docx";
import { TextLoader } from "langchain/document_loaders/fs/text";


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

const extractText = async (fileUrl, fileType) => {
  try {
    let docs = []

    switch (fileType) {
      case "pdf": {
        const buffer = fs.readFileSync(fileUrl);
        const data = await pdf(buffer);

        if (!data.text || data.text.trim().length < 100) {
          throw new Error(
            "PDF does not contain readable text "
          );
        }

        const loader = new PDFLoader(fileUrl, {
          splitPages: true
        });

        docs = await loader.load();
        break;
      }
      
      case "docx": {
        docs = await new DocxLoader(fileUrl).load();
        break;
      }

      case "txt": {
        docs = await new TextLoader(fileUrl).load();
        break;
      }
      default:
        throw new Error("Unsupported file type");
    }

    return cleanDocuments(docs);

  } catch (error) {
    console.log("Text extraction error: ", error)
    throw error
  }
}

const cleanDocuments = (docs) =>
  docs.map((doc) => ({
    ...doc,
    pageContent: doc.pageContent
      .replace(/\n{3,}/g, "\n\n")
      .replace(/[ \t]+/g, " ")
      .trim()
  }));


export { 
  getTextSplitter, 
  getOpenAIEmbeddingModel, 
  extractText 
};
