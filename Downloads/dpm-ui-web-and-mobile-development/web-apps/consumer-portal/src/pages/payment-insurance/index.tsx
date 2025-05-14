import BuyProductHeading from "components/BuyProductHeading";
import "./index.scss";
import { useApiCall } from "@dpm/shared-module";
import { useEffect, useState } from "react";
import { LanguageData } from "types/languageData";
import ThemeRadioCheckbox from "components/ThemeComponents/ThemeRadioCheckbox";
import PaymentOptions from "components/PaymentOptions";
import { getAmountText } from "@dpm/shared-module";
import Amex from "assets/Payment/amex.svg";
import ApplePay from "assets/Payment/apple-pay.svg";
import Madda from "assets/Payment/mada.svg";
import Master from "assets/Payment/master.svg";
import StcPay from "assets/Payment/stc-pay.svg";
import Tabby from "assets/Payment/tabby.svg";
import Visa from "assets/Payment/visa.svg";
import Sadad from "assets/Payment/sadad.svg";
import Tamara from "assets/Payment/tamara.svg";
import QuoteCreation from "components/QuoteCreation";
import { useLocation } from "react-router-dom";
import PremiumBreakUpUi from "components/PremiumBreakUp/premiumBreakUpUi";
import TravelPremiumBreakupUi from "components/TravelPremiumBreakupUi";
import { PromoCodeResponse } from "components/PremiumBreakUp";
import SafeSecure from "components/SafeSecure";
import { CmsPayment } from "components/PaymentOptions/types/cmsPayment";
import { ViewQuotePayload, ViewQuoteResponse } from "types/viewQuote";
import { processTransactionId } from "utils/paymentUtils";
import { AlertBox } from "components/AlertBox";
import { PRODUCTSAPI, TRAVEL_POLICY_TYPE, TRAVEL_TYPE, PRODUCTCODE_TRAVEL, PRODUCTCODE_HOME } from "constant";
import { converEndrosmentData, convertQuoteData, convertDriverData, getTotalSubTotal } from "./convertPayload";
import OrderSummaryCard from "components/OrderSummaryCard/OrderSummaryCard";
import { PremiumBreakdownProps } from "types/AddBenefit";
import { JAVA_API_ROUTES } from "../../constant";
import { RedisDataResponse } from "components/PaymentOptions/types/providerPayment";
import PanelRight from "components/PanelRight";

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

interface PolicyRiskData {
  travelerData: [] | null;
}

