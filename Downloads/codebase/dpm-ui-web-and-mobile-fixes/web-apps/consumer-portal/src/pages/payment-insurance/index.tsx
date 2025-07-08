import BuyProductHeading from "components/BuyProductHeading";
import "./index.scss";
import { useSelector } from "react-redux";
import {
  useApiCall,
  getAmountText,
  RootState,
} from "@dpm/shared-module";
import { useEffect, useMemo, useState, useRef } from "react";
import { LanguageData } from "types/languageData";
import PaymentOptions from "components/PaymentOptions";
import Amex from "assets/Payment/amex.svg";
import Madda from "assets/Payment/mada.svg";
import Master from "assets/Payment/master.svg";
import StcPay from "assets/Payment/stc-pay.svg";
import UrPay from "assets/Payment/ur-pay.svg";
import Tabby from "assets/Payment/tabby.svg";
import Visa from "assets/Payment/visa.svg";
import Sadad from "assets/Payment/sadad.svg";
import Tamara from "assets/Payment/tamara.svg";
import QuoteCreation from "components/QuoteCreation";
import { useLocation, useNavigate } from "react-router-dom";
import PremiumBreakUpUi from "components/PremiumBreakUp/premiumBreakUpUi";
import TravelPremiumBreakupUi from "components/TravelPremiumBreakupUi";
import { PromoCodeResponse } from "components/PremiumBreakUp";
import SafeSecure from "components/SafeSecure";
import { CmsPayment } from "components/PaymentOptions/types/cmsPayment";
import { ViewQuotePayload, ViewQuoteResponse } from "types/viewQuote";
import { processTransactionId } from "utils/paymentUtils";
import { AlertBox } from "components/AlertBox";
import {
  PRODUCTSAPI,
  TRAVEL_POLICY_TYPE,
  TRAVEL_TYPE,
  PRODUCTCODE_TRAVEL,
  PRODUCTCODE_HOME,
  ENDORSEMENT_TYPE,
  MOTORCOMP,
  DEFAULT_HOME_COVERAGE_CODE,
} from "constant";
import {
  converEndrosmentData,
  convertQuoteData,
  convertDriverData,
  getTotalSubTotal,
} from "./convertPayload";
import OrderSummaryCard from "components/OrderSummaryCard/OrderSummaryCard";
import { PremiumBreakdownProps } from "types/AddBenefit";
import { JAVA_API_ROUTES } from "../../constant";
import { RedisDataResponse } from "components/PaymentOptions/types/providerPayment";
import PanelRight from "components/PanelRight";
import IdleTimeout from "utils/idleTimeOut";
import ErrorDialogBox from "components/ErrorDialogBox/ErrorDialogBox";
import LoadingTimer from "assets/common/loading_timer.gif";
import { sessionTimer } from "constant";
import AlertPopUp from "pages/personalDesktop/MyPolicies/AlertPopUp/AlertPopUp";
export interface PaymentOptionProp {
  label: string;
  img: string[];
  value: string;
  disabled: boolean;
}

interface PaymentLangProps {
  config: CmsPayment;
}

interface CmsLanguageProps {
  config: LanguageData[];
}

