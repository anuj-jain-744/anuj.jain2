import React, { useState } from "react";
import style from "./UploadDocs.module.scss";
import cancel from "assets/TrackYourClaim/Cancel.svg";
import upload from 'assets/TrackYourClaim/upload.svg';
import pdfIcon from "../../../../../../assets/TrackYourClaim/pdfIcon.svg";
import ThemeButton from "components/ThemeButton/ThemeButton";
import { Accordion } from "react-bootstrap";
import { useUploadFile } from "../../../../../../claims/register/TrackClaim/hooks/useUploadClaimFile";
import { useClaimContext } from "Motor/ClaimHooks/useClaimContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { taskConstants, validFileTypes } from "../../../../../../constant";
import useFileHandler from "./hooks/useFileHandler";
import useUploadAll from "./hooks/useUploadAll";

interface UploadDocsProps {
  onClose?: () => void | undefined;
  setIsSuccess: (param: boolean) => void;
}
interface FileiItem {
  id: string;
  name?: string;
  file: File | null;
  base64: string | null;
  error: string | null;
  taskId: number;
}
const Title: React.FC = () => {
  const { trackClaimInfo } = useClaimContext();
  return (
    <div className={style.tycTitle}>
      <div className={style.tycTitleText}>
        {trackClaimInfo?.upload_the_supporting_docs}
      </div>
    </div>
  );
};
const SupportedFileInfo: React.FC = () => {
  const { trackClaimInfo } = useClaimContext();
  return (
    <div className={style.tycFrameHeader}>
      <div className={style.tycFrameHeaderValue}>
        <span
          className={style.tycFrameHeaderText}
          dangerouslySetInnerHTML={{
            __html: trackClaimInfo?.supported_file_type_doc,
          }}
        ></span>
      </div>
    </div>
  );
};
const UploadDocs: React.FC<UploadDocsProps> = ({ onClose, setIsSuccess }) => {
  const { trackNewData } = useClaimContext();
  const { trackClaimInfo } = useClaimContext();

  //accordion opened/not state
  const [isOpen, setOpen] = useState<boolean>(false);
  //accordion on body open handler fn
  const clickEnterHandler = () => {
    setOpen(true);
  };
  //accordion on body close handler fn
  const clickExitHandler = () => {
    setOpen(false);
  };
  const initialFileItems: FileiItem[] = Array.isArray(trackNewData.claimTrackingDetails)
    ? trackNewData.claimTrackingDetails
      .filter((claimTrackingDetail: { taskStatus: string; taskId: number; uploadDocumnets?: { documentId: string; documentName: string }[] }) => claimTrackingDetail.taskStatus === taskConstants.PENDING)
      .flatMap((claimTrackingDetail: { taskStatus: string; taskId: number; uploadDocumnets?: { documentId: string; documentName: string }[] }) =>
        Array.isArray(claimTrackingDetail.uploadDocumnets)
          ? claimTrackingDetail.uploadDocumnets.map((doc) => ({
            id: doc.documentId,
            name: doc.documentName,
            file: null,
            base64: null,
            error: null,
            taskId: claimTrackingDetail.taskId,
          }))
          : []
      )
    : [];
  const [fileItems, setFileItems] = useState<FileiItem[]>(initialFileItems);
  const [newFileItems, setNewFileItems] = useState<FileiItem[]>([
    ...initialFileItems,
  ]);

  const resetFileInput = (fileInput: HTMLInputElement) => {
    fileInput.value = "";// reset input value
  }
  // Handle File Remove Function
  const handleFileRemove = (id: string) => {
    const targetItem = fileItems.find((item) => item.id === id);
    if (targetItem) {
      updateItemsFile(id, null, null);
      toast.info(`${trackClaimInfo?.file_removed} for ${targetItem?.name}`, { autoClose: 2000 });
    }
  };



  // ConvertBase64 Function
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const updateItemsFile = (
    id: string,
    file: File | null,
    base64: string | null
  ) => {
    setFileItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, file, base64, error: null } : item
      )
    );
    setNewFileItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, file, base64,error: null } : item
      )
    );
  };

  const updateItemsError = (id: string, error: string) => {
    setFileItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, file: null, base64: null, error } : item
      )
    );
    setNewFileItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, file: null, base64: null, error } : item
      )
    );
  };

  const { handleFileChange } = useFileHandler({
    fileItems,
    validFileTypes,
    taskConstants,
    trackClaimInfo,
    updateItemsError,
    updateItemsFile,
    resetFileInput,
    convertToBase64,
  });


  const isUploadButtonEnbled = newFileItems.length > 0 && newFileItems.every((item) => item.base64 && !item.error)
  const isMandatory = true; // Mandetory Astrick
  // function to handle upload & submit API call
  const { makeApiCall } = useUploadFile();
  const resetState = () => {
    setFileItems(initialFileItems);
    setNewFileItems([...initialFileItems]);
    setOpen(false);
  };

  const { handleUploadAll } = useUploadAll({
    newFileItems,
    taskConstants,
    trackClaimInfo,
    makeApiCall,
    resetState,
    setIsSuccess,
  });

  return (
    <div className={style.tycContainer}>

      <Accordion
        className={`${isOpen ? "accor-open" : "accor-close"} accorUploadDocs`}
      >
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <Title />
            <SupportedFileInfo />
          </Accordion.Header>
          <Accordion.Body
            data-testid='accordion-enterid'
            onEntered={clickEnterHandler}
            onExiting={clickExitHandler}
            className="p-2"
          >
            <div className={style.tycContents}>
              <div className={style.tycFrame}>
                <div className={style.tycFrameContents}>
                  <div className={style.tycFrameUpload}>
                    {fileItems.map((item) => (
                      <div key={item.id} className={style.tycFrameUploadContent}>
                        <div className={style.tycFrameContentsTextValue}>
                          {`${item.name}`}{" "}
                          {isMandatory && (<span className={style.tycFrameContentsTextStrick}>*</span>)}
                        </div>
                        <div className={item.file ? `${style.buttonTextContainer}` : 'upload-btn-div'}>
                          <label htmlFor={`file-input-${item.id}`}>
                            {item.file ? (
                              <>
                                <span className={style.buttonTextNameValue}><img
                                  src={pdfIcon}
                                  alt="PDF"
                                  className={style.buttonTextIcon}
                                />{item.file.name}</span>
                                <span className={style.buttonTextNameSize}>{(item.file.size / 1024).toFixed(2)}KB</span>
                              </>
                            ) : (<div className="upload-btn"> <img
                              src={upload}
                              alt="upload"
                              className={style.buttonTextIcon}
                            />Upload</div>)
                            }
                          </label>
                          {item.file && (
                            <span data-testid='removefile_testid' className="closeIcon" onClick={() => {
                              handleFileRemove(item.id);
                            }}>{" "}
                              <img
                                src={cancel}
                                alt="cancel_icon"
                                className={style.buttonTextIcon}
                              />
                            </span>
                          )}
                          <input
                            type="file"
                            id={`file-input-${item.id}`}
                            onChange={(e) => handleFileChange(e, item.id)}
                            accept={validFileTypes.join(",")}
                            style={{ display: "none" }}
                            data-testid="file-input"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className={style.tycBottom}>
                <ThemeButton
                  icon={false}
                  variant="trackClaim"
                  onClickhandler={handleUploadAll}
                  isDisabled={!isUploadButtonEnbled}
                  title={trackClaimInfo?.submit_documents}
                  classes="walaa-medium-500"
                />
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};
export default UploadDocs;