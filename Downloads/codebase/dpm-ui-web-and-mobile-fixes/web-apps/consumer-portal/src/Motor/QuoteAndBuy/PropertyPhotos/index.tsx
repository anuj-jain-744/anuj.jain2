import { Card } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import React, { useRef, useState, useCallback, useEffect } from "react";
import "./index.scss";
import { useLocation } from "react-router-dom";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import style from "../../QuoteAndBuy/VehicleDetailsModal/VehicleDetailsModal.module.scss";
import { LanguageData } from "types/languageData";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";
import useFilesToBase64 from "../../../claims/register/TrackClaim/hooks/useFilesToBase64";
import FileList from "./FileList";
import { validatePropertyPhotos, validateDuplicateFileName } from "utils/fileValidation";
import ListItemIcon from "../../../components/ListItemIcon";

interface PropertyPhotosProps {
  languageData: LanguageData | undefined | null;
}

const PropertyPhotosModal: React.FC<PropertyPhotosProps> = ({
  languageData,
}) => {

  const {
    setPropertyPhotos,
    propertyPhotos
  } = usePHQuoteBuyContext();

  const location = useLocation();
  const propsData = location?.state?.data;

  const [isRefNoModal, setRefNoShow] = useState<boolean>(false);
  const { fileData, setFileData, convertFilesToBase64 } = useFilesToBase64();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileSizeError, setFileSizeError] = useState<string>("");

  useEffect(() => {
    if (fileData?.length) {
      setPropertyPhotos((prev) => ([...prev, ...fileData]));
      setFileData([]);
    }
  }, [fileData])

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

  // Browse file and convert to base64
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

  const handleRemoveFile = useCallback(
    (index: number) => {
      setPropertyPhotos((prev) => prev.filter((_, i) => i !== index));
    },
    [setPropertyPhotos]
  );

  const handleRefNoClose = () => setRefNoShow(false);
  const handleRefNoShow = () => setRefNoShow(true);

  return (
    <Card className="property-photos-container">
      <Modal
        show={isRefNoModal}
        centered
        onHide={handleRefNoClose}
        className='floors-dialog-box'
      >
        <Modal.Header closeButton className="btn-photo-header">{languageData?.guidelines_title}</Modal.Header>
        <div className='floors-container'>
        
          <div className="guidelines">
            {languageData?.guidelines_desc.map((item, index) => (
              <div
                className="d-flex align-items-center walaa-regular-400 list-item-container"
                key={`${item}${index}`}
              >
                <ListItemIcon title={item} />
              </div>
            ))}
          </div>
        </div>
      </Modal>
      <div className="header walaa-medium-500">
        {languageData?.property_pictures}
        <button onClick={handleRefNoShow}><InfoOutlinedIcon /></button>
      </div>
      <hr className="horizontal-line" />
      <div className="content-description">{propsData?.ownerDetail?.ownerFullNameEnglish}, {languageData?.property_photos_text}</div>
      <div className={style.body}>
        <div className={style.fixedContent}>
          <div className="property-photos">
            <div className="drag-drop" onDrop={handleDrop}
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
                {languageData?.or_label}
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
              {fileSizeError && (
                <div className="text-danger mt-2" style={{ textAlign: "center" }}>
                  {fileSizeError}
                </div>
              )}
              {propertyPhotos && propertyPhotos.length > 0 && (
                <FileList
                  files={propertyPhotos}
                  onRemove={handleRemoveFile}
                  dataTestId="remove-btnid"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PropertyPhotosModal;