import React, { useEffect, useState } from "react";
import { Card, Modal } from "react-bootstrap";
import { LanguageData } from "types/languageData";
import "./style.scss";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import ThemeRadioCheckbox from "components/ThemeComponents/ThemeRadioCheckbox";
import { Promocode } from "components/PromoCode";
import SchemeCodeApplied from "./schemeCodeApplied";
import { OTPWrapper } from "components/OTPValidation/OtpWrapper";
import SuccessCelebration from "components/PromoCode/successCelebration";
import { coveragePlanTypeIdMap, coverageTypeIdMap, JAVA_API_ROUTES, TRAVEL_COVERAGE_TYPE } from "../../constant";
import { PremiumBreakdown } from "types/quoteAndBuy";
import { compensationTypeCardFinalVAT } from "Motor/QuoteAndBuy/CoveragePlan/CommonFunction/CommonFunction";
import { calculatePremium } from "Home/QuoteAndBuy/utils/calculatePremium";
import { DEFAULT_SCHEME_CODE } from "Motor/QuoteAndBuy/hooks/mapCalculatePremiumPayload";
import { useCalculatePremiumApi } from 'hook/motor/useCalculatePremiumApi';
import useCalculatePremiumPayload from 'Motor/QuoteAndBuy/hooks/useCalculatePremiumPayload';
import { getAmountText } from "@dpm/shared-module";
import { getAmountWithIcon } from "@app-shell/utils/common";


interface IPremiumBreakUp {
  languageData: LanguageData | undefined | null;
  title: string;
  subtitle: string;
  producttype?: string;
  data: any;
  setLeftStep?: (val: number) => void;
}

