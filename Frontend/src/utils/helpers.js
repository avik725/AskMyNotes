const truncateFileName = (fileName, maxLength = 25) => {
  if (!fileName) return "";
  if (fileName.length <= maxLength) return fileName;
  const extension = fileName.split(".").pop();
  const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf("."));
  const truncatedName = nameWithoutExt.substring(
    0,
    maxLength - extension.length - 4
  );
  return `${truncatedName}...${extension}`;
};

const truncateText = (text, maxLength = 30) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;

  const truncatedText = text.substring(0, maxLength - 4);
  return `${truncatedText}...`
};

function downloadNote(title, fileUrl) {
  const downloadUrl = fileUrl.includes("upload/")
    ? fileUrl.replace("upload/", "upload/fl_attachment/")
    : fileUrl;

  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = title;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export { truncateFileName,truncateText, downloadNote };
