import React, { Suspense, useContext, useEffect, useState } from "react";

const Textbox = React.lazy(() => import("../components/ThemeTextbox"));
const ThemeButton = React.lazy(() => import("../components/ThemeButton"));
const ThemeDatePicker = React.lazy(() => import("../components/ThemeDatePicker"));
const TypographyAndIcon = React.lazy(
  () => import("../components/TypographyAndIcon")
);
const OTPComponent = React.lazy(() => import("../../components/OTPComponent"));
const Compensation = React.lazy(() => import("./compensation"));
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

import { callAPI } from "@dpm/shared-module";
import { DataContext } from "../../DataContext";
import BodyComp from "../layout/BodyComp";
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { Card } from "react-bootstrap";
import Header from "../layout/Header";
import { OTP_TIMER } from "constant";

const { VITE_BACKEND_BASE_URL } = import.meta.env;

type VehicleSeqNum = {
  name: string;
  value: string;
};

type OwnerDOB = {
  name: string;
  value: string;
};

interface IRegisterType {
  resetHeader: (e: String) => void;
  data: {
    title: string;
    iseditable: boolean;
    compotype: string;
    classes: string;
    key?: string;
    isdisabled?: boolean;
    type?: string;
    placeholder?: string;
  }[];
  propData: {
    type: string;
    module: string;
  }
  claimsInfo: {
    refNo: string,
    ownerId: string,
    SourceType: number
  };
}
function SeqNoDate({ propData, data, claimsInfo, resetHeader }: IRegisterType) {
  const [vSeqNo, setVSeqNo] = useState<VehicleSeqNum>();
  const [ownerDOB, setOwnerDOB] = useState<OwnerDOB>({ name: "DOB", value: "" });
  const [calendarType, setCalendarType] = useState<string>("Gregorian"); //Hijri or Gregorian
  const ClaimRequestType = propData?.type;
  const SourceType = claimsInfo?.SourceType;

  // Error text tracking for textbox data
  const [vSeqNoError, setVSeqNoError] = useState("");
  const [ownerDOBError, setOwnerDOBError] = useState("");
  // enable/disable action btn state
  const [updateActionEnabler, setAction] = useState<boolean>(true);

  // story board decider to show
  const [onVerify, setVerify] = useState<boolean>(false);
  const [validationData, setValidationData] = useState<any>();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [otpValue, setOtpValue] = useState<string>('');

  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("");

  const numberOfIncorrectAttempts = 3;
  const [incorrectAttempt, setIncorrectAttempt] = useState(numberOfIncorrectAttempts);

  // "numberOfResendOTP": 2,
  const [resendOTPCount, setresendOTPCount] = useState(2);

  // "timerForResend": 3min,
  const [timerResend, setTimerResend] = useState(OTP_TIMER);

  const [claimCheckData, setClaimCheckData] = useState<any>();

  useEffect(() => {
    if (otpValue.length === 6 && incorrectAttempt <= 0) {
      setVerify(false);
    } else {
      if (otpValue.length === 6 && incorrectAttempt > 0) {
        fetchOTPData(otpValue);
      }
    }
  }, [otpValue]);

  //Fetch OTP Data
  const fetchOTPData = async (digits: string) => {
    try {
      setIncorrectAttempt(incorrectAttempt - 1);
      const response = await callAPI("post", VITE_BACKEND_BASE_URL + `/Motor/Claim/V1/ValidateOtp`,
        {
          referenceNo: claimCheckData?.referenceNo, otp: digits
        });
      if (response.message == "SUCCESS") {
        setVerify(true);
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
      if (name === "Vehicle_Sequence_No") {
        setVSeqNo({
          name: "Vehicle_Sequence_No",
          value: value,
        });
        // Validate input: up to 30 digits
        if (/^[0-9]{0,30}$/.test(value) || value === '') {
          setVSeqNoError('');
        } else {
          //setVSeqNoError('Invalid input for Vehicle Sequence Number');
          setVSeqNoError(Data?.invalid_dynamic_input.replace("<DYNAMIC>", Data?.vehicle_sequence));
        }
        // if (value != "" && (/^\d{2}/.test(value) && value.length < 10) ||
        //   (value.length < 9)) {
        //   setVSeqNoError('Invalid input for Vehicle Sequence Number');
        // }
      }
    };
    const dateHandler = (dateDOB: Date) => {
      if (dateDOB) {
        const day = dateDOB.day.toString().padStart(2, '0');
        const month = dateDOB.month.toString().padStart(2, '0');
        const year = dateDOB.year;

        const dateString = `${day}/${month}/${year}`;
        const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/([0-9]{4})$/;
        if (datePattern.test(dateString)) {
          setOwnerDOB({
            name: "DOB",
            value: dateString,
          });
          setOwnerDOBError("");
        }
      } else {
        setOwnerDOBError("Date is not in correct format: DD/MM/YYYY");
      }
    }

    const CompObj = {
      textbox: (
        <Textbox
          type={item?.type}
          title={(item?.key == "Vehicle_Sequence_No") ? Data?.vehicle_sequence : Date?.dob}
          name={item?.key}
          value={(item?.key == "Vehicle_Sequence_No") ? vSeqNo?.value : ownerDOB?.value}
          placeholder={Data?.enter + ((item?.key == "Vehicle_Sequence_No") ? Data?.vehicle_sequence : Date?.dob)}
          onChangehandler={updatedValue}
          errorValue={(item?.key == "Vehicle_Sequence_No") ? vSeqNoError : ownerDOBError}
        />
      ),
      datepicker: (
        <ThemeDatePicker
          name={item?.key}
          placeholder={item?.placeholder}
          onChangehandler={dateHandler}
          value={ownerDOB?.value}
          format="DD/MM/YYYY"
          calendarType={calendarType}
          errorValue={ownerDOBError}
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
                  text={(item?.key == "Vehicle_Sequence_No") ? Data?.vehicle_sequence : Data?.dob}
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

  //click handler return accept fn
  const clickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { value } = event?.target as HTMLInputElement;
    if (value === "Verify") {
      setShowAlert(false);
      fetchData();
    }
  };

  const fetchData = async () => {
    try {
      const response = await callAPI("post", VITE_BACKEND_BASE_URL + `/Motor/Claim/V1/ValidateClaim&Customer`,
        {
          "caseReportId": claimsInfo.refNo,
          "claimRequestType": ClaimRequestType,
          "ownerId": claimsInfo.ownerId,
          "sequenceNo": vSeqNo?.value,
          "sourceType": SourceType
        }
      );

      if (response?.message == "SUCCESS") {
        setClaimCheckData(response?.data);
        //if (ClaimRequestType == "OD") {
        //Comp. flow - bypass OTP part
        //setVerify(true);
        //} else {
        setShowModal(true); // Show the modal for OTP
        //}
      } else if (response?.message == "ERROR" || response?.message == "INTERNAL_SERVER_ERROR") {
        setMessage(response?.error?.errorMessage);
        setShowAlert(true);
      } else {
        
      }
    } catch (error) {
      console.error("An error occurred while fetching the data", error);
    } finally {

    }
  };

  useEffect(() => {
    //Vehical Seq No. and DOB - on validate enable/disable Verify button
    // if (tempJSON.sequenceNo == "" && tempJSON.vehicleOwnerDOB == "") {
    //   ownerDOB?.value?.length && vSeqNo?.value?.length && ownerDOBError == "" && vSeqNoError == ""
    //     ? setAction(false)
    //     : setAction(true);
    // } else if (tempJSON.sequenceNo != "") {
    //   ownerDOB?.value?.length && ownerDOBError == ""
    //     ? setAction(false)
    //     : setAction(true);
    // } else if (tempJSON.vehicleOwnerDOB != "") {
      (vSeqNo?.value?.length && vSeqNoError == "")
        ? setAction(false)
        : setAction(true);
    //}
  }, [vSeqNo, ownerDOB]);
  
  const [updatedData, setUpdatedData] = useState(Array());
  useEffect(() => {
    //Page entry point setup
    // if (tempJSON.sequenceNo == "" && tempJSON.vehicleOwnerDOB == "") {
    //   setUpdatedData(data);
    // } else if (tempJSON.sequenceNo != "") {
    //   const result = data.filter(function (item) {
    //     return item.key != "Vehicle_Sequence_No";
    //   });
    //   setUpdatedData(result);
    // } else if (tempJSON.vehicleOwnerDOB != "" || tempJSON.ownerId.charAt(0) === '7') {
      const result = data.filter(function (item) {
        return item.key != "DOB";
      });
      setUpdatedData(result);
    // }
    //(tempJSON.ownerId.charAt(0) === '1') ? setCalendarType("Hijri") : setCalendarType("");

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
    setVerify(false);
    resetHeader('null');
  };

  // reset header handler
  const resetHeaderHandler = (val: String) => {
    resetHeader(val);
  };



  return (
    <Suspense fallback={<div>Loading...</div>}>
      {onVerify ? (
        <React.Fragment>
          {/* <Compensation
            claimCheckData={claimCheckData}
            validationData={validationData?.data}
            resetHeader={resetHeaderHandler}
          /> */}
          <BodyComp
            claimCheckData={claimCheckData}
            validationData={validationData?.data}
            resetHeader={resetHeaderHandler}
          />
        </React.Fragment>
      ) : (
        ///////////////////////////////////////////////////////
        <React.Fragment>
          {/* card */}
          <Card className="register-card">
            <Card.Body>
              {/* row 1 */}
              <Header
                title={Data?.register_new_claim}
              />
              {/* row 1 end */}

              <div className="row align-items-center register-refer-main">
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
                  {updatedData?.map((item, key) => {
                    return (
                      <React.Fragment key={key}>
                        {ComponentFactory(item, key)}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </Card.Body>
            <Card.Footer className="register-card-footer">
              <div className="d-flex align-items-center justify-content-between register-row-spacing-top">
                <div>
                  <ThemeButton
                    classes="walaa-medium-500"
                    isDisabled={false}
                    title={Data?.back}
                    variant="link"
                    icon={true}
                    iconName="ChevronLeftIcon"
                  />
                </div>
                <div>
                  <ThemeButton
                    isDisabled={updateActionEnabler}
                    title={Data?.verify}
                    value="Verify"
                    classes="register-call2action walaa-medium-500"
                    onClickhandler={clickHandler}
                  />
                </div>
              </div>
            </Card.Footer>
          </Card>
        </React.Fragment>
        ///////////////////////////////////////////////////////
      )}
    </Suspense>
  );
}

export default SeqNoDate;
