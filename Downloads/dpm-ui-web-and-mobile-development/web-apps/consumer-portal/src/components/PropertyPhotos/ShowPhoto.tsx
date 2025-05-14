import React from 'react';
import Delete from "assets/QuoteAndBuy/delete.svg";

interface FileData {
  name: string;
  size: number
  base64: string;
}

interface FileListProps {
  files: FileData[];
  onRemove: (index: number) => void;
}

const ShowPhoto: React.FC<FileListProps> = React.memo(({ files, onRemove }) => {

  return (
    <div>
    <div className="photo-wrapper">
      {files.map((fileData: FileData, index: number) => (
        <div key={index} className="files-row">
          <img src={fileData.base64} width={"130"} height={"100"} alt="" />
          <button className="action" onClick={() => onRemove(index)}>
            <img className="delete" src={Delete} alt="delete" />
          </button>
        </div>
      ))}
    </div>
    </div>
  );
});

export default ShowPhoto;