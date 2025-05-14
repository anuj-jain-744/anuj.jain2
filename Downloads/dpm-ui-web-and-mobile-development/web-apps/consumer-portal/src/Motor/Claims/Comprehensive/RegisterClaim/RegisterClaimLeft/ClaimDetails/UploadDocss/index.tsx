import { Accordion, Card, useAccordionButton } from "react-bootstrap";
import React, { useState, useRef, useEffect } from "react";
import "./style.scss";
import { sanitizeHtml, formatFileSize } from "@dpm/shared-module";
import { LanguageData } from "types/languageData";
import Upload from "assets/IbanValidation/Upload.svg";
import Tick from "assets/IbanValidation/Circle Tick.svg";
import UP from "assets/IbanValidation/Chevron Up.svg";
import DOWN from "assets/IbanValidation/Chevron Down.svg";
import Cancel from "assets/IbanValidation/Cancel.svg";
import { fileLogos } from "components/Iban/fileLogos";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { Bounce, toast } from "react-toastify";
import { inValidExtensions } from "../../../../../../../constant";

interface IbanProps {
  languageData: LanguageData;
  fileData: (null | {
    docType: string;
    fileName: string;
    fileExtension: string;
    docFile: string;
  })[];
  setFileData: React.Dispatch<
    React.SetStateAction<
      (null | {
        docType: string;
        fileName: string;
        fileExtension: string;
        docFile: string;
      })[]
    >
  >;
  onMandatoryFileRemoved?: (params: { name: string; value: string }) => void;
  isOthersCase?: boolean
}

interface DocumentUploadSectionProps {
  title: string;
  onFileChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  uploadedFile: File | null;
  onRemoveFile: (
    fileInputRef: React.RefObject<HTMLInputElement>,
    index: number
  ) => void;
  required: boolean;
  languageData: LanguageData;
  dataTestId: string;
}

interface CustomToggleProps {
  eventKey: string;
  onToggle: (isToggled: boolean) => void;
}

const fileNameRegex = /^[a-zA-Z0-9-_ ]+$/;
const validFileTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "image/jpeg",
  "image/png",
];
const maxFileSizeInMB = 5;

const validateFile = (file: File, languageData: LanguageData) => {
  const fileName = file.name.split(".").slice(0, -1).join(".");
  const fileExtension = file.name.split(".").pop()?.toLowerCase();

  if (file.size > maxFileSizeInMB * 1024 * 1024) {
    return languageData?.file_size_exceeds_5mb_plea;
  }
  if (!validFileTypes.includes(file.type) || (fileExtension && inValidExtensions.includes(fileExtension))) {
    return languageData?.not_a_valid_file;
  }
  if (!fileNameRegex.test(fileName) || fileName.length > 255) {
    return languageData?.invalid_file_name;
  }
  return null;
};

const CustomToggle = ({ eventKey, onToggle }: CustomToggleProps) => {
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
      data-testid="toggle-btnid"
    >
      <img src={isToggled ? UP : DOWN} alt="Toggle Icon" />
    </button>
  );
};

const getFileLogo = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  return extension ? fileLogos[extension] || null : null;
};

const DocumentUploadSection = ({
  title,
  onFileChange,
  uploadedFile,
  onRemoveFile,
  required,
  languageData,
  dataTestId,
}: DocumentUploadSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => fileInputRef.current?.click();

  return (
    <Accordion.Collapse eventKey="0">
      <div
        className="container-accordion"
        onClick={!uploadedFile ? handleClick : undefined}
        data-testid="accordion-testid"
      >
        <div className="document-name-section">
          <div className="document-heading walaa-medium-500">{title}</div>
          {required && <div className="important-mark walaa-regular-400">*</div>}
        </div>
        <div className="upload-section">
          {!uploadedFile ? (
            <>
              <div>
                <img src={Upload} alt="Upload" />
              </div>
              <div className="upload-section-header walaa-medium-500">
                {languageData?.upload}
              </div>
            </>
          ) : (
            <div className="uploaded-files">
              <div className="files-container">
                <div className="file-logo">
                  <img
                    src={getFileLogo(uploadedFile.name) || ""}
                    className="file-icon"
                    alt="File Icon"
                  />
                </div>
                <div className="file-name walaa-medium-500">{uploadedFile.name}</div>
                <div className="file-size walaa-regular-400">
                  {formatFileSize(uploadedFile.size)}
                </div>
              </div>
              <div className="delete-icon">
                <span data-testid={dataTestId} onClick={() => onRemoveFile(fileInputRef)}>
                  <img src={Cancel} alt="Cancel Icon" />
                </span>
              </div>
            </div>
          )}
        </div>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.jpeg,.jpg,.png"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={onFileChange}
          aria-label={`${languageData?.upload} ${title}`}
          data-testid={dataTestId}
        />
      </div>
    </Accordion.Collapse>
  );
};

