import React, { useEffect, useState } from "react";
import { Alert, Modal } from "react-bootstrap";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { TypographyAndIcon } from "components/TypographyAndIcon";
import { ThemeTextbox } from "components/ThemeTextbox";
import { ThemeDatePicker } from "components/ThemeDatePicker";
import ThemeButton from "components/ThemeButton";
import { callAPI } from "@dpm/shared-module";
import { DateObject } from "react-multi-date-picker"; // Import DateObject from the appropriate library
import "./index.scss";
import { ApiResponse, PayloadProps } from "../getQuoteInterface";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

//const { VITE_BACKEND_BASE_URL } = import.meta.env;
import { commonKeywords, othersCaseErrorCode, vehicleSequenceNumberIdent, VITE_BACKEND_BASE_URL } from "../../../constant"; // constant.ts file where we have all our constants
import { UiTabs } from "components/UiTabs";
import ThemeSelect from "components/FormInput/ThemeSelect";

type VehicleSeqNum = {
  name: string;
  value: string;
};

type OwnerDOB = {
  name: string;
  value: string;
};

type claimsInfo = {
  refNo: string;
  ownerId: string;
  SourceType: number;
  mailPhone?: string;
}

interface IModalDialogBox {
  isModal: boolean;
  setShow: (show: boolean) => void;
  setContinue: (show:boolean) => void;
  languageData: {[key:string] : string};
  setValidationData: any;
  setShowModal: (show: boolean) => void;
  setClaimCheckData: any;
  setMissingData:any;
  propData: {
    type: string;
    module: string;
  };
  claimsInfo: claimsInfo;
  isOtherCase: boolean;
  setIsSeqNo:(show:boolean) => void;
  setResendSeqNo:(value:string) => void;
}

