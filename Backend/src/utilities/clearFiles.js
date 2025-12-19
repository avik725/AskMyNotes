import fs from "fs";

export default function clearFiles(req) {
  if (req.files) {
    Object.values(req.files).forEach((fileArray) => {
      fileArray.forEach((singleFile) => fs.unlinkSync(singleFile.path));
    });
  } else if (req.file) {
    fs.unlinkSync(req.file.path);
  }
}