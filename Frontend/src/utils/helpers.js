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
  return `${truncatedText}...`;
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

const NOTE_TYPE_LABELS = [
  {
    value: "pkm",
    label: "Personal Knowledge",
  },
  {
    value: "study",
    label: "Study / Exam",
  },
  {
    value: "thought",
    label: "Thought Dump",
  },
  {
    value: "task",
    label: "Tasks / Todo",
  },
  {
    value: "project",
    label: "Project Notes",
  },
  {
    value: "journal",
    label: "Journal / Diary",
  },
  {
    value: "memory",
    label: "AI Memory",
  },
  {
    value: "other",
    label: "Other",
  },
];

export { truncateFileName, truncateText, downloadNote, NOTE_TYPE_LABELS };
