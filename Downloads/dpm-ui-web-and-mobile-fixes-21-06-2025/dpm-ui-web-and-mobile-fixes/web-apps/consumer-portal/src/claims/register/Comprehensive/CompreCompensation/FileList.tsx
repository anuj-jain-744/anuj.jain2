import React from "react";
import PictureAsPdfSharpIcon from "@mui/icons-material/PictureAsPdfSharp";
import CancelIcon from "@mui/icons-material/Cancel";

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

interface FileData {
  name: string;
  size: number;
  base64: string;
}

interface FileListProps {
  files: FileData[];
  onRemove: (index: number) => void;
  language: ILanguageData;
}

const FileList: React.FC<FileListProps> = React.memo(
  ({ files, onRemove, language }) => {
    return (
      <React.Fragment>
        <div className="px-3">
          <hr className="register-compensate-splitter" />
        </div>
        <div className="row">
          <div className="col d-flex justify-content-around">
            {language?.file_upload_is_completed || "File upload is completed."}.
          </div>
        </div>
        {files.map((fileData: FileData, index: number) => (
          <div key={index} className="px-4">
            <div className="row register-row-spacing-top register-row-spacing-bottom upload-ribbon-strip">
              <div className="col-sm-12 col-md d-flex align-items-center">
                <PictureAsPdfSharpIcon
                  sx={{ color: "red", fontSize: 16 }}
                  className="mx-1"
                />
                {fileData.name}&nbsp; {(fileData.size / 1024).toFixed(2)} KB
              </div>
              <div className="col-sm-12 col-md d-flex align-items-center justify-content-end">
                <CancelIcon
                  onClick={() => onRemove(index)}
                  sx={{ fontSize: 20, cursor: "pointer" }}
                />
              </div>
            </div>
          </div>
        ))}
      </React.Fragment>
    );
  }
);

export default FileList;
