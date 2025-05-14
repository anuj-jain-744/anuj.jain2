import React, { useEffect, useState } from "react";
import { Modal, Form } from "react-bootstrap";
import "./style.scss";
import ThemeButton from "../sharedComponent/ThemeButton";
import MockData from "./mock.json";

const TermsAndConditionsModal = ({ handleState, isTCAccepted }) => {
  const [show, setShow] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleCancel = () => {
    setShow(false);
    setIsChecked(false);
    handleState(false);
  };

  const handleAccept = () => {
    setShow(false);
    setIsChecked(true);
    handleState(true);
  };
  const handleShow = () => {
    setShow(true);
    isTCAccepted && setIsChecked((prev) => !prev);
  };

  const handleTermsConditions = () => {
    isTCAccepted && setIsChecked((prev) => !prev);
  };

  useEffect(() => {
    handleState(isChecked);
  }, [isChecked]);

  return (
    <div className="travel-terms-container">
    <div className="wrapper">
      <Form.Check
        disabled={false}
        onClick={handleTermsConditions}
        aria-label="option 1"
        checked={isChecked}
      />
      </div>
      {MockData["agree"]}
      <span className="model-text" onClick={handleShow}>
        {MockData["terms&conditions"]}
      </span>
      <Modal show={show} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>{MockData["dialog-heading"]}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{MockData["content-one"]}</p>
          <p>{MockData["content-two"]}</p>
        </Modal.Body>
        <Modal.Footer>
          <ThemeButton
            variant="primary"
            onClickhandler={handleCancel}
            title={MockData["close"]}
            classes={""}
          />
          <ThemeButton
            variant="primary"
            onClickhandler={handleAccept}
            title={MockData["accept"]}
            classes={""}
          />
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TermsAndConditionsModal;
