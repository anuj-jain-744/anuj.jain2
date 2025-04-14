import "./endorsement.scss";
import React, { useContext, useEffect, useState } from "react"; 
import ExtendTravel from "assets/Endorsement/extend-travel-period.png"; 
import ManageTraveller from "assets/Endorsement/manage-traveller.png";
import ThemeRadioCheckbox from "./sharedComponent/ThemeRadioCheckbox";
import { AccordionContext,Card,useAccordionButton,} from "react-bootstrap";
import { useEndorsementAddBenefitApi } from "./hook/useEndorsementAddBenefit";
import PolicyCard from "Motor/Policy-services/PolicyCancellation/sharedComponent/PolicyCard";
import { callAPI, getRandomString } from "@dpm/shared-module";
import Success from "Motor/SuccessPage";
import DidYouKnowCard from "Motor/DidYouKnowCard/DidYouKnowCard";
import { useReviewPolicy } from "Motor/Policy-services/PolicyDashboard/hooks/useReviewPolicy";
import TermsAndConditionsModal from "./TermsAndConditionModel";
import SelectPolicyCard from "components/Travel/Claims/Comprehensive/RegisterClaim/RegisterClaimLeft/SelectPolicyCard/SelectPolicyCard";
import { getPriceFormat } from "utils/getPriceFormat";
import usePolicyData from "Motor/Policy-services/PolicyDashboard/hooks/usePolicyData";
import OrderSummaryCard from "components/OrderSummaryCard/OrderSummaryCard";
import FooterPayment from "components/FooterPayment/FooterPayment";
import { useEndorsementPayment } from "./hook/useEndorsementPayment";
import { useEndoAddPayment } from "./hook/useEndoAddPayment";
import DefaultSpinner from "components/Spinner";
import { VITE_CONTENT_BASE_URI, VITE_BACKEND_UTILITY_URL } from "constant";
import OTPValidation from "components/OTPValidation";
import { AlertBox } from "components/AlertBox";
import { LanguageData  } from "types/languageData";
import ExtendTravelPeriod from "./ExtendTravelPeriod";


interface EndroseMentProps {
  policyNo: string;
  navigateTo?: (url: string) => void;
  allPolicy?: string[];
  travelData: string;
}

 

