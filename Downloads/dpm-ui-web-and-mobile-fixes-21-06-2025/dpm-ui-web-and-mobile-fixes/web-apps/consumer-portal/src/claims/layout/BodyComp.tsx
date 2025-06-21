import { Card } from "react-bootstrap";
import ThemeButton from "../components/ThemeButton";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../../DataContext";
import React from "react";
import StepsProgress from "../../components/StepsProgress";
import CompreCompensation from "../register/Comprehensive/CompreCompensation";
import CompreGarage from "../register/Comprehensive/CompreCompensation/CompreGarage";
import CompreContactDet from "../register/Comprehensive/CompreCompensation/CompreContactDet";
import CompreSuccess from "../register/Comprehensive/CompreCompensation/CompreSuccess";
import CompreClaimInfo from "../register/Comprehensive/CompreCompensation/CompreClaimInfo";
import ClaimsDetails from "../register/ClaimsDetails";
import CompreClaimInformation from "../register/Comprehensive/CompreCompensation/CompreClaimInformation";
import CompreUploadFiles from "../register/Comprehensive/CompreCompensation/CompreUploadFiles";
import { callAPI, TOAST_AUTOCLOSE_TIMER } from "@dpm/shared-module";
import { Bounce, toast } from "react-toastify";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

const { VITE_BACKEND_BASE_URL } = import.meta.env;
function BodyComp(props) {
  const [isSuccessClaim, setSuccessclaim] = useState(false);
  const [isLiablity, setIsLiablity] = useState(true);
  const [currentStep, setCurrentStep] = useState<number>(1);
  // claim register successfull data response
  const [successClaimData, setSucessClaimData] = useState<any>();

  const [isIAgree, setIAgree] = useState(false);
  const [isMobilenum, setMobilenum] = useState(false);
  const [mobilenumData, setMobilenumData] = useState<string | undefined>(
    props?.validationData?.mobile
  );
  const [emailData, setEmailData] = useState<string | undefined>(
    props?.validationData?.email
  );

  //uploaded files data
  const [fileData, setFileData] = useState<
    { name: string; size: number; base64: string }[]
  >([]);

  // contact details values
  const [contactDetData, setContactDetData] = useState({
    isMobilenum: props?.validationData?.mobile
      ? props?.validationData?.mobile
      : "",
    isEmailId: "",
    isIAgree: false,
  });

  //cms content
  const Data = useContext(DataContext);

  //click handler return accept fn
  const clickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { innerHTML, title } = event?.target as HTMLInputElement;

    if (title === "Next" || title === undefined) {
      setCurrentStep(currentStep + 1);
    } else if (title === "Submit") {
      submitRegisterClaim();
      // setCurrentStep(4);
    } else {
      setCurrentStep(innerHTML as unknown as number);
    }
  };
  useEffect(() => {
    isLiablity
      ? currentStep === 4
        ? setSuccessclaim(true)
        : setSuccessclaim(false)
      : currentStep === 5
      ? setSuccessclaim(true)
      : setSuccessclaim(false);
  }, [currentStep, isLiablity]);

  //Compensation - compo change handler fn
  const Onchangehandler = (
    name: string,
    isContactMand: boolean,
    value?: string
  ) => {
    if (name === "IAgree") {
      setIAgree(isContactMand);
    }
    if (name === "mobilenum") {
      setMobilenum(isContactMand);
      setMobilenumData(value);
    }
    if (name === "emailId") {
      setEmailData(value);
    }
  };

  //Liability change handler fn
  const Isliabilityhandler = (name: string, isChecked: boolean) => {
    if (name === "isLiability") setIsLiablity(!isChecked);
  };

  //click handler return accept fn
  const reset = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (currentStep !== 1) setCurrentStep(currentStep - 1);
    else props.clickhandler(event);
  };

  //files upload final data files
  const onChangeFileDatahandler = (Filesdata: any) => {
    setFileData(Filesdata);
  };

  // Submit Register New Claim Data
  const submitRegisterClaim = async () => {
    try {
      const response = await callAPI(
        "post",
        VITE_BACKEND_BASE_URL + `/Motor/Claim/V1/RegisterClaim`,
        {
          referenceNo: props?.claimCheckData?.referenceNo,
          sourceType: "1",
          claimRequestType: "OD",
          caseReportId:
            props?.validationData?.caseReportId ||
            props?.claimsInfo?.refNo ||
            null,
          sequenceNo: props?.validationData?.sequenceNo || null,
          ownerId:
            props?.validationData?.ownerId ||
            props?.claimsInfo?.ownerId ||
            null,
          estimateValue:
            props?.validationData?.estimatedAmount || "1500" || null,
          vehicleOwnerDOB: props?.validationData?.vehicleOwnerDob || null,
          vehicleOwnerDOBArabicH:
            props?.validationData?.vehicleOwnerDobArabicH || null,
          mobileNo: mobilenumData || null,
          email: emailData || null,
          // authorizationNumber: "012345678",
          // compensationType: "Repair",
          // ibanNo: '',
          // bankName: "45",
          documents: fileData?.map((item: { name: string; base64: any }) => {
            const fileParts = item?.name?.split(".");
            return {
              fileName: fileParts?.slice(0, -1).join("."),
              fileExtension: fileParts?.slice(-1)[0],
              docType: 521,
              docFile: item.base64,
            };
          }),
        }
      );

      if (
        response?.message.toUpperCase() == "SUCCESS"
      ) {
        setCurrentStep(4);
        setSuccessclaim(true);
        setSucessClaimData(response?.data);
      } else if (
        response?.message == "ERROR" ||
        response?.message == "INTERNAL_SERVER_ERROR"
      ) {
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
        
      }
    } catch (error) {
      console.log(
        "Register New Claim Register Submit failed with error",
        error
      );
    } finally {
      
    }
  };

  return (
    <div className="container-fluid container-fluid-compre p-0">
      {isSuccessClaim ? (
        <ClaimsDetails
          claimResponse={successClaimData}
          validationData={props?.validationData}
          claimsInfo={props?.claimsInfo}
        />
      ) : (
        <div className="register-row-division-spacing-cust-top register-row-division-spacing-cust-bottom">
          <div className="register-row-division-spacing-cust-top register-row-division-spacing-cust-bottom">
            <StepsProgress
              isLiablity={isLiablity}
              onClickhandler={clickHandler}
              currentStep={currentStep}
            />
          </div>
          {/* card */}
          <Card className="register-card">
            {isLiablity ? (
              <Card.Header className="register-card-header">
                <div className="title-colored">
                  {currentStep === 1 && (
                    <div className="walaa-medium-500 title">
                      {Data?.walaa_liability}
                    </div>
                  )}
                  {currentStep === 2 && (
                    <div className="walaa-medium-500 title">
                      {Data?.select_city_garage}
                    </div>
                  )}
                  {currentStep === 3 && (
                    <div className="walaa-medium-500 title">
                      {Data?.contact_details}
                    </div>
                  )}
                  {currentStep === 4 && (
                    <div className="walaa-medium-500 title">
                      {Data?.claim_submitted}
                    </div>
                  )}
                  <div className="register-row-spacing-bottom"></div>
                </div>
              </Card.Header>
            ) : (
              <Card.Header className="register-card-header">
                <div className="title-colored">
                  {currentStep === 1 && (
                    <div className="walaa-medium-500 title">
                      {Data?.walaa_liability}
                    </div>
                  )}
                  {currentStep === 2 && (
                    <div className="walaa-medium-500 title">
                      {Data?.select_city_garage}
                    </div>
                  )}
                  {currentStep === 3 && (
                    <div className="walaa-medium-500 title">
                      {Data?.upload_docs}
                    </div>
                  )}
                  {currentStep === 4 && (
                    <div className="walaa-medium-500 title">
                      {Data?.contact_details}
                    </div>
                  )}
                  {currentStep === 5 && (
                    <div className="walaa-medium-500 title">
                      {Data?.claim_submitted}
                    </div>
                  )}
                  <div className="register-row-spacing-bottom"></div>
                </div>
              </Card.Header>
            )}

            {/* {!isSuccessClaim ||
          (currentStep === 4 && (           
          ))} */}

            {isLiablity ? (
              <React.Fragment>
                {currentStep === 1 && (
                  <Card.Body className="register-card-body register-compre-card-body p-0">
                    <CompreCompensation
                      validationData={props?.validationData}
                      claimCheckData={props?.claimCheckData}
                      claimsInfo={props?.claimsInfo}
                      changeHandler={Isliabilityhandler}
                    />
                  </Card.Body>
                )}

                {currentStep === 2 && (
                  <Card.Body className="register-card-body register-compre-card-body p-0">
                    <div className="row compre-compensation">
                      <div className="col">
                        <CompreClaimInformation
                          validationData={props?.validationData}
                          claimsInfo={props?.claimsInfo}
                        />
                      </div>
                    </div>
                    <hr />
                    <CompreGarage />
                  </Card.Body>
                )}

                {currentStep === 3 && (
                  <Card.Body className="register-card-body register-compre-card-body p-0">
                    <div className="row compre-compensation">
                      <div className="col">
                        <CompreClaimInformation
                          validationData={props?.validationData}
                          claimsInfo={props?.claimsInfo}
                        />
                      </div>
                    </div>
                    <hr />
                    <CompreContactDet
                      validationData={props?.validationData}
                      contactDetData={contactDetData}
                      changeHandler={Onchangehandler}
                      mobilenumData={mobilenumData}
                      emailData={emailData}
                    />
                  </Card.Body>
                )}

                {currentStep === 4 && (
                  <React.Fragment>
                    <CompreSuccess />
                    <CompreClaimInfo />
                  </React.Fragment>
                )}
              </React.Fragment>
            ) : (
              <React.Fragment>
                {currentStep === 1 && (
                  <Card.Body className="register-card-body register-compre-card-body p-0">
                    <CompreCompensation
                      validationData={props?.validationData}
                      claimCheckData={props?.claimCheckData}
                      changeHandler={Isliabilityhandler}
                      claimsInfo={props?.claimsInfo}
                    />
                  </Card.Body>
                )}

                {currentStep === 2 && (
                  <Card.Body className="register-card-body register-compre-card-body p-0">
                    <div className="row compre-compensation">
                      <div className="col">
                        <CompreClaimInformation
                          validationData={props?.validationData}
                          claimsInfo={props?.claimsInfo}
                        />
                      </div>
                    </div>
                    <hr />
                    <CompreGarage />
                  </Card.Body>
                )}

                {currentStep === 3 && (
                  <Card.Body className="register-card-body register-compre-card-body p-0">
                    <div className="row compre-compensation">
                      <div className="col">
                        <CompreClaimInformation
                          validationData={props?.validationData}
                          claimsInfo={props?.claimsInfo}
                        />
                      </div>
                    </div>
                    <hr />
                    <CompreUploadFiles
                      changeHandler={onChangeFileDatahandler}
                    />
                  </Card.Body>
                )}

                {currentStep === 4 && (
                  <Card.Body className="register-card-body register-compre-card-body p-0">
                    <div className="row compre-compensation">
                      <div className="col">
                        <CompreClaimInformation
                          validationData={props?.validationData}
                          claimsInfo={props?.claimsInfo}
                        />
                      </div>
                    </div>
                    <hr />
                    <CompreContactDet
                      validationData={props?.validationData}
                      contactDetData={contactDetData}
                      changeHandler={Onchangehandler}
                      mobilenumData={mobilenumData}
                      emailData={emailData}
                    />
                  </Card.Body>
                )}

                {currentStep === 5 && (
                  <React.Fragment>
                    <CompreSuccess />
                    <CompreClaimInfo />
                  </React.Fragment>
                )}
              </React.Fragment>
            )}

            <Card.Footer className="register-card-footer">
              <div className="d-flex align-items-center justify-content-between register-row-spacing-top">
                <div>
                  {!isSuccessClaim && (
                    <ThemeButton
                      classes="walaa-medium-500"
                      isDisabled={false}
                      title={Data?.back}
                      variant="link"
                      icon={true}
                      iconName="ChevronLeftIcon"
                      onClickhandler={reset}
                    />
                  )}
                </div>
                <div>
                  {!isSuccessClaim ? (
                    <ThemeButton
                      classes="register-call2action walaa-medium-500"
                      title={
                        !isLiablity
                          ? currentStep === 4
                            ? Data?.submit
                            : Data?.next
                          : currentStep === 3 || currentStep === 4
                          ? Data?.submit
                          : Data?.next
                      }
                      iconRight={
                        !isLiablity
                          ? currentStep === 4
                            ? false
                            : true
                          : currentStep === 3 || currentStep === 4
                          ? false
                          : true
                      }
                      isDisabled={
                        !isLiablity
                          ? currentStep === 4
                            ? !(isIAgree && isMobilenum) && true
                            : false
                          : currentStep === 3 || currentStep === 4
                          ? !(isIAgree && isMobilenum) && true
                          : false
                      }
                      iconName="ArrowForwardIcon"
                      onClickhandler={clickHandler}
                    />
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </Card.Footer>
          </Card>
          {/* card */}
        </div>
      )}
    </div>
  );
}

export default BodyComp;
