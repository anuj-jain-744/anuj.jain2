import React, { useEffect, useState } from "react";
import { Accordion, Card } from "react-bootstrap";
import { LanguageData } from "types/languageData";
import "./style.scss";
import { additional_driver_premium, IComprehensive } from "../../Motor/QuoteAndBuy/CoveragePlan/ConstantValue/ConstantValue";
import { compensationTypeCardFinalVAT } from "Motor/QuoteAndBuy/CoveragePlan/CommonFunction/CommonFunction";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";
import { getAmountText,useApiCall } from "@dpm/shared-module";

interface IExistingPremiumBreakUp {
  languageData: LanguageData | undefined | null;
  title: string;
  subtitle: string;
  data: any;
}

interface PremiumInfo {
  vatAmount: string | number;
  vatPercent: string | number;
  planPrice: string | number;
  subtotal: string | number;
  netPremium: string | number;
  adminFees: string | number;
}

const ExistingPremiumBreakUp: React.FC<IExistingPremiumBreakUp> = ({
  languageData,
  title,
  subtitle,
  data
}) => {
  const {
    selectedBenefits,
    repairTypeSelected,
    workShopInitialPrice,
    agencyInitialPrice,
    mathInitialPrice,
    comp3rdParty,
    premium,
    setPremium,
    driverDetails: driverDetailsData,
    homePremiumResponse,
    viewPolicyData,
    isRenewpolicy
  } = useQuoteAndBuyContext();

  const { homePolicyRenewal } = usePHQuoteBuyContext();

  const isHome = homePremiumResponse && Object.keys(homePremiumResponse).length > 0;

  const [premiumInfo, setPremiumInfo] = useState<PremiumInfo>({ vatAmount: 0, vatPercent: 0, planPrice: 0, subtotal: 0, netPremium: 0, adminFees: 0 });




  //accordion opened/not state
  const [isOpen, setIsOpen] = useState<boolean>(false);
  //accordion on body open handler fn
  const clickEnterHandler = () => {
    setIsOpen(true);
  };
  //accordion on body close handler fn
  const clickExitHandler = () => {
    setIsOpen(false);
  };

  const renderPrice = () => {
    switch (repairTypeSelected) {
      case "Workshop Repair":
        return workShopInitialPrice || 0;
      case "Mawthoq Repair":
        return mathInitialPrice || 0;
      case "Agency Repair":
        return agencyInitialPrice || 0;
      default:
        return comp3rdParty?.pricingOptions[0]?.finalAmount;
    }
  };

  const renderRenewPolicyPrice = () => {
    return viewPolicyData?.policyBasic?.premiumInfo?.finalPremium;
  };

  const getPremiumArr = () => {
    return viewPolicyData?.policyBasic?.premiumInfo?.premiumBreakdowns;
  };



  const policyBenefits = viewPolicyData?.policyLob[0]?.policyRisk[0]?.policyCoverage;

  const capitalizedStr = IComprehensive.charAt(0).toUpperCase() + IComprehensive.slice(1);

  const existBenefits = policyBenefits?.filter(item => item.coverageName !== capitalizedStr);


  useEffect(() => {
    if(isRenewpolicy){

      const validBenefits = existBenefits?.filter(
        (benefit) => benefit?.coverageName !== undefined
      );


      const benefitsTotal = validBenefits?.reduce(
        (acc, benefit) => acc + benefit?.premiumInfo?.finalPremium,
        0
      );

      const planPrice = renderRenewPolicyPrice();
      const newSubtotal = planPrice + benefitsTotal;
      const newVat = newSubtotal * 0.15;
      const newNetPremium = newSubtotal + newVat;

      setPremiumInfo((prevValue: PremiumInfo) => ({
        ...prevValue,
        vatAmount: getAmountText(newVat),
        netPremium: getAmountText(newNetPremium),
        subtotal: getAmountText(newSubtotal),
        vatPercent: 0.15,
        planPrice: getAmountText(planPrice)
      }));
      setPremium(newNetPremium);

    }
  }, [
    selectedBenefits,
    repairTypeSelected,
    workShopInitialPrice,
    agencyInitialPrice,
    mathInitialPrice,
    premium,
    setPremium,
  ]);

  useEffect(() => {
    if (isHome) {
      const premiumInfo = homePolicyRenewal?.existingPremium;
      const planPrice = getAmountText(premiumInfo?.finalPremium);
      const newSubtotal = premiumInfo?.finalPremium + premiumInfo?.taxFeeBreakdowns[1]?.amount;
      const newVat = premiumInfo?.taxFeeBreakdowns[0]?.amount ?? 0;
      setPremiumInfo((prevValue: PremiumInfo) => ({
        ...prevValue,
        vatAmount: getAmountText(newVat),
        netPremium: getAmountText(premiumInfo?.premiumDue),
        subtotal: getAmountText(newSubtotal),
        vatPercent: getAmountText(premiumInfo?.taxFeeBreakdowns[0]?.percentage),
        planPrice: getAmountText(planPrice),
        adminFees: getAmountText(Number(premiumInfo?.taxFeeBreakdowns[1]?.amount))
      }))
    }
  }, [
    homePolicyRenewal,
    isHome
  ]);


  const ExistingPremiumBreakUpBody = (title: string) => {
    return (
      <React.Fragment>
        <div className="order-body-content">

          {getPremiumArr()?.sort((a, b) => a.type - b.type)?.map((val: PremiumBreakdown) => {
            return (
              <div className="order-body-package-content d-flex w-full justify-content-between" key={val?.amount}>
                <div>
                  {data?.config.premium_breakdown.find((valD: PremiumDescription) => {
                    return valD.code.toString() === val.type;
                  })?.description}
                </div>
                <div>
                  {languageData?.sar} {val.sign === -1 ? "-" : ""} {val.amount}
                </div>
              </div>
            )
          })}

          {/* coverage type */}
          <div className="order-body-package-content content-light">
            <div>
            {repairTypeSelected !== null && (
              <div className="subtitle">{repairTypeSelected}</div>
            )}
            </div>
            <div>{languageData?.sar} {premiumInfo?.planPrice} </div>
          </div>

          {/* Existing Benefits for Renew Policy */}
            {isRenewpolicy && existBenefits?.length > 0 && languageData?.additional_benefits && (
            <div className="additional">{languageData?.additional_benefits}</div>
            )}
            {isRenewpolicy && existBenefits?.map((benefit) => {
            return (
              <div className="order-body-package-content content-light" key={benefit?.amount}>
              <div>
                {benefit?.coverageName}
              </div>
              <div>
                {languageData?.sar} {getAmountText(benefit?.premiumInfo?.finalPremium)}
              </div>
              </div>
            );
            })}


          {/* Additional driver premium enabled when driverDetailsData is not empty */}
          {driverDetailsData?.length > 0 && (
            <div className="order-body-package-content d-flex w-full justify-content-between">
              <div className="w-50">
                {languageData?.additional_driver_premium} x&nbsp;
                {driverDetailsData?.length}
              </div>
              <div>
                {languageData?.sar} {getAmountText(additional_driver_premium)}
              </div>
            </div>
          )}

            {!isRenewpolicy &&
            selectedBenefits?.map((benefit, index) => (
              <div key={index} className="order-body-package-content d-flex w-full justify-content-between">
              <div className="w-50">{benefit.title}</div>
              <div>
                {languageData?.sar} {getAmountText(benefit.price)}
              </div>
              </div>
            ))}

        </div>
        {isHome && <>
          <hr className="horizontal-line" />
          <div className="order-body-content">
            <div className="order-body-package-content content-light d-flex w-full justify-content-between">
              <div>{languageData?.adminfees}</div>
              <div>
                {languageData?.sar} {premiumInfo?.adminFees}
              </div>
            </div>
          </div>
        </>}
        <hr className="horizontal-line" />
        <div className="order-body-content walaa-medium-500">
          <div className="order-body-package-content content-subtotal d-flex w-full justify-content-between">
            <div>{languageData?.subtotal}</div>
            <div>
              {languageData?.sar} {premiumInfo?.subtotal}
            </div>
          </div>
        </div>
        <hr className="horizontal-line" />
        <div className="order-body-content">
          <div className="order-body-package-content content-light d-flex w-full justify-content-between">
            <div>{languageData?.vat_amount} ({compensationTypeCardFinalVAT(premiumInfo?.vatPercent)}%)</div>
            <div>
              {languageData?.sar} {premiumInfo?.vatAmount}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  };
  return (
    <>
      <Accordion
        className={`${isOpen ? "accor-open" : "accor-close"
          } w-100 coverage-vehicleinfo-existing coverage-existing-premium order-summary-premium-breakup exist px-0`}
      >
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <Card className="order-summary-premium-breakup w-100 border-0 p-0">
              <div className="order-header justify-content-between flex-row">
                <div className="order-title walaa-medium-500">{title}</div>
              </div>
            </Card>
          </Accordion.Header>
          <Accordion.Body
            onEntered={clickEnterHandler}
            onExiting={clickExitHandler}
            className="px-0"
          >
            <hr className="horizontal-line" />
            <div className="order-body">
              {ExistingPremiumBreakUpBody(subtitle)}
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {/* 2nd row */}
      <div className="order-summary-footer coverage-existing-premium-footer walaa-medium-500">
        <div className="left">{languageData?.net_premium}</div>
        <div className="right">
          {languageData?.sar} {premiumInfo?.netPremium}
        </div>
      </div>
    </>
  );
};

export default ExistingPremiumBreakUp;
