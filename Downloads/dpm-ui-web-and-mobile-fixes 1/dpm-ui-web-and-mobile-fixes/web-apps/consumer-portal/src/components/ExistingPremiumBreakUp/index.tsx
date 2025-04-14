import React, { Fragment, useEffect, useState } from "react";
import { Accordion, Card } from "react-bootstrap";
import { LanguageData } from "types/languageData";
import "./style.scss";
import { additional_driver_premium } from "../../Motor/QuoteAndBuy/CoveragePlan/ConstantValue/ConstantValue";
import { compensationTypeCardFinalVAT } from "Motor/QuoteAndBuy/CoveragePlan/CommonFunction/CommonFunction";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";
import { getAmountText } from "@dpm/shared-module";

interface IExistingPremiumBreakUp {
  languageData: LanguageData | undefined | null;
  title: string;
  subtitle: string;
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

  useEffect(() => {
    if (!isHome) {
      const benefitsTotal = selectedBenefits.reduce(
        (acc, benefit) => acc + benefit.price,
        0
      );
      const planPrice = renderPrice();
      const newSubtotal = planPrice + additional_driver_premium + benefitsTotal;
      const newVat = newSubtotal * 0.15;
      const newNetPremium = newSubtotal + newVat;
      setPremiumInfo((prevValue: PremiumInfo) => ({
        ...prevValue,
        vatAmount: getAmount(newVat),
        netPremium: getAmount(newNetPremium),
        subtotal: getAmount(newSubtotal),
        vatPercent: 0.15,
        planPrice: getAmount(planPrice)
      }))
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
      const planPrice = getAmount(premiumInfo?.finalPremium) - premiumInfo?.taxFeeBreakdowns[1]?.amount;
      const newSubtotal = premiumInfo?.finalPremium;
      const newVat = premiumInfo?.taxFeeBreakdowns[0]?.amount ?? 0;
      setPremiumInfo((prevValue: PremiumInfo) => ({
        ...prevValue,
        vatAmount: getAmount(newVat),
        netPremium: getAmount(premiumInfo?.premiumDue),
        subtotal: getAmount(newSubtotal),
        vatPercent: getAmount(premiumInfo?.taxFeeBreakdowns[0]?.percentage),
        planPrice: getAmount(planPrice),
        adminFees: Number(premiumInfo?.taxFeeBreakdowns[1]?.amount)
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
          <div className="order-body-package-content d-flex w-full justify-content-between">
            <div>
              <div>{title}</div>
              {repairTypeSelected !== null && (
                <div>({repairTypeSelected})</div>
              )}
            </div>
            <div>
              {languageData?.sar} {premiumInfo?.planPrice}
            </div>
          </div>
          {/* Additional driver premium enabled when driverDetailsData is not empty */}
          {driverDetailsData?.length > 0 && (
            <div className="order-body-package-content d-flex w-full justify-content-between">
              <div className="w-50">
                {languageData?.additional_driver_premium} x&nbsp;
                {driverDetailsData?.length}
              </div>
              <div>
                {languageData?.sar} {getAmount(additional_driver_premium)}
              </div>
            </div>
          )}
          {selectedBenefits?.map((benefit, index) => (
            <div key={index} className="order-body-package-content d-flex w-full justify-content-between">
              <div className="w-50">{benefit.title}</div>
              <div>
                {languageData?.sar} {getAmount(benefit.price)}
              </div>
            </div>
          ))}
        </div>
        {isHome && <>
          <hr className="horizontal-line" />
          <div className="order-body-content walaa-medium-500">
            <div className="order-body-package-content d-flex w-full justify-content-between">
              <div>{languageData?.adminfees}</div>
              <div>
                {languageData?.sar} {premiumInfo?.adminFees}
              </div>
            </div>
          </div>
        </>}
        <hr className="horizontal-line" />
        <div className="order-body-content walaa-medium-500">
          <div className="order-body-package-content d-flex w-full justify-content-between">
            <div>{languageData?.subtotal}</div>
            <div>
              {languageData?.sar} {premiumInfo?.subtotal}
            </div>
          </div>
        </div>
        <hr className="horizontal-line" />
        <div className="order-body-content">
          <div className="order-body-package-content d-flex w-full justify-content-between">
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
    <Fragment>
      <Accordion
        className={`${isOpen ? "accor-open" : "accor-close"
          } w-100 coverage-vehicleinfo-existing coverage-existing-premium px-0`}
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
            <div className="order-body px-3">
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
    </Fragment>
  );
};

export default ExistingPremiumBreakUp;
