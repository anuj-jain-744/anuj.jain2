import React, { useEffect, useMemo, useState } from "react";
import { Modal, Form } from "react-bootstrap";
import "./style.scss";
import ThemeButton from "../sharedComponent/ThemeButton";
import MockData from "./mock.json";
import { productIDs, MOTOR_COMP, MOTOR } from "constant";
import { LanguageData } from "types/languageData";

interface ITermsandcon {
  handleState: (value: boolean) => void;
  isTCAccepted: boolean;
  languageData: LanguageData | undefined | null; 
  productName?: string;
  coverageType?: string; 
  cancelPolicy?: boolean;      
}

const TermsAndConditionsModal = ({ handleState, isTCAccepted, languageData, productName, coverageType, cancelPolicy }: Readonly<ITermsandcon>) => {
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

  const handleTermsConditionsForMotor = () => {
    setIsChecked((prev) => !prev);
  };

  useEffect(() => {
    handleState(isChecked);
  }, [isChecked]);

  const termsURL = useMemo(() => {
    let url: string | undefined = "";
     if (productName === productIDs.motor) {
      if (cancelPolicy) {
        if (coverageType === MOTOR_COMP)
          url = languageData?.cancel_policy_comprehensive;
        else if (coverageType === MOTOR)
          url = languageData?.cancel_policy_third_party;
      } else if (coverageType === MOTOR_COMP) {
        url = languageData?.endorsements_add_benefits_comprehensive;
      } else if (coverageType === MOTOR) {
        url = languageData?.endorsements_add_benefits_third_party;
      }
    }
    return url ?? "";
  }, [languageData]);

  const onLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!termsURL) event.preventDefault();
  };

  return (
    <div className="terms-and-conditions-container">
    <div className="wrapper">
      <Form.Check
        disabled={false}
        onClick={(productName === productIDs.motor) ? handleTermsConditionsForMotor : handleTermsConditions}
        aria-label="option 1"
        checked={isChecked}
      />
      </div>
      {MockData["agree"]}
      {(productName === productIDs.motor) ? (
        <>
          <a
            className="terms-condition-click"
            href={termsURL}
            target="_blank"
            onClick={onLinkClick}
          >
            {languageData?.terms_conditions}
          </a>
          <span className="and-word-text"> {languageData?.and} </span>
          
                  <a
                    className="terms-condition-click only-text"
                    href={languageData?.privacy_notice_link}
                    target="_blank"
                    onClick={onLinkClick}
                  >
                    {languageData?.privacy_notice}
                  </a>
          <span className="red-required">{" "}*</span>
        </>
      ) : (
        <span className="model-text" onClick={handleShow}>
          {MockData["terms&conditions"]}
        </span>
      )}
      {(productName !== productIDs.motor) && (
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
      )}
    </div>
  );
};

export default TermsAndConditionsModal;
