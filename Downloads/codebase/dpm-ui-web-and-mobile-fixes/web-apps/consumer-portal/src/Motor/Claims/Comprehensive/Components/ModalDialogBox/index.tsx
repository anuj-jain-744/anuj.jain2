import React, { useContext } from "react";
import { ListGroup, Modal } from "react-bootstrap";
import ThemeButton from "components/ThemeComponents/ThemeButton";
import { DataContext } from "../../../../../DataContext";
interface IModalDialogBox {
  isModal: boolean;
  handleClose: () => void;
}
const ModalDialogBox = ({ isModal, handleClose }: IModalDialogBox) => {
  //cms content
  const Data = useContext(DataContext);
  return (
    <Modal
      show={isModal}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      data-testid="register-new-claim-modal"
      className="register-new-claim-modal"
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title className="walaa-medium-500">
          {Data?.claim_registration_details}
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
                    key={"popup_body_content_one_item_" + key}
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
                      key={"popup_body_content_two_item_" + key}
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
          title={Data?.ok}
          onClickhandler={handleClose}
        />
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDialogBox;
