import React, { useContext, useState } from "react";
import { DataContext } from "../../../../DataContext";
import TypographyAndIcon from "../../../components/TypographyAndIcon";
import ThemeTextbox from "../../../components/ThemeTextbox";
import ThemeTextarea from "../../../components/ThemeTextarea";
import CompreTermsAndCon from "./CompreTermsAndCon";

interface IContactDetData {
  isMobilenum: any;
  isEmailId: string;
  isIAgree: boolean;
}

type typeCompensate = {
  validationData: any;
  contactDetData: IContactDetData;
  changeHandler: (name: string, isContactMand: boolean, value?: string) => void;
  mobilenumData: string | undefined;
  emailData: string | undefined;
};

function CompreContactDet({
  validationData,
  contactDetData,
  changeHandler,
  emailData,
  mobilenumData,
}: typeCompensate) {
  const [compensateError, setCompensateError] = useState({
    mobilenum: "",
    emailId: "",
  });

  //change handler return accept fn
  const updatedValue = (event: React.FormEvent<HTMLDivElement>) => {
    const { defaultValue, checked, name, value } =
      event.target as HTMLInputElement;

    if (name === "mobilenum" || name === "emailId") {
      if (name === "mobilenum") {
        // validation for mobile number
        const saudiMobileRegex = /^05\d{8}$/;
        //const saudiMobileRegex = /^((?:[+?0?0?966]+)(?:\s?\d{2})(?:\s?\d{7}))$/;
        if (
          value === "" ||
          (saudiMobileRegex.test(value) && value.length === 10)
        ) {
          setCompensateError({ ...compensateError, mobilenum: "" });
          changeHandler("mobilenum", true, value);
        } else {
          setCompensateError({
            ...compensateError,
            mobilenum: "Invlaid Mobile Number",
          });
          changeHandler("mobilenum", false);
        }
      } else {
        // validation for email id
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // setCompensateData({ ...compensateData, isEmailId: value });
        changeHandler("emailId", true, value);
        if (emailRegex.test(value) || value === "") {
          setCompensateError({ ...compensateError, emailId: "" });
        } else {
          setCompensateError({
            ...compensateError,
            emailId: "Invalid Email ID",
          });
        }
      }
    } else {
      // setCompensateData({ ...compensateData, isIAgree: checked });
      changeHandler("IAgree", checked);
    }
  };

  //cms content
  const Data = useContext(DataContext);

  return (
    <React.Fragment>
      <div className="row compre-compensation">
        <div className="col register-compensate">
          <div className="row register-row-spacing-top">
            <div className="col register-compensate-title walaa-medium-500">
              {Data?.contact_details}
            </div>
          </div>
          <div className="row register-row-spacing-top">
            <div className="col-md-6">
              <div className="d-flex flex-column">
                <div>
                  <TypographyAndIcon
                    text={Data?.mobile_number}
                    // required={true}
                  />
                </div>
                <div>
                  <ThemeTextbox
                    name="mobilenum"
                    placeholder={Data?.placeholder_enter_mobile}
                    type="tel"
                    maxLengthIs={10}
                    value={mobilenumData}
                    onChangehandler={updatedValue}
                    errorValue={compensateError.mobilenum}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex flex-column">
                <div>
                  <TypographyAndIcon
                    text={Data?.email}
                    // required={true}
                  />
                </div>
                <div>
                  <ThemeTextbox
                    name="emailId"
                    placeholder={Data?.placeholder_enter_email_id}
                    type="text"
                    value={emailData}
                    onChangehandler={updatedValue}
                    errorValue={compensateError.emailId}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="d-flex flex-column">
                <div>{Data?.additional_remarks}</div>
                <div className="register-contact-estimate-value walaa-medium-500">
                  <ThemeTextarea
                    placeholder={Data?.additional_remarks + "..."}
                    classes="themetextarea-cust"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row pt-2">
            <div className="col">
              <CompreTermsAndCon
                isChecked={contactDetData?.isIAgree}
                onChangehandler={updatedValue}
              />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default CompreContactDet;
