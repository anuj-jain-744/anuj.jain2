import React from "react";
import PDFImg from "assets/contactWalaa/PDF.png";
import JPGImg from "assets/contactWalaa/JPG.svg";
import PNGImg from "assets/contactWalaa/PNG.svg";
import DOCImg from "assets/contactWalaa/Doc.svg";
import DOCXImg from "assets/contactWalaa/Docx.svg";
import Delete from "./../../assets/contactWalaa/delete.svg";
import { getFileType } from "../../utils/getFileType";

interface FileListProps {
  files: any;
  onRemove: (index: number) => void;
  language: any;
}
const renderFileIcon=(base64: string)=>{
  const type=getFileType(base64)
  switch(type){
    case "application/pdf":
      return <img src={PDFImg} alt='pdf-img'/>
      case "application/msword":
      return <img src={DOCImg} alt='doc-img'/>
      case  "image/jpeg":
      return <img src={JPGImg} alt='jpeg-img'/>
      case "image/png":
      return <img src={PNGImg} alt='png-img'/>
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return <img src={DOCXImg} alt='docx-img'/>
      default: return <></>;
  }
}
const FileList: React.FC<FileListProps> = React.memo(
  ({ files, onRemove, language }) => {
    return (
      <div className="upfile_container">
      <div>
        <hr className="register-compensate-splitter" />
      </div>
      <div className="row">
        <div className="col d-flex justify-content-around completed_txt">
          {language?.file_upload_is_completed}.
        </div>
      </div>
      {files.map((fileData: any, index: number) => (
       <div key={index} className="row register-row-spacing-top register-row-spacing-bottom upload-ribbon-strip">
        <div className="col-sm-12 col-md d-flex align-items-center up_text">
          {renderFileIcon(fileData?.base64)}
          <p className="file_name_txt">{fileData.name}&nbsp;</p> <p className="file_size_txt">{(fileData.size / 1024).toFixed(2)} KB</p>
        </div>
        <img src={Delete} alt={"delete"} onClick={() => onRemove(index)}/>
     </div>
      ))}
    </div>
    );
  }
);

export default FileList;
