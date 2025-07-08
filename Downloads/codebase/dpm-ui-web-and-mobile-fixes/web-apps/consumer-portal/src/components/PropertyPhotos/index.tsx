import { Modal } from "react-bootstrap";
import React, { useRef, useState, useCallback, useEffect } from "react";
import ThemeButton from "components/ThemeButton/ThemeButton";
import { ConfirmBox } from "components/ConfirmBox";
import "./index.scss";
import style from "../../Motor/QuoteAndBuy/VehicleDetailsModal/VehicleDetailsModal.module.scss";
import closeIcon from "../../assets/QuoteAndBuy/closeIcon.svg";
import { LanguageData } from "types/languageData";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";
import useFilesToBase64 from "@dpm/consumer-portal/src/claims/register/TrackClaim/hooks/useFilesToBase64";
import FileList from "./FileList";
import ShowPhoto from "./ShowPhoto";
import { validatePropertyPhotos, validateDuplicateFileName } from "utils/fileValidation";


interface PropertyPhotosProps {
  show: boolean;
  onHide: () => void;
  languageData: LanguageData | undefined | null;
}

const PropertyPhotosModal: React.FC<PropertyPhotosProps> = ({
  show,
  onHide,
  languageData,
}) => {

  const {
    setPropertyPhotos,
    propertyPhotos
  } = usePHQuoteBuyContext();

  const [showAddBenefModal, setShowAddBenefModal] = useState(show);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const { fileData, setFileData, convertFilesToBase64 } = useFilesToBase64();
  const [fileSizeError, setFileSizeError] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const submitFiles = () => {
    const photos = [...propertyPhotos, ...fileData]
    setPropertyPhotos(photos);
    setShowAddBenefModal(false);
    onHide();
  };

  useEffect(() => {
    if (propertyPhotos) {
      setFileData([]);
    }
  }, [])

  const showFileSizeError = (message: string) => {
    setFileSizeError(message);
    setTimeout(() => {
      setFileSizeError("");
    }, 5000);
  };

  // Drag and drop file and convert to base64
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    if (!droppedFiles.length) return;
    const isValidDrop = validatePropertyPhotos(
      droppedFiles,
      languageData ?? languageData?.only_jpg_files_under_800kb
    );
    if (!isValidDrop) {
      showFileSizeError(languageData?.only_jpg_files_under_800kb);
      return;
    }
    const isFileNameExists = validateDuplicateFileName(droppedFiles, propertyPhotos);
    if (isFileNameExists) {
      showFileSizeError(languageData?.please_check_file_already_uploaded?.replace("<<name>>", isFileNameExists));
      return;
    }
    setFileSizeError(""); // Clear old error immediately if any
    convertFilesToBase64(event.dataTransfer.files);
  };


  /// Browse file and convert to base64
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const browseFiles = event.target.files;
    const filesArray = browseFiles ? Array.from(browseFiles) : [];
    if (!filesArray.length) return;
    const isValid = validatePropertyPhotos(
      filesArray,
      languageData ?? languageData?.only_jpg_files_under_800kb
    );
    if (!isValid) {
      showFileSizeError(languageData?.only_jpg_files_under_800kb);
      //  Reset input even if invalid to allow same file selection again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }
    const isFileNameExists = validateDuplicateFileName(filesArray, propertyPhotos);
    if (isFileNameExists) {
      showFileSizeError(languageData?.please_check_file_already_uploaded?.replace("<<name>>", isFileNameExists));
      //  Reset input even if invalid to allow same file selection again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }
    setFileSizeError(""); // Clear any old error
    convertFilesToBase64(browseFiles!); // Proceed with upload
    // Also reset after valid upload
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    if (fileData?.length) {
      setShowAlertModal(true);
    } else {
      setShowAddBenefModal(false);
      onHide();
    }
  };

  const handleModalYes = () => {
    setShowAlertModal(false);
  }

  const handleModalNo = () => {
    setFileData([]);
    setShowAlertModal(false);
    setShowAddBenefModal(false);
    onHide();
  }

  const handleRemoveLocalFile = useCallback(
    (index: number) => {
      setPropertyPhotos((prev) => prev.filter((_, i) => i !== index));
    },
    [setPropertyPhotos]
  );

  const handleRemoveFile = useCallback(
    (index: number) => {
      setFileData((prev) => prev.filter((_, i) => i !== index));
    },
    [setFileData]
  );

  return (
    <Modal
      show={showAddBenefModal}
      onHide={handleClose}
      className={`add-driver-pop ${style.mainContainer}`}
      centered
    >
      <div className={style.modalContainer}>
        <ConfirmBox
          title={languageData?.property_photos}
          showConfirmModal={showAlertModal}
          setConfirmYes={handleModalYes}
          setConfirmNo={handleModalNo}
          languageData={languageData}
        />
        <div className={style.frame}>
          <div className={style.heading}>{languageData?.property_photos}</div>
          <button onClick={handleClose}><img src={closeIcon} alt="close icon" className={style.modalCloseIcon} /></button>
        </div>
        <div className={style.body}>
          <div className={style.fixedContent}>
            {propertyPhotos && propertyPhotos?.length > 0 && (
              <ShowPhoto
                files={propertyPhotos}
                onRemove={handleRemoveLocalFile}
              />
            )}
            <div className="property-photos">
              <div className={`drag-drop ${fileData && fileData.length > 0 && ' drag-opacity'}`} onDrop={handleDrop}
                onDragOver={(event) => event.preventDefault()}>
                <div className="row">
                  <div className="d-flex justify-content-around drag-head">
                    {languageData?.drag_and_drop}
                  </div>
                  <div className="d-flex justify-content-around drag-supporting-label">
                    {languageData?.supported_file_type}
                  </div>
                </div>
                <div className="col d-flex justify-content-around or-label">
                  {'OR'}
                </div>
                <div className="col d-flex justify-content-around">
                  <input
                    type="file"
                    id="browse"
                    multiple
                    ref={fileInputRef}
                    accept=".pdf,.doc,.docx,.jpeg,.jpg,.png"
                    onChange={handleFileChange}
                    className="position-absolute input-hidden"
                  />
                  <label
                    htmlFor="browse"
                    className="butn-div"
                  >
                    <span className="btn">{languageData?.browse_files}</span>
                  </label>
                </div>
              </div>
              {fileSizeError && (
                <div className="text-danger mt-2" style={{ textAlign: "center" }}>
                  {fileSizeError}
                </div>
              )}
              {fileData && fileData.length > 0 && (
                <FileList
                  files={fileData}
                  onRemove={handleRemoveFile}
                />
              )}
            </div>
            <div className={style.frameBottom}>
              <ThemeButton
                icon={false}
                variant="outline"
                isDisabled={false}
                title={languageData?.cancel}
                onClickhandler={handleClose}
              />
              <ThemeButton
                icon={false}
                variant="trackClaim"
                isDisabled={fileData?.length === 0}
                title={languageData?.update}
                onClickhandler={submitFiles}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal >
  );
};

export default PropertyPhotosModal;