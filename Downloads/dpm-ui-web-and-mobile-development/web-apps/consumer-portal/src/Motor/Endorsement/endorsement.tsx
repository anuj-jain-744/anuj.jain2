import "./endorsement.scss";
import React, { useCallback, useEffect, useState } from "react";
import ThemeButton from "./sharedComponent/ThemeButton";
import Nissan from "assets/Endorsement/Nissan.svg";
import Line from "assets/Endorsement/Line.svg";
import Car_Icon from "assets/Endorsement/Car_Icon.svg";
import ManageDriver from "assets/Endorsement/manage-drivers.png";
import ChangeVehicle from "assets/Endorsement/change-vehicle-information.png";
import AddOns from "assets/Endorsement/add-ons.png";
import Car_Swap from "assets/Endorsement/Car_Swap.svg";
import ThemeRadioCheckbox from "./sharedComponent/ThemeRadioCheckbox";
import { Accordion, Card, useAccordionButton } from "react-bootstrap";
import ChangeVehicleInformation from "./ChangeVehicleInformation";
import PolicyCard from "../Policy-services/PoliciesCancellation/sharedComponent/PolicyCard";
import { callAPI, useApiCall } from "@dpm/shared-module";
import DidYouKnowCard from "Motor/DidYouKnowCard/DidYouKnowCard";
import { useReviewPolicy } from "Motor/Policy-services/PolicyDashboard/hooks/useReviewPolicy";
import TermsAndConditionsModal from "./TermsAndConditionModel";
import { ManageDrivers } from "./ManageDrivers";
import { getPriceFormat } from "utils/getPriceFormat";
import usePolicyData from "Motor/Policy-services/PolicyDashboard/hooks/usePolicyData";
import OrderSummaryCard from "components/OrderSummaryCard/OrderSummaryCard";
import FooterPayment from "components/FooterPayment/FooterPayment";
import { PaymentUrl } from "./../../constant";
import {
  VITE_CONTENT_BASE_URI,
  PORTAL,
  INTERNAL_SERVER_ERROR,
  SOMETHING_WENT_WRONG,
  JAVA_API_ROUTES,
  ENDORSEMENT_TYPE,
} from "../../constant";
import { LanguageData } from "types/languageData";
import {
  AddBenefitprops,
  PayloadAddBenefit,
  ResponseAddBenefit,
} from "types/AddBenefit";
import { OTPWrapper } from "components/OTPValidation/OtpWrapper";
import { AddDriverProps, NewDriverProps } from "types/endorsement";
import { formatDateYYYYMMDD } from "utils/formatDate";
import { AlertBox } from "components/AlertBox";
import { convertDriverData, getTotalSubTotal } from "../../pages/payment-insurance/convertPayload";
import { PremiumDriverProps } from "components/PaymentOptions/types/providerPayment";

interface EndroseMentProps {
  policyDetailObj: {
    policyNo: string;
    productCode: string;
  };
  navigateTo?: (url: string) => void;
  allPolicy?: string[];
}

