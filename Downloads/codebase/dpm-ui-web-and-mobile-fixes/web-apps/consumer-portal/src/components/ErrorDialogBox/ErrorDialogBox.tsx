import React, { useState } from "react";
import "./ErrorDialogBox.scss"
import { Modal } from "react-bootstrap";
import Warning from "assets/Dashboard/Warning Fill_Large.svg";
import ThemeButton from "components/ThemeButton/ThemeButton";

interface ErrorDialogBoxProps {
  onClose: () => void;
  buttonName?: string;
  headingContent?: string;
  bodyContent?: string | React.ReactNode;
  imgSrc?: string;
  isCentered?: boolean;
}

const ErrorDialogBox: React.FC<ErrorDialogBoxProps> = ({
  onClose,
  buttonName,
  headingContent,
  bodyContent,
  imgSrc = Warning,
  isCentered = false,
}) => {
  const [show, setShow] = useState(true);

  const handleClose = () => {
    setShow(false);
    onClose();
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered={isCentered} dialogClassName="custom-error-modal-content" >
        <div className="error-dialog-box-container">
          <div className="error-dialog-box-header">
            <div>
              <img src={imgSrc} />
            </div>
            <div className="error-dialog-box-body-text">
              <div className="main-body-header walaa-medium-500">
                {headingContent}
                </div>
                <div className="main-body-content walaa-regular-400">
                  {bodyContent}
                </div>
            </div>
          </div>
          <div className="error-dialog-box-footer">
            <ThemeButton variant="filterBtnsActive" onClickhandler={handleClose} title={buttonName} />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ErrorDialogBox;
