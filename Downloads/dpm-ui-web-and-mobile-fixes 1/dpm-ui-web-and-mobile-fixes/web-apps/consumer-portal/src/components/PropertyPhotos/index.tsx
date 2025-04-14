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

  // Drag and drop file and convert to base64
  const handleDrop = (event: any) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles) {
      convertFilesToBase64(droppedFiles);
    }
  };

  // Browse file and convert to base64
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const browseFiles = event.target.files;
    if (browseFiles) {
      convertFilesToBase64(browseFiles);
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