import { useContext, useState } from "react";
import { ListGroup } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { DataContext } from "../../DataContext";

function RegisterModalDialog() {
  const [show, setShow] = useState(true);
  const handleClose = () => setShow(false);

  //cms content
  const Data = useContext(DataContext);
  return (
    <div>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        className="register-new-claim-modal"
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
                  dangerouslySetInnerHTML={{ __html: Data?.popup_subtitle_two }}
                />
              </div>
              <div>
                <ListGroup as="ol" numbered>
                  {Data?.popup_body_content_two?.map((item, key) => {
                    return (
                      <ListGroup.Item
                        key={key}
                        as="li"
                        className="d-flex justify-content-between align-items-start p-0 border-0 registration-det-body-sub-body walaa-regular-400"
                      >
                        <div className="ms-2 me-auto popover-row-spacing">
                          {item?.value}&nbsp;&nbsp;
                          {Data?.popup_body_content_two?.length - 1 === key && (
                            <a className="theme-link"
                              href="https://motorclaims.walaa.com/"
                              target="_blank"
                            >
                              Walaa.com
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
          <Button
            className="register-call2action walaa-medium-500"
            onClick={handleClose}
          >
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default RegisterModalDialog;
