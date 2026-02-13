import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";

import fs from "fs";
import { PDFParse } from "pdf-parse";
import axios from 'axios';
import mammoth from 'mammoth';
import { Document } from "@langchain/core/documents";


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

const extractText = async (fileUrl, ext) => {
  try {
    console.log({ ext })
    const response = await axios.get(fileUrl, {
      responseType: "arraybuffer",
    });

    const buffer = Buffer.from(response.data);

    let rawText = []

    if (ext === 'pdf') {
      const uint8Array = new Uint8Array(buffer);
      const parser = new PDFParse(uint8Array);
      const data = await parser.getText();
      rawText = data.text;
    }

    if (ext === 'docx') {
      const result = await mammoth.extractRawText({ buffer });
      rawText = result.value;
    }

    if (ext === 'txt') {
      rawText = buffer.toString("utf-8");
    }

    // console.log({ rawText })

    const extractedText = cleanText(rawText)
    //console.log({ extractedText })
    return (extractedText)
    
  } catch (error) {
    console.log("Text extraction error: ", error)
    throw error
  }
}

const cleanText = (text) => {
    return text
        .replace(/\r\n/g, "\n")
        .replace(/\n{2,}/g, "\n\n")
        .trim();
};


export {
  getTextSplitter,
  getOpenAIEmbeddingModel,
  extractText
};
