import React from 'react';
import Delete from "assets/Home/Cancel.svg";

interface FileData {
  name: string;
  size: number
  base64: string;
}

interface FileListProps {
  files: FileData[];
  onRemove: (index: number) => void;
  dataTestId?: string;
}

const FileList: React.FC<FileListProps> = React.memo(({ files, onRemove, dataTestId }) => {

  return (
    <React.Fragment>
      {files.map((fileData: FileData, index: number) => (
        <div key={fileData.name + index} className="files-wrapper">
          <div className="files-row recent-added">
            <img src={fileData.base64} width={40} height={40} alt={fileData.name} />
            <div className="file-name">{fileData.name}</div>
            <div className="fontSize">{(fileData.size / 1024).toFixed(2)} KB</div>
            <button data-testid={dataTestId} className="action" onClick={() => onRemove(index)}>
              <img className="delete" src={Delete} alt="delete" />
            </button>
          </div>
        </div>
      ))}
    </React.Fragment>
  );
});

export default FileList;