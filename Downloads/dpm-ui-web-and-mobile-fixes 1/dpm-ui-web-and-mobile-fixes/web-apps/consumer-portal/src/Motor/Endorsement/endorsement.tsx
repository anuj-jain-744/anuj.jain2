import "./endorsement.scss";
import React, { useContext, useEffect, useMemo, useState } from "react";
import ThemeButton from "./sharedComponent/ThemeButton";
import Nissan from "assets/Endorsement/Nissan.svg";
import Line from "assets/Endorsement/Line.svg";
import Car_Icon from "assets/Endorsement/Car_Icon.svg";
import ManageDriver from "assets/Endorsement/manage-drivers.png";
import ChangeVehicle from "assets/Endorsement/change-vehicle-information.png";
import AddOns from "assets/Endorsement/add-ons.png";
import Car_Swap from "assets/Endorsement/Car_Swap.svg";
import ThemeRadioCheckbox from "./sharedComponent/ThemeRadioCheckbox";
import {
  Accordion,
  AccordionContext,
  Card,
  useAccordionButton,
} from "react-bootstrap";
import { useEndorsementAddBenefitApi } from "./hook/useEndorsementAddBenefit";
import ChangeVehicleInformation from "./ChangeVehicleInformation";
import PolicyCard from "../Policy-services/PolicyCancellation/sharedComponent/PolicyCard";
import { callAPI, getRandomString } from "@dpm/shared-module";
import Success from "./../../Motor/SuccessPage";
import DidYouKnowCard from "./../../Motor/DidYouKnowCard/DidYouKnowCard";
import { useReviewPolicy } from "./../../Motor/Policy-services/PolicyDashboard/hooks/useReviewPolicy";
import TermsAndConditionsModal from "./TermsAndConditionModel";
import { ManageDrivers } from "./ManageDrivers";
import { getPriceFormat } from "utils/getPriceFormat";
import usePolicyData from "Motor/Policy-services/PolicyDashboard/hooks/usePolicyData";
import OrderSummaryCard from "components/OrderSummaryCard/OrderSummaryCard";
import FooterPayment from "components/FooterPayment/FooterPayment";
import { useEndorsementPayment } from "./hook/useEndorsementPayment";
import { useEndoAddDriverPayment } from "./hook/useEndoAddDriverPayment";
import DefaultSpinner from "components/Spinner";
import {
  VITE_CONTENT_BASE_URI,
  VITE_BACKEND_UTILITY_URL
} from "../../constant";
import OTPValidation from "components/OTPValidation";
import { AlertBox } from "components/AlertBox";
import { LanguageData } from "types/languageData";
import { getPlanName } from "utils/policyDetails";

interface EndroseMentProps {
  policyDetailObj: any;
  navigateTo?: (url: string) => void;
  allPolicy?: string[];
}

