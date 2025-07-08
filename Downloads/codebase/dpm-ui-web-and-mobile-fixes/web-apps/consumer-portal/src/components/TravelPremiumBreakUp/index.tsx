import React, { useEffect, useState } from "react";
import { Card, Modal } from "react-bootstrap";
import ThemeRadioCheckbox from "components/ThemeComponents/ThemeRadioCheckbox";
import { Promocode } from "components/PromoCode";
import { OTPWrapper } from "components/OTPValidation/OtpWrapper";
import SchemeCodeApplied from "./schemeCodeApplied";
import SuccessCelebration from "components/PromoCode/successCelebration";
import { useApiCall, capitalizeNameFirstLetter } from "@dpm/shared-module";
import { getAmountWithIcon } from "@app-shell/utils/common";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import useCalculatePremiumPayload from "Motor/QuoteAndBuy/hooks/useCalculatePremiumPayload";
import { useCalculatePremiumApi } from "hook/motor/useCalculatePremiumApi";
import {
  coveragePlanTypeIdMap,
  coverageTypeIdMap,
  JAVA_API_ROUTES,
  TRAVEL_COVERAGE_TYPE,
  TRAVELER,
  travelerTypeIdMap,
} from "constant";
import { covergaeTypes } from "components/Travel/constantsTravel";
import { DEFAULT_SCHEME_CODE } from "Motor/QuoteAndBuy/hooks/mapCalculatePremiumPayload";
import "./style.scss";
import { LanguageData } from "types/languageData";
import { getDiscountDetails } from "utils/quoteAndBuy";

interface Props {
  langData: {
    consumer: LanguageData;
    product: LanguageData;
  };
  title: string;
  leftStep?: number;
}

interface PremiumDescription {
  code: number;
  description: string;
}

export interface PromoCodeConfigResponse {
  filed_promocode: string;
  promo_code_applied_successfully: string;
  field_do_you_have_a_promo_code: string;
  field_enter_the_promo_code: string;
  field_enter_promo_code_placehold: string;
  field_apply: string;
  field_are_you_a_corporate_employ: string;
  field_if_yes_please_keep_your_em: string;
  field_corporate_email_id: string;
  field_enter_corporate_email_id: string;
  field_send_promo_code: string;
  promo_code_applied: string;
  premium_breakdown: PremiumDescription[];
  internal_server_error: string;
}

interface PromoCodeResponse {
  config: PromoCodeConfigResponse;
}

export interface TravelLink {
  label: string;
  link: string;
}

