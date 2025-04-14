import { Accordion, Card, useAccordionButton } from "react-bootstrap";
import { useState, useRef, useEffect } from "react";
import "./style.scss";
import Upload from "assets/IbanValidation/Upload.svg";
import Tick from "assets/IbanValidation/Circle Tick.svg";
import UP from "assets/IbanValidation/Chevron Up.svg";
import DOWN from "assets/IbanValidation/Chevron Down.svg";
import Cancel from "assets/IbanValidation/Cancel.svg";
import { sanitizeHtml, formatFileSize } from "@dpm/shared-module";
import { LanguageData } from "types/languageData";
import { fileLogos } from "components/Iban/fileLogos";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { Bounce, toast } from "react-toastify";
import { inValidExtensions } from "constant";

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
  children?: React.ReactNode;
  onToggle: (isToggled: boolean) => void;
}
const fileNameRegex = /^[a-zA-Z0-9-_ ]+$/;

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
      data-testid="toggle-btnid"
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
  onFileChange,
  uploadedFile,
  onRemoveFile,
  required,
  languageData,
  dataTestId
}: DocumentUploadSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const index =
    title === languageData?.moroor_report
      ? 0
      : title === languageData?.quotation
      ? 1
      : title === languageData?.spare_parts
      ? 2
      : title === languageData?.moroor_sketch
      ? 3
      : 4;

  return (
    <Accordion.Collapse eventKey="0">
      <div
        className="container-accordion"
        onClick={!uploadedFile ? handleClick : undefined}
        data-testid="accordion-testid"
      >
        <div  className="document-name-section">
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
          accept=".pdf,.doc,.docx,.jpeg,.jpg,.png"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => onFileChange(e, index)}
          aria-label={languageData?.upload + " " + `${title}`}
          data-testid={`file_nameid_${index}`}
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
                <span>{formatFileSize(uploadedFile.size)}</span>
              </div>
            </div>
            <div className="delete-icon">
              <span data-testid={dataTestId} onClick={() => onRemoveFile(fileInputRef, index)}>
                <img src={Cancel} alt="Cancel Icon" />
              </span>
            </div>
          </div>
        )}
      </div>
    </Accordion.Collapse>
  );
};

export default function UploadDocss({
  languageData,
  fileData,
  setFileData,
  onMandatoryFileRemoved,
}: Readonly<IbanProps>) {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({
    moroorReport: null as File | null,
    quotation: null as File | null,
    spareParts: null as File | null,
    moroorSketch: null as File | null,
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
      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
        "application/msword", // doc
        "image/jpeg",
        "image/png",
      ];      
      const fileName = file.name.split(".").slice(0, -1).join(".");
      if (file.size > maxSizeInMB * 1024 * 1024) {
        toast.error(languageData?.file_size_exceeds_5mb_plea, {
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
      } else if (!validTypes.includes(file.type) || inValidExtensions.some(ext => file?.name?.substring(file?.name?.lastIndexOf('.') + 1).toLowerCase() === ext)) {
        toast.error(languageData?.not_a_valid_file, {
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
      } else if (!fileNameRegex.test(fileName) || fileName.length > 255) {
        toast.error(languageData?.invalid_file_name, {
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
      else {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64File = reader.result as string;

          const section =
            index === 0
              ? "moroorReport"
              : index === 1
              ? "quotation"
              : index === 2
              ? "spareParts"
              : index === 3
              ? "moroorSketch"
              : "otherDocuments";

          setUploadedFiles((prevFiles) => ({
            ...prevFiles,
            [section]: file,
          }));

          setFileData((prevFileData) => {
            const newFileData = [...prevFileData];
            newFileData[index] = {
              docType: "372",
              fileName: file.name,
              fileExtension: file.name.split(".").pop() ?? "",
              docFile: base64File,
            };
            return newFileData;
          });
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
  };

  const allRequiredDocumentsUploaded = uploadedFiles.moroorReport;
useEffect(() => {
  allRequiredDocumentsUploaded === null && onMandatoryFileRemoved && onMandatoryFileRemoved({ name: "mandatoryLiabilityFileRemoved", value: "LiabilityFileMandatoryRemoved" });  
}, [allRequiredDocumentsUploaded]);
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
            <CustomToggle
              eventKey="0"
              onToggle={setIsAccordionOpen}
              children={undefined}
            />
          </Card.Header>
        </Card>
        <div className="iban-validation-content">
          <DocumentUploadSection
            title={languageData?.moroor_report}
            onFileChange={handleFileChange}
            uploadedFile={uploadedFiles.moroorReport}
            onRemoveFile={(fileInputRef) =>
              handleRemoveFile("moroorReport", 0, fileInputRef)
            }
            required={true}
            languageData={languageData}
            dataTestId={"moroor_testid"}
          />
          <DocumentUploadSection
            title={languageData?.quotation}
            onFileChange={handleFileChange}
            uploadedFile={uploadedFiles.quotation}
            onRemoveFile={(fileInputRef) =>
              handleRemoveFile("quotation", 1, fileInputRef)
            }
            required={false}
            languageData={languageData}
            dataTestId={"quotation_testid"}
          />
          <DocumentUploadSection
            title={languageData?.spare_parts}
            onFileChange={handleFileChange}
            uploadedFile={uploadedFiles.spareParts}
            onRemoveFile={(fileInputRef) =>
              handleRemoveFile("spareParts", 2, fileInputRef)
            }
            required={false}
            languageData={languageData}
            dataTestId={"spare_parts_testid"}
          />

          <DocumentUploadSection
            title={languageData?.moroor_sketch}
            onFileChange={handleFileChange}
            uploadedFile={uploadedFiles.moroorSketch}
            onRemoveFile={(fileInputRef) =>
              handleRemoveFile("moroorSketch", 3, fileInputRef)
            }
            required={false}
            languageData={languageData}
            dataTestId={"moroor_sketch_testid"}
          />
          <DocumentUploadSection
            title={languageData?.other_documents}
            onFileChange={handleFileChange}
            uploadedFile={uploadedFiles.otherDocuments}
            onRemoveFile={(fileInputRef) =>
              handleRemoveFile("otherDocuments", 4, fileInputRef)
            }
            required={false}
            languageData={languageData}
            dataTestId={"other_documents_testid"}
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