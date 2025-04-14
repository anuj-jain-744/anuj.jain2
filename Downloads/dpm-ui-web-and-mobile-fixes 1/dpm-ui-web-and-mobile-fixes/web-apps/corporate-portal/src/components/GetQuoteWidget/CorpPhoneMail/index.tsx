import React, { useEffect, useState } from "react";
import { TypographyAndIcon } from "components/TypographyAndIcon";
import { ThemeTextbox } from "components/ThemeTextbox";
import { Modal, Placeholder } from "react-bootstrap";
import ThemeButton from "components/ThemeButton";
import "./index.scss";

interface CorpPhoneMailProps {
  isCorporatModal: boolean;
  setIsCorporatModal: (show: boolean) => void;
  setIsPhoneMailData: (show: boolean) => void;
  cPhoneMail: string;
  setcPhoneMail: (show: string) => void;
  languageData: any;
}

const CorpPhoneMail = ({ 
  isCorporatModal,
  setIsCorporatModal,
  setIsPhoneMailData,
  cPhoneMail,
  setcPhoneMail,
  languageData }: CorpPhoneMailProps) => {

  // Error text tracking for textbox data
  const [cPhoneMailError, setCPhoneMailError] = useState("");
  // enable/disable action btn state
  const [verifyAction, setVerifyAction] = useState<boolean>(false);

  const Data = {
    title: "Verification",
    labelText: "Mobile No. or Email ID",
    Placeholder: languageData?.enter + "Mobile No. or Email ID", 
    mobileNo: languageData?.mobile_number,
    emailId: "Email ID",
    verify: languageData?.verify,
    invalid_dynamic_input: languageData?.invalid_dynamic_input,
  };

  const updatedValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "cPhone_Mail") {
      setcPhoneMail(value);
      setCPhoneMailError('');
      setVerifyAction(false);

      // Validate input: only numeric characters or basic email format
      if (/^\d*$/.test(value)) {
        const saudiMobileRegex = /^05\d{8}$/;
        // section for phone number validation
        if (saudiMobileRegex.test(value) && value.length === 10){
          setVerifyAction(true);
        } else {
          setCPhoneMailError(Data?.invalid_dynamic_input.replace("<DYNAMIC>", Data?.mobileNo));
        }
      } else {
        // section for email validation
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          setVerifyAction(true);
        } else {
          setCPhoneMailError(Data?.invalid_dynamic_input.replace("<DYNAMIC>", Data?.emailId));
        }
      }
      if (value===""){
        setCPhoneMailError('');
      }
    }
  };

  //click handler return accept fn
  const clickHandler = () => {
    setIsPhoneMailData(true);
    setIsCorporatModal(false);
  };

  //modal dialog handler functions
  const handleClose = () => setIsCorporatModal(false);

  return (
    <React.Fragment>
      {/* dialog code */}
      <Modal
        // size="lg"
        show={isCorporatModal}
        centered
        onHide={handleClose}
        className="register-new-claim-comprehensive-corp-phone-mobile-ModalDialogBox"
      >
        <Modal.Header closeButton>
          <Modal.Title className="walaa-medium-500">
            {Data?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <div className="container walaa-regular-400 p-0">
            <div className="row ps-1">
              <div className="col col-12">
                <div className="row ps-1">
                  <TypographyAndIcon
                    text={Data?.labelText}
                    isIcon={false}
                    iconclasses={""}
                    tooltip={false}
                    tooltipdataheader={""}
                    tooltipclasses={""}
                    required={true}
                  />
                </div>
                <div className="row ps-1">
                  <div className="col-10">
                    <ThemeTextbox
                      type="text"
                      title={Data?.Placeholder}
                      name="cPhone_Mail"
                      value={cPhoneMail}
                      placeholder={Data?.Placeholder}
                      onChangehandler={updatedValue}
                      errorValue={cPhoneMailError}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="w-100 d-flex justify-content-end gap-1">
            <ThemeButton
              name={Data?.verify}
              className="walaa-medium-500 register-call2action2 btn btn-link btn-lg"
              disabled={!verifyAction}
              handleClick={(event) => clickHandler(event)}
            />
          </div>
        </Modal.Footer>
      </Modal>
      {/* dialog code ends */}
    </React.Fragment>
  );
};

export default CorpPhoneMail;