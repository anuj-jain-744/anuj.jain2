import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import ListGroup from "react-bootstrap/ListGroup";
import ThemeButton from "components/ThemeComponents/ThemeButton";

interface PropTypes {
  showRegModal?: boolean;
  setShowRegModal?: (show: boolean) => void;
  langData: Record<string, string>;
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
          {langData?.claim_registration_details}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column registration-det-body">
          <div className="fw-medium">
            <span
              dangerouslySetInnerHTML={{ __html: langData.popup_subtitle_one }}
            />
          </div>
          <div>
            <ListGroup as="ol" numbered>
              {langData.popup_body_content_one?.map((item, key) => {
                return (
                  <ListGroup.Item
                    key={key}
                    as="li"
                    className="d-flex justify-content-between align-items-start p-0 border-0"
                  >
                    <div className="ms-2 me-auto popover-row-spacing">
                      {item?.value}
                    </div>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </div>
          <div>
            <div className="walaa-medium-500 registration-det-body-sub-title">
              <span
                dangerouslySetInnerHTML={{
                  __html: langData.popup_subtitle_two,
                }}
              />
            </div>
            <div>
              <ListGroup as="ol" numbered>
                {langData.popup_body_content_two?.map((item, key) => {
                  return (
                    <ListGroup.Item
                      key={key}
                      as="li"
                      className="d-flex justify-content-between align-items-start p-0 border-0 registration-det-body-sub-body walaa-regular-400"
                    >
                      <div className="ms-2 me-auto popover-row-spacing">
                        {item?.value}&nbsp;&nbsp;
                        {langData.popup_body_content_two?.length - 1 ===
                          key && (
                          <a
                            href={langData.https_motorclaims_walaa_co}
                            target="_blank"
                          >
                            {langData.walaa_com}
                          </a>
                        )}
                      </div>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <ThemeButton
          classes="register-call2action walaa-medium-500"
          isDisabled={false}
          title="Ok"
          onClickhandler={handleClose}
        />
      </Modal.Footer>
    </Modal>
  );
};

export default RegisterClaimModalDialog;
