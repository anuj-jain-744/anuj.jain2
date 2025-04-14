import ThemeRadioCheckbox from "components/ThemeComponents/ThemeRadioCheckbox";
import React, { useState } from "react";
import TermsAndConditionDialog from "./TermsAndConditionDialog";
import ThemeButton from "components/ThemeComponents/ThemeButton";
interface ICompreTermsAndConditions {
  changeHandler: (name: string, isIBAN: boolean, value?: string) => void;
  isChecked: boolean;
}

function CompreTermsAndConditions({
  changeHandler,
  isChecked,
}: Readonly<ICompreTermsAndConditions>) {
  const [showDialog, setShowDialog] = useState(false);
  //change handler return accept fn
  const updatedValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    isChecked && changeHandler(event?.target?.name, event?.target?.checked);
  };

  // Modal Dialog box click handler
  const handleShow = () => setShowDialog(true);
  const handleClose = () => setShowDialog(false);

  // terms and condition accepted consent
  const clickHandlerAccept = () => {
    setShowDialog(false);
    changeHandler("IAgree", true);
  };
  return (
    <div className="terms-and-con">
      {showDialog && (
        <TermsAndConditionDialog
          showDialog={showDialog}
          clickHandler={handleClose}
          clickHandlerAccept={clickHandlerAccept}
        />
      )}
      <div className="d-flex align-items-center">
        <div className="terms-and-con-checkbox pe-2">
          <ThemeRadioCheckbox
            type="checkbox"
            defaultChecked={isChecked}
            checked={isChecked}
            label=""
            classes="register-compensate-radio radio-check-cust walaa-regular-400"
            onChangehandler={updatedValue}
            name="IAgree"
          />
        </div>
        <div>I agree to the </div>
        <div>
          <ThemeButton
            classes="register-claim-link-no-button text-decoration-underline p-0 ps-2 link-offset-2"
            variant="link"
            isDisabled={false}
            title="terms and conditions."
            onClickhandler={handleShow}
          />
        </div>
      </div>
    </div>
  );
}

export default CompreTermsAndConditions;
