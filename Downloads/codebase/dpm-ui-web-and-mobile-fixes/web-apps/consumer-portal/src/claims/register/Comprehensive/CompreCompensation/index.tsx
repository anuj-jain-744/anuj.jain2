import React, { useContext, useEffect, useState } from "react";
import CompreClaimInformation from "./CompreClaimInformation";
import { callAPI } from "@dpm/shared-module";
import CompreEstimation from "./CompreEstimation";
import { DataContext } from "../../../../DataContext";

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
  claimsInfo: any;
  changeHandler: (name: string, isChecked: boolean) => void;
};

const CompreCompensation = ({
  validationData,
  claimCheckData,
  claimsInfo,
  changeHandler,
}: typeCompensate) => {
  // for contactdetails info enabler
  const [isContact, setContactEnabler] = useState(false);

  const [compensateType, setCompensatetype] = useState<null | string>(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [claimResponse, setClaimResponse] = useState();
  // IBAN verification icon state
  const [showIcon, setIconhandler] = useState<boolean>(true);

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
            validateIBAN();
          }
        } else {
          setCompensateError({
            ...compensateError,
            iBan: "Invalid IBAN input",
          });
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
        } else {
          setCompensateError({
            ...compensateError,
            mobilenum: "Invlaid Mobile Number",
          });
        }
      } else {
        // validation for email id
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setCompensateData({ ...compensateData, isEmailId: value });
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
      } else if (defaultValue === "Bank Transfer") {
        setCompensateData({ ...compensateData, isDamage: false });
        setCompensateData({ ...compensateData, isBank: checked });
        setCompensatetype("Bank Transfer");
      } else if (defaultValue === "Yes") {
        setCompensateData({ ...compensateData, isLiability: checked });
      } else {
        setCompensateData({ ...compensateData, isIAgree: checked });
      }
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

  const validateIBAN = async () => {
    const response = await callAPI(
      "post",
      VITE_BACKEND_BASE_URL + `/ValidateIBAN`,
      {
        iban: compensateData?.isIBan,
        idType: "NATIONAL_ID",
        idValue: validationData?.OwnerId,
        channel: "MotorClaims",
        userId: "1054651",
      }
    );
    if (response.message == "Success" && response.data.result == "MATCH") {
      setIconhandler(true);
    } else {
      
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
    value === "1"
      ? changeHandler("isLiability", false)
      : changeHandler("isLiability", true);
  };
  return (
    <React.Fragment>
      <div className="row compre-compensation">
        <div className="col">
          <CompreClaimInformation
            validationData={validationData}
            claimCheckData={claimCheckData}
            claimsInfo={claimsInfo}
          />
        </div>
      </div>
      {/* <SuccessClaim /> */}

      <div className="row">
        <div className="col register-compensate">
          {/* <CompreCompensateType /> */}
        </div>
      </div>
      <hr className="register-row-spacing-cust-top register-row-spacing-cust-bottom" />
      <div className="row compre-compensation">
        <div className="col">
          <CompreEstimation
            changeHandler={Onchangehandler}
            validationData={validationData}
          />
        </div>
      </div>
      {/* <div className="row register-compensate compre-compensation">
            <div className="col-xs-12 col-md-5 register-row-spacing-top">
              <div className="register-compensate-estimate">
                <div className="register-compensate-estimate-small-value walaa-regular-400">
                  <div>IBAN Number</div>
                  <div className="walaa-regular-400 title pt-2">
                    <InputGroup>
                      <Form.Control
                        placeholder={Data?.placeholder_enter_iban_num}
                        aria-label="iban"
                        aria-describedby="basic-addon1"
                        className="register-input border-end-0"
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
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr className="register-row-spacing-cust-top register-row-spacing-cust-bottom" />
          <div className="row">
            <div className="col">
              <CompreUploadFiles />
            </div>
          </div> */}
    </React.Fragment>
  );
};

export default CompreCompensation;
