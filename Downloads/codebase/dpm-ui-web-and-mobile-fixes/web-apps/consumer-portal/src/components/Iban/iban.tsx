import { Accordion, Card, useAccordionButton } from "react-bootstrap";
import { useState, useRef, useEffect } from "react";
import "./style.scss";
import Upload from "assets/IbanValidation/Upload.svg";
import Tick from "assets/IbanValidation/Circle Tick.svg";
import UP from "assets/IbanValidation/Chevron Up.svg";
import DOWN from "assets/IbanValidation/Chevron Down.svg";
import Cancel from "assets/IbanValidation/Cancel.svg";
import { sanitizeHtml, formatFileSize, TOAST_AUTOCLOSE_TIMER } from "@dpm/shared-module";
import { LanguageData } from "types/languageData";
import { Bounce, toast } from "react-toastify";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { fileLogos } from "./fileLogos";
import { inValidExtensions } from "../../constant";

interface IbanProps {
  languageData: LanguageData;
  fileData: (null | { docType: string; fileName: string; fileExtension: string; docFile: string; })[];
  setFileData: React.Dispatch<React.SetStateAction<(null | { docType: string; fileName: string; fileExtension: string; docFile: string; })[]>>;
  onChequeLeafUpload: (file: File) => void;
  onChequeLeafRemove: () => void;
}

interface DocumentUploadSectionProps {
  title: string;
  index: number;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  uploadedFile: File | null;
  onRemoveFile: (fileInputRef: React.RefObject<HTMLInputElement>, index: number) => void;
  required: boolean;
  languageData: LanguageData;
}

interface CustomToggleProps {
  eventKey: string;
  children?: React.ReactNode;
  onToggle: (isToggled: boolean) => void;
}

const CustomToggle = ({ eventKey, children, onToggle }: CustomToggleProps) => {
  const [isToggled, setIsToggled] = useState(false);

  const decoratedOnClick = useAccordionButton(eventKey, () => {
    setIsToggled((prev) => !prev);
    onToggle(!isToggled);
  });

  return (
    <button
      type="button"
      onClick={decoratedOnClick}
      className="toggle-btn-iban"
    >
      <img src={isToggled ? UP : DOWN} alt="Toggle Icon" />
      {children}
    </button>
  );
};

const getFileLogo = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  return fileLogos[extension] || null;
};

const DocumentUploadSection = ({
  title,
  index,
  onFileChange,
  uploadedFile,
  onRemoveFile,
  required,
  languageData,
}: DocumentUploadSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input value
    }
    fileInputRef.current?.click();
  };

  return (
    <Accordion.Collapse eventKey="0">
      <div
        className="container-accordion"
        onClick={!uploadedFile ? handleClick : undefined}
      >
        <div className="document-name-section">
          <div className="document-heading walaa-medium-500">{title}</div>
          {required && (
            <div className="important-mark walaa-regular-400">*</div>
          )}
        </div>
        <div className="upload-section">
          {!uploadedFile && (
            <>
              <div>
                <img src={Upload} alt="Upload" />
              </div>
              <div className="upload-section-header walaa-medium-500">
                {languageData?.upload}
              </div>
            </>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => onFileChange(e, index)}
          aria-label={languageData?.upload + " " + `${title}`}
        />
        {uploadedFile && (
          <div className="uploaded-files">
            <div className="files-container">
              <div className="file-logo">
                <span>
                  <img
                    src={getFileLogo(uploadedFile.name)}
                    className="file-icon"
                    alt="File Icon"
                  />
                </span>
              </div>
              <div className="file-name walaa-medium-500">
                <span>{uploadedFile.name}</span>
              </div>
              <div className="file-size walaa-regular-400">
                <span>{formatFileSize(uploadedFile.size) ?? ""}</span>
              </div>
            </div>
            <div className="delete-icon">
              <span role="button" tabIndex={0} onClick={() => onRemoveFile(fileInputRef, index)}>
                <img src={Cancel} alt="Cancel Icon" />
              </span>
            </div>
          </div>
        )}
      </div>
    </Accordion.Collapse>
  );
};

