import React, { useCallback, useContext, useEffect, useRef } from "react";
import { DataContext } from "../../../../DataContext";
import useFilesToBase64 from "./hooks/useFilesToBase64";
import FileList from "./Filelist";

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

function CompreUploadFiles({ changeHandler }: typeCompreUploadFiles) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const language = useContext(DataContext) as ILanguageData;

  const { fileData, setFileData, convertFilesToBase64 } = useFilesToBase64();

  const handleMultipleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;

    if (selectedFiles) {
      convertFilesToBase64(selectedFiles);
    }
  };

  const handleRemoveFile = useCallback(
    (index: number) => {
      setFileData((prev) => prev.filter((_, i) => i !== index));
    },
    [setFileData]
  );

  useEffect(() => {
    changeHandler(fileData);
  }, [fileData]);
  //cms content
  const Data = useContext(DataContext);
  return (
    <div className="register-contact compre-compensation">
      <div className="register-contact-card register-row-spacing-top register-row-spacing-bottom">
        {/* <Card className="register-contact-card register-row-spacing-top register-row-spacing-bottom">
        <Card.Body className="p-0"> */}
        <div className="flex flex-col">
          <div className="register-contact-title walaa-medium-500">
            {Data?.upload_the_supporting_docs}
          </div>
          <div className="row register-row-spacing-top register-row-spacing-bottom">
            <div className="col">
              <div className="register-contact-estimate uploadfncontainer no-uploadfncontainer">
                <div className="register-row-large-spacing-top register-row-large-spacing-bottom">
                  <div className="row register-row-spacing-bottom">
                    <div className="col d-flex justify-content-center">
                      <div className="position-relative">
                        {Data?.drag_and_drop}
                        <input
                          type="file"
                          multiple
                          ref={fileInputRef}
                          accept=".pdf,.doc,.docx,.jpeg,.jpg,.png"
                          onChange={handleMultipleFileUpload}
                          className="position-absolute input-hidden"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col d-flex justify-content-center">
                      {Data?.supported_formats}
                    </div>
                  </div>
                  <div className="row register-row-spacing-top register-row-spacing-bottom">
                    <div className="col d-flex justify-content-center">
                      {Data?.or}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col d-flex justify-content-center">
                      <div className="walaa-medium-500 btn-outline-primary position-relative">
                        {Data?.browse_files}
                        <input
                          type="file"
                          multiple
                          ref={fileInputRef}
                          accept=".pdf,.doc,.docx,.jpeg,.jpg,.png"
                          onChange={handleMultipleFileUpload}
                          className="position-absolute input-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {fileData && fileData.length > 0 && (
                    <FileList
                      files={fileData}
                      onRemove={handleRemoveFile}
                      language={language}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </Card.Body>
      </Card> */}
    </div>
  );
}

export default CompreUploadFiles;
