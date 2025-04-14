import { Modal } from "react-bootstrap";
import "./style.scss";
import ThemeButton from "components/ThemeButton/ThemeButton";
import { familtyFlowConstants } from "components/Travel/constantsTravel";

interface ModalPopUpProps {
  readonly handleClose: () => void;
  readonly show: boolean;
  readonly errorMsg: string;
  readonly popupUsedFor: string;
  readonly handleSubmitPopup?: () => void;
}

const ModalPopUp = ({
  show,
  errorMsg,
  popupUsedFor,
  handleClose,
  handleSubmitPopup,
}: ModalPopUpProps) => {
  return (
    <Modal className="resume-jorney-parent-container" show={show} centered>
      <div className="resume-journey-container">
        <div className="journey walaa-medium-500">
          {popupUsedFor === "" ? familtyFlowConstants.POPUP_USED.ERROR : familtyFlowConstants.POPUP_USED.DELETE_TRAVELLER}
        </div>
        <div className="journey-content">{errorMsg}</div>
        <hr className="horizontal-line" />

        <div className="bottom-btns">
          {" "}
          {popupUsedFor === familtyFlowConstants.POPUP_USED.POPUP_FOR && (
            <ThemeButton
              isDisabled={false}
              title={familtyFlowConstants.POPUP_USED.BUTTONS.NO}
              classes={"continue-btn walaa-medium-500"}
              variant="outline"
              onClickhandler={handleClose}
            />
          )}
          <ThemeButton
            isDisabled={false}
            title={popupUsedFor === familtyFlowConstants.POPUP_USED.POPUP_FOR ? familtyFlowConstants.POPUP_USED.BUTTONS.YES: familtyFlowConstants.POPUP_USED.BUTTONS.OK}
            classes={"new-quotation-btn walaa-medium-500"}
            variant="policyPrimary"
            onClickhandler={handleSubmitPopup}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModalPopUp;
