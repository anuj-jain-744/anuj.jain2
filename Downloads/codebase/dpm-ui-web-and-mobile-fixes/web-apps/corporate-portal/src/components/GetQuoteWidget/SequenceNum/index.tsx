import React, { useEffect, useState } from "react";
import { Alert, Modal } from "react-bootstrap";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { TypographyAndIcon } from "components/TypographyAndIcon";
import { ThemeTextbox } from "components/ThemeTextbox";
import ThemeButton from "components/ThemeButton";
import "./index.scss";
import { formStateProps, OthersClaimInfo, PayloadProps } from "../getQuoteInterface";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { commonKeywords, vehicleSequenceNumberIdent } from "../../../constant"; // constant.ts file where we have all our constants
import { UiTabs } from "components/UiTabs";
import ThemeSelect from "components/FormInput/ThemeSelect";

type VehicleSeqNum = {
  name: string;
  value: string;
};

type claimsInfo = {
  refNo: string;
  ownerId: string;
  SourceType: number;
  mailPhone?: string;
  sessionId?: string;
}

type claimsInfoOther = {
  refNo: string;
  ownerId: string;
  SourceType: number;
  type: string;
  mailPhone: string;
  sessionId?: string;
}

type PayloadPropsClaim = {
  caseReportId: string;
  claimRequestType: string;
  ownerId: string;
  sequenceNo?: string;
  lossType?: string;
  sourceType: number;
  sessionSecretId?: string;
  mobileNumber?: string;
  email?: string;
}
interface IModalDialogBox {
  isModal: boolean;
  setShow: (show: boolean) => void;
  languageData: {[key:string] : string};
  setShowModal: (show: boolean) => void;
  setClaimCheckData: any;
  setMissingData:any;
  propData: {
    type: string;
    module: string;
  };
  claimsInfo: claimsInfo;
  setClaimsInfo: (data: claimsInfoOther) => void;
  isOtherCase: boolean;
  setIsOtherCase: (show:boolean) => void;
  setIsSeqNo:(show:boolean) => void;
  setResendSeqNo:(value:string) => void;
  formState: formStateProps;
  cPhoneMail?: string;
  othersClaimInfo: OthersClaimInfo;
  setOthersClaimInfo: (claimsInfo: OthersClaimInfo) => void;
  setMissingPayload: (payload: PayloadProps) => void;
}

const SequenceNum = ({ 
  isModal,
  setShow,
  languageData,
  setShowModal,
  setClaimCheckData,
  propData,
  claimsInfo,
  isOtherCase,
  setMissingData,
  setIsSeqNo,
  setResendSeqNo,
  setIsOtherCase,
  formState,
  setClaimsInfo,
  cPhoneMail,
  othersClaimInfo,
  setOthersClaimInfo,
  setMissingPayload,
}: IModalDialogBox) => {
  const [vSeqNo, setVSeqNo] = useState<VehicleSeqNum>();

  // Error text tracking for textbox data
  const [vSeqNoError, setVSeqNoError] = useState("");
  const [alertMessage, setalertMessage] = useState("");
  // enable/disable action btn state
  const [updateActionEnabler, setAction] = useState<boolean>(true);

  //story board decider to show Sequence Number and DOB
  const [showSeqNo, setShowSeqNo] = useState(false);

  const [isTooltipModal, setIsTooltipModal] = useState<boolean>(false);

  const handleTooltipClose = () => setIsTooltipModal(false);
  const handleTooltipShow = () => setIsTooltipModal(true);

  //others case
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [accidentType, setAccidentType] = useState<string | undefined>(undefined);

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
        setOthersClaimInfo({ ...othersClaimInfo, SequenceNo: value });
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
      setOthersClaimInfo({ ...othersClaimInfo, SequenceNo: value });
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
    if (currentTab === 0) {
      setOthersClaimInfo({...othersClaimInfo, isSequenceNo: true });
      if (showSeqNo) {
          setAction(currentTab === 0 && vSeqNo?.value?.length === 0);
      } else {
        setAction(true);
      }
    } else if (currentTab === 1) {
      setOthersClaimInfo({...othersClaimInfo, isSequenceNo: false });
      if (accidentType?.length) {
          setAction(accidentType?.length === 0);
      } else {
        setAction(true);
      }
    }
  }, [vSeqNo, accidentType, currentTab]);

  useEffect(() => {
    //Modal entry point setup
    setalertMessage("");
    setShowSeqNo(true);
  }, []);

  const fetchData = async () => {
    const payload : PayloadProps = {
      caseReportId: claimsInfo.refNo,
      claimRequestType: propData.type,
      ownerId: claimsInfo.ownerId,
      sequenceNo: vSeqNo?.value,
      lossType: accidentType,
      sourceType: claimsInfo.SourceType,
      sessionSecretId: claimsInfo?.sessionId,
    };
    if(claimsInfo.mailPhone){
      // when owner id starts with 7 AND is a number, then it is a mobile number
      (claimsInfo?.ownerId?.toString().startsWith("7") && /^\d*$/.test(claimsInfo.mailPhone)) ?
        payload.mobileNumber = claimsInfo.mailPhone :
        payload.email = claimsInfo.mailPhone;
    }
    setMissingPayload(payload);
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
    setOthersClaimInfo({...othersClaimInfo, lossType: value });
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
                            onKeyDownHandler={handleKeyPress}
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
                            value={accidentType as string}
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
