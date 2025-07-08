import React, { useContext, useState, useEffect } from "react";
import ThemeButton from "components/ThemeComponents/ThemeButton";
import { DataContext } from "../../../../../DataContext";
import Modal from "react-bootstrap/Modal";
import ListGroup from "react-bootstrap/ListGroup";

interface RegisterClaimModalDialogProps {
  showRegModal?: boolean;
  setShowRegModal?: (show: boolean) => void;
}

const RegisterClaimModalDialog: React.FC<RegisterClaimModalDialogProps> = ({
  showRegModal,
  setShowRegModal,
}) => {
  const [show, setShow] = useState(true);
  const handleClose = () => {
    setShow(false);
    if (showRegModal != undefined) {
      setShowRegModal(false);
    }
  };

  useEffect(() => {
    if (showRegModal != undefined) {
      setShow(showRegModal);
    } else {
      setShow(false);
    }
  }, [showRegModal]);

  //cms content
  const Data = useContext(DataContext);
  return (
    <React.Fragment>
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
            Registration Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column registration-det-body">
            <div className="fw-medium">
              <span
                dangerouslySetInnerHTML={{ __html: Data?.popup_subtitle_one }}
              />
            </div>
            <div>
              <ListGroup as="ol" numbered>
                {Data?.popup_body_content_one?.map((item, key) => {
                  return (
                    <ListGroup.Item
                      key={"popup_body_content_one_" + key}
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
                  dangerouslySetInnerHTML={{ __html: Data?.popup_subtitle_two }}
                />
              </div>
              <div>
                <ListGroup as="ol" numbered>
                  {Data?.popup_body_content_two?.map((item, key) => {
                    return (
                      <ListGroup.Item
                        key={"popup_body_content_two_" + key}
                        as="li"
                        className="d-flex justify-content-between align-items-start p-0 border-0 registration-det-body-sub-body walaa-regular-400"
                      >
                        <div className="ms-2 me-auto popover-row-spacing">
                          {item?.value}&nbsp;&nbsp;
                          {Data?.popup_body_content_two?.length - 1 === key && (
                            <a
                              className="theme-link"
                              href={Data?.https_motorclaims_walaa_co}
                              target="_blank"
                            >
                              {Data?.walaa_com}
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
    </React.Fragment>
  );
};

export default RegisterClaimModalDialog;