export default function UploadDocss({
  languageData,
  fileData,
  setFileData,
  onMandatoryFileRemoved,
  isOthersCase
}: Readonly<IbanProps>) {
  const documentSections = !isOthersCase && Array.isArray(languageData?.register_claim_dynamic_upload_section)
    ? languageData.register_claim_dynamic_upload_section
    : isOthersCase ? [{
      "key": "police_report",
      "value": "Police Report",
      "required": true
    }]: [];

  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File | null>>(
    Object.fromEntries(documentSections.map((section) => [section.key, null]))
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file, languageData);
    if (validationError) {
      toast.error(validationError, {
        icon: <WarningAmberOutlinedIcon />,
        className: "error-cust",
        position: "top-right",
        autoClose: 5000,
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

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64File = reader.result as string;
      const sectionKey = documentSections[index].key;

      setUploadedFiles((prev) => ({ ...prev, [sectionKey]: file }));
      setFileData((prev) => {
        const newFileData = [...prev];
        newFileData[index] = {
          docType: "372",
          fileName: file.name,
          fileExtension: file.name.split(".").pop() ?? "",
          docFile: base64File.split(",")[1],
        };
        return newFileData;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = (sectionKey: string, index: number, fileInputRef: React.RefObject<HTMLInputElement>) => {
    setUploadedFiles((prev) => ({ ...prev, [sectionKey]: null }));
    setFileData((prev) => {
      const newFileData = [...prev];
      newFileData[index] = null;
      return newFileData;
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const allRequiredDocumentsUploaded = isOthersCase ? uploadedFiles.policeReport : uploadedFiles.moroor_report;

  useEffect(() => {
    if (allRequiredDocumentsUploaded === null && !allRequiredDocumentsUploaded && onMandatoryFileRemoved) {
      onMandatoryFileRemoved({
        name: "mandatoryLiabilityFileRemoved",
        value: "LiabilityFileMandatoryRemoved",
      });
    }
  }, [allRequiredDocumentsUploaded]);

  return (
    <div className="iban-parent">
      <Accordion
        defaultActiveKey="0"
        className={`iban-validation-container ${isAccordionOpen ? "open-iban-accordion" : "closed-iban-accordion"}`}
      >
        <Card className="card-iban">
          <Card.Header className="card-header-iban">
            <div>
              <div className="upload-bank-document-header walaa-regular-400">
                {languageData?.upload_the_supporting_docs}
              </div>
              {!isAccordionOpen && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(languageData?.supported_file_type_doc),
                  }}
                ></div>
              )}
            </div>
            <CustomToggle eventKey="0" onToggle={setIsAccordionOpen} />
          </Card.Header>
        </Card>
        <div className="iban-validation-content">
          {documentSections.map((doc, index) => (
            <DocumentUploadSection
              key={index}
              title={doc.value}
              onFileChange={(e) => handleFileChange(e, index)}
              uploadedFile={uploadedFiles[doc.key]}
              onRemoveFile={(fileInputRef) => handleRemoveFile(doc.key, index, fileInputRef)}
              required={doc.required}
              languageData={languageData}
              dataTestId={`${doc.key}_testid`}
            />
          ))}
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