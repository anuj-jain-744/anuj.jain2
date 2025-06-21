import React, { useEffect, useRef, useState } from "react";
import style from "./index.module.scss";
import WalaaDp from "assets/Dashboard/WalaLogo.svg";
import cancel from "assets/TrackYourClaim/Cancel.svg";
import upload from "assets/TrackYourClaim/upload.svg";
import { Bounce, toast } from "react-toastify";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import GppMaybeOutlinedIcon from '@mui/icons-material/GppMaybeOutlined';
import { allFileExtension, validFileTypes } from "constant";
import { LanguageData } from "types/languageData";
import PDFImg from "@corporate-portal/assets/contactWalaa/PDF.png";
import JPGImg from "@corporate-portal/assets/contactWalaa/JPG.svg";
import PNGImg from "@corporate-portal/assets/contactWalaa/PNG.svg";
import DOCImg from "@corporate-portal/assets/contactWalaa/Doc.svg";
import DOCXImg from "@corporate-portal/assets/contactWalaa/Docx.svg";
import { TOAST_AUTOCLOSE_TIMER } from "@dpm/shared-module";

interface WalaaResponseProps {
  onCheckDisabled:(value: boolean)=>void;
  languageData: LanguageData;
  conversation:{
    user:string;
    name: string;
    message: string;
    dateTime: string;
  }
}
interface FileUploadProps {
  handleFileChange:(event: React.ChangeEvent<HTMLInputElement>)=>void;
  handleFileRemove: ()=>void;
  files: [],
  name: string;
  required: boolean;
  id: string;
}
const FileUploadRow: React.FC<FileUploadProps> = ({required,name,files,handleFileChange,handleFileRemove}) => {
  const renderFileIcon=(type: string)=>{
    switch(type){
      case "application/pdf":
        return <img src={PDFImg} alt='pdf-img' className={style.buttonTextIcon}/>
        case "application/msword":
        return <img src={DOCImg} alt='doc-img' className={style.buttonTextIcon}/>
        case  "image/jpeg":
        return <img src={JPGImg} alt='jpeg-img' className={style.buttonTextIcon}/>
        case "image/png":
        return <img src={PNGImg} alt='png-img' className={style.buttonTextIcon}/>
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return <img src={DOCXImg} alt='docx-img' className={style.buttonTextIcon}/>
        default :  <></>
    }
  }
  return(
  <div className={style.tycFrameUploadContent}>
        <div className={style.tycFrameContentsTextValue}>
          {`${name}`}
          {required && <span className={style.tycFrameContentsTextStrick}>*</span>}
        </div>
        <div
          className={
            files ? `${style.buttonTextContainer}` : "upload-btn-div"
          }
        >
          <label htmlFor={`file-input-${name}`}>
            {files ? (
              <>
                <span className={style.buttonTextNameValue}>
                  {renderFileIcon(files[0]?.type)}
                  {files?.length>0 && files[0]?.name}
                </span>
                <span className={style.buttonTextNameSize}>
                  {(files?.length>0 && files[0]?.size / 1024).toFixed(2)}KB
                </span>
              </>
            ) : (
              <div className="upload-btn">
                <img
                  src={upload}
                  alt="upload"
                  className={style.buttonTextIcon}
                />
                Upload
              </div>
            )}
          </label>
          {files && (
            <span
              data-testid="removefile_testid"
              className="closeIcon"
              role="button"
              tabIndex={0}
              onClick={handleFileRemove}
            >
              <img
                src={cancel}
                alt="cancel_icon"
                className={style.buttonTextIcon}
              />
            </span>
          )}
          <input
            type="file"
            id={`file-input-${name}`}
            name={name}
            onChange={(e) => handleFileChange(e)}
            accept={validFileTypes.join(",")}
            style={{ display: "none" }}
            data-testid="file-input"
          />
        </div>
      </div>
)};

const WalaaResponse: React.FC<WalaaResponseProps> = ({onCheckDisabled,languageData,conversation}) => {
  const [selectedFile, setSelectedFile] = useState<{
    file: File | null;
    base64: string | null;
    name: string | null;
  }>({ file: null, base64: null, name: null });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setSelected] = useState<{[key:string]:Object} | null>(null);

  useEffect(() => {
    if(files?.hasOwnProperty('0')){
      onCheckDisabled(false)
    }else{
      onCheckDisabled(true)
    }
    
  }, [files])

  // Upload file 
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const Objectfile = event.target.files as Object;
    const fieldName=event.target.name;
    switch (fieldName) {
      case 'Police Document':
        setSelected((prevFiles) => {
          return {...prevFiles,['0']:Objectfile}
        });
        break;
      case 'Medical Document':
        setSelected((prevFiles) => {
          return {...prevFiles,['1']:Objectfile}
        });
        break;
  
      default:
        break;
    }
    
    const file = event.target.files?.[0];
    if (file) {
      if (validFileTypes.includes(file.type) && file.size <= 5 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          setSelectedFile({
            file: file,
            base64: base64,
            name,
          });
        };
        reader.onerror = () => {
          console.error("Error occurred while reading file.");
          toast.error("Error occurred while reading file.", {
            icon: <WarningAmberOutlinedIcon />,
            className: "error-cust",
            position: "top-right",
            autoClose: TOAST_AUTOCLOSE_TIMER || false,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          });
        };
        reader.readAsDataURL(file);
      } else {
        toast.warning("Invalid file type or exceeds size limit (3MB)", {
          icon: <GppMaybeOutlinedIcon />,
          className: "warning-cust",
          position: "top-right",
          autoClose: TOAST_AUTOCLOSE_TIMER || false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
        alert("Invalid file type or exceeds size limit (3MB)");
        setSelected(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };
  const handleFileRemove =(index:number)=>{
    setSelected((prevFiles) => {
      delete prevFiles[index]
      return {...prevFiles}
    });
  }

  // file list data
 
  
  return (
    <div className={style.walaaResponse}>
      <div className={style.profileSection}>
        <div className={style.dpWrapper}>
          <img src={WalaaDp} alt="user dp" />
        </div>
      </div>
      <div className={style.contentSection}>
        <div className={style.titleRow}>
          <h4>{conversation.name}</h4>
          <p>{conversation.dateTime}</p>
        </div>
        <div className={style.conversationWrapper}>
          <p>
           {conversation.message}
          </p>
          <div className={style.fileWrapper}>
            <h4>{languageData?.upload_support_doc}</h4>
            <p><span className={style.fileTitle}>{languageData?.supported_file_type}:</span> {allFileExtension.join(", ")}  | <span className={style.fileTitle}>{`${languageData?.file_size} : `} </span>{languageData?.max5mb}</p>
            <FileUploadRow required={true} name={languageData?.police_document ?? ""} handleFileChange={handleFileChange} files={files ? length > 0 && files['0'] : null} handleFileRemove={()=>handleFileRemove(0)}/>
            <FileUploadRow required={false} name={languageData?.medical_document ?? ""} handleFileChange={handleFileChange} files={files ? length > 0 && files['1'] : null} handleFileRemove={()=>handleFileRemove(1)}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalaaResponse;
