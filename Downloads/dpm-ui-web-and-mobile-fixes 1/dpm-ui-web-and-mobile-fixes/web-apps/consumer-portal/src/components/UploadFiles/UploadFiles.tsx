import React, { useContext, useEffect, useRef, useState } from "react";
import { DataContext } from "../../DataContext";
import useFilesToBase64 from "./hooks/useFilesToBase64";
import { Button } from "react-bootstrap";
import UploadBlue from "assets/Claims/svg/icons/UploadBlue.svg";
import PictureAsPdfSharpIcon from "@mui/icons-material/PictureAsPdfSharp";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import MoroorReport from "./MoroorReport";
import Spare from "./Spare";
import MoroorSketch from "./MoroorSketch";
import OtherDoc from "./OtherDoc";
import TypographyAndIcon from "components/ThemeComponents/TypographyAndIcon";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
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
  checkHandler: (name: string, valid: boolean) => void;
};

function UploadFiles({ changeHandler, checkHandler }: typeCompreUploadFiles) {
  //Mandatory doc uploaded check
  const [isMoroorReportUploaded, setMoroorReportUploaded] = useState(false);
  //Quotation
  const [selectedFileQuotation, setSelectedFileQuotation] = useState<{
    file: File | null;
    base64: string | null;
  }>({ file: null, base64: null });
  const fileInputRef = useRef<HTMLInputElement>(null);
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
          setSelectedFileQuotation({
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
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  // Delete file and clear input
  const deleteFileQuotation = () => {
    setSelectedFileQuotation({ file: null, base64: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    changeHandler(fileData);
  }, [fileData]);

  //MoroorReport
  const changeHandlerMoroor = (dataMoroor: any) => {
    if (dataMoroor === undefined || dataMoroor === null)
      setMoroorReportUploaded(false);
    else if (dataMoroor?.length !== 0) setMoroorReportUploaded(true);
    else setMoroorReportUploaded(false);
    changeHandler(dataMoroor);
  };

  //Spare
  const changeHandlerSpare = (dataSpare: any) => {
    changeHandler(dataSpare);
  };

  //MoroorSketch
  const changeHandlerSketch = (dataSketch: any) => {
    changeHandler(dataSketch);
  };

  //OtherDoc
  const changeHandlerOtherDoc = (dataOtherDoc: any) => {
    changeHandler(dataOtherDoc);
  };

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
    <div className="register-contact">
      <div className="flex flex-col">
        {/* commented as per new VD changes will bring back as per ask */}
        {/* <div className="register-contact-title walaa-medium-500">
          {language?.upload_the_supporting_docs}
        </div>
        <div className="register-contact-sub-title">
          {language?.supported_formats} | File size: max 5mb
        </div> */}
        <MoroorReport
          changeHandler={changeHandlerMoroor}
          checkHandler={checkHandler}
        />
        <div className="row register-row-spacing-top register-row-spacing-bottom">
          <div className="col">
            <div className="register-contact-estimate uploadfncontainer">
              <div className="m-2">
                <div className="row d-flex align-items-center">
                  <div className="col">
                    <TypographyAndIcon
                      text={language?.quotation}
                      required={false}
                    />
                  </div>
                  <div className="col d-flex justify-content-around">
                    <div className="walaa-medium-500 btn-outline-primary position-relative content-right">
                      {selectedFileQuotation?.file !== null ? (
                        <React.Fragment>
                          <div className="d-flex align-items-center walaa-medium-500 py-2">
                            <div className="upload-title">
                              {icnFactory(selectedFileQuotation?.file?.type)}
                              {selectedFileQuotation?.file?.name}
                              <span className="mx-1">
                                {selectedFileQuotation?.file?.size}&nbsp;KB
                              </span>
                            </div>
                            <div
                              title={language?.delete_document}
                              className="upload-white-icon"
                            >
                              <HighlightOffIcon
                                color="error"
                                onClick={deleteFileQuotation}
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
                            ref={fileInputRef}
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
        <Spare changeHandler={changeHandlerSpare} />
        <MoroorSketch changeHandler={changeHandlerSketch} />
        <OtherDoc changeHandler={changeHandlerOtherDoc} />
      </div>
    </div>
  );
}

export default UploadFiles;
