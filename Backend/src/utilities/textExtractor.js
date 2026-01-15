import { pdf } from "pdf-parse";
import fs from "fs";
import { apiError } from "./apiError";

//:)----------->Requirment :( fileTypes for text extraction )

//Only for PDF files
const extractText = async (fileUrl) => {

    if (!fileUrl) {
        throw new apiError(400, "File is required")
    }

    try {
        const buffer = fs.readFileSync(fileUrl)
        const data = await pdf(buffer)
        return cleanText(data.text);

    } catch (error) {
        console.log("Text extraction error: ", error)
        throw error
    }

};

const cleanText = (text) => {
    return text
        .replace(/\r\n/g, "\n")
        .replace(/\n{2,}/g, "\n\n")
        .trim();
};


export default extractText;
