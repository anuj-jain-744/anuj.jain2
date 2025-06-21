import React, { useContext, useEffect, useState } from "react";
import ClaimInformation from "./ClaimInformation";
import { DataContext } from "../../../DataContext";
import { callAPI, TOAST_AUTOCLOSE_TIMER } from "@dpm/shared-module";
import CompensationType from "./CompensationType";
import Estimation from "./Estimation";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Form, InputGroup } from "react-bootstrap";
import UploadFiles from "./UploadFiles";
import ThemeTextbox from "../../components/ThemeTextbox";
import TypographyAndIcon from "../../components/TypographyAndIcon";
import ThemeTextarea from "../../components/ThemeTextarea";
import TermsAndCon from "./TermsAndCon";
import { Bounce, toast } from "react-toastify";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

const { VITE_BACKEND_BASE_URL } = import.meta.env;

interface ICompensationObjFactory {
  isBank: boolean;
  isDamage: boolean;
  isLiability: boolean;
  isIBan: string;
  isMobilenum: string;
  isEmailId: string;
  isIAgree: boolean;
}

type typeCompensate = {
  validationData: any;
  claimCheckData: any;
  SuccessData: any;
  resetHeader: any;
  changeHandler: (name: string, isIBAN: boolean, value?: string) => void;
  compensationType: string;
  isCompensatePage: boolean;
  isContactPage: boolean;
  isSuccessClaim: boolean;
  changeHandlerFiles: (data: any) => void;
  mobilenumData: string | undefined;
  emailData: string | undefined;
};

