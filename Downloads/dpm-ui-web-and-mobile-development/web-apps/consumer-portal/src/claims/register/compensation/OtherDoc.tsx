import React, {
    useContext,
    useEffect,
    useRef,
    useState,
  } from "react";
  import { DataContext } from "../../../DataContext";
  import useFilesToBase64 from "./hooks/useFilesToBase64";
  import { Button } from "react-bootstrap";
  import UploadBlue from "../../assets/svg/icons/UploadBlue.svg";
  import PictureAsPdfSharpIcon from "@mui/icons-material/PictureAsPdfSharp";
  import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
  
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
  
  function OtherDoc({ changeHandler }: typeCompreUploadFiles) {
    //OtherDoc
    const [selectedFileOtherDoc, setSelectedFileOtherDoc] = useState<{
      file: File | null;
      base64: string | null;
    }>({ file: null, base64: null });
    const fileInputRefOtherDoc = useRef<HTMLInputElement>(null);
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
            setSelectedFileOtherDoc({
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
          if (fileInputRefOtherDoc.current) {
            fileInputRefOtherDoc.current.value = "";
          }
        }
      }
    };
  
    // Delete file and clear input
    const deleteFileOtherDoc = () => {
      setSelectedFileOtherDoc({ file: null, base64: null });
      if (fileInputRefOtherDoc.current) {
        fileInputRefOtherDoc.current.value = "";
      }
    };
  
    useEffect(() => {
      changeHandler(fileData);
    }, [fileData]);
  
    //cms content
    const language = useContext(DataContext);
    return (
      <div className="row register-row-spacing-top register-row-spacing-bottom">
            <div className="col">
              <div className="register-contact-estimate uploadfncontainer">
                <div className="register-row-large-spacing-top register-row-large-spacing-bottom">
                  <div className="row">
                    <div className="col">{language?.other_documents}</div>
                    <div className="col d-flex justify-content-around">
                      <div className="walaa-medium-500 btn-outline-primary position-relative content-right">
                        {selectedFileOtherDoc?.file !== null ? (
                          <Button
                            className="upload-white"
                            title={language?.delete_document}
                            onClick={deleteFileOtherDoc}
                          >
                            <PictureAsPdfSharpIcon
                              sx={{ color: "red", fontSize: 16 }}
                              className="mx-1"
                            />
                            {selectedFileOtherDoc.file?.name}
                            <span className="mx-1">
                              {selectedFileOtherDoc?.file?.size}&nbsp;KB
                            </span>
                            <DeleteOutlinedIcon />
                          </Button>
                        ) : (
                          <Button
                            className="upload-white"
                            title={language?.upload_docs}
                          >
                            <img src={UploadBlue} alt="Upload icon" />{" "}
                            {language?.upload_docs}
                            <input
                              type="file"
                              ref={fileInputRefOtherDoc}
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
  
  export default OtherDoc;