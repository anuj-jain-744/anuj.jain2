import React from 'react';
import PictureAsPdfSharpIcon from "@mui/icons-material/PictureAsPdfSharp";
import Delete from "assets/Home/Cancel.svg";

interface FileData {
  name: string;
  size: number
  base64: string;
}

interface FileListProps {
  files: FileData[];
  onRemove: (index: number) => void;
}

const FileList: React.FC<FileListProps> = React.memo(({ files, onRemove }) => {

  return (
    <React.Fragment>
      {files.map((fileData: FileData, index: number) => (
        <div key={index} className="files-wrapper">
          <div className="files-row recent-added">
            <PictureAsPdfSharpIcon
              sx={{ color: "red", fontSize: 16 }}
              className="mx-1"
            />
            <div className="file-name">{fileData.name}</div>
            <div className="fontSize">{(fileData.size / 1024).toFixed(2)} KB</div>
            <button className="action" onClick={() => onRemove(index)}>
              <img className="delete" src={Delete} alt="delete" />
            </button>
          </div>
        </div>
      ))}
    </React.Fragment>
  );
});

export default FileList;