import React, { useEffect } from "react";
import "./index.scss";
import { Card } from "react-bootstrap";
import { getAmountWithIcon } from "@app-shell/utils/common";
import {
  COMPREHENSIVE_TRAVEL_INSURANCE_CODE,
  WINTER_SPORTS_COVER_CODE,
} from "constant";
interface Props {
  languageData: { [key: string]: string };
  policyRiskData: [] | null;
  travelPackageData: { [key: string]: string };
  familyIndividual: string;
  typeOfCoverage: string;
}

const TravelPremiumBreakupUi = ({
  languageData,
  policyRiskData,
  travelPackageData,
  familyIndividual = "",
  typeOfCoverage = "",
}: Props) => {
  const [subTotal, setSubTotal] = React.useState<number>(0);
  const getPremiumPrice = (policyCoverage: any) => {
    if (policyCoverage && policyCoverage.length > 0) {
      return policyCoverage.map((coverage: any) => {
        if (coverage.coverageCode === COMPREHENSIVE_TRAVEL_INSURANCE_CODE) {
          return coverage?.premiumInfo?.annualPremium.toFixed(2);
        }
      });
    }
  };
  useEffect(() => {
    if (
      travelPackageData?.premiumInfo?.finalPremium &&
      travelPackageData?.premiumInfo?.taxFeeBreakdowns.length > 0
    ) {
      setSubTotal(
        (
          travelPackageData?.premiumInfo?.finalPremium +
          travelPackageData?.premiumInfo?.taxFeeBreakdowns[1]?.amount
        ).toFixed(2)
      );
    }
  }, [travelPackageData]);

  return (
    <Card className="payment-order-summary-travel-premium-breakup w-100">
      <div className="order-header justify-content-between flex-row">
        <div className="order-title walaa-medium-500">
          {languageData?.order_summary}
        </div>
      </div>
      <hr className="horizontal-line" />
      <div className="insurancename"> {languageData?.title} </div>
      <div className="order-body ">
        <div className="order-travel-body-content walaa-medium-500 ">
          <div className="order-travel-body-package-content">
            <div>
              {typeOfCoverage} - {familyIndividual}
            </div>
            <div>
              {getAmountWithIcon(travelPackageData?.premiumInfo?.finalPremium)}
            </div>
          </div>
        </div>
        <div className="order-travel-body-content ">
          {policyRiskData?.map((policyRisk: any) => (
            <div className="travel-person-group">
              <div className="travel-person-group-one">
                <div className="travel-person-group-name">
                  {policyRisk?.travellerNameEnglish}
                </div>
                <div className="travel-person-group-price">
                  {getAmountWithIcon(
                    getPremiumPrice(policyRisk?.policyCoverage)
                  )}
                </div>
              </div>
              {travelPackageData?.familyIndividual === "Family" && (
                <div className="travel-person-group-two">
                  <div className="add-benefit-heading">
                    {languageData?.additional_benefits}
                  </div>
                </div>
              )}
              <div className="travel-person-group-two travel-person-group-name">
                <div className="add-benefit-heading">
                  {languageData?.additional_benefits1}
                </div>
              </div>
              <div className="travel-person-group-three">
                {policyRisk?.policyCoverage &&
                  policyRisk?.policyCoverage.map(
                    (benefit: any, index: number) =>
                      benefit.coverageCode !==
                      COMPREHENSIVE_TRAVEL_INSURANCE_CODE ? (
                        <div className="add-benefit" key={benefit.coverageCode}>
                          <p>
                            {benefit.coverageCode === WINTER_SPORTS_COVER_CODE
                              ? languageData?.benfit_sports
                              : languageData?.benfit_covid}
                          </p>
                          <p>
                            {getAmountWithIcon(
                              benefit.premiumInfo.annualPremium
                            )}
                          </p>
                        </div>
                      ) : null
                  )}
              </div>
            </div>
          ))}
        </div>
        <div className="order-travel-body-content">
          <div className="order-travel-body-package-content-light">
            <div>{languageData?.adminfees}</div>
            <div>
              {getAmountWithIcon(
                travelPackageData?.premiumInfo?.taxFeeBreakdowns?.length > 0
                  ? travelPackageData?.premiumInfo?.taxFeeBreakdowns[1]?.amount
                  : 0
              )}
            </div>
          </div>
        </div>
        <hr className="horizontal-travel-line" />
        <div className="order-travel-body-content walaa-medium-500">
          <div className="order-travel-body-package-content">
            <div>{languageData?.subtotal}</div>
            <div>{getAmountWithIcon(subTotal)}</div>
          </div>
        </div>
        <hr className="horizontal-travel-line" />
        <div className="order-travel-body-content">
          <div className="order-travel-body-package-content-light">
            <div>
              {languageData?.vat_amount} (
              {travelPackageData?.premiumInfo?.taxFeeBreakdowns?.length > 0
                ? travelPackageData?.premiumInfo?.taxFeeBreakdowns[0]
                    ?.percentage * 100
                : 0}
              %)
            </div>
            <div>
              {getAmountWithIcon(
                travelPackageData?.premiumInfo?.taxFeeBreakdowns?.length > 0
                  ? travelPackageData?.premiumInfo?.taxFeeBreakdowns[0]?.amount
                  : 0.0
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="order-summary-footer walaa-medium-500">
        <div className="left">{languageData?.net_premium}</div>
        <div className="right">
          {getAmountWithIcon(travelPackageData?.premiumInfo?.premiumDue)}
        </div>
      </div>
    </Card>
  );
};

export default TravelPremiumBreakupUi;
