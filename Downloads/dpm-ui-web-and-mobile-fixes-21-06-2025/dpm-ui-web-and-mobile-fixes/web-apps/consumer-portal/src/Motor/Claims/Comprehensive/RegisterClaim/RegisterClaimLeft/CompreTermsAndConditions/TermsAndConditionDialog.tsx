import Modal from "react-bootstrap/Modal";
import MockData from "../../../../../Endorsement/TermsAndConditionModel/mock.json";
import ThemeButton from "components/ThemeComponents/ThemeButton";

interface ITermsAndConditionDialog {
  showDialog: boolean;
  clickHandler: () => void;
  clickHandlerAccept: () => void;
}

function TermsAndConditionDialog({
  showDialog,
  clickHandler,
  clickHandlerAccept
}: Readonly<ITermsAndConditionDialog>) {
  return (
    <div>
      <Modal
        show={showDialog}
        onHide={clickHandler}
        backdrop="static"
        keyboard={false}
        className="register-new-claim-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{MockData["dialog-heading"]}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{MockData["content-one"]}</p>
          <p>{MockData["content-two"]}</p>
        </Modal.Body>
        <Modal.Footer>
          <ThemeButton
            isDisabled={false}
            variant="primary"
            onClickhandler={clickHandler}
            title={MockData["close"]}
            classes="register-call2action walaa-medium-500"
          />
          <ThemeButton
            isDisabled={false}
            variant="primary"
            onClickhandler={clickHandlerAccept}
            title={MockData["accept"]}
            classes="register-call2action walaa-medium-500"
          />
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default TermsAndConditionDialog;