interface PaymentInsuranceProps {
  transactionId?: string;
}
export default function PaymentInsurance({ transactionId }: Readonly<PaymentInsuranceProps>) {
  const [paymentOptions, setPaymentOptions] = useState<PaymentOptionProp[]>([]);
  const [paymentData, setPaymentData] = useState<CmsPayment | null>(null);
  const [selectedPaymentOption, setSelectedPaymentOption] =
    useState<string>("debit");
  const [endoPremiumBreakDown, setEndoPremiumBreakDown] = useState<PremiumBreakdownProps | null>(null);
  const [selectedBenefits, setSelectedBenefits] = useState<{ title: string; price: number; code: string }[]>([]);
  const processTransaction = processTransactionId(transactionId ?? "");
  const location = useLocation();
  const propsData = location.state?.quoteData ?? { quoteNo: processTransaction?.quotationNo ?? "" };
  const productCode: string = location.state?.productCode ?? processTransaction?.productCode ?? "";
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [policyRisk, setPolicyRisk] = useState<PolicyRiskData>([]);
  const [travelPackageData, setTravelPackageData] = useState({});
  const [familyIndividual, setFamilyIndividual] = useState<string>("");
  const [typeOfCoverage, setTypeOfCoverage] = useState<string>("");

  const { makeApiCall: redisKeyCall, data: endrosmentData } = useApiCall<{ key: string }, undefined>(
    6,
    `${JAVA_API_ROUTES.redisGetValue}/${processTransaction.endrosmentNo}`,
    "get",
  );
  const { makeApiCall, data: paymentLang } = useApiCall<
    PaymentLangProps,
    unknown
  >(1, "payment-config", "get");

  const {
    makeApiCall: makePromoCodeConfig,
    data: ppromoCodeConfig
  } = useApiCall<
    PromoCodeResponse,
    unknown
  >(1, "promo-code-config", "get");

  const {
    makeApiCall: makeCmsApiCall,
    data: cmsLang
  } = useApiCall<
    CmsLanguageProps,
    unknown
  >(1, "consumerportal-config", "get");
  const {
    makeApiCall: makeCmsTravelApiCall,
    data: cmsTravelLang
  } = useApiCall<
    CmsLanguageProps,
    unknown
  >(1, "travel-config", "get");

  const productsInfo = PRODUCTSAPI[productCode] || {}; // get product APIs based on product code
  const { makeApiCall: makeApiCallQuote, data: quoteDataValue } = useApiCall<ViewQuoteResponse, ViewQuotePayload>(
    productsInfo?.viewQuoteNo,
    productsInfo?.viewQuoteAPI,
    "post",
  );

  
  const getCardOptionsData = (quoteDataValue: ViewQuoteResponse, endrosmentData: RedisDataResponse) => {
    if(quoteDataValue)
      return convertQuoteData(quoteDataValue, propsData?.quoteNo);
    if(endrosmentData && processTransaction?.endrosmentNo) 
      return converEndrosmentData(endrosmentData, processTransaction?.endrosmentNo);
    return null;
  }

  useEffect(() => {
    makeApiCall();
    makePromoCodeConfig();
    makeCmsApiCall();
    makeCmsTravelApiCall();
  }, []);

  useEffect(() => {
    if (propsData?.quoteNo) {
      const quoteData: { quotationNo: string; apiSource?: string; } = { quotationNo: propsData?.quoteNo };
      if (productCode === PRODUCTCODE_HOME) { // for HOME use cases
        quoteData["apiSource"] = "Portal";
      }
      makeApiCallQuote(quoteData);
    }
  }, [makeApiCallQuote, productCode, propsData?.quoteNo]);

  const getHighestPricedBenefits = (benefits: { benefitCode: string; benefitPrice: number }[]) => {
    const benefitMap = new Map();

    benefits.forEach((benefit) => {
      if (!benefitMap.has(benefit.benefitCode) || benefitMap.get(benefit.benefitCode).benefitPrice < benefit.benefitPrice) {
        benefitMap.set(benefit.benefitCode, benefit);
      }
    });

    return Array.from(benefitMap.values());
  };

  useEffect(() => {
    if (quoteDataValue?.model?.policyLob?.[0]?.policyRisk?.[0]?.benefits) {
      const benefitData = getHighestPricedBenefits(quoteDataValue?.model?.policyLob?.[0]?.policyRisk?.[0]?.benefits);
      setSelectedBenefits(benefitData.map((benefit) => ({
        title: benefit.benefitNameEn,
        price: benefit.benefitPrice ?? 0,
        code: benefit.benefitCode
      })));
    }
    if (quoteDataValue?.model?.policyLob?.[0]?.policyRisk?.[0]?.policyCoverage) {
      const benefitData = quoteDataValue?.model?.policyLob?.[0]?.policyRisk?.[0]?.policyCoverage;
      const benefits = [];
      for (const benefit of benefitData) {
        if (benefit?.premiumInfo?.finalPremium > 0 && benefit?.coverageCode !== "CFAP") {
          benefits.push({
            title: benefit.coverageName,
            price: benefit?.premiumInfo?.finalPremium ?? 0,
            code: benefit.coverageCode
          });
        }
      }
      setSelectedBenefits(benefits);
    }
    if (quoteDataValue?.model?.policyLob?.[0]?.policyRisk && productCode === PRODUCTCODE_TRAVEL) {
      setPolicyRisk(quoteDataValue?.model?.policyLob?.[0]?.policyRisk);
    }

    if (quoteDataValue?.model?.policyLob?.length > 0 && productCode === PRODUCTCODE_TRAVEL) {
      setFamilyIndividual(
        TRAVEL_TYPE[quoteDataValue?.model?.policyLob?.[0]?.familyIndividual]
      );
      setTypeOfCoverage(
        TRAVEL_POLICY_TYPE[quoteDataValue?.model?.policyLob?.[0]?.typeOfCoverage]
      );

      setTravelPackageData({
        ...travelPackageData,
        premiumInfo: quoteDataValue?.model?.policyBasic?.premiumInfo
      });
    }
  }, [quoteDataValue]);

  useEffect(() => {
    if (paymentLang) {
      const paymentData = paymentLang?.config;
      setPaymentData(paymentData);
      setPaymentOptions([
        {
          label: paymentData.field_pay_via_sadad,
          img: [Sadad],
          value: "sadad",
          disabled: true,
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
          label: paymentData.field_wallets,
          img: [StcPay, ApplePay],
          value: "wallets",
          disabled: true,
        },
      ]);
    }
  }, [paymentLang]);
  const errorMessages_des = {
    "testfailed": "Your Payment Is Failed",
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
  let paymentInfo = {};
  if (productCode === PRODUCTCODE_HOME) { // need to add admin fess with plan amount for home
    subtotal = getAmountText(premiumInfo?.finalPremium + premiumInfo?.taxFeeBreakdowns[1]?.amount);
    paymentInfo = {
      adminFees: getAmountText(premiumInfo?.taxFeeBreakdowns[1]?.amount),
      planAmount: premiumInfo?.finalPremium,
      productCode: productCode,
      planName: quoteDataValue?.model?.policyLob[0].planCode,
      adminFeesLabel: cmsTravelLang?.config?.adminfees
    }
  }
  useEffect(() => {
    if (processTransaction?.endrosmentNo) {
      redisKeyCall();
    }
  }, [processTransaction?.endrosmentNo, redisKeyCall])

  useEffect(() => {
    if (endrosmentData && endrosmentData?.benefitsPremiumData?.length > 0) {
      setEndoPremiumBreakDown(getTotalSubTotal(endrosmentData?.benefitsPremiumData, endrosmentData));
    } else if (endrosmentData && endrosmentData?.driversPremiumData?.length > 0){
      setEndoPremiumBreakDown(convertDriverData(endrosmentData?.driversPremiumData, endrosmentData?.totalAmount))
    }
  }, [endrosmentData]);

  return (
    <div className="payment-insurance">
      <AlertBox
        title="Payment"
        description={
          errorMessages_des[processTransaction?.errorMessage as keyof typeof errorMessages_des] || ""
        }
        showAlertModal={openModal}
        setShowAlertModal={() => setOpenModal(false)}

      />
      <div className="payment-buy-container" data-testid="quote-buy">
        <div className="leftPanel">
          <BuyProductHeading heading="Buy Product" />
          <div className="payment-options">
            {paymentOptions.map((option, index) => (
              <div
                key={index}
                className={`payment-option-container ${option.value === selectedPaymentOption
                  ? "option-selected"
                  : ""
                  }`}
              >
                <div className={`payment-option `}>
                  <ThemeRadioCheckbox
                    label={option.label}
                    type={"radio"}
                    disabled={option.disabled}
                    checked={option.value === selectedPaymentOption}
                    classes={""}
                    onChangehandler={() =>
                      setSelectedPaymentOption(option.value)
                    }
                    dataTestId={`check-button_${index}`}
                  />
                  <div className="image-options">
                    {option.img.map((img, imgIndex) => (
                      <img key={imgIndex} src={img} alt={option.label} />
                    ))}
                  </div>
                </div>
                {cmsLang && (quoteDataValue ?? endrosmentData) && paymentData && option.value === selectedPaymentOption && (
                  <PaymentOptions
                    option={option.value}
                    paymentData={paymentData}
                    optionData={option}
                    quoteData={getCardOptionsData(quoteDataValue, endrosmentData)}
                    languageData={cmsLang?.config[0]}
                    productCode={productCode}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="rightPanel">
          <PanelRight>
            {propsData?.quoteNo && <QuoteCreation quotationNum={propsData?.quoteNo} isQuote={true} />}
            {processTransaction.endrosmentNo && <QuoteCreation quotationNum={processTransaction.endrosmentNo} isQuote={false} />}
            {processTransaction.endrosmentNo && endoPremiumBreakDown &&
              <OrderSummaryCard
                languageData={cmsLang?.config[0]}
                addBenefitData={{ benefits: endrosmentData?.benefitsPremiumData.length > 0 ? endrosmentData?.benefitsPremiumData : endoPremiumBreakDown?.driverData ?? [] }}
                subtotal={endoPremiumBreakDown?.subtotal}
                vatAmount={endoPremiumBreakDown?.vatAmount}
                totalAmount={endoPremiumBreakDown?.totalAmount}
              />
            }
            {productCode === PRODUCTCODE_TRAVEL ? (
              cmsTravelLang &&
              (<TravelPremiumBreakupUi
                languageData={cmsTravelLang?.config}
                policyRiskData={policyRisk}
                travelPackageData={travelPackageData}
                familyIndividual={familyIndividual}
                typeOfCoverage={typeOfCoverage}
              />)
            ) : (
              cmsLang && ppromoCodeConfig && quoteDataValue && (
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
              )
            )}

            {cmsLang && (
              <SafeSecure />
            )}
          </PanelRight>
        </div>
      </div>
    </div>
  );
}
