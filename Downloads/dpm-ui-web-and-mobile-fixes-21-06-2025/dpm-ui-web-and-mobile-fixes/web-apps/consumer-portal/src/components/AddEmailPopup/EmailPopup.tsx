import React, { useState } from 'react';
import './index.scss';
import { Button, Modal } from 'react-bootstrap';
import ThemeTextbox from "components/ThemeTextbox/ThemeTextbox";
import {
    isValidEmail,
  } from "@dpm/shared-module";
import { LanguageData } from 'types/languageData';
import CloseIcon from 'assets/AlertIcon/closeIcon.svg'

interface AlertBoxProps {
  showEmailModal: boolean;
  handleClose: () => void;
  languageData?: LanguageData;
  handleAddEmail: (email: string) => void;
}

export const AddEmailPopup: React.FC<AlertBoxProps> = ({handleClose,showEmailModal,languageData,handleAddEmail}) => {
    const [email, setEmail] = useState<string>("");
    const [disableButton, setDisableButton] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const validateInput = (value: string | number) => {
        setErrorMessage("");
        if (!isValidEmail(value)) {
            setErrorMessage(languageData?.please_provide_valid_email_id);
            setDisableButton(true);
          } else {
            setDisableButton(false);
          }
      };

      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        validateInput(value);
      };
  return (
    <div >
      <Modal
        show={showEmailModal}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
        className={"email-modal"}
      >
        <Modal.Header closeButton className='modal-header no-border mb-0 btn-close-color="red"'>
          <Modal.Title className="walaa-medium-500">{languageData?.add_email}</Modal.Title>
          <img src={CloseIcon} alt="close icon" className={"close-icon"} onClick={handleClose} />
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column email-container">
            <div className='label'>{languageData?.new_email_id}</div>
          <ThemeTextbox
                name="email"
                onChangehandler={handleInputChange}
                value={email}
                onBlurHandler={validateInput}
                errorMessage={errorMessage}
                classes="email"
              />
          </div>
        </Modal.Body>

        <Modal.Footer className='modal-footer no-border'>
          <Button
            className="email-cancel walaa-medium-500"
            onClick={handleClose}
          >
            {languageData?.cancel}
          </Button>
          <Button
            className={`email-action ${
              disableButton ? "disabled" : ""
            } walaa-medium-500`}
            onClick={()=>handleAddEmail(email)}
            disabled={disableButton}
          >
            {languageData?.add}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
