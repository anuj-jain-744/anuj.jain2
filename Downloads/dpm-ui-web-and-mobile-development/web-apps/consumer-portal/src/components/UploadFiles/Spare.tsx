import React, { useContext, useEffect, useRef, useState } from "react";
import { DataContext } from "../../DataContext";
import useFilesToBase64 from "./hooks/useFilesToBase64";
import { Button } from "react-bootstrap";
import UploadBlue from "assets/Claims/svg/icons/UploadBlue.svg";
import PictureAsPdfSharpIcon from "@mui/icons-material/PictureAsPdfSharp";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ImageIcon from "@mui/icons-material/Image";

interface ILanguageData {
  download_all?: string;
  renew_you_policy?: string;
  endorsements?: string;
  back?: string;
  comprehensive?: string;
  policy_placeholder?: string;
  policy_documents?: string;
  quotation?: string;
  policy_related?: string;
  endorsement_related?: string;
  claims_related?: string;
  track_your_claim?: string;
  current_status?: string;
  download_claim_documents?: string;
  track_another_claim?: string;
  upload_the_supporting_docs?: string;
  supported_formats?: string;
  upload_accident_report?: string;
  uploading?: string;
  submit?: string;
  upload_docs?: string;
  file_upload_is_completed?: string;
  motor_claim_no?: string;
  insurance_type?: string;
  claim_id?: string;
}

type typeCompreUploadFiles = {
  changeHandler: (data: any) => void;
};

function Spare({ changeHandler }: typeCompreUploadFiles) {
  //Spare
  const [selectedFileSpare, setSelectedFileSpare] = useState<{
    file: File | null;
    base64: string | null;
  }>({ file: null, base64: null });
  const fileInputRefSpare = useRef<HTMLInputElement>(null);
  const languageFile = useContext(DataContext) as ILanguageData;

  const { fileData, setFileData, convertFilesToBase64 } = useFilesToBase64();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;

    if (selectedFiles) {
      convertFilesToBase64(selectedFiles);
    }
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = [
        "application/pdf",
        "application/msword",
        "image/jpeg",
        "image/png",
      ];
      if (validTypes.includes(file.type) && file.size <= 3 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          setSelectedFileSpare({
            file: file,
            base64: base64,
          });
        };
        reader.onerror = () => {
          console.error("Error occurred while reading file.");
        };
        reader.readAsDataURL(file);
      } else {
        alert("Invalid file type or exceeds size limit (3MB)");
        if (fileInputRefSpare.current) {
          fileInputRefSpare.current.value = "";
        }
      }
    }
  };

  // Delete file and clear input
  const deleteFileSpare = () => {
    setSelectedFileSpare({ file: null, base64: null });
    if (fileInputRefSpare.current) {
      fileInputRefSpare.current.value = "";
    }
  };

  useEffect(() => {
    changeHandler(fileData);
  }, [fileData]);

  //icon generator factory
  const icnFactory = (icnName: string) => {
    switch (icnName) {
      case "application/pdf":
        return <PictureAsPdfSharpIcon className="mx-1 upload-icon-error" />;
      default:
        return <ImageIcon className="mx-1 upload-icon-error" />;
    }
  };

  //cms content
  const language = useContext(DataContext);
  return (
    <div className="row register-row-spacing-top register-row-spacing-bottom">
      <div className="col">
        <div className="register-contact-estimate uploadfncontainer">
          <div className="m-2">
            <div className="row d-flex align-items-center">
              <div className="col">{language?.spare_parts}</div>
              <div className="col d-flex justify-content-around">
                <div className="walaa-medium-500 btn-outline-primary position-relative content-right">
                  {selectedFileSpare?.file !== null ? (
                    <React.Fragment>
                      <div className="d-flex align-items-center walaa-medium-500 py-2">
                        <div className="upload-title">
                          {icnFactory(selectedFileSpare?.file?.type)}
                          {selectedFileSpare?.file?.name}
                          <span className="mx-1">
                            {selectedFileSpare?.file?.size}&nbsp;KB
                          </span>
                        </div>
                        <div
                          title={language?.delete_document}
                          className="upload-white-icon"
                        >
                          <HighlightOffIcon
                            color="error"
                            onClick={deleteFileSpare}
                          />
                        </div>
                      </div>
                    </React.Fragment>
                  ) : (
                    <Button
                      className="upload-white"
                      title={language?.upload_docs}
                    >
                      <img src={UploadBlue} alt="Upload icon" />{" "}
                      {language?.upload_docs}
                      <input
                        type="file"
                        ref={fileInputRefSpare}
                        accept=".pdf,.doc,.docx,.jpeg,.jpg,.png"
                        onChange={handleFileUpload}
                        className="position-absolute input-hidden"
                      />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Spare;