const Compensation = ({
  validationData,
  changeHandler,
  compensationType,
  isCompensatePage,
  isContactPage,
  isSuccessClaim,
  SuccessData,
  changeHandlerFiles,
  emailData,
  mobilenumData,
}: typeCompensate) => {
  // for contactdetails info enabler
  // const [isContact, setContactEnabler] = useState(isContactPage);

  const [compensateType, setCompensatetype] =
    useState<string>(compensationType);
  const [isSubmit, setIsSubmit] = useState(false);
  const [claimResponse, setClaimResponse] = useState();
  // IBAN verification icon state
  const [showIcon, setIconhandler] = useState<boolean>(false);

  const [compensateData, setCompensateData] = useState<ICompensationObjFactory>(
    {
      isBank: true,
      isDamage: false,
      isLiability: false,
      isIBan: "",
      isMobilenum: validationData?.mobile ? validationData?.mobile : "",
      isEmailId: "",
      isIAgree: false,
    }
  );

  const [compensateError, setCompensateError] = useState({
    sequenceNo: "",
    dob: "",
    estimatedAmount: "",
    liability: "",
    iBan: "",
    mobilenum: "",
    emailId: "",
  });

  //change handler return accept fn
  const updatedValue = (event: React.FormEvent<HTMLDivElement>) => {
    const { defaultValue, checked, name, value } =
      event.target as HTMLInputElement;
    if (name === "IBan" || name === "mobilenum" || name === "emailId") {
      if (name === "IBan") {
        // validation for IBan value
        setCompensateData({ ...compensateData, isIBan: value });
        setIconhandler(false);
        if (/^[SA0-9]{0,2}\d{0,22}$/.test(value) || value === "") {
          setCompensateError({ ...compensateError, iBan: "" });
          if (value.length === 24) {
            validateIBAN(value);
          }
        } else {
          setCompensateError({
            ...compensateError,
            iBan: "Invalid IBAN input",
          });
          changeHandler("iBAN", false);
        }
      } else if (name === "mobilenum") {
        // validation for mobile number
        setCompensateData({ ...compensateData, isMobilenum: value });
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
        setCompensateData({ ...compensateData, isEmailId: value });
        changeHandler("emailId", true, value);
        if (emailRegex.test(value) || value === "") {
          setCompensateError({ ...compensateError, emailId: "" });
        } else {
          setCompensateError({
            ...compensateError,
            emailId: "Invlaid Email ID",
          });
        }
      }
    } else {
      if (defaultValue === "Damage Repairs") {
        setCompensateData({ ...compensateData, isBank: false });
        setCompensateData({ ...compensateData, isDamage: checked });
        setCompensatetype("Damage Repairs");
        changeHandler("Repair", true);
      } else if (defaultValue === "Bank Transfer") {
        setCompensateData({ ...compensateData, isDamage: false });
        setCompensateData({ ...compensateData, isBank: checked });
        setCompensatetype("Bank Transfer");
        changeHandler("Transfer", true);
      } else if (defaultValue === "Yes") {
        setCompensateData({ ...compensateData, isLiability: checked });
      } else {
        setCompensateData({ ...compensateData, isIAgree: checked });
        changeHandler("IAgree", checked);
      }
    }
  };

  //click handler return accept fn
  const clickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { title } = event?.target as HTMLInputElement;
    if (title === "Submit") {
      fetchData();
    }
  };
  //cms content
  const Data = useContext(DataContext);
  const fetchData = async () => {
    const response = await callAPI(
      "post",
      VITE_BACKEND_BASE_URL + `/RegisterClaim`,
      {
        otpReferenceNo: validationData.otpReferenceNo,
        sourceType: "1",
        claimRequestType: "TPL", //validationData.ClaimRequestType as TP but here TPL
        caseReportId: validationData.CaseReportId,
        sequenceNo: validationData.sequenceNo,
        ownerId: validationData.OwnerId,
        estimateValue: validationData.estimatedAmount,
        vehicleOwnerDOB: validationData.dob,
        mobileNo: validationData.mobile,
        compensationType: "Transfering the Compensation",
        ibanNo: compensateData?.isIBan,
        bankName: "1",
      }
    );
    if (response.message == "Success") {
      setClaimResponse(response?.data[0]);
      setIsSubmit(true);
      // setting header to off
      // resetHeader("Success");
    } else {
    }
  };

  const validateIBAN = async (iBAN: string) => {
    try {
      const response = await callAPI(
        "post",
        VITE_BACKEND_BASE_URL + `/Motor/Claim/V1/ValidateIban`,
        {
          iban:
            compensateData?.isIBan?.length > 0 ? compensateData?.isIBan : iBAN,
          idType: "NATIONAL_ID",
          idValue: validationData?.OwnerId
            ? validationData?.OwnerId
            : "1106972886",
          channel: "MotorClaims",
          userId: "1054651",
        }
      );
      if (
        response?.message.toUpperCase() == "SUCCESS" &&
        response.data.result == "MATCH"
      ) {
        setIconhandler(true);
        changeHandler("iBAN", true);
      } else if (
        response?.message == "ERROR" ||
        response?.message == "INTERNAL_SERVER_ERROR"
      ) {
        changeHandler("iBAN", false);

        toast.error(response?.error?.message, {
          icon: <WarningAmberOutlinedIcon />,
          className: "error-cust",
          position: "top-right",
          autoClose: TOAST_AUTOCLOSE_TIMER || false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      } else {
        changeHandler("iBAN", false);
      }
    } catch (error) {
      changeHandler("iBAN", false);
    } finally {
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // IBAN blur handler
  const Blurhandler = (e: React.FocusEvent<HTMLInputElement>) => {};

  //estimation - compo change handler fn
  const Onchangehandler = (event: React.FormEvent<HTMLDivElement>) => {
    const { value } = event?.target as HTMLInputElement;
    value === "1"
      ? setCompensateData({ ...compensateData, isLiability: false })
      : setCompensateData({ ...compensateData, isLiability: true });
  };

  return (
    <React.Fragment>
      {!isSuccessClaim && (
        <div className="row">
          <div className="col">
            <ClaimInformation validationData={validationData} />
          </div>
        </div>
      )}

      {isContactPage ? (
        <React.Fragment>
          <div className="row">
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
                        // errorValue={compensateError.emailId}
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
                  <TermsAndCon
                    languageData={Data}
                    isChecked={compensateData?.isIAgree}
                    onChangehandler={updatedValue}
                  />
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      ) : isSuccessClaim ? (
        // <SuccessClaim SuccessData={SuccessData} />
        <></>
      ) : (
        <React.Fragment>
          <div className="row">
            <div className="col register-compensate">
              <CompensationType onChangehandler={updatedValue} />
            </div>
          </div>
          <hr className="register-row-spacing-cust-top register-row-spacing-cust-bottom" />
          <div className="row">
            <div className="col">
              <Estimation
                changeHandler={Onchangehandler}
                validationData={validationData}
              />
            </div>
          </div>
          <div className="row register-compensate">
            <div className="col-xs-12 col-md-5 register-row-spacing-top">
              <div className="register-compensate-estimate">
                <div className="register-compensate-estimate-small-value walaa-regular-400">
                  <div>{Data?.iban_no}</div>
                  <div
                    className="walaa-regular-400 title pt-2"
                    onChange={(e) => updatedValue(e)}
                  >
                    <InputGroup>
                      <Form.Control
                        placeholder={Data?.placeholder_enter_iban_num}
                        aria-label="iban"
                        aria-describedby="basic-addon1"
                        className="register-input border-end-0"
                        name="IBan"
                      />
                      <InputGroup.Text
                        id="basic-addon1"
                        className="register-input border-start-0"
                      >
                        {showIcon && (
                          <span className="m-2">
                            <CheckCircleIcon sx={{ color: "green" }} />
                          </span>
                        )}
                      </InputGroup.Text>
                    </InputGroup>
                    <Form.Text className="validationText">
                      {compensateError.iBan}
                    </Form.Text>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {compensateData?.isLiability && (
            <React.Fragment>
              <hr className="register-row-spacing-cust-top register-row-spacing-cust-bottom" />
              <div className="row">
                <div className="col">
                  <UploadFiles changeHandler={changeHandlerFiles} />
                </div>
              </div>
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default Compensation;