function Endorsement({
  policyDetailObj,
  navigateTo,
}: Readonly<EndroseMentProps>) {
  const [manage, setManage] = useState(false);
  const [vehicle, setVehicle] = useState(false);
  const [benefit, setBenefit] = useState(false);
  const [isRadioChecked, setIsRadioChecked] = useState<boolean>(true);
  const [languageData, setLanguageData] = useState<LanguageData>();
  const [callGenerateOtp, setCallGenerateOtp] = useState<boolean>(false);
  const [addBenefitData, setAddBenefitData] = useState<AddBenefitprops[]>([]);
  const [addDriverData, setAddDriverData] = useState<AddDriverProps[]>([]);
  const [apiErrorMessage, setApiErrorMessage] = useState({
    title: "",
    description: "",
  });
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);

  const [selectedPolicyNumber, setSelectedPolicyNumber] = useState<
    string | undefined
  >(policyDetailObj?.policyNo);

  const {
    makeApiCall: makeAddDriverCall,
    data: endoDriverData,
    errors: endoDriverErrors,
  } = useApiCall(4, "/AddDriver", "post");
  const { makeApiCall: saveRedisData } = useApiCall(
    6,
    `${JAVA_API_ROUTES.redisSetValue}`,
    "post"
  );
  const {
    makeApiCall: makeAddBenefitApiCall,
    data: benefitData,
    errors: endoBenefitErrors,
  } = useApiCall<ResponseAddBenefit, PayloadAddBenefit>(
    4,
    "/AddBenefit",
    "post"
  );

  const { makeApiCall, data } = useReviewPolicy({
    PolicyNo: selectedPolicyNumber!,
    Product: policyDetailObj?.productCode,
  });
  const [isTCAccepted, setIsTCAccepted] = useState(false);

  const [newDriverArray, setNewDriverArray] = useState<NewDriverProps[]>([]);

  const policyDataDetail = usePolicyData(data, null);

  useEffect(() => {
    if (selectedPolicyNumber) {
      const fetchData = async () => {
        await makeApiCall();
      };
      fetchData();
    }
  }, [makeApiCall, selectedPolicyNumber]);

  useEffect(() => {
    if (selectedPolicyNumber) {
      makeAddBenefitApiCall({
        policyNo: selectedPolicyNumber,
      });
    }
  }, [selectedPolicyNumber, makeAddBenefitApiCall]);

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

  const policyDetails = policyDataDetail?.policyDetails ?? undefined;

  useEffect(() => {
    if (benefitData) {
      const benefits = benefitData?.model?.vehicles[0]?.benefits;
      setAddBenefitData(
        benefits?.map((benefit: AddBenefitprops) => {
          return {
            ...benefit,
            isSelected: false,
          };
        })
      );
    }
  }, [benefitData]);
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

  const getRedisData = useCallback(async (redisKey: string, benefitIds:AddBenefitprops[], endoDriverData?:PremiumDriverProps) => {
    const data = {
      driversPremiumData : benefit ? [] : addDriverData.map((driverData) => {
        const data = newDriverArray?.find(driver => driver.driverID === driverData?.driver?.driverID) 
        return {
          driver :{
            driverID: driverData?.driver?.driverID,
            driverName: driverData?.driver?.driverName,
            driverNameArabic: driverData?.driver?.driverNameArabic,
            relation: data?.relation,
            gender: driverData?.driver?.gender,
          },
          taxableAmount: driverData?.taxableAmount,
        }
      }),
      policyNo: selectedPolicyNumber,
      vehicleSequenceNo: policyData?.vehicleSequenceNo,
      productType: 1,
      benefitsPremiumData: benefit ? benefitIds: [],
      totalAmount: benefit ? getTotalSubTotal(benefitIds): endoDriverData ? convertDriverData(addDriverData, endoDriverData): {},
      nationalId: sessionStorage.getItem("iqmaId"),
    }
    await saveRedisData({ key: redisKey, value: JSON.stringify(data) });
    const encryptedQuoteNumber = btoa(`${redisKey}_01`);
    navigateTo && navigateTo(PaymentUrl + encryptedQuoteNumber);

    return data;
  },
  [
    addDriverData,
    benefit,
    navigateTo,
    policyData?.vehicleSequenceNo,
    saveRedisData,
    selectedPolicyNumber,
  ]
  );

  const handlePayment = async () => {
    setCallGenerateOtp(false);
    // const driverIds = newDriverArray?.map((driver) => ({ driverID: driver.driverID }));
    const redisKey = benefitData?.endoRequestReferenceNo;
    const benefitIds = addBenefitData?.filter((val: AddBenefitprops) => {
      return val.isSelected === true;
    });
    const driverIds = addDriverData;

    if (benefit && benefitIds && benefitIds.length > 0) {
      getRedisData(redisKey, benefitIds);
    } else if (manage && driverIds && driverIds.length > 0) {
      const driverData = addDriverData.map((val: AddDriverProps) => val.driver);
      const payload = {
        apiSource: PORTAL,
        policyNo: selectedPolicyNumber,
        endoEffectiveDate: formatDateYYYYMMDD(),
        vehicles: [
          {
            drivers: driverData,
          },
        ],
      };
      await makeAddDriverCall(payload);
    }
  };

  const languageOTPData = {
    otp_info_message: languageData?.enter_otp_code ?? "",
    your_otp_will_expire: languageData?.your_otp_will_expire ?? "",
    confirm_otp: languageData?.confirm_otp ?? "",
    resend_otp: languageData?.resend_otp ?? "",
    enter_otp_code: languageData?.enter_otp_code ?? "",
  };

  const fetchData = async () => {
    const response: { config: LanguageData[] } = await callAPI(
      "get",
      VITE_CONTENT_BASE_URI + "en/api/consumerportal-config"
    );
    setLanguageData(response.config[0]);
  };

  function ContextAwareToggle() {
    const decoratedOnClick = useAccordionButton("", async () => {
      setIsRadioChecked((prev: boolean) => !prev);
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
        dataTestId="test-benefit"
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
      label: languageData?.manage_vehicles,
      checked: vehicle,
      onChange: handleVehicleInfo,
    },
    {
      imgSrc: AddOns,
      label: languageData?.add_benefits,
      checked: benefit,
      onChange: handleExtraBenefit,
    },
  ];

  const RadioCard = ({
    imgSrc,
    label,
    checked,
    onChange,
  }: {
    imgSrc: string;
    label: string;
    checked: boolean;
    onChange: () => void;
  }) => (
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
          dataTestId={`test-${label}`}
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

  const handleBenefitToggle = (index: number) => {
    const updatedBenefits = [...addBenefitData];
    updatedBenefits[index].isSelected = !updatedBenefits[index].isSelected;
    setAddBenefitData(updatedBenefits);
  };

  const selectedBenefits: AddBenefitprops[] = addBenefitData?.filter(
    (benefit: AddBenefitprops) => benefit.isSelected
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
  if (benefit) {
    isAnyBenefitSelected = addBenefitData?.some(
      (benefit: AddBenefitprops) => benefit.isSelected
    );
  } else if (manage) {
    isAnyBenefitSelected = newDriverArray.length > 0 ? true : false;
  }

  // Section for Manage driver begins here.
  const [isDriverAdded, setisDriverAdded] = useState<boolean>(false);

  const [driverSubtotal, setDriverSubtotal] = useState<number>(0);
  const [driverVatAmount, setDriverVatAmount] = useState<number>(0);
  const [driverTotalAmount, setDriverTotalAmount] = useState<number>(0);
  const [driverSummaryData, setDriverSummaryData] = useState<{
    benefits: AddBenefitprops[];
  } | null>(null);

  useEffect(() => {
    let feeAmount = 0;
    let totalAmount = 0;
    let vatAmount = 0;
    if (addDriverData.length > 0) {
      setisDriverAdded(true);
      addDriverData.map(function (item) {
        feeAmount += item.taxableAmount;
        totalAmount += item.totalAmount;
        vatAmount += item.vatAmount;
      });
      setDriverSubtotal(feeAmount);
      setDriverVatAmount(vatAmount);
      setDriverTotalAmount(totalAmount);
      const summaryData: {
        benefits: AddBenefitprops[];
      } = {
        benefits: [],
      };

      summaryData["benefits"] = newDriverArray.map((d) => {
        const x: AddBenefitprops = {
          isSelected: true,
          benefitNameAr: d?.driverNameArabic,
          benefitNameEn: d?.driverName,
          benefitPrice: d?.premium,
          benefitCategory: "",
          benefitCode: "",
          benefitId: "",
          effectiveDate: "",
          expiryDate: "",
          vatAmount: 0,
        };
        return x;
      });
      setDriverSummaryData(summaryData);
    } else {
      setisDriverAdded(false);
    }
  }, [addDriverData, newDriverArray]);

  useEffect(() => {
    if (endoDriverData) {
      const redisKey = endoDriverData?.endoRequestReferenceNo;
      getRedisData(redisKey, [], endoDriverData)
    }
  }, [endoDriverData, getRedisData]);

  useEffect(() => {
    if (endoDriverErrors) {
      setApiErrorMessage({
        title: endoDriverErrors?.name || INTERNAL_SERVER_ERROR,
        description:
          endoDriverErrors.messages?.message_en ?? SOMETHING_WENT_WRONG,
      });
      setShowAlertModal(true);
    }
  }, [endoDriverErrors]);

  useEffect(() => {
    if (endoBenefitErrors) {
      setApiErrorMessage({
        title: endoBenefitErrors?.name || INTERNAL_SERVER_ERROR,
        description:
          endoBenefitErrors.messages?.message_en ?? SOMETHING_WENT_WRONG,
      });
      setShowAlertModal(true);
    }
  }, [endoBenefitErrors]);
  const [showAllBenefits, setShowAllBenefits] = useState(false); // State to toggle "Show More" and "Show Less"

  // Function to toggle the state
  const toggleShowBenefits = () => {
    setShowAllBenefits((prev) => !prev);
  };
  return (
    <React.Fragment>
      <AlertBox
        title={apiErrorMessage.title}
        description={apiErrorMessage.description}
        showAlertModal={showAlertModal}
        setShowAlertModal={() => setShowAlertModal(false)}
      />
      <OTPWrapper
        generateOtpUrl={"GenerateOtp"}
        validateOtpUrl={"ValidateOtp"}
        languageData={languageOTPData}
        handleSuccessValidation={() => {
          handlePayment();
        }}
        payload={{ mobileNumber: mobile }}
        callGenerateOtp={callGenerateOtp}
      />

      <div>
        <div className="container-main">
          <div className="left-card-main d-flex flex-column">
            {selectedPolicyNumber && (
              <div className="left-card walaa-regular-400">
                <div className="header walaa-medium-500">
                  <div className="header-body">{languageData?.endorsement}</div>
                </div>
                <div className="header-border"></div>
                <div className="body">
                  <div className="radio-btns-cards walaa-medium-500">
                    {cardData.map((card, index) => (
                      <>
                        {card.label && (
                          <RadioCard
                            key={index}
                            imgSrc={card.imgSrc}
                            label={card.label}
                            checked={card.checked}
                            onChange={card.onChange}
                          />
                        )}
                      </>
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

            {manage && languageData && selectedPolicyNumber && (
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
                    <Accordion defaultActiveKey="0" className="main-accordion">
                      <Card
                        className={
                          isRadioChecked ? "card-accordion-1" : "card-accordion"
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
                              <ContextAwareToggle />
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
                      {!Array.isArray(addBenefitData) ||
                        (addBenefitData?.length === 0 && (
                          <div>
                            {languageData?.no_benefits_endorsement ?? ""}
                          </div>
                        ))}
                      <Accordion
                        defaultActiveKey="0"
                        className="main-accordion"
                      >
                        <Accordion.Collapse eventKey="0">
                          <Card.Body className="benefit-cards">
                            {(showAllBenefits
                              ? addBenefitData
                              : addBenefitData.slice(0, 2)
                            ).map((benefit: AddBenefitprops, index: number) => (
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
                                    {languageData?.emergency_support_for}
                                  </div>
                                </div>
                                <hr className="horizontal-line" />
                                <div className="card-foot walaa-medium-500">
                                  <div className="price">
                                    {languageData?.sar}{" "}
                                    {benefit.benefitPrice?.toFixed(2)}
                                  </div>
                                  <div>
                                    {(languageData?.remove || languageData?.add) && <ThemeButton
                                      classes={
                                        benefit.isSelected
                                          ? "icon-btn walaa-medium-500"
                                          : "link-btn walaa-medium-500"
                                      }
                                      isDisabled={false}
                                      dataTestId="benefitAdded"
                                      title={
                                        benefit.isSelected
                                          ? languageData?.remove
                                          : languageData?.add
                                      }
                                      variant="link"
                                      onClickhandler={() =>
                                        handleBenefitToggle(index)
                                      }
                                    />}
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </Card.Body>
                        </Accordion.Collapse>
                      </Accordion>
                      {addBenefitData.length > 2 && (
                        <>
                        <button
                          className="show-more-btn walaa-medium-500"
                          onClick={toggleShowBenefits}
                        >
                          {showAllBenefits
                            ? `${languageData?.show_less_benefits ?? "Show Less Benefits"}`
                            : `${"Show More Benefits"} (${
                                addBenefitData.length - 2
                              })`}
                        </button>
                        </>
                      )}
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
                coverageName={policyDetails?.coverageName}
                startDateTitle={languageData?.start_date}
                expiryDateTitle={languageData?.expiry_date}
                policyNo={languageData?.policy_no}
                idvTitle={languageData?.sum_insured}
                prodCode={policyDetailObj?.productCode}
              />
            )}

            {benefit && isAnyBenefitSelected && languageData && (
              <OrderSummaryCard
                endorsementType={ENDORSEMENT_TYPE.ADD_BENEFITS}
                languageData={languageData}
                addBenefitData={{ benefits: addBenefitData }}
                subtotal={subtotal}
                vatAmount={vatAmount}
                totalAmount={totalAmount}
              />
            )}

            {driverSummaryData && manage && isDriverAdded && languageData && (
              <OrderSummaryCard
                endorsementType={ENDORSEMENT_TYPE.ADD_DRIVER}
                languageData={languageData}
                addBenefitData={driverSummaryData}
                subtotal={driverSubtotal}
                vatAmount={driverVatAmount}
                totalAmount={driverTotalAmount}
              />
            )}

            <div className="didyouknow">
              {languageData && (
                <DidYouKnowCard
                  did_you_know_content={languageData?.did_you_know_content}
                  did_you_know_text={languageData?.did_you_know_text}
                />
              )}
            </div>
          </div>
        </div>

        <FooterPayment
          handlePayment={() => setCallGenerateOtp(true)}
          isAnyBenefitSelected={isAnyBenefitSelected}
          isEnable={isTCAccepted}
          navigateTo={navigateTo}
        />
      </div>
    </React.Fragment>
  );
}

export default Endorsement;
