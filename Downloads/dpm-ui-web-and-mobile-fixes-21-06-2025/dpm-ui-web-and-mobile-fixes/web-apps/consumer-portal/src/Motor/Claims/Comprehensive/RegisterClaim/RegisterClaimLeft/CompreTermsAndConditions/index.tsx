import ThemeRadioCheckbox from "components/ThemeComponents/ThemeRadioCheckbox";
import React, { useState, useMemo, useContext } from "react";
import TermsAndConditionDialog from "./TermsAndConditionDialog";
import ThemeButton from "components/ThemeComponents/ThemeButton";
import { DataContext } from "../../../../../../DataContext";
import { productIDs, comprehensiveOD, comprehensiveTP } from "constant";
interface ICompreTermsAndConditions {
  changeHandler: (name: string, isIBAN: boolean, value?: string) => void;
  isChecked: boolean;
  productName?: string;
  coverageType?:string;
}

function CompreTermsAndConditions({
  changeHandler,
  isChecked,
  productName,
  coverageType,
}: Readonly<ICompreTermsAndConditions>) {
  //cms content
  const Data = useContext(DataContext);
  const [showDialog, setShowDialog] = useState(false);
  //change handler return accept fn
  const updatedValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    isChecked && changeHandler(event?.target?.name, event?.target?.checked);
  };

  const updatedValueForMotor = (event: React.ChangeEvent<HTMLInputElement>) => {
    changeHandler(event?.target?.name, event?.target?.checked);
  };

  // Modal Dialog box click handler
  const handleShow = () => setShowDialog(true);
  const handleClose = () => setShowDialog(false);

  // terms and condition accepted consent
  const clickHandlerAccept = () => {
    setShowDialog(false);
    changeHandler("IAgree", true);
  };

  const termsURL = useMemo(() => {
    let url: string | undefined = "";
     if (productName === productIDs.motor) {
      if (coverageType === comprehensiveOD)
        url = Data?.register_claim_comprehensive;
      else if (coverageType === comprehensiveTP)
        url = Data?.register_claim_third_party;
    }
    return url ?? "";
  }, [Data]);

  const onLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!termsURL) event.preventDefault();
  };

  return (
    <div className="terms-and-con">
      {((productName !== productIDs.motor) && showDialog) && (
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
            onChangehandler={(productName === productIDs.motor) ? updatedValueForMotor : updatedValue}
            name="IAgree"
          />
        </div>
        <div>I agree to the </div>
        {(productName === productIDs.motor) ? (
          <>
            <a
              className="terms-condition-click terms-condition-link"
              href={termsURL}
              target="_blank"
              onClick={onLinkClick}
            >
              {Data?.terms_conditions}
            </a>
            <span className="red-required">{" "}*</span>
          </>
        ) : (
          <div>
            <ThemeButton
              classes="register-claim-link-no-button text-decoration-underline p-0 ps-2 link-offset-2"
              variant="link"
              isDisabled={false}
              title="terms and conditions."
              onClickhandler={handleShow}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default CompreTermsAndConditions;
