import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.scss";
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { sanitizeHtml } from "@dpm/shared-module";
 
interface HeaderItem {
  title: string;
  tooltip: string;
}
 
interface ProductTooltipProps {
  headerItem: HeaderItem;
}
 
export const ProductTooltip: React.FC<ProductTooltipProps> = ({ headerItem }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
 
  const handleShowModal = (content: string) => {
    setModalContent(content);
    setShowModal(true);
  };
 
  const handleCloseModal = () => {
    setShowModal(false);
  };
 
  return (
    <>
      <InfoOutlinedIcon className="info-icon"  onClick={() => handleShowModal(headerItem.tooltip)} />
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        className="modal-custom"
      >
        <Modal.Header>
          <CloseIcon  data-testid="img-role" className="modal-close-icon"  onClick={handleCloseModal} />
          <Modal.Title data-testid="tooltip-title">{headerItem.title}</Modal.Title>
        </Modal.Header>
 
        <Modal.Body>
          <div
            data-testid="tooltip-data"
            className="modal-content comprehensive-content"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(modalContent).replaceAll('\n','<br />') }}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};
