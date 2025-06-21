import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import "./index.scss";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { sanitizeHtml } from "@dpm/shared-module";

interface popUpData {
  popUpData: string;
}
const Info: React.FC<popUpData> = (popUpData) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [data, setData] = useState<string>("");
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const showInfo = (data: string) => {
    setShowModal(true);
    setData(data);
  };
  return (
    <>
      <InfoOutlinedIcon
        onClick={() => showInfo(popUpData.popUpData)}
        className="form-info"
        data-testid="info-icon"
      />
      <Modal fade-scale show={showModal} onHide={handleCloseModal} centered className="info-modal-main">
        <Modal.Header data-testid="info-head" closeButton className="info-modal-head"></Modal.Header>
        <Modal.Body data-testid="info-body" className="info-modal-body" dangerouslySetInnerHTML={{ __html: sanitizeHtml(data) }}></Modal.Body>
      </Modal>
    </>
  );
};

export default Info;
