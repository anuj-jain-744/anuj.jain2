import React, { useRef, useCallback } from "react";
import { Card } from "react-bootstrap";
import { useUploadFile } from "../../hooks/useUploadFile";
import FileList from "./FileList";
import UploadButton from "./UploadButton";
import ThemeButton from "../../utils/BaseButton";
import "./UploadDoc.scss";
import useFilesToBase64 from "../../hooks/useFilesToBase64";
import { LanguageData } from "types/languageData";

interface Props {
  handleSuccess: (param: boolean) => void,
  languageData : LanguageData
}

function UploadDoc({ handleSuccess, languageData }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { makeApiCall, isLoading } = useUploadFile();

  const { fileData, setFileData, convertFilesToBase64 } = useFilesToBase64();

  const handleMultipleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;

    if (selectedFiles) {
      convertFilesToBase64(selectedFiles);
    }
  };

  const submitFiles = async () => {
    const result = await makeApiCall(fileData);

    if (result.status === "OK") {
      handleSuccess(true);
    }
  };

  const handleRemoveFile = useCallback(
    (index: number) => {
      setFileData((prev) => prev.filter((_, i) => i !== index));
    },
    [setFileData]
  );

  return (
    <>
      {languageData ? (
        <div className="register-contact">
          <Card className="register-contact-card register-row-spacing-top register-row-spacing-bottom">
            <Card.Body className="p-0">
              <div className="flex flex-col">
                <div className="register-contact-title walaa-medium-500">
                  {languageData?.upload_the_supporting_docs}
                </div>
                <div className="register-contact-sub-title">
                  {languageData?.supported_formats}
                </div>
                <div className="row register-row-spacing-top register-row-spacing-bottom">
                  <div className="col">
                    <div className="register-contact-estimate uploadfncontainer">
                      <div className="register-row-large-spacing-top register-row-large-spacing-bottom">
                        <div className="row">
                          <div className="col">
                            {languageData?.upload_accident_report}
                          </div>
                          <div className="col d-flex justify-content-around">
                            <UploadButton
                              language={languageData}
                              fileInputRef={fileInputRef}
                              handleFileChange={handleMultipleFileUpload}
                            />
                          </div>
                        </div>
                        {fileData && fileData.length > 0 && (
                          <FileList
                            files={fileData}
                            onRemove={handleRemoveFile}
                            language={languageData}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="button-right">
                    <ThemeButton
                      classes="walaa-medium-500"
                      variant="trackClaim"
                      isDisabled={fileData?.length === 0 || isLoading}
                      title={
                        isLoading && languageData
                          ? languageData?.uploading ?? "Uploading"
                          : languageData?.submit ?? "Submit"
                      }
                      icon={true}
                      onClickhandler={submitFiles}
                    />
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      ) : (
        "Loading"
      )}
    </>
  );
}

export default UploadDoc;
