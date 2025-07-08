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
  readonly cmsConfigData ?: {[key:string]: string}
}

const ModalPopUp = ({
  show,
  errorMsg,
  popupUsedFor,
  handleClose,
  handleSubmitPopup,
  cmsConfigData
}: ModalPopUpProps) => {

  const getPrimaryButtonTitle = (popupUse: string) => {
    const titles = {
      [familtyFlowConstants.POPUP_USED.LAST_FAMILY_MEMBER_NOT_SELF_DELETE]: familtyFlowConstants.POPUP_USED.BUTTONS.CONFIRM,
      [familtyFlowConstants.POPUP_USED.POPUP_FOR]: familtyFlowConstants.POPUP_USED.BUTTONS.YES,
      [familtyFlowConstants.POPUP_USED.SENIOR_CITIZEN_AGE_VALIDATION]: familtyFlowConstants.POPUP_USED.BUTTONS.YES,
    };
  
    return titles[popupUse] || familtyFlowConstants.POPUP_USED.BUTTONS.OK;
  };

  const getJourneyHeader = (popupUse: string) => {
    const headers = {
      "": familtyFlowConstants.POPUP_USED.ERROR,
      [familtyFlowConstants.POPUP_USED.SENIOR_CITIZEN_AGE_VALIDATION]: cmsConfigData?.senior_citizen_age_validation_header,
    };
  
    return headers[popupUse] || familtyFlowConstants.POPUP_USED.DELETE_TRAVELLER;
  };

  return (
    <Modal className="resume-jorney-parent-container" show={show} centered>
      <div className="resume-journey-container">
        <div className="journey walaa-medium-500">
        {getJourneyHeader(popupUsedFor)}
        </div>
        <div className="journey-content">{errorMsg}</div>
        <hr className="horizontal-line" />

        <div className="bottom-btns">
        {popupUsedFor === familtyFlowConstants.POPUP_USED.POPUP_FOR || popupUsedFor ===familtyFlowConstants.POPUP_USED.LAST_FAMILY_MEMBER_NOT_SELF_DELETE || popupUsedFor ===familtyFlowConstants.POPUP_USED.SENIOR_CITIZEN_AGE_VALIDATION ? (
            <ThemeButton
              isDisabled={false}
              title={familtyFlowConstants.POPUP_USED.BUTTONS.NO}
              classes={"continue-btn walaa-medium-500"}
              variant="outline"
              onClickhandler={handleClose}
            />
          ):null}
          <ThemeButton
            isDisabled={false}
            title={getPrimaryButtonTitle(popupUsedFor)}
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
