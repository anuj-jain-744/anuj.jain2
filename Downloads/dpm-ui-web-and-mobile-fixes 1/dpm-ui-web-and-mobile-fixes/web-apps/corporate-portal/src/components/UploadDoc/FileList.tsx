import React from "react";
import PictureAsPdfSharpIcon from "@mui/icons-material/PictureAsPdfSharp";
import CancelIcon from "@mui/icons-material/Cancel";

interface FileListProps {
  files: any;
  onRemove: (index: number) => void;
  language: any;
}

const FileList: React.FC<FileListProps> = React.memo(
  ({ files, onRemove, language }) => {
    return (
      <React.Fragment>
        <div className="upfile_container">
          <div className="px-3">
            <hr className="register-compensate-splitter" />
          </div>
          <div className="row">
            <div className="col d-flex justify-content-around">
              {language?.file_upload_is_completed}.
            </div>
          </div>
          {files.map((fileData: any, index: number) => (
            <div key={index} className="px-4">
              <div className="row register-row-spacing-top register-row-spacing-bottom upload-ribbon-strip">
                <div className="col-sm-12 col-md d-flex align-items-center up_text">
                  {fileData.name}&nbsp; {(fileData.size / 1024).toFixed(2)} KB
                </div>
              </div>
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  }
);

export default FileList;