function Endorsement({ policyNo, navigateTo, allPolicy, travelData }: Readonly<EndroseMentProps>) {
  const [manage, setManage] = useState(false);
  const [vehicle, setVehicle] = useState(false);
  const [benefit, setBenefit] = useState(false);
  const [isRadioChecked, setIsRadioChecked] = useState(true);
  const [languageData, setLanguageData] = useState<LanguageData>(); 
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  // const [isNudgeVisible, setIsNudgeVisible] = useState(false);
  const [selectedPolicyNumber, setSelectedPolicyNumber] = useState<
    string | undefined
  >(policyNo);
  const { makeAddBenefitApiCall, benefitData } = useEndorsementAddBenefitApi({
    PolicyNo: selectedPolicyNumber!,
  });
  const { makeApiCall, data } = useReviewPolicy({
    PolicyNo: selectedPolicyNumber!,
  });

  const { makePaymentApiCall, isLoading: isLoadingEndorsementPayment } =
    useEndorsementPayment({ PolicyNo: selectedPolicyNumber! });

  const [isTCAccepted, setIsTCAccepted] = useState(false);
  
  const [newDriverArray, setNewDriverArray] = useState<{}[]>([]);
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [apiErrorMessage, setApiErrorMessage] = useState({
    title: "",
    description: ""
  });
  
  // OTP Modal related states
  const [showOTPModal, setShowOTPModal] = useState<boolean>(false);
  const [otpValue, setOtpValue] = useState<string>('');
  const [errorCode, setErrorCode] = useState<string>("")
  const [messageOTP, setMessageOTP] = useState("");
  const [isOTPValidated, setIsOTPValidated] = useState(false);
  const [timerResend, setTimerResend] = useState(600);
  const [isLoading, setIsLoading] = useState(false);
  const [disabledBtn, setDisabledBtn] = useState<boolean>(false);

  const policyDataDetail = usePolicyData(data);

 
 
// Motor cms data call 
  const fetchData = async () => {
    const response : {config: LanguageData[]}= await callAPI(
      "get",
      VITE_CONTENT_BASE_URI + "en/api/consumerportal-config"
    ); 
    setLanguageData(response.config[0]); 
  };
 
  useEffect(() => {
    if (selectedPolicyNumber) {
      const fetchData = async () => {
        await makeApiCall();
        await makeAddBenefitApiCall();
      };
      fetchData();
    }
  }, [makeApiCall, selectedPolicyNumber]);

  useEffect(() => {
    localStorage.removeItem("selectedPolicyNumber");

    const storedPolicyNumber = localStorage.getItem("selectedPolicyNumber");
    if (storedPolicyNumber) {
      setSelectedPolicyNumber(storedPolicyNumber);
    }

    const handleBeforeUnload = () => {
      localStorage.removeItem("selectedPolicyNumber");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const policyData = data?.policyLob[0]?.policyRisk[0];
  const mobile = data?.policyCustomer[0]?.mobile; 
  const addBenefitData = benefitData?.data?.model?.vehicles[0]; 
  const policyDetails = policyDataDetail?.policyDetails ?? undefined;

  useEffect(() => {
    fetchData();
  }, []);

  const handleExtendPeriod = () => {
    setManage(true);
    setVehicle(false);
    setBenefit(false);
  };
 
  const handleExtraBenefit = async () => {
    setBenefit(true);
    setManage(false);
    setVehicle(false);
    // setIsNudgeVisible((prev) => !prev); // TODO : needed this for later use
  };

  const getRandomNumber = getRandomString(3, true);
  const refNo = "EECRN-24-" + getRandomNumber;
  const seqNo = (policyData?.vehicleSequenceNo)?policyData?.vehicleSequenceNo:"";

  const { makeAddDriverPaymentApiCall } =
  useEndoAddPayment({ PolicyNo: selectedPolicyNumber!,
      SequenceNo: seqNo!, 
      ReferenceNo: refNo!
     });


  const benefitIds = addBenefitData?.benefits
    ?.filter((benefit) => benefit.isSelected)
    ?.map((benefit) => ({ benefitId: benefit.benefitId }));

  const driverIds = newDriverArray?.map((driver) => ({ driverID: driver.driverID }));

  const handlePayment = async () => {
    if (benefit && benefitIds && benefitIds.length > 0) {
      await makePaymentApiCall({ benefitId: benefitIds });
      if (isTCAccepted) {
        setIsPaymentSuccess(true);
      }
    } else if(manage && driverIds && driverIds.length > 0) {
      if (!isOTPValidated){
        generateDirectIssueOtp();
        return false;
      }
      await makeAddDriverPaymentApiCall({ driverId: driverIds });
      if (isTCAccepted) {
         setIsPaymentSuccess(true);
      }
    }
  };

  const languageOTPData = {
    otp_info_message: languageData?.enter_otp_code,
    your_otp_will_expire: languageData?.your_otp_will_expire,
    confirm_otp: languageData?.confirm_otp,
    resend_otp: languageData?.resend_otp,
    enter_otp_code: languageData?.enter_otp_code
  };
  const [referenceData, setReferenceData] = useState({referenceNo:"",responseDataReferenceNo:""})

  const generateDirectIssueOtp = async () => {
    const referenceNo = getRandomString(9, true);
    let mobileNo = mobile;
    if (mobile!==undefined && mobile!=="" && mobile.length === 12) {
      mobileNo = mobileNo.replace(/^966/, "0");
    }
    try {
      setIsLoading(true);
      const responseData = await callAPI(
        "post", 
        VITE_BACKEND_UTILITY_URL + `GenerateOtp`,
        {
          "sessionSecretId": referenceNo, //123456789
          "mobileNumber": mobileNo //"0512345678"
        }
      );
      if (responseData?.code === 1 && responseData?.message === "SUCCESS") {
        setShowOTPModal(true);
        setReferenceData({referenceNo: referenceNo,responseDataReferenceNo: responseData?.data?.referenceNo})
      } else {
        setApiErrorMessage({
          title: responseData?.message,
          description: responseData?.errors[0]?.messages?.message_en
        });
        setShowAlertModal(true);
      }
    } catch (error) { 
      console.error("An error occurred while fetching the data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if(otpValue.length === 4) {
      validateOtp();
    }
  }, [otpValue]);

  useEffect(() => {
    if (isOTPValidated)
      handlePayment();
  },[isOTPValidated]);

  const validateOtp = async () => {
    try {
      setIsLoading(true);
      const responseData = await callAPI(
        "post", 
        VITE_BACKEND_UTILITY_URL + `ValidateOtp`,
        {
          "otp": otpValue,
          "referenceNo": referenceData.responseDataReferenceNo,
          "sessionSecretId": referenceData.referenceNo, //123456789
        }
      );
      if (responseData?.code === 1 && responseData?.message === "SUCCESS") {
        setIsOTPValidated(true);
        setShowOTPModal(false);
      }
      else if (responseData?.errors[0]?.messages?.message_en !== "") {
        setMessageOTP(responseData?.errors[0]?.messages?.message_en);
        setErrorCode(responseData?.errors[0]?.code);
      } else {
        //API response error -- section
      }
    } catch (error) { 
      console.error("An error occurred while fetching the data", error);
    } finally {
      setIsLoading(false);
    }
  }
 
  function ContextAwareToggle({ children, eventKey, callback }) {
    const { activeEventKey } = useContext(AccordionContext);

    const decoratedOnClick = useAccordionButton(eventKey, async () => {
      if (callback) {
        callback(eventKey);
      }
      setIsRadioChecked((prev) => !prev);
      await makeAddBenefitApiCall();
    });

    return (
      <ThemeRadioCheckbox
        type="radio"
        defaultChecked={isRadioChecked}
        classes={"card-radio-btn"}
        onChangehandler={decoratedOnClick}
        name="radio-check"
        label=""
      />
    );
  }

  const cardData = [
    {
      imgSrc: ExtendTravel,
      label: travelData?.extend_travel_period,  
      checked: manage,
      onChange: handleExtendPeriod,
    },
    
    {
      imgSrc: ManageTraveller,
      label: travelData?.manage_travelers,
      checked: benefit,
      onChange: handleExtraBenefit,
    },
  ];

  const RadioCard = ({ imgSrc, label, checked, onChange }) => (
    <Card className={checked ? "card-checked" : "card-unchecked"}>
      <div>
        <Card.Img variant="top" src={imgSrc} className="img-card" />
      </div>
      <Card.Body className="body-card">
        <ThemeRadioCheckbox
          label={label}
          type="radio"
          defaultChecked={checked}
          classes="body-card-btn"
          onChangehandler={onChange}
          name="main-radio"
        />
      </Card.Body>
    </Card>
  );

  const handlePolicySelect = (policyNumber: string) => {
    setSelectedPolicyNumber(policyNumber);
    localStorage.setItem("selectedPolicyNumber", policyNumber);
  };

  useEffect(() => {
    localStorage.removeItem("selectedPolicyNumber");

    const storedPolicyNumber = localStorage.getItem("selectedPolicyNumber");
    if (storedPolicyNumber) {
      setSelectedPolicyNumber(storedPolicyNumber);
    }
  }, []);

  const [addBenefitDatas, setAddBenefitData] = useState<{ benefits: any[] }>(
    []
  );

  const handleBenefitToggle = (benefit, index) => {
    const updatedBenefits = [...addBenefitData.benefits];
    updatedBenefits[index].isSelected = !updatedBenefits[index].isSelected;

    setAddBenefitData({ ...addBenefitData, benefits: updatedBenefits });
  };

  let selectedBenefits = addBenefitData?.benefits?.filter(
    (benefit) => benefit.isSelected
  );

  const subtotal =
    selectedBenefits?.reduce(
      (total, benefit) => total + benefit.benefitPrice,
      0
    ) || 0;
  const tax = subtotal * 0.15;
  const vatAmount = tax;
  const totalAmount = subtotal + tax;

  let isAnyBenefitSelected = false;
  if (benefit){
    isAnyBenefitSelected = addBenefitData?.benefits?.some(
      (benefit) => benefit.isSelected
    );
  } else if (manage){
    isAnyBenefitSelected = (newDriverArray.length > 0) ? true : false;
  }

  let policyDetail = {
    policyNumber: selectedPolicyNumber,
    addBenefitDatas: selectedBenefits,
  };

  // Section for Manage driver begins here.
  const [isPeriodAdded, setisPeriodAdded] = useState<boolean>(false);
  const [addDriverData, setAddDriverData] = useState<[]>([]);

  const [driverSubtotal, setDriverSubtotal] = useState<number>(0);
  const [driverTax, setDriverTax] = useState<number>(driverSubtotal * 0.15);
  const [driverVatAmount, setDriverVatAmount] = useState<number>(driverTax);
  const [driverTotalAmount, setDriverTotalAmount] = useState<number>(subtotal + driverTax);
  const [driverSummaryData, setDriverSummaryData] = useState<{}>({});
  
  useEffect(() => {
    let feeAmount=0;
    let taxableAmount=15;
    let totalAmount=0;
    let vatAmount=0;
    if (addDriverData.length>0){
      setisPeriodAdded(true);
      addDriverData.map(function(item,i){
        feeAmount+=item.taxableAmount;
        totalAmount+=item.totalAmount;
        vatAmount+=item.vatAmount;
      });
      setDriverSubtotal(feeAmount);
      setDriverVatAmount(vatAmount);
      setDriverTotalAmount(totalAmount);

      let summaryData={ "benefits": [] };
      newDriverArray.map((d,i)=>{
        const x={
          "isSelected": true,
          "benefitNameAr": d?.driverNameArabic,
          "benefitNameEn": d?.driverName,
          "benefitPrice": d?.premium
        };
        summaryData.benefits.push(x);
      });
      setDriverSummaryData(summaryData);
    } else {
      setisPeriodAdded(false);
    }
  }, [addDriverData]);

  if (manage && driverSummaryData?.benefits?.length) {
    policyDetail = {
      policyNumber: selectedPolicyNumber,
      addBenefitDatas: driverSummaryData?.benefits
    };
  }

  const handleReset = () => {
    setOtpValue("");
    setErrorCode("");
    setMessageOTP("")
  }

  const handleResend = () => {
    generateDirectIssueOtp();
  }

  const handleAlertClose = () => {
    setShowAlertModal(false);
  }
  // Section for Manage driver ends here.

  return (
    <React.Fragment>
      <AlertBox
        title={apiErrorMessage.title}
        description={apiErrorMessage.description}
        showAlertModal={showAlertModal}
        setShowAlertModal={handleAlertClose}
      />
      <OTPValidation
          showModal={showOTPModal}
          setShowModal={setShowOTPModal}
          setOtpValue={setOtpValue}
          timerResend={timerResend}
          messageOTP={messageOTP}
          languageData={languageOTPData}
          isLoading={isLoading}
          isInputDisabled={errorCode === "DTXSVLD4002"}
          setDisabledBtn={setDisabledBtn}
          handleResend={handleResend}
          handleReset={handleReset}
        />
      {isLoadingEndorsementPayment ? (
        <DefaultSpinner />
      ) : (
        !isPaymentSuccess && (
          <div className="endorement_container">
            <div className="container-main">
              <div className="left-card-main d-flex flex-column">
                <SelectPolicyCard
                  onPolicySelect={handlePolicySelect}
                  selectedPolicy={selectedPolicyNumber}
                  allPolicy={allPolicy}
                />

                {selectedPolicyNumber && (
                  <div className="left-card walaa-regular-400">
                  <div className="header walaa-medium-500">
                    <div className="header-body">
                      {travelData?.select_endorsement}
                    </div>
                  </div>
                  <div className="header-border"></div>
                  <div className="body">
                    <div className="radio-btns-cards walaa-medium-500">
                      {cardData.map((card, index) => (
                        <RadioCard
                          key={index}
                          imgSrc={card.imgSrc}
                          label={card.label}
                          checked={card.checked}
                          onChange={card.onChange}
                        />
                      ))}
                    </div>
                    {/* TODO : It may need it for latar use */}
                    {/* {isNudgeVisible && (
                      <div className="informative-container">
                        <div className="logo">
                          <img src={Car_Swap} />
                        </div>
                        <div className="informative-content">
                          <div className="informative-content-header walaa-medium-500">
                            {languageData?.informative_nudge_for_endo}
                          </div>
                          <div className="content walaa-regular-400">
                            {languageData?.your_motor_current_market}
                          </div>
                        </div>
                      </div>
                    )} */}
                  </div>
                </div>
                )}

                
                {manage && (
                   
                  <ExtendTravelPeriod   
                  travelData={travelData}  
                  cardData={cardData} 
                  languageData={languageData} />  

                )}
                {benefit && (
                   <> benifit </>
                )}
                {(isPeriodAdded || isAnyBenefitSelected) && ( 
                  <div className="consent-footer">
                    <div className="consent">
                      <TermsAndConditionsModal
                        handleState={setIsTCAccepted}
                        isTCAccepted={isTCAccepted}
                      />
                    </div>
                  </div>
                )}

               
              </div>

              <div className="right-card-container">
                {selectedPolicyNumber && (
                  <PolicyCard
                    policyNumber={selectedPolicyNumber}
                    startDate={policyDetails?.startDate}
                    expiryDate={policyDetails?.expiryDate}
                    idvValue={
                      policyDetails?.idv
                        ? `${languageData?.sar} ${getPriceFormat(
                            parseInt(policyDetails?.idv)
                          )}`
                        : `${languageData?.not_available}`
                    }
                    coverageName={languageData?.comprehensive}
                    startDateTitle={languageData?.start_date}
                    expiryDateTitle={languageData?.expiry_date}
                    policyNo={languageData?.policy_no}
                    idvTitle={languageData?.sum_insured} 
                    nationalId={languageData?.national_id}
                    policyHolder={languageData?.policy_holder}
                    prodCode={policyDetails?.prodCode}
                    insurerName={policyDetails?.insurerName}
                    nationalID={policyDetails?.nationalID}  

                  />
                )}

                {benefit && isAnyBenefitSelected && (
                  <OrderSummaryCard
                    languageData={languageData}
                    addBenefitData={addBenefitData}
                    subtotal={subtotal}
                    vatAmount={vatAmount}
                    totalAmount={totalAmount}
                  />
                )}

                {manage && isPeriodAdded && (
                  <OrderSummaryCard
                    languageData={languageData}
                    addBenefitData={driverSummaryData}
                    subtotal={driverSubtotal}
                    vatAmount={driverVatAmount}
                    totalAmount={driverTotalAmount}
                  />
                )}


                <DidYouKnowCard
                 did_you_know_content={travelData?.did_you_know_content}
                 did_you_know_text={travelData?.did_you_know_text}
                  />
              </div>
            </div>

            <FooterPayment
              handlePayment={handlePayment}
              isAnyBenefitSelected={isAnyBenefitSelected}
              isEnable={isTCAccepted}
              navigateTo={navigateTo}
              selectedPolicyNumber={selectedPolicyNumber}
              setSelectedPolicyNumber={setSelectedPolicyNumber}
            />

             
          </div>
        )
      )}
      {isPaymentSuccess && <Success status={true} data={policyDetail} />}
    </React.Fragment>
  );
}

export default Endorsement;
