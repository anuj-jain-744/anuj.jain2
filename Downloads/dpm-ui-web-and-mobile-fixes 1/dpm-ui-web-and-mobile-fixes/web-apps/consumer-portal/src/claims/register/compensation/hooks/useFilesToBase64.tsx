import { useState } from "react";

const useFilesToBase64 = () => {
  const [fileData, setFileData] = useState<{ name: string; size: number; base64: string }[]>([]);

  const validTypes = [
    "application/pdf",
    "application/msword",
    "image/jpeg",
    "image/png",
  ];

  const convertFilesToBase64 = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const newSelectedFiles: { name: string; size: number; base64: string }[] = [];

    fileArray.forEach((file) => {
      if (validTypes.includes(file.type) && file.size <= 3 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onloadend = (e) => {
          const base64 = e.target?.result as string;
          newSelectedFiles.push({ name: file.name, size: file.size, base64 });
          if (newSelectedFiles.length === fileArray.length) {
            setFileData((prev) => [...prev, ...newSelectedFiles]);
          }
        };
        reader.onerror = () => {
          console.error("Error occurred while reading file.");
        };
        reader.readAsDataURL(file);
      } else {
        console.error("Invalid file type or exceeds size limit (3MB)");
      }
    });
  };

  return { fileData, setFileData, convertFilesToBase64 };
};

export default useFilesToBase64;