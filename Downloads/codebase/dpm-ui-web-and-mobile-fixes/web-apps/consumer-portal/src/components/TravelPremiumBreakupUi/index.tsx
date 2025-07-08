import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { getAmountWithIcon } from "@app-shell/utils/common";
import { getBasePremium, getDiscountDetails } from "utils/quoteAndBuy";
import { covergaeTypes } from "components/Travel/constantsTravel";
import "./index.scss";
import { LanguageData } from "types/languageData";

interface Props {
  langData: {
    consumer: LanguageData;
    product: LanguageData;
  };
  promoCMSData: { [key: string]: string };
  policyRiskData: [] | null;
  travelPackageData: { [key: string]: string };
  familyIndividual: string;
  typeOfCoverage: string;
}

const TravelPremiumBreakupUi = ({
  langData,
  promoCMSData,
  policyRiskData,
  travelPackageData,
  familyIndividual = "",
  typeOfCoverage = "",
}: Props) => {
  const [subTotal, setSubTotal] = useState<number>(0);
  const [discountsApplicable, setDiscountsApplicable] = useState<
    Array<{ id: string; description: string; amount: number }>
  >([]);
  const [totalBasePremium, setTotalBasePremium] = useState<number>(0);
  const getPremiumPrice = (policyCoverage: any) => {
    if (policyCoverage && policyCoverage.length > 0) {
      return policyCoverage.map((coverage: any) => {
        if (coverage.coverageCode === covergaeTypes.comprehensive) {
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
    if (travelPackageData?.premiumInfo?.premiumBreakdowns) {
      setDiscountsApplicable(
        getDiscountDetails(
          travelPackageData?.premiumInfo?.premiumBreakdowns,
          promoCMSData
        )
      );
    }
  }, [travelPackageData]);

  useEffect(() => {
    if (policyRiskData) {
      setTotalBasePremium(getBasePremium(policyRiskData));
    }
  }, [policyRiskData]);

  return (
    <Card className="payment-order-summary-travel-premium-breakup w-100">
      <div className="order-header justify-content-between flex-row">
        <div className="order-title walaa-medium-500">
          {langData.product?.order_summary}
        </div>
      </div>
      <hr className="horizontal-line" />
      <div className="insurancename"> {langData.product?.title} </div>
      <div className="order-body ">
        <div className="order-travel-body-content walaa-medium-500 ">
          <div className="order-travel-body-package-content">
            <div>
              {typeOfCoverage} - {familyIndividual}
            </div>
            <div>{getAmountWithIcon(totalBasePremium)}</div>
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
              {policyRisk?.policyCoverage &&
                policyRisk?.policyCoverage.length > 1 && (
                  <>
                    <div className="travel-person-group-two travel-person-group-name">
                      <div className="add-benefit-heading">
                        {langData.product?.additional_benefits1}
                      </div>
                    </div>
                    <div className="travel-person-group-three">
                      {policyRisk?.policyCoverage?.map((benefit: any) =>
                        benefit.coverageCode !== covergaeTypes.comprehensive ? (
                          <div
                            className="add-benefit"
                            key={benefit.coverageCode}
                          >
                            <p>
                              {benefit.coverageCode ===
                              covergaeTypes.winterSports
                                ? langData.product?.benfit_sports
                                : langData.product?.benfit_covid}
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
                  </>
                )}
            </div>
          ))}
        </div>
        <div className="order-travel-body-content">
          {discountsApplicable.map((item) => (
            <div
              key={item.id}
              className="order-travel-body-package-content-light"
            >
              <div className="add-benefit">{item.description || langData?.consumer?.default_discount}</div>
              <div> {getAmountWithIcon(item.amount)}</div>
            </div>
          ))}
        </div>
        <div className="order-travel-body-content">
          <div className="order-travel-body-package-content-light">
            <div>{langData.product?.adminfees}</div>
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
            <div>{langData.product?.subtotal}</div>
            <div>{getAmountWithIcon(subTotal)}</div>
          </div>
        </div>
        <hr className="horizontal-travel-line" />
        <div className="order-travel-body-content">
          <div className="order-travel-body-package-content-light">
            <div>
              {langData.product?.vat_amount} (
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
        <div className="left">{langData.product?.net_premium}</div>
        <div className="right">
          {getAmountWithIcon(travelPackageData?.premiumInfo?.premiumDue)}
        </div>
      </div>
    </Card>
  );
};

export default TravelPremiumBreakupUi;
