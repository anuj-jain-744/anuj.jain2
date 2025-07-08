import React, { useEffect, useState, useRef } from "react";
import "./index.scss";
import FileList from "./FileList";
import { formFieldData } from "pages/ContactWalaa";

interface UploadProps {
  name: string;
  attachedFiles: any;
  upLoadLabels: any;
  attachmentData: formFieldData;
  onChangehandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setDragFiles: (files: any) => void;
}

interface NewSelectedFile {
  name: string;
  size: number;
  base64: string;
}

export const isValidFilename = (filename: string) => {
  const regex = /^[a-zA-Z0-9._-]+$/;
  return regex.test(filename);
};

const DragNdrop: React.FC<UploadProps> = ({
  attachedFiles,
  upLoadLabels,
  attachmentData,
  name,
  onChangehandler,
  setDragFiles,
}) => {
  const [files, setFiles] = useState<
    { name: string; size: number; base64: string }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      if (file) {
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64File = reader.result as string;
          const newSelectedFiles: {
            name: string;
            size: number;
            base64: string;
          }[] = [];
          newSelectedFiles.push({
            name: file.name,
            size: file.size,
            base64: base64File,
          });
          setFiles((files) => [...files, ...newSelectedFiles]);
          onChangehandler(event);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  useEffect(() => {
    if (files && files.length > 0) {
      setDragFiles(files);
    }
  }, [files]);

  const handleAndReturnEachFile = (
    newFiles,
    newSelectedFiles: NewSelectedFile[]
  ) => {
    newFiles.forEach((file: any) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = (e) => {
        const base64 = e.target?.result as string;
        newSelectedFiles.push({ name: file.name, size: file.size, base64 });
        if (newSelectedFiles.length === newFiles.length) {
          setFiles((prevFiles) => {
            onChangehandler({
              target: {
                name,
                type: "file",
                files: [...prevFiles, ...newSelectedFiles],
              },
            });
            return [...prevFiles, ...newSelectedFiles];
          });
        }
      };
    });
  };

  const handleDrop = (event: any) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    const newSelectedFiles: NewSelectedFile[] = [];
    if (!droppedFiles.length) return;
    const newFiles = Array.from(droppedFiles);
    handleAndReturnEachFile(newFiles, newSelectedFiles);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => {
      const files = prevFiles.filter((_, i) => i !== index);
      onChangehandler({ target: { name, type: "file", files } });
      return files;
    });
  };

  return (
    <section className="drag-drop">
      <div
        className={`document-uploader ${
          files.length > 0 ? "upload-box active" : "upload-box"
        }`}
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      >
        <div className="btnContainer">
          <div className="txtContainer">
            <p className="walaa-regular-400 drag-txt">
              {upLoadLabels?.drag_and_drop}
            </p>
            <p className="walaa-regular-400 suptype-txt">
              {upLoadLabels?.supported_file_type}
            </p>
          </div>

          <p className="or-txt">{upLoadLabels?.or_label}</p>
          <input
            type="file"
            hidden
            name={name}
            ref={fileInputRef}
            id="browse"
            onChange={handleFileChange}
            accept=".pdf,.docx,.doc,.jpg,.png"
            multiple
          />
          <label
            htmlFor="browse"
            className="walaa-medium-500 upload-white btn btn-primary browse-btn"
          >
            {attachmentData?.field_placeholder}
          </label>
          {files && files.length > 0 && (
            <FileList
              files={files}
              onRemove={handleRemoveFile}
              language={{
                file_upload_is_completed: "File upload is completed",
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default DragNdrop;