const SequenceNum = ({ isModal, setShow, setContinue, languageData, setValidationData, setShowModal, setClaimCheckData, propData, claimsInfo, isOtherCase, setMissingData,setIsSeqNo,setResendSeqNo }: IModalDialogBox) => {
  const [vSeqNo, setVSeqNo] = useState<VehicleSeqNum>();
  const [ownerDOB, setOwnerDOB] = useState<OwnerDOB>({ name: "DOB", value: "" });
  const [calendarType, setCalendarType] = useState<string>("Gregorian"); //Hijri or Gregorian

  // Error text tracking for textbox data
  const [vSeqNoError, setVSeqNoError] = useState("");
  const [ownerDOBError, setOwnerDOBError] = useState("");
  const [alertMessage, setalertMessage] = useState("");
  // enable/disable action btn state
  const [updateActionEnabler, setAction] = useState<boolean>(true);

  //story board decider to show Sequence Number and DOB
  const [showSeqNo, setShowSeqNo] = useState(false);
  const [showDate, setShowDate] = useState(false);

  const [isTooltipModal, setIsTooltipModal] = useState<boolean>(false);

  const handleTooltipClose = () => setIsTooltipModal(false);
  const handleTooltipShow = () => setIsTooltipModal(true);

  //others case
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [accidentType, setAccidentType] = useState<string>("");

  const dateHandler = (date: DateObject | null, options: { validatedValue: string | string[]; input: HTMLElement; isTyping: boolean; }) => {
      if (date && date.isValid) {
        const jsDate = date.toDate(); // Convert DateObject to JavaScript Date
        const day = jsDate.getDate().toString().padStart(2, '0');
        const month = (jsDate.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is zero-based
        const year = jsDate.getFullYear();

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

  const handleOnChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    // Only handle changes for the "Vehicle_Sequence_No" field
    if (name === "Vehicle_Sequence_No") {
      const regex = /^[0-9]{0,11}$/;
      if (regex.test(value)) {
        setVSeqNo({
          name: "Vehicle_Sequence_No",
          value: value,
        });
        setVSeqNoError('');
        setResendSeqNo(value);
        setIsSeqNo(true);
      } else {
        setVSeqNoError(languageData?.invalid_dynamic_input.replace("<DYNAMIC>", languageData?.vehicle_sequence));
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { value } = event.target as HTMLInputElement;
    // Allow backspace, delete, copy, cut, and paste keys, prevent non-numeric characters, or length exceeding the allowed limit
    if (
      event.key === 'Backspace' ||
      event.key === 'Delete' ||
      event.ctrlKey && (event.key === 'c' || event.key === 'v' || event.key === 'x') ||
      (!/[^0-9]/.test(event.key) && value.length < 11)
    ) {
      return;
    }
    event.preventDefault();
  };

  const updatedValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === vehicleSequenceNumberIdent) {
      setVSeqNo({
        name: vehicleSequenceNumberIdent,
        value: value,
      });
      // Validate input: up to 30 digits
      if (/^[0-9]{0,30}$/.test(value) || value === '') {
        setVSeqNoError('');
      } else {
        setVSeqNoError(languageData?.invalid_dynamic_input.replace("<DYNAMIC>", languageData?.vehicle_sequence));
      }
    }
  };

  //click handler return accept fn
  const clickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { value } = event?.target as HTMLInputElement;
    fetchData();
  };

  useEffect(() => {
    //Vehical Seq No. and DOB - on validate enable/disable Verify button
    if (showSeqNo && showDate){
      (ownerDOB?.value?.length && vSeqNo?.value?.length && ownerDOBError == "" && vSeqNoError == "")
      ? setAction(false)
      : setAction(true);
    } else if (currentTab === 0) {
      if (showSeqNo) {
          setAction(currentTab === 0 && vSeqNo?.value?.length === 0);
      } else {
        setAction(true);
      }
    } else if (currentTab === 1) {
      if (accidentType?.length) {
          setAction(accidentType?.length === 0);
      } else {
        setAction(true);
      }
    } else if (showDate) {
      (vSeqNo?.value?.length && vSeqNoError == "")
      ? setAction(false)
      : setAction(true);
    }
  }, [vSeqNo, ownerDOB, accidentType, currentTab]);

  useEffect(() => {
    //Modal entry point setup
    setalertMessage("");
    setShowSeqNo(true);
    // Hijri calander code for (tempJSON.ownerId.charAt(0) === '1') ? setCalendarType("Hijri") : setCalendarType("");
  }, []);

  const fetchData = async () => {
    let payload : PayloadProps = {
      caseReportId: claimsInfo.refNo,
      claimRequestType: propData.type,
      ownerId: claimsInfo.ownerId,
      sequenceNo: vSeqNo?.value,
      accidentType: accidentType,
      sourceType: claimsInfo.SourceType
    };
    if(claimsInfo.mailPhone){
      // when owner id starts with 7 AND is a number, then it is a mobile number
      (claimsInfo?.ownerId?.toString().startsWith("7") && /^\d*$/.test(claimsInfo.mailPhone)) ?
        payload.mobileNumber = claimsInfo.mailPhone :
        payload.email = claimsInfo.mailPhone;
    }
    try {
      //23/10/2024 - As per java team due to CORS error asked to use "InitiateClaim" instead of "ValidateClaim&Customer"
      //const response = await callAPI("post", VITE_BACKEND_BASE_URL + `/Motor/Claim/V1/ValidateClaim&Customer`,
      const response : ApiResponse = await callAPI("post", VITE_BACKEND_BASE_URL + `/Motor/Claim/V1/InitiateClaim`,
        payload
      );

      if (response?.message === "SUCCESS") {
        setClaimCheckData(response?.data);
        setMissingData(false);
        //if (propData.type == "OD") {
        //Comp. flow - bypass OTP part
        setShow(false);
        //setContinue(true);
        //setValidationData(response?.data);
        //uncomment the next line to enbale OTP for Third party
        //} else {
        setShowModal(true); // Show the modal for OTP
        //}
      } //Error code DTXJCRC4003 provided by Java team - Need to consider this Code for OTHER case redirect
      else if (response?.errors && response?.errors[0]?.code == othersCaseErrorCode) {
        //Others. flow - bypass OTP part
        setShow(false);
        setShowModal(true); // Show the modal for OTP
      } else if ((response?.message === "ERROR" || response?.message === "INTERNAL_SERVER_ERROR") && response?.errors && Array.isArray(response?.errors) && response?.errors.length > 0) {
        if (isOtherCase) {
          //Others. flow - bypass OTP part
          setShow(false);
          setShowModal(true); // Show the modal for OTP
        } else {
          setalertMessage(response?.errors[0]?.messages?.message_en);
        }
      } else {

      }
    } catch (error) {
      console.error("An error occurred while fetching the data", error);
    } finally {

    }
  };
//modal dialog handler functions
const handleClose = () => setShow(false);

  //mock data
  const form_fields = [
    {
      webform_name: "Yes",
    },
    {
      webform_name: "No",
    },
  ];

  // on select change handler
  const handleFieldChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setAccidentType(value);
  };
  return (
    <React.Fragment>
      {/* dialog code */}
      <Modal
        // size="lg"
        show={isModal}
        centered
       onHide={handleClose}
        className="register-new-claim-comprehensive-ModalDialogBox"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {isOtherCase
              ? languageData?.provide_the_accident
              : languageData?.enter_vehicle_sequence_no}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert
            variant="danger"
            className={
              isOtherCase
                ? "register-new-claim-comprehensive-danger"
                : "register-new-claim-comprehensive-warning"
            }
            show={isOtherCase ? true : alertMessage?.length > 0 ? true : false}
          >
            <div className="row d-flex align-items-center">
              <div className="col-1">
                <WarningAmberIcon fontSize="large" />
              </div>
              <div className="col walaa-regular-400 ps-10">
                {isOtherCase
                  ? languageData?.yes +
                    " " +
                    languageData?.your_vehicle_suffered +
                    " " +
                    languageData?.or +
                    " " +
                    languageData?.select +
                    " " +
                    languageData?.no +
                    " " +
                    languageData?.if_crashed_in_a_property
                  : alertMessage}
              </div>
            </div>
          </Alert>

          <div className="container">
            <div className="row ps-1">
              {isOtherCase ? (
                <div className="row">
                  <div className="col-sm-12 col-md-4 d-flex align-items-center px-0 pt-4">
                    <UiTabs
                      tabsData={form_fields}
                      activeTab={currentTab}
                      setActiveTab={setCurrentTab}
                    />
                  </div>
                  <div className="col-sm-12 col-md-8 px-0">
                    {currentTab === 0 ? (
                      <React.Fragment>
                        <TypographyAndIcon
                          text={languageData?.vehicle_sequence}
                          isIcon={true}
                          iconclasses={""}
                          tooltip={true}
                          tooltipclasses={""}
                          required={true}
                        />
                        <button
                          className="bg-transparent btn btn-link text-primary border border-0 text-decoration-none p-0"
                          title="Read More"
                          type="button"
                          onClick={handleTooltipShow}
                        >
                          <InfoOutlinedIcon className="tooltip-icon" />
                        </button>
                        <div className="pt-1">
                          <ThemeTextbox
                            type="text"
                            title={languageData?.vehicle_sequence}
                            name="Vehicle_Sequence_No"
                            value={vSeqNo?.value}
                            placeholder={languageData?.vehicle_sequence}
                            onChangehandler={updatedValue}
                            errorValue={vSeqNoError}
                          />
                        </div>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <TypographyAndIcon
                          text={languageData?.accident_type}
                          isIcon={true}
                          iconclasses={""}
                          tooltip={true}
                          tooltipclasses={""}
                          required={true}
                        />
                        <button
                          className="bg-transparent btn btn-link text-primary border border-0 text-decoration-none p-0"
                          title="Read More"
                          type="button"
                          onClick={handleTooltipShow}
                        >
                          <InfoOutlinedIcon className="tooltip-icon" />
                        </button>
                        <div className="pt-1">
                          <ThemeSelect
                            options={
                              propData?.type === commonKeywords?.claimOD
                                ? (languageData?.vehicle_claim_types as unknown as {
                                    key: string;
                                    value: string;
                                  }[])
                                : (languageData?.accident_claim_types as unknown as {
                                    key: string;
                                    value: string;
                                  }[])
                            }
                            placeholder={languageData?.provide_the_accident}
                            value={accidentType}
                            onChangehandler={handleFieldChange}
                            isRequired={true}
                            fieldName="accidenttype"
                            classes="select-input"
                            label=""
                          />
                        </div>
                      </React.Fragment>
                    )}
                  </div>
                </div>
              ) : (
                <React.Fragment>
              {showSeqNo && (
                <div className="col col-10">
                  <div className="row ps-1 theme-textbox-wrapper">
                    <TypographyAndIcon
                      text={languageData?.vehicle_sequence}
                      isIcon={true}
                      iconclasses={""}
                      tooltip={true}
                      tooltipclasses={""}
                      required={true}
                    />
                    <button
                      className="bg-transparent btn btn-link text-primary border border-0 text-decoration-none p-0"
                      title="Read More"
                      type="button"
                      onClick={handleTooltipShow}
                    >
                      <InfoOutlinedIcon className="tooltip-icon" />
                    </button>
                  </div>
                  <div className="row ps-1">
                    <div className="col-10">
                      <ThemeTextbox
                        type="text"
                        title={languageData?.vehicle_sequence}
                        name="Vehicle_Sequence_No"
                        value={vSeqNo?.value}
                        placeholder={languageData?.vehicle_sequence}
                        onChangehandler={handleOnChangeHandler}
                        onKeyDownHandler={handleKeyPress}
                        errorValue={vSeqNoError}
                      />
                    </div>
                  </div>
                </div>
              )}
              {showDate && (
                <div className="col col-6">
                  <div className="row ps-1">
                    <TypographyAndIcon
                      text={languageData?.dob}
                      isIcon={true}
                      iconclasses={""}
                      tooltip={true}
                      tooltipclasses={""}
                      required={true}
                    />
                  </div>
                  <div className="row ps-1">
                    <div className="col-10">
                      <ThemeDatePicker
                        name={languageData?.dob}
                        placeholder={languageData?.dob}
                        onChangehandler={dateHandler}
                        value={ownerDOB?.value ? new Date(ownerDOB.value.split('/').reverse().join('-')) : undefined}
                        format="DD/MM/YYYY"
                        calendarType={calendarType}
                        errorValue={ownerDOBError}
                      />
                    </div>
                  </div>
                </div>
                  )}
                </React.Fragment>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="w-100 d-flex justify-content-end gap-1">
            <ThemeButton
              name={languageData?.verify}
              className="walaa-medium-500 register-call2action2 btn btn-link btn-lg"
              disabled={updateActionEnabler}
              handleClick={(event) => clickHandler(event)}
            />
          </div>
        </Modal.Footer>
      </Modal>
      {/* dialog code ends */}

      <Modal
        size="lg"
        show={isTooltipModal}
        centered
        onHide={handleTooltipClose}
        className="register-new-claim-GetQuoteWidget-ModalDialogBox"
      >
        <Modal.Header closeButton></Modal.Header>
        {languageData?.sequence_no_tooltip && <div dangerouslySetInnerHTML={{ __html: languageData?.sequence_no_tooltip }}></div>}
      </Modal>
    </React.Fragment>
  );
};

export default SequenceNum;