function Endorsement({ policyDetailObj, navigateTo, allPolicy }: Readonly<EndroseMentProps>) {
  const [manage, setManage] = useState(false);
  const [vehicle, setVehicle] = useState(false);
  const [benefit, setBenefit] = useState(false);
  const [isRadioChecked, setIsRadioChecked] = useState(true);
  const [languageData, setLanguageData] = useState<LanguageData>();
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [selectedPolicyNumber, setSelectedPolicyNumber] = useState<
    string | undefined
  >(policyDetailObj?.policyNo);
  const { makeAddBenefitApiCall, benefitData } = useEndorsementAddBenefitApi({
    PolicyNo: selectedPolicyNumber!,
  });
  const { makeApiCall, data } = useReviewPolicy({
    PolicyNo: selectedPolicyNumber!,
    Product: policyDetailObj?.productCode
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
    sessionStorage.removeItem("selectedPolicyNumber");

    const storedPolicyNumber = sessionStorage.getItem("selectedPolicyNumber");
    if (storedPolicyNumber) {
      setSelectedPolicyNumber(storedPolicyNumber);
    }

    const handleBeforeUnload = () => {
      sessionStorage.removeItem("selectedPolicyNumber");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const policyData = data?.policyLob[0]?.policyRisk[0];
  const mobile = data?.policyCustomer[0]?.mobile;

  const vehicleModel = policyData?.vehicleModelText;
  const plateNo = policyData?.plateNo;
  const manufactureYear = policyData?.manufactureYear;
  const vehicleColour = policyData?.vehicleColour;
  const color = vehicleColour == 0 ? "Black" : "White";

  const chassisNo = policyData?.chassisNo;
  const vehSeqNo = policyData?.vehicleSequenceNo;

  const addBenefitData = benefitData?.data?.model?.vehicles[0];

  const policyDetails = policyDataDetail?.policyDetails ?? undefined;

  useEffect(() => {
    fetchData();
  }, []);

  const handleManageDrivers = () => {
    setManage(true);
    setVehicle(false);
    setBenefit(false);
  };

  const handleVehicleInfo = () => {
    setVehicle(true);
    setBenefit(false);
    setManage(false);
  };

  const handleExtraBenefit = async () => {
    setBenefit(true);
    setManage(false);
    setVehicle(false);
  };

  const getRandomNumber = getRandomString(3, true);
  const refNo = "EECRN-24-" + getRandomNumber;
  const seqNo = (policyData?.vehicleSequenceNo)?policyData?.vehicleSequenceNo:"";

  const { makeAddDriverPaymentApiCall } =
    useEndoAddDriverPayment({ PolicyNo: selectedPolicyNumber!,
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
      /*
        added temporary fix.
        response code should be a number but api returns string.
        change the comparison operator to strict equality operator after api fix.
      */
      if (responseData?.code == 1 && responseData?.message === "SUCCESS") {
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

  const fetchData = async () => {
    const response : {config: LanguageData[]}= await callAPI(
      "get",
      VITE_CONTENT_BASE_URI + "en/api/consumerportal-config"
    );
    setLanguageData(response.config[0]);
  };

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
      imgSrc: ManageDriver,
      label: languageData?.manage_drivers,
      checked: manage,
      onChange: handleManageDrivers,
    },
    {
      imgSrc: ChangeVehicle,
      label: "Manage Vehicles",
      checked: vehicle,
      onChange: handleVehicleInfo,
    },
    {
      imgSrc: AddOns,
      label: "Add Benefits",
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

  useEffect(() => {
    sessionStorage.removeItem("selectedPolicyNumber");

    const storedPolicyNumber = sessionStorage.getItem("selectedPolicyNumber");
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
  const [isDriverAdded, setisDriverAdded] = useState<boolean>(false);
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
      setisDriverAdded(true);
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
      setisDriverAdded(false);
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
  const coverageName = getPlanName(policyDataDetail);

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
          <div>
            <div className="container-main">
              <div className="left-card-main d-flex flex-column">
                {selectedPolicyNumber && (
                  <div className="left-card walaa-regular-400">
                  <div className="header walaa-medium-500">
                    <div className="header-body">
                      {languageData?.endorsement}
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
                    {benefit && (
                      <div className="informative-container">
                        <div className="logo">
                          <img src={Car_Swap} />
                        </div>
                        <div className="informative-content">
                          <div className="informative-content-header walaa-medium-500">
                            {languageData?.get_latest_extra_benefits_title}
                          </div>
                          <div className="content walaa-regular-400">
                            {languageData?.get_latest_extra_benefits_desc}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                )}

                
                {manage && (
                  <ManageDrivers
                    languageData={languageData}
                    policyData={policyData}
                    policyNumber={selectedPolicyNumber}
                    newDriverArray={newDriverArray}
                    setNewDriverArray={setNewDriverArray}
                    addDriverData={addDriverData}
                    setAddDriverData={setAddDriverData}
                  />
                )}
                
                {benefit && (
                  <>
                    <div className="benefit-container">
                      <div className="header walaa-medium-500">
                        <div className="header-body">
                          {languageData?.select_vehicle_to_add_bene}
                        </div>
                      </div>
                      <div className="header-border"></div>

                      <div className="body-addons">
                        <Accordion
                          defaultActiveKey="0"
                          className="main-accordion"
                        >
                          <Card
                            className={
                              isRadioChecked
                                ? "card-accordion-1"
                                : "card-accordion"
                            }
                          >
                            <Card.Header className="card-accordion-header">
                              <div className="card-accordion-before-collapse">
                                <div className="logo-container">
                                  <div className="logo">
                                    <img src={Nissan} />
                                  </div>
                                  <div className="content">
                                    <div className="content-vehicle walaa-regular-400">
                                      {vehicleModel}
                                    </div>
                                    <div className="content-vehicle-number walaa-medium-500">
                                      {plateNo}
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <ContextAwareToggle
                                    eventKey="0"
                                    children={undefined}
                                    callback={undefined}
                                  ></ContextAwareToggle>
                                </div>
                              </div>
                            </Card.Header>
                            <Accordion.Collapse
                              eventKey="0"
                              className="card-accordion-after-expand"
                            >
                              <Card.Body className="accordion-expand-body">
                                <div className="detail">
                                  <div className="detail-type walaa-regular-400">
                                    {languageData?.number_plate}
                                  </div>
                                  <div className="detail-type-data walaa-medium-500">
                                    {plateNo}
                                  </div>
                                </div>

                                <img src={Line} />
                                <div className="detail">
                                  <div className="detail-type walaa-regular-400">
                                    {languageData?.vehicle_sequence}
                                  </div>
                                  <div className="detail-type-data walaa-medium-500">
                                    {vehSeqNo}
                                  </div>
                                </div>
                                <img src={Line} />
                                <div className="detail">
                                  <div className="detail-type walaa-regular-400">
                                    {languageData?.registration_year_label}
                                  </div>
                                  <div className="detail-type-data walaa-medium-500">
                                    {manufactureYear}
                                  </div>
                                </div>
                                <img src={Line} />
                                <div className="detail">
                                  <div className="detail-type walaa-regular-400">
                                    {languageData?.colour}
                                  </div>
                                  <div className="detail-type-data walaa-medium-500">
                                    {color}
                                  </div>
                                </div>
                                <img src={Line} />
                                <div className="detail">
                                  <div className="detail-type walaa-regular-400">
                                    {languageData?.chassis_no}
                                  </div>
                                  <div className="detail-type-data walaa-medium-500">
                                    {chassisNo}
                                  </div>
                                </div>
                              </Card.Body>
                            </Accordion.Collapse>
                          </Card>
                        </Accordion>
                      </div>
                    </div>
                    <div></div>
                    {isRadioChecked && (
                      <div className="benefit-container">
                        <div className="header walaa-medium-500">
                          <div className="header-body">
                            {languageData?.add_benefits}
                          </div>
                        </div>
                        <div className="header-border"></div>

                        <div className="body-addons">
                          <Accordion
                            defaultActiveKey="0"
                            className="main-accordion"
                          >
                            <Accordion.Collapse eventKey="0">
                              <Card.Body className="benefit-cards">
                                {addBenefitData?.benefits?.map(
                                  (benefit, index) => (
                                    <Card
                                      key={index}
                                      className={
                                        benefit.isSelected
                                          ? "card-checked"
                                          : "card-unchecked"
                                      }
                                    >
                                      <div className="body-card">
                                        <div className="title-card">
                                          <div className="img-card">
                                            <img
                                              src={Car_Icon}
                                              alt={benefit.benefitNameEn}
                                            />
                                          </div>
                                          <div className="card-title-header walaa-medium-500">
                                            {benefit.benefitNameEn}
                                          </div>
                                        </div>
                                        <div className="body-content walaa-regular-400">
                                          {languageData?.[benefit.description]}
                                          {languageData?.emergency_support_for}
                                        </div>
                                      </div>
                                      <hr className="horizontal-line" />
                                      <div className="card-foot walaa-medium-500">
                                        <div className="price">
                                        {languageData?.sar} {benefit.benefitPrice?.toFixed(2)}
                                        </div>
                                        <div>
                                          <ThemeButton
                                            classes={
                                              benefit.isSelected
                                                ? "icon-btn walaa-medium-500"
                                                : "link-btn walaa-medium-500"
                                            }
                                            isDisabled={false}
                                            title={
                                              benefit.isSelected
                                                ? "Remove"
                                                : languageData?.add
                                            }
                                            variant="link"
                                            onClickhandler={() =>
                                              handleBenefitToggle(
                                                benefit,
                                                index
                                              )
                                            }
                                          />
                                        </div>
                                      </div>
                                    </Card>
                                  )
                                )}
                              </Card.Body>
                            </Accordion.Collapse>
                          </Accordion>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {(isDriverAdded || isAnyBenefitSelected) && (
                  <div className="consent-footer">
                    <div className="consent">
                      <TermsAndConditionsModal
                        handleState={setIsTCAccepted}
                        isTCAccepted={isTCAccepted}
                      />
                    </div>
                  </div>
                )}

                {vehicle && <ChangeVehicleInformation />}
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
                    coverageName={coverageName}
                    startDateTitle={languageData?.start_date}
                    expiryDateTitle={languageData?.expiry_date}
                    policyNo={languageData?.policy_no}
                    idvTitle={languageData?.sum_insured}
                    prodCode={policyDetailObj?.productCode}
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

                {manage && isDriverAdded && (
                  <OrderSummaryCard
                    languageData={languageData}
                    addBenefitData={driverSummaryData}
                    subtotal={driverSubtotal}
                    vatAmount={driverVatAmount}
                    totalAmount={driverTotalAmount}
                  />
                )}

                <div className="didyouknow">
                  <DidYouKnowCard did_you_know_content={languageData?.did_you_know_content} 
              did_you_know_text={languageData?.did_you_know_text}  />
                </div>
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

            {/* {vehicle && <ChangeVehicleInformation />} */}
          </div>
        )
      )}
      {isPaymentSuccess &&<Success
          status={true}
          data={{
            isAddon: true,
            ...policyDetail,
            policyDataDetail,
            benefits: { drivers: newDriverArray },
          }}
        />}
    </React.Fragment>
  );
}

export default Endorsement;
