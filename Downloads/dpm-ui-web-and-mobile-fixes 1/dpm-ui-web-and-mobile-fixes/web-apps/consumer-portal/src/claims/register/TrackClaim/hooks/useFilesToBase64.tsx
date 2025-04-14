import { useState } from "react";

const useFilesToBase64 = () => {
  const [fileData, setFileData] = useState<{ name: string; size: number; base64: string }[]>([]);

  const validTypes = [
    "application/pdf",
    "application/msword",
    "image/jpeg",
    "image/png",
  ];

  const convertFilesToBase64 = async (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);

    const validFilesPromises = fileArray
      .filter(file => validTypes.includes(file.type) && file.size <= 3 * 1024 * 1024)
      .map(file => {
        return new Promise<{ name: string; size: number; base64: string }>((resolve, reject) => {
          const reader = new FileReader();

          reader.onloadend = (e) => {
            const base64 = e.target?.result as string;
            resolve({ name: file.name, size: file.size, base64 });
          };

          reader.onerror = () => {
            console.error("Error occurred while reading file.");
            reject(new Error("File reading error"));
          };

          reader.readAsDataURL(file);
        });
      });

    try {
      const newSelectedFiles = await Promise.all(validFilesPromises);
      setFileData((prev) => [...prev, ...newSelectedFiles]);
    } catch (error) {
      console.error(error);
    }
  };

  return { fileData, setFileData, convertFilesToBase64 };
};

export default useFilesToBase64;