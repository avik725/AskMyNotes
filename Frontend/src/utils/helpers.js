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

export { truncateFileName };