const TravelPremiumBreakUp = ({ langData, title, leftStep }: Props) => {
  const {
    schemeCode,
    travelcoverageTypeCode,
    travelcoverage,
    dataworldwidepearladminfee,
    dataworldwidetravelleradminfee,
    dataworldwidepearlnetpremium,
    dataworldwidetravellernetpremium,
    dataworldwidepearlVAT,
    dataworldwidetravellerVAT,
    dataWorldwidetraveller,
    dataworldwideexceptpearladminfee,
    dataworldwideexcepttravelleradminfee,
    dataworldwideexceptpearlnetpremium,
    dataworldwideexcepttravellernetpremium,
    dataworldwideexceptpearlVAT,
    dataworldwideexcepttravellerVAT,
    dataEuropeeuropeadminfee,
    dataEuropeschengenadminfee,
    dataEuropeeuropenetpremium,
    dataEuropeschengennetpremium,
    dataEuropeeuropeVAT,
    dataEuropeschengenVAT,
    pTravelername,
    ownerDetailsResponseData,
    travellerType,
    primaryTravelers,
    travelers,
    travelersChild,
    travelersSrcitizen,
    worldwideFamilyCPPrice,
    dataEuropeeurope,
    dataEuropeschengen,
    dataWorldwidepearl,
    dataWorldwideexcepttraveller,
    dataWorldwideexceptpearl,
    dataworldwideCoverageFamily,
  } = useQuoteAndBuyContext();
  const [isToggled, setIsToggled] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [callGenerateOtp, setCallGenerateOtp] = useState<boolean>(false);
  const [emailVal, setEmailVal] = useState<string>("");
  const [isCouponApplied, setIsCouponApplied] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [travelsubtotal, setTravelsubtotal] = useState(0);
  const { handleCalculatePremium } = useCalculatePremiumApi();
  const requestPayload = useCalculatePremiumPayload();

  const { makeApiCall, data } = useApiCall<PromoCodeResponse, unknown>(
    1,
    "promo-code-config",
    "get"
  );

  const handleSuccessValidation = () => {
    setCallGenerateOtp(false);
    setIsCouponApplied(true);
    setIsOpen(true);
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    }
  }, [isOpen]);

  const renderPricebyCPApi = () => {
    switch (travelcoverage) {
      case coverageTypeIdMap.worldwide:
        if (travelcoverageTypeCode === coveragePlanTypeIdMap.type3) {
          const finalAmount =
            dataworldwideCoverageFamily?.purchasedCoverage.reduce(
              (sum, item) => {
                return item.coverageCode === covergaeTypes.comprehensive
                  ? sum + (item?.premiumInfo?.annualPremium ?? 0)
                  : sum;
              },
              0
            ) ?? 0;
          return {
            price: finalAmount,
            type: TRAVEL_COVERAGE_TYPE.type_seven,
            adminFee: worldwideFamilyCPPrice.dataworldwideFamilyadminfee,
            netpremium:
              worldwideFamilyCPPrice.dataworldwideFamilynetpremium ?? 0,
            vat: worldwideFamilyCPPrice.dataworldwideFamilyVAT,
            discounts: getDiscountDetails(
              dataworldwideCoverageFamily?.pricingOptions[0]?.premiumBreakdowns,
              data?.config
            ),
            travellers:
              worldwideFamilyCPPrice.dataworldwideFamilypurchasedCoverage,
          };
        } else if (travelcoverageTypeCode === coveragePlanTypeIdMap.type1) {
          const finalAmount =
            dataWorldwidetraveller?.purchasedCoverage[0]?.premiumInfo
              ?.annualPremium ?? 0;
          return {
            price: finalAmount,
            type: TRAVEL_COVERAGE_TYPE.type_one,
            adminFee: dataworldwidetravelleradminfee,
            netpremium:
              dataWorldwidetraveller?.pricingOptions[0]?.premiumDue ?? 0,
            vat: dataworldwidetravellerVAT,
            discounts: getDiscountDetails(
              dataWorldwidetraveller?.pricingOptions[0]?.premiumBreakdowns,
              data?.config
            ),
            coverageOpted: dataWorldwidetraveller?.purchasedCoverage,
          };
        } else if (travelcoverageTypeCode === coveragePlanTypeIdMap.type2) {
          const finalAmount =
            dataWorldwidepearl?.purchasedCoverage[0]?.premiumInfo
              ?.annualPremium ?? 0;
          return {
            price: finalAmount,
            type: TRAVEL_COVERAGE_TYPE.type_two,
            adminFee: dataworldwidepearladminfee,
            netpremium: dataWorldwidepearl?.pricingOptions[0]?.premiumDue ?? 0,
            vat: dataworldwidepearlVAT,
            discounts: getDiscountDetails(
              dataWorldwidepearl?.pricingOptions[0]?.premiumBreakdowns,
              data?.config
            ),
            coverageOpted: dataWorldwidepearl?.purchasedCoverage,
          };
        } else break;
      case coverageTypeIdMap.worldwide1:
        if (travelcoverageTypeCode === coveragePlanTypeIdMap.type1) {
          const finalAmount =
            dataWorldwideexcepttraveller?.purchasedCoverage[0]?.premiumInfo
              ?.annualPremium ?? 0;
          return {
            price: finalAmount,
            type: TRAVEL_COVERAGE_TYPE.type_three,
            adminFee: dataworldwideexcepttravelleradminfee,
            netpremium:
              dataWorldwideexcepttraveller?.pricingOptions[0]?.premiumDue ?? 0,
            vat: dataworldwideexcepttravellerVAT,
            discounts: getDiscountDetails(
              dataWorldwideexcepttraveller?.pricingOptions[0]
                ?.premiumBreakdowns,
              data?.config
            ),
            coverageOpted: dataWorldwideexcepttraveller?.purchasedCoverage,
          };
        } else {
          const finalAmount =
            dataWorldwideexceptpearl?.purchasedCoverage[0]?.premiumInfo
              ?.annualPremium ?? 0;
          return {
            price: finalAmount,
            type: TRAVEL_COVERAGE_TYPE.type_four,
            adminFee: dataworldwideexceptpearladminfee,
            netpremium:
              dataWorldwideexceptpearl?.pricingOptions[0]?.premiumDue ?? 0,
            vat: dataworldwideexceptpearlVAT,
            discounts: getDiscountDetails(
              dataWorldwideexceptpearl?.pricingOptions[0]?.premiumBreakdowns,
              data?.config
            ),
            coverageOpted: dataWorldwideexceptpearl?.purchasedCoverage,
          };
        }
      case coverageTypeIdMap.europe:
        if (travelcoverageTypeCode === coveragePlanTypeIdMap.type4) {
          const finalAmount =
            dataEuropeschengen?.purchasedCoverage[0]?.premiumInfo
              ?.annualPremium ?? 0;
          return {
            price: finalAmount,
            type: TRAVEL_COVERAGE_TYPE.type_five,
            adminFee: dataEuropeschengenadminfee,
            netpremium: dataEuropeschengen?.pricingOptions[0]?.premiumDue ?? 0,
            vat: dataEuropeschengenVAT,
            discounts: getDiscountDetails(
              dataEuropeschengen?.pricingOptions[0]?.premiumBreakdowns,
              data?.config
            ),
            coverageOpted: dataEuropeschengen?.purchasedCoverage,
          };
        } else {
          const finalAmount =
            dataEuropeeurope?.purchasedCoverage[0]?.premiumInfo
              ?.annualPremium ?? 0;
          return {
            price: finalAmount,
            type: TRAVEL_COVERAGE_TYPE.type_six,
            adminFee: dataEuropeeuropeadminfee,
            netpremium: dataEuropeeurope?.pricingOptions[0]?.premiumDue ?? 0,
            vat: dataEuropeeuropeVAT,
            discounts: getDiscountDetails(
              dataEuropeeurope?.pricingOptions[0]?.premiumBreakdowns,
              data?.config
            ),
            coverageOpted: dataEuropeeurope?.purchasedCoverage,
          };
        }
      default:
        break;
    }
  };

  useEffect(() => {
    const newSubtotalTravel = renderPricebyCPApi();
    if (newSubtotalTravel?.adminFee) {
      // changed condition as per vipul pr comments
      setTravelsubtotal(newSubtotalTravel.netpremium - newSubtotalTravel.vat);
    }
  }, [
    travelcoverage,
    travelcoverageTypeCode,
    dataEuropeeuropenetpremium,
    dataEuropeschengennetpremium,
    dataworldwideexceptpearlnetpremium,
    dataworldwideexcepttravellernetpremium,
    dataworldwidepearlnetpremium,
    dataworldwidetravellernetpremium,
    worldwideFamilyCPPrice,
  ]);

  const getTravellerName =
    ownerDetailsResponseData !== undefined && ownerDetailsResponseData !== null
      ? capitalizeNameFirstLetter(ownerDetailsResponseData.ownerFullNameEnglish)
      : capitalizeNameFirstLetter(pTravelername);

  const groupCoverageByRiskId = (data) => {
    const persons = [
      ...primaryTravelers,
      ...travelers,
      ...travelersChild,
      ...travelersSrcitizen,
    ];
    const groupedData = {};
    data?.forEach((item) => {
      const person = persons.find((val) => val.uiId === item.nationalIqamaId);
      if (!groupedData[item.riskId]) {
        groupedData[item.riskId] = {
          riskId: item.riskId,
          nationalIqamaId:
            person?.travellerNameEnglish ||
            person?.type ||
            (item.riskId.includes("1")
              ? getTravellerName
              : item.travellerNameEnglish) ||
            item.nationalIqamaId,
          coverageCode: item.coverageCode,
          price: item.premiumInfo.annualPremium,
          coverages: [],
        };
      }
      groupedData[item.riskId].coverages.push(item);
    });

    return Object.values(groupedData);
  };

  const travellerDetails = renderPricebyCPApi()?.travellers ?? [];
  const groupedCoverageData = groupCoverageByRiskId(travellerDetails);

  const premiumBreakUpBody = () => {
    const discounts = renderPricebyCPApi()?.discounts ?? [];
    const shouldRenderSelfAdditionalBenefit = (
      leftStep: number | undefined,
      travellerType: string | null
    ) => {
      if (travellerType === travelerTypeIdMap.self) {
        const coverageOpted = renderPricebyCPApi()?.coverageOpted;
        if (coverageOpted && coverageOpted.length > 1) {
          return (
            <div className="travel-person-benefits">
              <div className="travel-person-group-two">
                <div className="add-benefit-heading">
                  {langData.product?.additional_benefits1}
                </div>
              </div>
              <div className="travel-person-group-three">
                {coverageOpted.map((coverage: any) =>
                  coverage.coverageCode !== covergaeTypes.comprehensive ? (
                    <div className="add-benefit" key={coverage.coverageCode}>
                      <p>
                        {coverage.coverageCode === covergaeTypes.winterSports
                          ? langData.product?.benfit_sports
                          : langData.product?.benfit_covid}
                      </p>
                      <p>
                        {getAmountWithIcon(coverage.premiumInfo.annualPremium)}
                      </p>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          );
        }
        return null;
      } else {
        return null;
      }
    };
    return (
      <React.Fragment>
        <div className="order-travel-body-content walaa-medium-500 ">
          <div className="order-travel-body-package-content">
            <div>{renderPricebyCPApi()?.type}</div>
            <div>{getAmountWithIcon(renderPricebyCPApi()?.price)}</div>
          </div>
        </div>
        <div className="order-travel-body-content ">
          {travellerType === travelerTypeIdMap.self && (
            <div className="travel-person">
              <div className="travel-person-header">
                <div className="travel-person-name walaa-medium-500">
                  {" "}
                  {ownerDetailsResponseData
                    ? capitalizeNameFirstLetter(
                        ownerDetailsResponseData.ownerFullNameEnglish
                      )
                    : capitalizeNameFirstLetter(pTravelername)}
                </div>
                <div className="travel-person-fee">
                  {getAmountWithIcon(renderPricebyCPApi()?.price)}
                </div>
              </div>
            </div>
          )}
          {travellerType === travelerTypeIdMap.family &&
            groupedCoverageData.map((group: any, index: number) => (
              <React.Fragment key={index}>
                <div className="travel-person-group">
                  <div className="travel-person-group-one">
                    <div className="travel-person-group-name">
                      {group.nationalIqamaId}
                    </div>
                    <div className="travel-person-group-price">
                      {getAmountWithIcon(group.price)}
                    </div>
                  </div>
                  {group.coverages.length > 1 && (
                    <>
                      <div className="travel-person-group-two">
                        <div className="add-benefit-heading">
                          {langData.product?.additional_benefits1}
                        </div>
                      </div>
                      <div className="travel-person-group-three">
                        {group.coverages.map((benefits) =>
                          benefits.coverageCode !==
                          covergaeTypes.comprehensive ? (
                            <React.Fragment key={benefits.coverageCode}>
                              <div className={`add-benefit`}>
                                <p>
                                  {benefits.coverageCode ===
                                  covergaeTypes.winterSports
                                    ? langData.product?.benfit_sports
                                    : langData.product?.benfit_covid}
                                </p>
                                <p>
                                  {getAmountWithIcon(
                                    benefits.premiumInfo.annualPremium
                                  )}
                                </p>
                              </div>
                            </React.Fragment>
                          ) : null
                        )}
                      </div>
                    </>
                  )}
                </div>
              </React.Fragment>
            ))}
          {shouldRenderSelfAdditionalBenefit(leftStep, travellerType)}
        </div>
        {discounts.length > 0 && (
          <div className="order-travel-body-content">
            {discounts.map((item) => (
              <div
                key={item.id}
                className={`order-travel-body-package-content-light ${
                  travellerType === travelerTypeIdMap.self
                    ? "traveler-type-2-right"
                    : "traveler-type-1-right"
                }`}
              >
                <div>
                  {item.description || langData.consumer.default_discount}
                </div>
                <div>{getAmountWithIcon(item.amount)}</div>
              </div>
            ))}
          </div>
        )}
        <div className="order-travel-body-content">
          <div
            className={`order-travel-body-package-content-light ${
              travellerType === travelerTypeIdMap.self
                ? "traveler-type-2-right"
                : "traveler-type-1-right"
            }`}
          >
            <div>{langData.product?.adminfees}</div>
            <div>{getAmountWithIcon(renderPricebyCPApi()?.adminFee)}</div>
          </div>
        </div>
        <hr className="horizontal-travel-line" />
        <div className="order-travel-body-content walaa-medium-500">
          <div className="order-travel-body-package-content">
            <div>{langData.product?.subtotal}</div>
            <div>{getAmountWithIcon(travelsubtotal)}</div>
          </div>
        </div>
        <hr className="horizontal-travel-line" />
        <div className="order-travel-body-content">
          <div
            className={`order-travel-body-package-content-light ${
              travellerType === travelerTypeIdMap.self
                ? "traveler-type-2-right"
                : "traveler-type-1-right"
            }`}
          >
            <div>{langData.product?.vat_amount} (15%)</div>
            <div> {getAmountWithIcon(renderPricebyCPApi()?.vat)}</div>
          </div>
        </div>
      </React.Fragment>
    );
  };

  useEffect(() => {
    makeApiCall();
  }, []);

  useEffect(() => {
    if (
      isMounted &&
      requestPayload &&
      schemeCode === null &&
      requestPayload?.schemeCode === DEFAULT_SCHEME_CODE
    ) {
      handleCalculatePremium(requestPayload);
    }
  }, [schemeCode, requestPayload, isMounted]);

  return (
    <Card className="order-summary-travel-premium-breakup w-100">
      <div className="order-header justify-content-between flex-row">
        <div className="order-title walaa-medium-500">
          {leftStep === 4 ? langData.product?.order_summary : title}
        </div>
        {!schemeCode ? (
          <div className="order-sub-title walaa-medium-500 flex-row pt-1">
            <div>{langData.product?.apply_promo_code}</div>
            <div className="apply-promo-container">
              <ThemeRadioCheckbox
                type="switch"
                classes="mx-0"
                checked={isToggled}
                onChangehandler={() => {
                  if (!isToggled) {
                    setIsCouponApplied(false);
                  }
                  if (!isMounted) {
                    setIsMounted(true);
                  }
                  setIsToggled(!isToggled);
                }}
                label=""
              />
            </div>
          </div>
        ) : (
          <SchemeCodeApplied
            promoCodeApplied={data?.config?.promo_code_applied || ""}
          />
        )}
      </div>
      <hr className="horizontal-line" />
      <div className="insurancename">
        {" "}
        {leftStep === 4 ? langData.product?.title : ""}{" "}
      </div>
      <div
        className={`order-body ${
          leftStep === 3 && travellerType === travelerTypeIdMap.family
            ? "vertical-scroll"
            : ""
        }`}
      >
        {premiumBreakUpBody()}
      </div>
      <div className="order-summary-footer walaa-medium-500">
        <div className="left">{langData.product?.net_premium}</div>
        <div className="right">
          {getAmountWithIcon(renderPricebyCPApi()?.netpremium)}
        </div>
      </div>
      {data?.config && (
        <>
          <Promocode
            isOpen={isToggled}
            setIsOpen={setIsToggled}
            promoCodeHeading={data?.config?.filed_promocode || ""}
            languageData={data?.config}
            setCallGenerateOtp={setCallGenerateOtp}
            emailVal={emailVal}
            setEmailVal={setEmailVal}
            isCouponApplied={isCouponApplied}
            setIsCouponApplied={setIsCouponApplied}
            productType={TRAVELER}
          />
          <Modal
            show={isOpen}
            onHide={() => setIsOpen(false)}
            centered={true}
            size={"sm"}
            backdrop="static"
            keyboard={false}
            className={"promo-code-success"}
          >
            <SuccessCelebration
              successMessage={data?.config?.promo_code_applied_successfully}
            />
          </Modal>
        </>
      )}
      {emailVal && callGenerateOtp && (
        <OTPWrapper
          generateOtpUrl={JAVA_API_ROUTES.schemeCodeGenOtp}
          validateOtpUrl={JAVA_API_ROUTES.schemeCodeValOtp}
          languageData={{
            enter_otp_code: langData.product?.enter_otp_code,
            your_otp_will_expire: langData.product?.your_otp_will_expire,
            confirm_otp: langData.product?.confirm_otp,
            resend_otp: langData.product?.resend_otp,
          }}
          handleSuccessValidation={handleSuccessValidation}
          payload={{
            emailID: emailVal,
          }}
          callGenerateOtp={callGenerateOtp}
          setCallGenerateOtp={setCallGenerateOtp}
        />
      )}
    </Card>
  );
};

export default TravelPremiumBreakUp;
