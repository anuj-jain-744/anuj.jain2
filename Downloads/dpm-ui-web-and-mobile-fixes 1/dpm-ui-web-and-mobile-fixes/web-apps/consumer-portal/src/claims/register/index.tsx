import React, { Suspense, useContext, useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

const Textbox = React.lazy(() => import("../components/ThemeTextbox"));
const ThemeButton = React.lazy(() => import("../components/ThemeButton"));
const TypographyAndIcon = React.lazy(
  () => import("../components/TypographyAndIcon")
);
const OTPComponent = React.lazy(() => import("../../components/OTPComponent"));
const Compensation = React.lazy(() => import("./compensation"));
import ClaimSeqDate from "../data/ClaimSeqDate.json";

import SeqNoDate from "../register/SeqNoDate";
import { callAPI } from "@dpm/shared-module";
import { DataContext } from "../../DataContext";
import { Card } from "react-bootstrap";
import Header from "../layout/Header";
import BodyTP from "../layout/BodyTP";
import BodyComp from "../layout/BodyComp";
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { comprehensiveOD } from "constant";

const { VITE_BACKEND_BASE_URL } = import.meta.env;

type ItooltipData = {
  title: string;
  classes: string;
};

type IiconType = {
  displayicon: boolean;
  classes: string;
  istooltip: boolean;
  tooltipdata?: ItooltipData[];
};
interface IRegisterType {
  resetHeader: (e: String) => void;
  data: {
    title: string;
    iseditable: boolean;
    compotype: string;
    classes: string;
    key?: string;
    icon?: IiconType[];
    isdisabled?: boolean;
    type?: string;
    placeholder?: string;
  }[];
  propData: {
    type: string;
    module: string;
  };
  show: boolean;
  CardclassName: string;
  headersrc: string;
  headeralt: string;
  headerclassName: string;
  headertitleclassName: string;
  headertitle: string;
}
function Register({
  propData,
  data,
  resetHeader,
  show,
  CardclassName,
  headersrc,
  headeralt,
  headerclassName,
  headertitleclassName,
  headertitle,
}: IRegisterType) {
  const [caseReferData, setRefData] = useState<CaseReferenceNum>();
  const [ownerData, setOwnData] = useState<OwnerId>();
  const ClaimRequestType = propData?.type;
  const [claimsInfo, setClaimsInfo] = useState({
    refNo: "",
    ownerId: "",
    SourceType: 0
  });

  // Error text tracking for textbox data
  const [caseReferError, setRefError] = useState("");
  const [ownerError, setOwnError] = useState("");
  // enable/disable action btn state
  const [updateActionEnabler, setAction] = useState<boolean>(true);

  // story board decider to show
  const [onContinue, setContinue] = useState<boolean>(false);
  const [onMissingData, setMissingData] = useState<boolean>(false);
  const [validationData, setValidationData] = useState<any>();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [otpValue, setOtpValue] = useState<string>('');

  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("");

  const numberOfIncorrectAttempts = 3;
  const [incorrectAttempt, setIncorrectAttempt] = useState(numberOfIncorrectAttempts);

  // "numberOfResendOTP": 2,
  const [resendOTPCount, setresendOTPCount] = useState(2);

  // "timerForResend": 10min,
  const [timerResend, setTimerResend] = useState(600);

  const [claimCheckData, setClaimCheckData] = useState<any>();

  useEffect(() => {
    if (otpValue.length === 6 && incorrectAttempt <= 0) {
      setContinue(false);
    } else {
      if (otpValue.length === 6 && incorrectAttempt > 0) {
        fetchOTPData(otpValue);
      }
    }

  }, [otpValue]);

  //Fetch OTP Data
  const fetchOTPData = async (digits: string) => {
    // setContinue(true);
    setIncorrectAttempt(incorrectAttempt - 1);
    try {
      const response = await callAPI("post", VITE_BACKEND_BASE_URL + `/Motor/Claim/V1/ValidateOtp`,
        {
          referenceNo: claimCheckData?.referenceNo, otp: digits
        });
      if (response.message == "SUCCESS") {
        if (response?.data?.mobile.length == 12){
          const regex = /^966/;
          const phoneNumber = response.data.mobile;
          if (regex.test(phoneNumber)) {
            response.data.mobile = phoneNumber.replace(regex, "0");
          }
        }
        setContinue(true);
        setValidationData(response);
      } else {
        setMessage("Entered OTP is not valid");
        setShowAlert(true);
      }
    } catch (error) {
      console.error("An error occurred while fetching the data", error);
    } finally {
    }
  };


  //factory fn for component decider
  function ComponentFactory(item, key) {
    //change handler return accept fn
    const updatedValue = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      if (name === "Case_Reference_Number") {
        setRefData({
          name: "Case_Reference_Number",
          value: value,
        });
        // Validate input: up to 30 alphanumeric characters and first two characters must be alphabets
        if (/^[A-Za-z0-9]{0,2}[0-9]{0,28}$/.test(value) || value === '') {
          setRefError('');
        } else {
          setRefError(Data?.invalid_dynamic_input.replace("<DYNAMIC>", Data?.case_reference)); //'Invalid input for Case Reference Number');
        }
        if (value != "" && (/^\d{2}/.test(value) && value.length < 10) ||
          (value.length < 9)) {
          setRefError(Data?.invalid_dynamic_input.replace("<DYNAMIC>", Data?.case_reference)); //setRefError('Invalid input for Case Reference Number');
        }
      } else if (name === "Owner_ID") {
        setOwnData({
          name: "Owner_ID",
          value: value,
        });
        // Validate input: up to 10 digits and starts with 1, 2, or 7
        if ((/^[127]\d{0,9}$/.test(value) && value.length == 10) || value === '') {
          setOwnError('');
        } else {
          setOwnError(Data?.invalid_dynamic_input.replace("<DYNAMIC>", Data?.owner_id));//setOwnError('Invalid input for Owner ID');
        }
      }
    };

    //click handler return accept fn
    const clickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
      const { value } = event?.target as HTMLInputElement;
      if (value === "continue") {
        setShowAlert(false);
        fetchData();
      }
    };

    const fetchData = async () => {
      let SourceType = 0;
      //Najm case fist two character if it is alhphabet then set source type 1
      //otherwise source type is 2
      if (/^\d{2}/.test(caseReferData.value)) {
        SourceType = 1;
      } else {
        SourceType = 2;
      }
      setClaimsInfo({
        refNo: caseReferData.value,
        ownerId: ownerData.value,
        SourceType: SourceType
      });
      try {
        const response = await callAPI("post", VITE_BACKEND_BASE_URL + `/Motor/Claim/V1/InitiateClaim`,
          {
            "caseReportId": caseReferData.value,
            "claimRequestType": ClaimRequestType,
            "ownerId": ownerData.value,
            "sourceType": SourceType
          }
        );

        // Sample response v1
        // {
        //   "statusCode": 200,
        //     "message": "SUCCESS",
        //       "data": {
        //     "referenceNo": "1726235540252"
        //   },
        //   "error": null
        // }

        // Sample response v2
        // {
        //   "code": 1,
        //   "message": "SUCCESS",
        //   "data": {
        //       "referenceNo": "1726729349571",
        //       "mobileNo": null,
        //       "status": null,
        //       "subClaimType": null,
        //       "validationResult": null
        //   },
        //   "error": null
        // }

        if (response.message == "SUCCESS" || response.code == 1) {
          setClaimCheckData(response?.data);
          // if (ClaimRequestType == "OD") {
          //   //Comp. flow - bypass OTP part
          //   setContinue(true);
          // } else {
            setShowModal(true); // Show the modal for OTP
          // }
        } else if (response.message == "ERROR" || response.code == 0) {
          if (response?.error?.errorCode == "DATA_NOT_AVAILABLE") {
            setMissingData(true);
          } else {
            setMessage(response?.error?.errorMessage);
            setShowAlert(true);
          }
        }
      } catch (error) {
        console.error("An error occurred while fetching the data", error);
      } finally {

      }

    };

    const CompObj = {
      textbox: (
        <Textbox
          type={item?.type}
          title={(item?.key === "Case_Reference_Number") ? Data?.case_reference : Data?.owner_id}
          name={item?.key}
          value={(item?.key === "Case_Reference_Number") ? caseReferData?.value : ownerData?.value}
          placeholder={Data?.enter + ((item?.key === "Case_Reference_Number") ? Data?.case_reference : Data?.owner_id)}
          onChangehandler={updatedValue}
          errorValue={(item?.key === "Case_Reference_Number") ? caseReferError : ownerError}
        />
      ),
      button: (
        <ThemeButton
          isDisabled={updateActionEnabler}
          title={Data?.continue}
          value="continue"
          classes={item?.classes}
          onClickhandler={clickHandler}
        />
      ),
    };
    return (
      <React.Fragment>
        <OTPComponent
          showModal={showModal}
          setShowModal={setShowModal}
          type="mail"
          otpValue={otpValue}
          setOtpValue={setOtpValue}
          setIncorrectAttempt={setIncorrectAttempt}
          numberOfIncorrectAttempts={numberOfIncorrectAttempts}
          resendOTPCount={resendOTPCount}
          timerResend={timerResend}
          languageData={languageOTPData}
        />

        {item?.iseditable ? (
          <div className="col-md">
            <div className="p-1">
              <div className={item?.classes}>
                <TypographyAndIcon
                  text={key === 0 ? Data?.case_reference : Data?.owner_id}
                  isIcon={item?.icon && item?.icon[0]?.displayicon}
                  iconclasses={item?.icon && item?.icon[0]?.classes}
                  tooltip={item?.icon && item?.icon[0]?.istooltip}
                  tooltipdataheader={
                    item?.icon && item?.icon[0]?.tooltipdata[0]?.title
                  }
                  tooltipclasses={
                    item?.icon && item?.icon[0]?.tooltipdata[0]?.classes
                  }
                  required={true}
                />
              </div>
              <div>{CompObj[item?.compotype]}</div>
            </div>
          </div>
        ) : (
          <div className="col-md d-flex align-items-center">
            <div className="pt-4">
              <div>{CompObj[item?.compotype]}</div>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }

  useEffect(() => {
    //Case Ref No. and ownerID on validate enable/disable continue button
    ownerData?.value?.length && caseReferData?.value?.length && ownerError == "" && caseReferError == ""
      ? setAction(false)
      : setAction(true);
  }, [caseReferData, ownerData]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  //cms content
  const Data = useContext(DataContext);
  const languageOTPData = {
    otp_info_message: Data?.otp_info_message,
    your_otp_will_expire: Data?.your_otp_will_expire,
    confirm_otp: Data?.confirm_otp,
    resend_otp: Data?.resend_otp,
    enter_otp_code: Data?.enter_otp_code
  };

  // back btn route back to main page handler
  const clickhandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    setContinue(false);
    resetHeader('null');
  };

  // reset header handler
  const resetHeaderHandler = (val: String) => {
    resetHeader(val);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {onMissingData ? (
        <div className="row align-items-center register-refer-main">
        <SeqNoDate
          propData={propData}
          data={ClaimSeqDate?.data}
          claimsInfo={claimsInfo}
          resetHeader={resetHeaderHandler}
        />
      </div>
      ) : onContinue ? (
        ClaimRequestType !== comprehensiveOD ? (
          <BodyTP
            claimCheckData={claimCheckData}
            validationData={validationData?.data}
            claimsInfo={claimsInfo}
            resetHeader={resetHeaderHandler}
          />
        ) : (
          <BodyComp 
          claimCheckData={claimCheckData}
          validationData={validationData?.data}
          claimsInfo={claimsInfo}
          clickhandler={clickhandler}
        />
        )
      ) : (
        <React.Fragment>
          {/* card */}
          <Card className={CardclassName}>
            <Card.Body>
              {/* row 1 */}
              {show && (
                <Header
                  src={headersrc}
                  alt={headeralt}
                  className={headerclassName}
                  titleclassName={headertitleclassName}
                  title={headertitle}
                />
              )}
              {/* row 1 end */}

              <div className="row align-items-center register-refer-main">
                {(showAlert) &&
                  <div className="claimNotify">
                    <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
                      <div className="d-flex justify-content-between">
                        <div>
                          <WarningAmberOutlinedIcon />
                          <p className="walaa-regular-400">{message}</p>
                        </div>
                      </div>
                    </Alert>
                  </div>
                }

                {data?.map((item, key) => {
                  return (
                    <React.Fragment key={key}>
                      {ComponentFactory(item, key)}
                    </React.Fragment>
                  );
                })}
              </div>
            </Card.Body>
          </Card>
        </React.Fragment>
      )}
    </Suspense>
  );
}

export default Register;