interface PaymentInsuranceProps {
  transactionId?: string;
  navigateTo?: (url: string, navigate: any) => void;
}
export default function PaymentInsurance({
  transactionId,
  navigateTo,
}: Readonly<PaymentInsuranceProps>) {
  const [paymentOptions, setPaymentOptions] = useState<PaymentOptionProp[]>([]);
  const [paymentData, setPaymentData] = useState<CmsPayment | null>(null);
  const [selectedPaymentOption, setSelectedPaymentOption] =
    useState<string>("debit");
  const [endoPremiumBreakDown, setEndoPremiumBreakDown] =
    useState<PremiumBreakdownProps | null>(null);
  const [selectedBenefits, setSelectedBenefits] = useState<
    { title: string; price: number; code: string }[]
  >([]);
  const processTransaction = processTransactionId(transactionId ?? "");
  const location = useLocation();
  const navigate = useNavigate();
  const propsData = location.state?.quoteData ?? {
    quoteNo: processTransaction?.quotationNo ?? "",
  };
  const productCode: string =
    location.state?.productCode ?? processTransaction?.productCode ?? "";
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [sessionTimeout, setSessionTimeout] = useState<boolean>(false);
  const [policyRisk, setPolicyRisk] = useState<[] | null>(null);
  const [travelPackageData, setTravelPackageData] = useState({});
  const [familyIndividual, setFamilyIndividual] = useState<string>("");
  const [typeOfCoverage, setTypeOfCoverage] = useState<string>("");

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      rightPanelRef.current &&
      !rightPanelRef.current.contains(event.target as Node)
    ) {
      setIsPanelOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);


  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isAuthenticated] = useSelector((state: RootState) => [
    state.auth.isAuthenticated,
  ]);
  const { makeApiCall: redisKeyCall, data: endrosmentData } = useApiCall<
    { key: string },
    undefined
  >(
    6,
    `${JAVA_API_ROUTES.redisGetValue}/${processTransaction.endrosmentNo}`,
    "get"
  );
  const { makeApiCall, data: paymentLang } = useApiCall<
    PaymentLangProps,
    unknown
  >(1, "payment-config", "get");

  const { makeApiCall: makePromoCodeConfig, data: ppromoCodeConfig } =
    useApiCall<PromoCodeResponse, unknown>(1, "promo-code-config", "get");

  const { makeApiCall: makeCmsApiCall, data: cmsLang } = useApiCall<
    CmsLanguageProps,
    unknown
  >(1, "consumerportal-config", "get");
  const { makeApiCall: makeCmsTravelApiCall, data: cmsTravelLang } = useApiCall<
    CmsLanguageProps,
    unknown
  >(1, "travel-config", "get");

  const productsInfo = PRODUCTSAPI[productCode] || {}; // get product APIs based on product code
  const { makeApiCall: makeApiCallQuote, data: quoteDataValue } = useApiCall<
    ViewQuoteResponse,
    ViewQuotePayload
  >(productsInfo?.viewQuoteNo, productsInfo?.viewQuoteAPI, "post");

  const endorsementType = useMemo(() => {
    if (endrosmentData?.benefitsPremiumData?.length > 0) {
      return ENDORSEMENT_TYPE.ADD_BENEFITS;
    }
    if (endrosmentData?.selectManagerDriver) {
      return ENDORSEMENT_TYPE.ADD_DRIVER;
    }
    return "";
  }, [
    endrosmentData?.benefitsPremiumData?.length,
    endrosmentData?.selectManagerDriver,
    ENDORSEMENT_TYPE,
  ]);

  const getCardOptionsData = (
    quoteDataValue: ViewQuoteResponse,
    endrosmentData: RedisDataResponse
  ) => {
    if (quoteDataValue)
      return convertQuoteData(quoteDataValue, propsData?.quoteNo);
    if (endrosmentData && processTransaction?.endrosmentNo)
      return converEndrosmentData(
        endrosmentData,
        processTransaction?.endrosmentNo
      );
    return null;
  };

  useEffect(() => {
    makeApiCall();
    makePromoCodeConfig();
    makeCmsApiCall();
    makeCmsTravelApiCall();
  }, []);

  useEffect(() => {
    if (propsData?.quoteNo) {
      const quoteData: { quotationNo: string; apiSource?: string } = {
        quotationNo: propsData?.quoteNo,
      };
      if (productCode === PRODUCTCODE_HOME) {
        // for HOME use cases
        quoteData["apiSource"] = "Portal";
      }
      makeApiCallQuote(quoteData);
    }
  }, [makeApiCallQuote, productCode, propsData?.quoteNo]);

  const getHighestPricedBenefits = (
    benefits: { benefitCode: string; benefitPrice: number }[]
  ) => {
    const benefitMap = new Map();

    benefits.forEach((benefit) => {
      if (
        !benefitMap.has(benefit.benefitCode) ||
        benefitMap.get(benefit.benefitCode).benefitPrice < benefit.benefitPrice
      ) {
        benefitMap.set(benefit.benefitCode, benefit);
      }
    });

    return Array.from(benefitMap.values());
  };

  useEffect(() => {
    if (quoteDataValue?.model?.policyLob?.[0]?.policyRisk?.[0]?.benefits) {
      const benefitData = getHighestPricedBenefits(
        quoteDataValue?.model?.policyLob?.[0]?.policyRisk?.[0]?.benefits
      );
      setSelectedBenefits(
        benefitData.map((benefit) => ({
          title: benefit.benefitNameEn,
          price: benefit.benefitPrice ?? 0,
          code: benefit.benefitCode,
        }))
      );
    }
    if (
      quoteDataValue?.model?.policyLob?.[0]?.policyRisk?.[0]?.policyCoverage
    ) {
      const benefitData =
        quoteDataValue?.model?.policyLob?.[0]?.policyRisk?.[0]?.policyCoverage;
      const benefits = [];
      for (const benefit of benefitData) {
        if (
          benefit?.premiumInfo?.finalPremium > 0 &&
          benefit?.coverageCode !== DEFAULT_HOME_COVERAGE_CODE
        ) {
          benefits.push({
            title: benefit.coverageName,
            price: benefit?.premiumInfo?.finalPremium ?? 0,
            code: benefit.coverageCode,
          });
        }
      }
      setSelectedBenefits(benefits);
    }
    if (
      quoteDataValue?.model?.policyLob?.[0]?.policyRisk &&
      productCode === PRODUCTCODE_TRAVEL
    ) {
      setPolicyRisk(quoteDataValue?.model?.policyLob?.[0]?.policyRisk);
    }

    if (
      quoteDataValue?.model?.policyLob?.length > 0 &&
      productCode === PRODUCTCODE_TRAVEL
    ) {
      setFamilyIndividual(
        TRAVEL_TYPE[quoteDataValue?.model?.policyLob?.[0]?.familyIndividual]
      );
      setTypeOfCoverage(
        TRAVEL_POLICY_TYPE[
        quoteDataValue?.model?.policyLob?.[0]?.typeOfCoverage
        ]
      );

      setTravelPackageData({
        ...travelPackageData,
        premiumInfo: quoteDataValue?.model?.policyBasic?.premiumInfo,
      });
    }
  }, [quoteDataValue]);

  const thankYouMessage = paymentLang?.config?.thankyou_msg?.replace(
    "<<dynamic>>",
    paymentData?.productCodeTitle[productCode] || ""
  );

  useEffect(() => {
    if (paymentLang) {
      const paymentData = paymentLang?.config;
      setPaymentData(paymentData);
      setPaymentOptions([
        {
          label: paymentData.field_pay_via_sadad,
          img: [Sadad],
          value: "sadad",
          disabled: false,
        },
        {
          label: paymentData.field_debit_credit_card,
          img: [Visa, Master, Amex, Madda],
          value: "debit",
          disabled: false,
        },
        {
          label: paymentData.field_monthly_instalment_option,
          img: [Tabby, Tamara],
          value: "monthly_options",
          disabled: true,
        },
        {
          label: "UR Pay",
          img: [UrPay],
          value: "ur_pay",
          disabled: false,
        },
        {
          label: "STC Pay",
          img: [StcPay],
          value: "stc_pay",
          disabled: false,
        },
      ]);
    }
  }, [paymentLang]);
  const errorMessages_des = {
    testfailed: cmsLang?.config[0]?.your_payment_is_failed,
    "00000": "Transaction Successful.",
    "00001": "Merchant ID is missing",
    "00002": "Amount is missing",
    "00003": "Currency code is missing",
    "00004": "Message ID is missing",
  };
  useEffect(() => {
    if (processTransaction?.errorMessage) {
      setOpenModal(true);
    }
  }, [processTransaction?.errorMessage]);
  const premiumInfo = quoteDataValue?.model?.policyBasic?.premiumInfo;
  let subtotal = getAmountText(premiumInfo?.finalPremium);
  let paymentInfo: {
    adminFees: number;
    planAmount: number;
    productCode: string | number;
    planName: string;
    adminFeesLabel: string;
  } = {
    adminFees: 0,
    planAmount: 0,
    productCode: "",
    planName: "",
    adminFeesLabel: "",
  };

  if (productCode === PRODUCTCODE_HOME) {
    // need to add admin fees with plan amount for home
    subtotal = getAmountText(
      premiumInfo?.finalPremium + premiumInfo?.taxFeeBreakdowns[1]?.amount
    );
    paymentInfo = {
      adminFees: getAmountText(premiumInfo?.taxFeeBreakdowns[1]?.amount),
      planAmount: premiumInfo?.finalPremium,
      productCode: productCode,
      planName: quoteDataValue?.model?.policyLob[0].planCode,
      adminFeesLabel: cmsTravelLang?.config?.adminfees,
    };
  }
  useEffect(() => {
    if (processTransaction?.endrosmentNo) {
      redisKeyCall();
    }
  }, [processTransaction?.endrosmentNo, redisKeyCall]);

  useEffect(() => {
    if (endrosmentData && endrosmentData?.benefitsPremiumData?.length > 0) {
      setEndoPremiumBreakDown(
        getTotalSubTotal(endrosmentData?.benefitsPremiumData, endrosmentData)
      );
    } else if (
      endrosmentData &&
      endrosmentData?.driversPremiumData?.length > 0
    ) {
      setEndoPremiumBreakDown(
        convertDriverData(
          endrosmentData?.driversPremiumData,
          endrosmentData?.totalAmount
        )
      );
    }
  }, [endrosmentData]);
  let timerId: NodeJS.Timeout | undefined;
  const handleTimeout = () => {
    setSessionTimeout(true);
    setTimeLeft(sessionTimer.SESSION_TIMEOUT);
    clearTimeout(timerId);
  };

  const handleSessionClose = () => {
    clearTimeout(timerId);
    isAuthenticated ? navigate("/") : navigate("/dashboard");
  };

  useEffect(() => {
    if (timeLeft > 0) {
      timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `0${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };
  const productCodeAlert = quoteDataValue?.model?.policyBasic?.productCode;
  const getFormattedOTPExpiryMessage = (timeLeft: number): JSX.Element => {
    const formattedTime = formatTime(timeLeft);
    const msg = cmsLang?.config[0]?.for_security_reasons
      ? cmsLang?.config[0]?.for_security_reasons
      : "";
    const htmlContent = msg.replace(
      "<timer>",
      `<span class="session-expiry-timer">${formattedTime}</span>`
    );
    return <p dangerouslySetInnerHTML={{ __html: htmlContent }} />;
  };
  return (
    <div className="payment-insurance">
      <IdleTimeout
        timeout={sessionTimer.WARNING_TIME}
        onTimeout={handleTimeout}
      />
      {sessionTimeout && (
        <>
          <ErrorDialogBox
            imgSrc={LoadingTimer}
            onClose={() => setSessionTimeout(false)}
            buttonName={cmsLang?.config[0]?.continue_label}
            headingContent={cmsLang?.config[0]?.session_is_about_to_expire}
            bodyContent={
              <div className="session-timer">
                {getFormattedOTPExpiryMessage(timeLeft)}
              </div>
            }
          />
          <IdleTimeout timeout={timeLeft} onTimeout={handleSessionClose} />
        </>
      )}
      <AlertBox
        title="Payment"
        description={
          errorMessages_des[
          processTransaction?.errorMessage as keyof typeof errorMessages_des
          ] || ""
        }
        showAlertModal={openModal}
        setShowAlertModal={() => setOpenModal(false)}
      />
      <div className="payment-buy-container" data-testid="quote-buy">
        <div className="leftPanel">
          {propsData?.quoteNo && thankYouMessage && (
            <div className="payment-toast">
              <AlertPopUp
                varaint="warning"
                title=""
                message={
                  <div
                    dangerouslySetInnerHTML={{
                      __html: thankYouMessage || "",
                    }}
                  />
                }
                showNavButton={false}
                className="payment-alert"
              />
            </div>
          )}
          {propsData?.quoteNo && productCodeAlert == MOTORCOMP &&(
              <AlertPopUp
                varaint="warning"
                title=""
                message={cmsLang?.config[0]?.comp_upload_lime_msg}
                showNavButton={false}
                className="payment-comp-toast"
              />
          )}
          <BuyProductHeading heading={paymentData?.payment_options} />
          <div className="payment-options">
            {paymentOptions.map((option, index) => (
              <div
                key={"paymentOption_" + index}
                className={`payment-option-container ${option.value === selectedPaymentOption
                    ? "option-selected"
                    : option.disabled
                      ? "option-disabled"
                      : ""
                  }`}
                onClick={() => setSelectedPaymentOption(option.value)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setSelectedPaymentOption(option.value);
                  }
                }}
              >
                <div className={`payment-option`}>
                  <label>{option.label}</label>
                  <div className="image-options">
                    {option.img.map((img, imgIndex) => (
                      <img key={imgIndex} src={img} alt={option.label} />
                    ))}
                  </div>
                </div>
                {cmsLang &&
                  (quoteDataValue ?? endrosmentData) &&
                  paymentData &&
                  option.value === selectedPaymentOption && (
                    <PaymentOptions
                      option={option.value}
                      paymentData={paymentData}
                      optionData={option}
                      quoteData={getCardOptionsData(
                        quoteDataValue,
                        endrosmentData
                      )}
                      languageData={cmsLang?.config[0]}
                      productCode={productCode}
                      mobileNumber={
                        quoteDataValue?.model?.policyCustomer[0]?.mobile
                      }
                      navigateTo={navigateTo}
                      premiumInfo={premiumInfo}
                    />
                  )}
              </div>
            ))}
          </div>
        </div>

        <div className={`rightPanel ${isPanelOpen ? 'open' : 'closed'}`}>
          <PanelRight>
            {propsData?.quoteNo && (
              <QuoteCreation quotationNum={propsData?.quoteNo} isQuote={true} />
            )}
            {processTransaction.endrosmentNo && (
              <QuoteCreation
                quotationNum={processTransaction.endrosmentNo}
                isQuote={false}
              />
            )}
            {processTransaction.endrosmentNo && endoPremiumBreakDown && (
              <OrderSummaryCard
                languageData={cmsLang?.config[0]}
                addBenefitData={{
                  benefits:
                    endrosmentData?.benefitsPremiumData.length > 0
                      ? endrosmentData?.benefitsPremiumData
                      : endoPremiumBreakDown?.driverData ?? [],
                }}
                subtotal={
                  endrosmentData?.totalAmount?.subtotal ??
                  endrosmentData?.subtotal
                }
                vatAmount={
                  endrosmentData?.totalAmount?.vatAmount ??
                  endrosmentData?.vatAmount
                }
                totalAmount={
                  endrosmentData?.totalAmount?.totalAmount ??
                  endrosmentData?.totalAmount
                }
                endorsementType={endorsementType}
                adminFees={endrosmentData?.adminFees ?? 0}
              />
            )}
            {productCode === PRODUCTCODE_TRAVEL
              ? cmsLang &&
                cmsTravelLang &&
                ppromoCodeConfig && (
                  <TravelPremiumBreakupUi
                    langData={{
                      consumer: cmsLang.config[0] ?? {},
                      product: cmsTravelLang.config,
                    }}
                    promoCMSData={ppromoCodeConfig.config}
                    policyRiskData={policyRisk}
                    travelPackageData={travelPackageData}
                    familyIndividual={familyIndividual}
                    typeOfCoverage={typeOfCoverage}
                  />
                )
              : cmsLang &&
              ppromoCodeConfig &&
              quoteDataValue && (
                <PremiumBreakUpUi
                  languageData={cmsLang?.config[0]}
                  quoteHeading={paymentData?.productCodeTitle[productCode]}
                  title={cmsLang?.config[0]?.order_summary}
                  showSchemeCode={false}
                  data={ppromoCodeConfig}
                  premium={premiumInfo?.premiumDue}
                  premiumArr={premiumInfo?.premiumBreakdowns}
                  priceAmount={0}
                  subtotalAmount={subtotal}
                  vatAmount={premiumInfo?.taxFeeBreakdowns[0]?.amount ?? 0}
                  selectedBenefits={selectedBenefits}
                  paymentInfo={paymentInfo}
                />
              )}

            {cmsLang && <SafeSecure />}
          </PanelRight>
        </div>
      </div>
    </div>
  );
}
