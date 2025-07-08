import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import ThemeButton from "components/ThemeComponents/ThemeButton";
import { LanguageData } from "types/languageData";
import "./index.scss";

interface PropTypes {
  showRegModal?: boolean;
  setShowRegModal?: (show: boolean) => void;
  langData: {
    consumer: LanguageData;
    product: LanguageData;
  };
}

const RegisterClaimModalDialog = ({
  showRegModal,
  setShowRegModal,
  langData,
}: PropTypes) => {
  const [show, setShow] = useState(true);
  const handleClose = () => {
    setShow(false);
    if (showRegModal != undefined) {
      setShowRegModal?.(false);
    }
  };

  useEffect(() => {
    if (showRegModal != undefined) {
      setShow(showRegModal);
    } else {
      setShow(false);
    }
  }, [showRegModal]);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      className="register-new-claim-modal"
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title className="walaa-medium-500">
          {langData.product.claim_registration_details}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column">
          <div>
            {Array.isArray(langData.product.claim_register_popup_content) &&
              langData.product.claim_register_popup_content.map((item) => {
                return (
                  <div className="me-auto popover-row-spacing mb-3" key={item}>
                    {item}
                  </div>
                );
              })}
          </div>
          <div className="mb-3">
            {langData.product.claim_register_popup_list_content_one_title}
          </div>
          <div className="detail-points">
            <ul className="custom-bullet-list p-0 m-0 mb-0">
              {Array.isArray(
                langData.product
                  .claim_register_popup_list_content_one_list_items
              ) &&
                langData.product.claim_register_popup_list_content_one_list_items.map((item) => (
                  <li
                    key={item}
                    className="d-flex align-items-center border-0 walaa-regular-400"
                  >
                    <span className="popover-row-spacing ms-2 me-auto">{item}</span>
                  </li>
                ))}
            </ul>
          </div>
          <div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <ThemeButton
          classes="register-call2action walaa-medium-500"
          isDisabled={false}
          title={langData.consumer?.ok}
          onClickhandler={handleClose}
        />
      </Modal.Footer>
    </Modal>
  );
};

export default RegisterClaimModalDialog;