export default function Iban({ languageData, fileData, setFileData, onChequeLeafUpload, onChequeLeafRemove }: Readonly<IbanProps>) {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({
    chequeLeaf: null as File | null,
    otherDocuments: null as File | null,
  });

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const files = event.target.files;
    const maxSizeInMB = 5;
    if (files && files.length > 0) {
      const file = files[0];

      const isDuplicateFile = fileData.some(
      (uploadedFile) =>
        uploadedFile &&
        uploadedFile.fileName === file.name &&
        uploadedFile.fileExtension === file.name.split('.').pop()?.toLowerCase()
    );

      if (isDuplicateFile) {
        toast.error(languageData?.file_with_the_same_name_already_exists, {
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
        return; // Stop further processing if duplicate file is detected
      }

      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
        "application/msword", // doc
        "image/jpeg",
        "image/png",
      ]; 
      if (file.size > maxSizeInMB * 1024 * 1024) {
        toast.error(languageData?.file_size_exceeds_5mb_plea, {
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
        return;
      } else if (!validTypes.includes(file.type) || inValidExtensions.some(ext => file?.name?.substring(file?.name?.lastIndexOf('.') + 1).toLowerCase() === ext)) {
        toast.error(languageData?.not_a_valid_file, {
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
        return;
      }
      else {      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64File = reader.result as string;

        const section = index === 0 ? "chequeLeaf" : "otherDocuments";

        setUploadedFiles((prevFiles) => ({
          ...prevFiles,
          [section]: file,
        }));

        setFileData((prevFileData) => {
          const newFileData = [...prevFileData];
          newFileData[index] = { docType: "372", fileName: file.name, fileExtension: file.name.split('.').pop() ?? "", docFile: base64File.split(",")[1] };
          return newFileData;
        });

        if (section === 'chequeLeaf') {
          onChequeLeafUpload(file);
        }
      };
      reader.readAsDataURL(file);
      }
    }
  };

  const handleRemoveFile = (
    section: keyof typeof uploadedFiles,
    index: number,
    fileInputRef: React.RefObject<HTMLInputElement>
  ) => {
    setUploadedFiles((prevFiles) => ({
      ...prevFiles,
      [section]: null,
    }));

    setFileData((prevFileData) => {
      const newFileData = [...prevFileData];
      newFileData[index] = null;
      return newFileData;
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (section === 'chequeLeaf') {
      onChequeLeafRemove();
    }
  };

  useEffect(() => {
    if (fileData[0]) {
      setUploadedFiles((prev) => ({
        ...prev,
        chequeLeaf: {
          name: fileData?.[0]?.fileName,
          size: fileData?.[0]?.docFile.length,
        },
      }));
    }
  
    if (fileData[1]) {
      setUploadedFiles((prev) => ({
        ...prev,
        otherDocuments: {
          name: fileData?.[1]?.fileName,
          size: fileData?.[1]?.docFile.length,
        },
      }));
    }
  }, [fileData]);

  const allRequiredDocumentsUploaded = uploadedFiles.chequeLeaf;

  return (
    <div className="iban-parent">
      <Accordion
        defaultActiveKey="0"
        className={`iban-validation-container ${
          isAccordionOpen ? "open-iban-accordion" : "closed-iban-accordion"
        }`}
      >
        <Card className="card-iban">
          <Card.Header className="card-header-iban">
            <div>
              <div className="upload-bank-document-header walaa-regular-400">
                {languageData?.upload_bank_documents}
              </div>
              {!isAccordionOpen && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(languageData?.supported_file_type_doc),
                  }}
                ></div>
              )}
            </div>
            <CustomToggle
              eventKey="0"
              onToggle={setIsAccordionOpen}
              children={undefined}
            />
          </Card.Header>
        </Card>
        <div className="iban-validation-content">
          <DocumentUploadSection
            title={languageData?.cheque_leaf}
            index={0}
            onFileChange={handleFileChange}
            uploadedFile={uploadedFiles.chequeLeaf}
            onRemoveFile={(fileInputRef) =>
              handleRemoveFile("chequeLeaf", 0, fileInputRef)
            }
            required={true}
            languageData={languageData}
          />
          <DocumentUploadSection
            title={languageData?.other_documents}
            index={1}
            onFileChange={handleFileChange}
            uploadedFile={uploadedFiles.otherDocuments}
            onRemoveFile={(fileInputRef) =>
              handleRemoveFile("otherDocuments", 1, fileInputRef)
            }
            required={false}
            languageData={languageData}
          />
        </div>
        {allRequiredDocumentsUploaded && (
          <div className="upload-required-documents">
            <img src={Tick} alt="Tick" />
            <div className="upload-required-documents-heading walaa-regular-400">
              {languageData?.uploaded_all_required_docu}
            </div>
          </div>
        )}
      </Accordion>
    </div>
  );
}