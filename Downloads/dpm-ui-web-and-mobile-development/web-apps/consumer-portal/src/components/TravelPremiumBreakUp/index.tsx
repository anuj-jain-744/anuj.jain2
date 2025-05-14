import React, { useEffect, useState } from "react";
import { Card, Modal } from "react-bootstrap";
import { LanguageData } from "types/languageData";
import "./style.scss";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import ThemeRadioCheckbox from "components/ThemeComponents/ThemeRadioCheckbox";
import { Promocode } from "components/PromoCode";
import { useApiCall, capitalizeNameFirstLetter } from "@dpm/shared-module";
import SchemeCodeApplied from "./schemeCodeApplied";
import { OTPWrapper } from "components/OTPValidation/OtpWrapper";
import SuccessCelebration from "components/PromoCode/successCelebration";
import {
  COMPREHENSIVE_TRAVEL_INSURANCE_CODE,
  coverageTypeIdMap,
  JAVA_API_ROUTES,
  TRAVEL_COVERAGE_TYPE,
  TRAVELER,
  WINTER_SPORTS_COVER_CODE,
} from "../../constant";
import { DEFAULT_SCHEME_CODE } from "Motor/QuoteAndBuy/hooks/mapCalculatePremiumPayload";
import { useCalculatePremiumApi } from "hook/motor/useCalculatePremiumApi";
import useCalculatePremiumPayload from "Motor/QuoteAndBuy/hooks/useCalculatePremiumPayload";
import { getAmountWithIcon } from "@app-shell/utils/common";

