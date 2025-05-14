import React, { useEffect, useState } from "react";
import "./index.scss";
import FileList from "./FileList";
import { formFieldData } from "pages/ContactWalaa";

interface UploadProps {
  name: string;
  attachedFiles: any;
  upLoadLabels: any;
  attachmentData: formFieldData;
  onChangehandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const isValidFilename = (filename: string) => {
  const regex = /^[a-zA-Z0-9._-]+$/;
  return regex.test(filename);
}

const DragNdrop: React.FC<UploadProps> = ({ attachedFiles, upLoadLabels, attachmentData, name, onChangehandler }) => {
  const [files, setFiles] = useState<{ name: string; size: number; base64: string }[]>([]);

  const handleFileChange = (event: any) => {
    
    const selectedFiles = event.target.files;
    const newSelectedFiles: { name: string; size: number; base64: string }[] = [];
    if (selectedFiles && selectedFiles.length > 0) {
      const newFiles = Array.from(selectedFiles);
      newFiles.forEach((file: any) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = (e) => {
          const base64 = e.target?.result as string;
          newSelectedFiles.push({ name: file.name, size: file.size, base64 });
          if (newSelectedFiles.length === newFiles.length) {
            setFiles((prevFiles) => {
              onChangehandler({target:{name,type:'file',files:[...prevFiles, ...newSelectedFiles]}});
              return [...prevFiles, ...newSelectedFiles]
            });
            
          }

        }
      });
    }
  };
  const handleDrop = (event: any) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    const newSelectedFiles: { name: string; size: number; base64: string }[] = [];
    if (droppedFiles.length > 0) {
      const newFiles = Array.from(droppedFiles);
      newFiles.forEach((file: any) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = (e) => {
          const base64 = e.target?.result as string;
          newSelectedFiles.push({ name: file.name, size: file.size, base64 });
          if (newSelectedFiles.length === newFiles.length) {
            setFiles((prevFiles) => {
              onChangehandler({target:{name,type:'file',files:[...prevFiles, ...newSelectedFiles]}});
              return [...prevFiles, ...newSelectedFiles]
            });
          }

        }
       });
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => {
      const files=prevFiles.filter((_, i) => i !== index)
      onChangehandler({target:{name,type:'file',files}});
      return files
    });
  };


  return (
    <section className="drag-drop">
      <div
        className={`document-uploader ${files.length > 0 ? "upload-box active" : "upload-box"
          }`}
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
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
            <input // need to send name
              type="file"
              hidden
              name={name}
              id="browse"
              onChange={handleFileChange} // from inputfile handleFieldChange
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
                language={{ file_upload_is_completed: "File upload is completed" }}
              />
            )}
          </div>
      </div>
    </section>
  );
};

export default DragNdrop;
