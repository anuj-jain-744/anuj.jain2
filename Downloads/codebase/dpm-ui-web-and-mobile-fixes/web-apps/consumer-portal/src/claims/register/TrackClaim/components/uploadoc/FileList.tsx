import React from 'react';
import PictureAsPdfSharpIcon from "@mui/icons-material/PictureAsPdfSharp";
import CancelIcon from "@mui/icons-material/Cancel";
import { LanguageData } from 'types/languageData';

interface FileData {
  name: string;
  size: number
  base64: string;
}

interface FileListProps {
  files: FileData[];
  onRemove: (index: number) => void;
  language: LanguageData;
}

const FileList: React.FC<FileListProps> = React.memo(({ files, onRemove, language }) => {
    
  return (
    <React.Fragment>
      <div className="px-3">
        <hr className="register-compensate-splitter" />
      </div>
      <div className="row">
        <div className="col d-flex justify-content-around">
          {language?.file_upload_is_completed}.
        </div>
      </div>
      {files.map((fileData: FileData, index: number) => (
        <div key={index} className="px-4">
          <div className="row register-row-spacing-top register-row-spacing-bottom upload-ribbon-strip">
            <div className="col-sm-12 col-md d-flex align-items-center">
              <PictureAsPdfSharpIcon
                sx={{ color: "red", fontSize: 16 }}
                className="mx-1"
              />
              {fileData.name}&nbsp; {(fileData.size / 1024).toFixed(2)} KB
            </div>
            <div className="col-sm-12 col-md d-flex align-items-center justify-content-end">
              <CancelIcon onClick={() => onRemove(index)} sx={{ fontSize: 20, cursor: "pointer" }} />
            </div>
          </div>
        </div>
      ))}
    </React.Fragment>
  );
});

export default FileList;