interface IPremiumBreakUp {
  languageData: LanguageData | undefined | null;
  title: string;
  subtitle: string;
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

const TravelPremiumBreakUp: React.FC<IPremiumBreakUp> = ({
  languageData,
  title,
  subtitle,
  leftStep,
}) => {
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
    dataCoverageplanselfworldwide,
    dataCoverageplanselfworldwideusa,
    dataCoverageplanselfeurope,
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
        if (travelcoverageTypeCode === "3") {
          const finalAmount =
            worldwideFamilyCPPrice?.dataworldwideFamilypurchasedCoverage?.reduce(
              (acc, item) => {
                if (item.coverageCode === "CTI") {
                  return acc + (item?.premiumInfo?.netPremium ?? 0);
                }
                return acc;
              },
              0
            );
          return {
            price: finalAmount,
            type: TRAVEL_COVERAGE_TYPE.type_seven,
            adminFee: worldwideFamilyCPPrice.dataworldwideFamilyadminfee,
            netpremium: worldwideFamilyCPPrice.dataworldwideFamilynetpremium,
            vat: worldwideFamilyCPPrice.dataworldwideFamilyVAT,
            travellers:
              worldwideFamilyCPPrice.dataworldwideFamilypurchasedCoverage,
          };
        } else if (travelcoverageTypeCode === "1") {
          const finalAmount =
            dataWorldwidetraveller?.purchasedCoverage[0]?.premiumInfo
              ?.netPremium || 0;
          return {
            price: finalAmount,
            type: TRAVEL_COVERAGE_TYPE.type_one,
            adminFee: dataworldwidetravelleradminfee,
            netpremium: dataworldwidetravellernetpremium,
            vat: dataworldwidetravellerVAT,
            coverageOpted: dataWorldwidetraveller?.purchasedCoverage,
          };
        } else if (travelcoverageTypeCode === "2") {
          const finalAmount =
            dataWorldwidepearl?.purchasedCoverage[0]?.premiumInfo?.netPremium ||
            0;
          return {
            price: finalAmount,
            type: TRAVEL_COVERAGE_TYPE.type_two,
            adminFee: dataworldwidepearladminfee,
            netpremium: dataworldwidepearlnetpremium,
            vat: dataworldwidepearlVAT,
            coverageOpted: dataWorldwidepearl?.purchasedCoverage,
          };
        } else break;
      case coverageTypeIdMap.worldwide1:
        if (travelcoverageTypeCode === "1") {
          const finalAmount =
            dataWorldwideexcepttraveller?.purchasedCoverage[0]?.premiumInfo
              ?.netPremium || 0;
          return {
            price: finalAmount,
            type: TRAVEL_COVERAGE_TYPE.type_three,
            adminFee: dataworldwideexcepttravelleradminfee,
            netpremium: dataworldwideexcepttravellernetpremium,
            vat: dataworldwideexcepttravellerVAT,
            coverageOpted: dataWorldwideexcepttraveller?.purchasedCoverage,
          };
        } else {
          const finalAmount =
            dataWorldwideexceptpearl?.purchasedCoverage[0]?.premiumInfo
              ?.netPremium || 0;
          return {
            price: finalAmount,
            type: TRAVEL_COVERAGE_TYPE.type_four,
            adminFee: dataworldwideexceptpearladminfee,
            netpremium: dataworldwideexceptpearlnetpremium,
            vat: dataworldwideexceptpearlVAT,
            coverageOpted: dataWorldwideexceptpearl?.purchasedCoverage,
          };
        }
      case coverageTypeIdMap.europe:
        if (travelcoverageTypeCode === "4") {
          const finalAmount =
            dataEuropeschengen?.purchasedCoverage[0]?.premiumInfo?.netPremium ||
            0;
          return {
            price: finalAmount,
            type: TRAVEL_COVERAGE_TYPE.type_five,
            adminFee: dataEuropeschengenadminfee,
            netpremium: dataEuropeschengennetpremium,
            vat: dataEuropeschengenVAT,
            coverageOpted: dataEuropeschengen?.purchasedCoverage,
          };
        } else {
          const finalAmount =
            dataEuropeeurope?.purchasedCoverage[0]?.premiumInfo?.netPremium ||
            0;
          return {
            price: finalAmount,
            type: TRAVEL_COVERAGE_TYPE.type_six,
            adminFee: dataEuropeeuropeadminfee,
            netpremium: dataEuropeeuropenetpremium,
            vat: dataEuropeeuropeVAT,
            coverageOpted: dataEuropeeurope?.purchasedCoverage,
          };
        }
      default:
        break;
    }
  };

  useEffect(() => {
    const newSubtotalTravel = renderPricebyCPApi();
    if (newSubtotalTravel && newSubtotalTravel.adminFee) {
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
          price: item.premiumInfo.netPremium,
          coverages: [],
        };
      }
      groupedData[item.riskId].coverages.push(item);
    });

    return Object.values(groupedData);
  };

  const premiumBreakUpBody = () => {
    const shouldRenderSelfAdditionalBenefit = (
      leftStep: number | undefined,
      travellerType: string | null
    ) => {
      if (travellerType === "2") {
        const coverageOpted = renderPricebyCPApi()?.coverageOpted;
        if (coverageOpted && coverageOpted.length > 1) {
          return (
            <div className="travel-person-benefits">
              <div className="travel-person-group-two">
                <div className="add-benefit-heading">
                  {languageData?.additional_benefits1}
                </div>
              </div>
              <div className="travel-person-group-three">
                {coverageOpted.map((coverage: any) =>
                  coverage.coverageCode !==
                  COMPREHENSIVE_TRAVEL_INSURANCE_CODE ? (
                    <div className="add-benefit" key={coverage.coverageCode}>
                      <p>
                        {coverage.coverageCode === WINTER_SPORTS_COVER_CODE
                          ? "Winter-Sports"
                          : "Covid-19"}
                      </p>
                      <p>
                        {getAmountWithIcon(coverage.premiumInfo.finalPremium)}
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
          {travellerType === "2" && (
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
          {(() => {
            if (travellerType === "1") {
              const travellerDetails = renderPricebyCPApi()?.travellers ?? [];
              const groupedCoverageData =
                groupCoverageByRiskId(travellerDetails);

              return groupedCoverageData.map((group: any, index: number) => (
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
                    {group.coverages.length > 1 &&
                      (() => {
                        const hasWinterSports = group.coverages.some(
                          (item) => item.coverageCode === "WSC"
                        );
                        const hasCovid = group.coverages.some(
                          (item) => item.coverageCode === "CV"
                        );
                        return (
                          <>
                            <div className="travel-person-group-two">
                              <div className="add-benefit-heading">
                                {languageData?.additional_benefits1}
                              </div>
                            </div>
                            <div className="travel-person-group-three">
                              {group.coverages.map((benefits) =>
                                benefits.coverageCode !== "CTI" ? (
                                  <React.Fragment key={benefits.coverageCode}>
                                    <div className={`add-benefit`}>
                                      <p>
                                        {benefits.coverageCode === "WSC"
                                          ? "Winter-Sports"
                                          : "Covid-19"}
                                      </p>
                                      <p>
                                        {getAmountWithIcon(
                                          benefits.premiumInfo.finalPremium
                                        )}
                                      </p>
                                    </div>
                                  </React.Fragment>
                                ) : null
                              )}
                            </div>
                          </>
                        );
                      })()}
                  </div>
                </React.Fragment>
              ));
            }
          })()}
          {shouldRenderSelfAdditionalBenefit(leftStep, travellerType)}
        </div>
        <div className="order-travel-body-content">
          <div
            className={`order-travel-body-package-content-light ${
              travellerType === "2"
                ? "traveler-type-2-right"
                : "traveler-type-1-right"
            }`}
          >
            <div>{languageData?.adminfees}</div>
            <div>{getAmountWithIcon(renderPricebyCPApi()?.adminFee)}</div>
          </div>
        </div>
        <hr className="horizontal-travel-line" />
        <div className="order-travel-body-content walaa-medium-500">
          <div className="order-travel-body-package-content">
            <div>{languageData?.subtotal}</div>
            <div>{getAmountWithIcon(travelsubtotal)}</div>
          </div>
        </div>
        <hr className="horizontal-travel-line" />
        <div className="order-travel-body-content">
          <div
            className={`order-travel-body-package-content-light ${
              travellerType === "2"
                ? "traveler-type-2-right"
                : "traveler-type-1-right"
            }`}
          >
            <div>{languageData?.vat_amount} (15%)</div>
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
          {leftStep === 4 ? languageData?.order_summary : title}
        </div>
        {!schemeCode ? (
          <div className="order-sub-title walaa-medium-500 flex-row pt-1">
            <div>{languageData?.apply_promo_code}</div>
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
        {leftStep === 4 ? languageData?.title : ""}{" "}
      </div>
      <div
        className={`order-body ${
          leftStep === 3 && travellerType === "1" ? "vertical-scroll" : ""
        }`}
      >
        {premiumBreakUpBody()}
      </div>
      <div className="order-summary-footer walaa-medium-500">
        <div className="left">{languageData?.net_premium}</div>
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
      {languageData && emailVal && callGenerateOtp && (
        <OTPWrapper
          generateOtpUrl={JAVA_API_ROUTES.schemeCodeGenOtp}
          validateOtpUrl={JAVA_API_ROUTES.schemeCodeValOtp}
          languageData={{
            enter_otp_code: languageData?.enter_otp_code,
            your_otp_will_expire: languageData.your_otp_will_expire,
            confirm_otp: languageData.confirm_otp,
            resend_otp: languageData.resend_otp,
          }}
          handleSuccessValidation={handleSuccessValidation}
          payload={{
            emailID: emailVal,
          }}
          callGenerateOtp={callGenerateOtp}
        />
      )}
    </Card>
  );
};

export default TravelPremiumBreakUp;