export interface PremiumDescription {
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

export interface PromoCodeResponse {
  config: PromoCodeConfigResponse;
}

export interface TravelLink {
  label: string;
  link: string;
}

const PremiumBreakUp: React.FC<IPremiumBreakUp> = ({
  languageData,
  title,
  subtitle,
  producttype,
  data,
  setLeftStep
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
    schemeCode,
    travelcoverageTypeCode,
    travelcoverage,
    worldwidetravellerInitialPrice,
    worldwidepearlInitialPrice,
    dataworldwidepearladminfee,
    dataworldwidetravelleradminfee,
    dataworldwidepearlnetpremium,
    dataworldwidetravellernetpremium,
    dataworldwidepearlVAT,
    dataworldwidetravellerVAT,

    worldwideexcepttravellerInitialPrice,
    worldwideexceptpearlInitialPrice,
    dataworldwideexceptpearladminfee,
    dataworldwideexcepttravelleradminfee,
    dataworldwideexceptpearlnetpremium,
    dataworldwideexcepttravellernetpremium,
    dataworldwideexceptpearlVAT,
    dataworldwideexcepttravellerVAT,


    EuropeeuropeInitialPrice,
    EuropeschengenInitialPrice,
    dataEuropeeuropeadminfee,
    dataEuropeschengenadminfee,
    dataEuropeeuropenetpremium,
    dataEuropeschengennetpremium,
    dataEuropeeuropeVAT,
    dataEuropeschengenVAT,
    wsPremiumBreakdown,
    tpPremiumBreakdown,
    agencyPremiumBreakdown,
    mathPremiumBreakdown,
    homePremiumResponse,
    travelCovidcoverage,
    travelWintersportscoverage,
    pTravelername,
    coverageType,
    ownerDetailsResponseData,
    isTpOnly, isRenewpolicy
  } = useQuoteAndBuyContext();
  const [subtotal, setSubtotal] = useState(0);
  const [vat, setVat] = useState(0);
  const [adminFees, setAdminFees] = useState(0);
  const [isToggled, setIsToggled] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [callGenerateOtp, setCallGenerateOtp] = useState<boolean>(false);
  const [emailVal, setEmailVal] = useState<string>("");
  const [isCouponApplied, setIsCouponApplied] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [travelsubtotal, setTravelsubtotal] = useState(0);
  const { handleCalculatePremium } = useCalculatePremiumApi();
  const requestPayload = useCalculatePremiumPayload();
  const [additionalDetails, setAdditionalDetails] = useState<TravelLink[]>([]);

  // additional traveller for travel button on premium breakup window display starts
  useEffect(() => {
    if (languageData) {
      setAdditionalDetails([
        {
          label: languageData?.benfit_sports || "",
          link: travelWintersportscoverage,
        }, {
          label: languageData?.benfit_covid || "",
          link: travelCovidcoverage,
        }
      ]);
    }
  }, [languageData, travelCovidcoverage, travelWintersportscoverage]);
  // additional traveller for travel button on premium breakup window display ends



  const isHome = homePremiumResponse && Object.keys(homePremiumResponse).length > 0;

  const renderPrice = () => {
    switch (repairTypeSelected) {
      case "Workshop Repair":
        return workShopInitialPrice ?? 0;
      case "Mawthoq Repair":
        return mathInitialPrice ?? 0;
      case "Agency Repair":
        return agencyInitialPrice ?? 0;
      default:
        return comp3rdParty?.pricingOptions[0]?.finalAmount ?? 0;
    }
  };

  const getPremiumArr = () => {
    switch (repairTypeSelected) {
      case "Workshop Repair":
        return wsPremiumBreakdown || [];
      case "Mawthoq Repair":
        return mathPremiumBreakdown || [];
      case "Agency Repair":
        return agencyPremiumBreakdown || [];
      default:
        return tpPremiumBreakdown || [];
    }
  };

  const handleSuccessValidation = () => {
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

  const renderPriceTravel = () => {
    switch (travelcoverage) {

      case coverageTypeIdMap.worldwide:
        if (travelcoverageTypeCode === coveragePlanTypeIdMap.type1) {
          return {
            price: worldwidetravellerInitialPrice || 0,
            type: TRAVEL_COVERAGE_TYPE.type_one,
            adminFee: dataworldwidetravelleradminfee,
            netpremium: dataworldwidetravellernetpremium,
            vat: dataworldwidetravellerVAT
          };
        } else {
          return {
            price: worldwidepearlInitialPrice || 0,
            type: TRAVEL_COVERAGE_TYPE.type_two,
            adminFee: dataworldwidepearladminfee,
            netpremium: dataworldwidepearlnetpremium,
            vat: dataworldwidepearlVAT
          };
        }
      case coverageTypeIdMap.worldwide1:
        if (travelcoverageTypeCode === coveragePlanTypeIdMap.type1) {
          return {
            price: worldwideexcepttravellerInitialPrice || 0,
            type: TRAVEL_COVERAGE_TYPE.type_three,
            adminFee: dataworldwideexcepttravelleradminfee,
            netpremium: dataworldwideexcepttravellernetpremium,
            vat: dataworldwideexcepttravellerVAT
          };
        } else {
          return {
            price: worldwideexceptpearlInitialPrice || 0,
            type: TRAVEL_COVERAGE_TYPE.type_four,
            adminFee: dataworldwideexceptpearladminfee,
            netpremium: dataworldwideexceptpearlnetpremium,
            vat: dataworldwideexceptpearlVAT
          };
        }
      case coverageTypeIdMap.europe:
        if (travelcoverageTypeCode === coveragePlanTypeIdMap.type4) {
          return {
            price: EuropeschengenInitialPrice || 0,
            type: TRAVEL_COVERAGE_TYPE.type_five,
            adminFee: dataEuropeschengenadminfee,
            netpremium: dataEuropeschengennetpremium,
            vat: dataEuropeschengenVAT
          };
        } else {
          return {
            price: EuropeeuropeInitialPrice || 0,
            type: TRAVEL_COVERAGE_TYPE.type_six,
            adminFee: dataEuropeeuropeadminfee,
            netpremium: dataEuropeeuropenetpremium,
            vat: dataEuropeeuropeVAT
          };
        }
      default:
        break
    }
  };

  useEffect(() => {
    if (!isHome) {
      const benefitsTotal = selectedBenefits.reduce(
        (acc, benefit) => acc + (benefit.benefitPrice ?? 0),
        0
      );

      const newSubtotal = renderPrice() + benefitsTotal;
      setSubtotal(newSubtotal);

      const newVat = newSubtotal * 0.15;
      setVat(newVat);

      const newNetPremium = newSubtotal + newVat;
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
    isHome
  ]);

  const renderHomePrice = () => {
    const coverageType = repairTypeSelected.replace(/\s+/g, '').toLowerCase();
    const price: { 'minFinalPrice': number, 'subTotal': number, 'vatPrice': number, 'vatAmount': number, 'netPremium': number, 'adminFees': number } = calculatePremium({ [coverageType]: homePremiumResponse[coverageType] });
    return price;
  }

  const callhandleCalculatePremium = () => {
    if (requestPayload) {
      let requestPayloadScheme = {
        ...requestPayload,
        policyBasic: {
          ...requestPayload?.policyBasic,
          effectiveDate: requestPayload?.policyBasic?.effectiveDate || "",
          schemeCode: DEFAULT_SCHEME_CODE,
        }
      }
      handleCalculatePremium(requestPayloadScheme);
    }
  }
  useEffect(() => {
    if (isHome) {
      const price = renderHomePrice();
      setSubtotal(price.subTotal + price.adminFees);
      setVat(price.vatAmount);
      setPremium(price.netPremium);
      setAdminFees(getAmountText(price.adminFees))
    }
  }, [
    isHome,
    selectedBenefits,
    repairTypeSelected,
    homePremiumResponse
  ]);
  useEffect(() => {
    const newSubtotalTravel = renderPriceTravel();
    if (newSubtotalTravel && newSubtotalTravel.adminFee !== null) {
      setTravelsubtotal(newSubtotalTravel.price + newSubtotalTravel.adminFee);
    }

  }, [travelcoverage, travelcoverageTypeCode, dataEuropeeuropenetpremium, dataEuropeschengennetpremium,
    dataworldwideexceptpearlnetpremium, dataworldwideexcepttravellernetpremium, dataworldwidepearlnetpremium, dataworldwidetravellernetpremium]);

  const orderCovergeDetails = coverageType && Array.isArray(repairTypeSelected?.coverage_plan) && repairTypeSelected?.coverage_plan?.find(val => val.key === coverageType);

  const premiumBreakUpBody = (title: string) => {


    return (
      producttype === "Travel" ? (<React.Fragment>
        <div className="order-travel-body-content walaa-medium-500">
          <div className="order-travel-body-package-content">
            <div>{renderPriceTravel()?.type}</div>
            <div>{getAmountWithIcon(renderPriceTravel()?.price)}</div>
          </div>
        </div>
        <div className="order-travel-body-content">
          <div className="travel-person">
            <div className="travel-person-header">
              <div className="travel-person-nam">  {ownerDetailsResponseData ? ownerDetailsResponseData.ownerFullNameEnglish : pTravelername} </div>
              <div className="travel-person-fee">{getAmountWithIcon(renderPriceTravel()?.adminFee)}</div>
            </div>
            <div className="poli-detail-container-left">
              {additionalDetails && additionalDetails.length > 0 ? (
                additionalDetails
                  .filter(detail => detail.link)
                  .map((detail, index) => (
                    <button key={index} className="tra-info-btn col-3"> {detail.label} </button>
                  ))
              ) : null}
            </div>
          </div>

          <div className="order-travel-body-package-content-light">
            <div>{languageData?.adminfees}</div>
            <div>{getAmountWithIcon(renderPriceTravel()?.adminFee)}</div>
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
          <div className="order-travel-body-package-content-light">
            <div>{languageData?.vat_amount} (15%)</div>
            <div>{getAmountWithIcon(renderPriceTravel()?.vat)}</div>
          </div>
        </div>

      </React.Fragment>) : (
        <React.Fragment>
          <div className="order-body-content">
            {getPremiumArr()?.sort((a, b) => Number(a.type) - Number(b.type))?.map((val: PremiumBreakdown) => {
              return (
                <div className="order-body-package-content" key={val?.amount}>
                  <div>
                    {data?.config.premium_breakdown.find((valD: PremiumDescription) => {
                      return valD.code.toString() === val.type;
                    })?.description}
                  </div>
                  <div>
                    {getAmountWithIcon(`${val.sign === -1 ? "-" : ""} ${val.amount}`)}
                  </div>
                </div>
              )
            })}
            <div className="order-body-package-content content-title">
              <div>{title}</div>
              {repairTypeSelected === null ? (
                <div>
                  {!isHome && getAmountWithIcon(renderPrice())} {isHome && getAmountWithIcon(renderHomePrice().minFinalPrice)}
                </div>)
                : (
                  <div></div>
                )
              }
            </div>

            {repairTypeSelected ? (
              <div className="order-body-package-content content-light">
                <div>
                  {repairTypeSelected !== null && (
                    <>
                      {orderCovergeDetails?.title && (
                        <div className="title">{orderCovergeDetails?.title}</div>
                      )}
                      <div className="subtitle">{repairTypeSelected}</div>
                    </>
                  )}
                </div>
                {repairTypeSelected !== null && (
                  <div>
                    {!isHome && getAmountWithIcon(renderPrice())}{" "}
                    {isHome && getAmountWithIcon(renderHomePrice().minFinalPrice)}
                  </div>
                )}
              </div>
            ) : null}
            {selectedBenefits?.length > 0 && languageData?.additional_benefits && <div className="additional">{languageData?.additional_benefits}</div>}
            {selectedBenefits?.filter((value) => value.benefitNameEn)?.map((benefit, index) => (
              <div key={index} className="order-body-package-content content-light">
                <div className="w-50 left-text">{benefit.benefitNameEn}</div>
                <div>
                  {getAmountWithIcon(benefit?.benefitPrice)}
                </div>
              </div>
            ))}
          </div>
          {isHome && <>
            <hr className="horizontal-line" />
            <div className="order-body-content">
              <div className="order-body-package-content content-light">
                <div>{languageData?.adminfees}</div>
                <div>
                  {getAmountWithIcon(adminFees)}
                </div>
              </div>
            </div>
          </>
          }
          <hr className="horizontal-line" />
          <div className="order-body-content">
            <div className="order-body-package-content content-subtotal">
              <div>{languageData?.subtotal}</div>
              <div>
                {getAmountWithIcon(subtotal)}
              </div>
            </div>
          </div>
          <hr className="horizontal-line" />
          <div className="order-body-content">
            <div className="order-body-package-content content-light">
              <div>{languageData?.vat_amount} ({isHome ? compensationTypeCardFinalVAT(renderHomePrice().vatPrice) : '15'}%)</div>
              <div>
                {getAmountWithIcon(vat)}
              </div>
            </div>
          </div>
        </React.Fragment>)
    );
  };



  return (
    <Card className="order-summary-premium-breakup w-100">
      <div className="order-header justify-content-between flex-row">
        <div className="order-title walaa-medium-500">{title}</div>
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
            callhandleCalculatePremium={callhandleCalculatePremium}
            setLeftStep={setLeftStep}
          />
        )}
      </div>
      <hr className="horizontal-line" />
      <div className="order-body">{premiumBreakUpBody(subtitle)}</div>
      <div className="order-summary-footer walaa-medium-500">
        <div className="left">{languageData?.net_premium}</div>
        <div className="right">
          {producttype === "Travel" ? getAmountWithIcon(renderPriceTravel()?.netpremium) : getAmountWithIcon(premium)}
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
            setLeftStep={setLeftStep}
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
      {callGenerateOtp && (
        <OTPWrapper
          generateOtpUrl={JAVA_API_ROUTES.schemeCodeGenOtp}
          validateOtpUrl={JAVA_API_ROUTES.schemeCodeValOtp}
          languageData={{
            enter_otp_code: languageData?.enter_otp_code ?? "",
            your_otp_will_expire: languageData?.your_otp_will_expire ??"",
            confirm_otp: languageData?.confirm_otp ?? "",
            resend_otp: languageData?.resend_otp ?? "",
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

export default PremiumBreakUp;
