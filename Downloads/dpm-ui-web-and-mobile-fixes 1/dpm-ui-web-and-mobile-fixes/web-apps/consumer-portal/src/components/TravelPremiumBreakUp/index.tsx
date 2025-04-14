import React, { useEffect, useState } from "react";
import { Card, Modal,Button } from "react-bootstrap";
import { LanguageData } from "types/languageData";
import "./style.scss";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import ThemeRadioCheckbox from "components/ThemeComponents/ThemeRadioCheckbox";
import { Promocode } from "components/PromoCode";
import { useApiCall } from "@dpm/shared-module";
import SchemeCodeApplied from "./schemeCodeApplied";
import { OTPWrapper } from "components/OTPValidation/OtpWrapper";
import SuccessCelebration from "components/PromoCode/successCelebration";
import { JAVA_API_ROUTES, TRAVEL_COVERAGE_TYPE, TRAVELER } from "../../constant";
import { PremiumBreakdown } from "types/quoteAndBuy";
import { compensationTypeCardFinalVAT } from "Motor/QuoteAndBuy/CoveragePlan/CommonFunction/CommonFunction";
import { calculatePremium } from "Home/QuoteAndBuy/utils/calculatePremium";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";
import { DEFAULT_SCHEME_CODE } from "Motor/QuoteAndBuy/hooks/mapCalculatePremiumPayload";
import { useCalculatePremiumApi } from 'hook/motor/useCalculatePremiumApi';
import useCalculatePremiumPayload from 'Motor/QuoteAndBuy/hooks/useCalculatePremiumPayload';
import { capitalizeNameFirstLetter} from "@dpm/shared-module";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
interface IPremiumBreakUp {
  languageData: LanguageData | undefined | null;
  title: string;
  subtitle: string;
  producttype?: string;
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
  producttype,
  leftStep
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
    travellerType,
    primaryTravelers,
    travelers,
    travelersChild,
    travelersSrcitizen,
    worldwideCoveragePrice,
    worldwideFamilyCoveragePrice,
    worldwideexceptCoveragePrice,
    europeCoveragePrice,
    worldwideFamilyCPPrice,
    dataworldwideCoverageFamily,
    dataCoverageplanselfworldwide, dataCoverageplanselfworldwideusa, dataCoverageplanselfeurope, dataCoverageplanfamilyworldwide,
  } = useQuoteAndBuyContext();
  
  const [subtotal, setSubtotal] = useState(0);
  const [vat, setVat] = useState(0);
  const [isToggled, setIsToggled] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [callGenerateOtp, setCallGenerateOtp] = useState<boolean>(false);
  const [emailVal, setEmailVal] = useState<string>("");
  const [isCouponApplied, setIsCouponApplied] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [travelsubtotal, setTravelsubtotal] = useState(0);
  const { selectedContetBenefits } = usePHQuoteBuyContext();
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


  const renderPricebyCoverageplanAPI = () => {

    switch (travelcoverage) {

      case "worldwide":
        if (travelcoverageTypeCode === "3") {
          return {
            price: worldwideFamilyCoveragePrice.dataworldwidefamilyFinalPrice || 0,
            type: TRAVEL_COVERAGE_TYPE.type_seven,
            adminFee: worldwideFamilyCoveragePrice.dataworldwidefamilyadminfee,
            netpremium: worldwideFamilyCoveragePrice.dataworldwidefamilynetpremium,
            vat: worldwideFamilyCoveragePrice.dataworldwidefamilyVAT,
            travellers: worldwideFamilyCoveragePrice.dataworldwidefamilypurchasedCoverage

          };
        }
        else if (travelcoverageTypeCode === "2") {
          return {
            price: worldwideCoveragePrice?.dataworldwidepearlFinalPrice || 0,
            type: TRAVEL_COVERAGE_TYPE.type_two,
            adminFee: worldwideCoveragePrice?.dataworldwidepearladminfee,
            netpremium: worldwideCoveragePrice?.dataworldwidepearlnetpremium,
            vat: worldwideCoveragePrice?.dataworldwidepearlVAT
          }
        }
        else if (travelcoverageTypeCode === "1") {
          return {
            price: worldwideCoveragePrice.dataworldwidetravellerFinalPrice || 0,
            type: TRAVEL_COVERAGE_TYPE.type_one,
            adminFee: worldwideCoveragePrice.dataworldwidetravelleradminfee,
            netpremium: worldwideCoveragePrice.dataworldwidetravellernetpremium,
            vat: worldwideCoveragePrice.dataworldwidetravellerVAT
          };
        }
      case "worldwideexceptusa&canada":
        if (travelcoverageTypeCode === "1") {
          return {
            price: worldwideexceptCoveragePrice.dataworldwideexcepttravellerFinalPrice || 0,
            type: TRAVEL_COVERAGE_TYPE.type_three,
            adminFee: worldwideexceptCoveragePrice.dataworldwideexcepttravelleradminfee,
            netpremium: worldwideexceptCoveragePrice.dataworldwideexcepttravellernetpremium,
            vat: worldwideexceptCoveragePrice.dataworldwideexcepttravellerVAT
          };
        } else if (travelcoverageTypeCode === "2") {
          return {
            price: worldwideexceptCoveragePrice.dataworldwideexceptpearlFinalPrice || 0,
            type: TRAVEL_COVERAGE_TYPE.type_four,
            adminFee: worldwideexceptCoveragePrice.dataworldwideexceptpearladminfee,
            netpremium: worldwideexceptCoveragePrice.dataworldwideexceptpearlnetpremium,
            vat: worldwideexceptCoveragePrice.dataworldwideexceptpearlVAT
          };
        }
      case "europe":
        if (travelcoverageTypeCode === "4") {
          return {
            price: europeCoveragePrice.dataEuropeschengenFinalPrice || 0,
            type: TRAVEL_COVERAGE_TYPE.type_five,
            adminFee: europeCoveragePrice.dataEuropeschengenadminfee,
            netpremium: europeCoveragePrice.dataEuropeschengennetpremium,
            vat: europeCoveragePrice.dataEuropeschengenVAT
          };
        } else if (travelcoverageTypeCode === "5") {
          return {
            price: europeCoveragePrice.dataEuropeeuropeFinalPrice || 0,
            type: TRAVEL_COVERAGE_TYPE.type_six,
            adminFee: europeCoveragePrice.dataEuropeeuropeadminfee,
            netpremium: europeCoveragePrice.dataEuropeeuropenetpremium,
            vat: europeCoveragePrice.dataEuropeeuropeVAT
          };
        }

      default:
        break;
    }
  }


  const renderPricebyCPApi = () => {
    switch (travelcoverage) {

      case "worldwide":

        if (travelcoverageTypeCode === "3") {
          return {
            price: worldwideFamilyCPPrice.dataworldwideFamilyFinalPrice || 0,
            type: TRAVEL_COVERAGE_TYPE.type_seven,
            adminFee: worldwideFamilyCPPrice.dataworldwideFamilyadminfee,
            netpremium: worldwideFamilyCPPrice.dataworldwideFamilynetpremium,
            vat: worldwideFamilyCPPrice.dataworldwideFamilyVAT,
            travellers: worldwideFamilyCPPrice.dataworldwideFamilypurchasedCoverage
          };
        }
        else if (travelcoverageTypeCode === "1") {
          return {
            price: worldwidetravellerInitialPrice || 0,
            type: TRAVEL_COVERAGE_TYPE.type_one,
            adminFee: dataworldwidetravelleradminfee,
            netpremium: dataworldwidetravellernetpremium,
            vat: dataworldwidetravellerVAT
          };
        } else if (travelcoverageTypeCode === "2") {
          return {
            price: worldwidepearlInitialPrice || 0,
            type: TRAVEL_COVERAGE_TYPE.type_two,
            adminFee: dataworldwidepearladminfee,
            netpremium: dataworldwidepearlnetpremium,
            vat: dataworldwidepearlVAT
          };
        }
      case "worldwideexceptusa&canada":
        if (travelcoverageTypeCode === "1") {
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
      case "europe":
        if (travelcoverageTypeCode === "4") {
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
    const newSubtotalTravel = renderPricebyCPApi();

    if (newSubtotalTravel && newSubtotalTravel.adminFee ) { // changed condition as per vipul pr comments
      
      setTravelsubtotal(newSubtotalTravel.price + newSubtotalTravel.adminFee);
    }

  }, [travelcoverage, travelcoverageTypeCode, dataEuropeeuropenetpremium, dataEuropeschengennetpremium, dataworldwideexceptpearlnetpremium, dataworldwideexcepttravellernetpremium, dataworldwidepearlnetpremium, dataworldwidetravellernetpremium, worldwideFamilyCPPrice]);

  useEffect(() => {
    const newSubtotalTravel = renderPricebyCoverageplanAPI();

    if (newSubtotalTravel && newSubtotalTravel.adminFee ) { // changed condition as per vipul pr comments
      
      setTravelsubtotal(newSubtotalTravel.price + newSubtotalTravel.adminFee);
    }

  }, [travelcoverage, travelcoverageTypeCode, dataCoverageplanselfworldwide, dataCoverageplanselfworldwideusa, dataCoverageplanselfeurope, dataCoverageplanfamilyworldwide, dataworldwideCoverageFamily]);

  const getTravellerName = ownerDetailsResponseData !== undefined && ownerDetailsResponseData !== null ?  capitalizeNameFirstLetter(ownerDetailsResponseData.ownerFullNameEnglish) : capitalizeNameFirstLetter(pTravelername)

  const groupCoverageByRiskId = (data) => {
    const persons = [
      ...primaryTravelers,
      ...travelers,
      ...travelersChild,
      ...travelersSrcitizen,
    ];
    const groupedData = {};
    data?.forEach(item => {
      const person = persons.find(val => val.uiId === item.nationalIqamaId);
      if (!groupedData[item.riskId]) {
        groupedData[item.riskId] = {
          riskId: item.riskId,
          nationalIqamaId:
            person?.travellerNameEnglish ||
            item.travellerNameEnglish ||
            item.type ||
            (item.riskId.includes("1")
              ? getTravellerName
              : item.nationalIqamaId),
          coverageCode: item.coverageCode,
          price: item.premiumInfo.finalPremium,
          coverages: []
        };
      }
      groupedData[item.riskId].coverages.push(item);
    });

    return Object.values(groupedData);
  };

 

  const premiumBreakUpBody = (title: string) => {
    return (
      <React.Fragment>
        <div className="order-travel-body-content walaa-medium-500 ">
          <div className="order-travel-body-package-content">
            <div>{renderPricebyCPApi()?.type}</div>
            <div>{languageData?.sar} {renderPricebyCPApi()?.price ? renderPricebyCPApi()?.price?.toFixed(2) : renderPricebyCoverageplanAPI()?.price?.toFixed(2)}</div>
          </div>
        </div>
        <div className="order-travel-body-content ">
          {leftStep === 2 && (
            <div className="travel-person">
              <div className="travel-person-header">
                <div className="travel-person-name walaa-medium-500"> {ownerDetailsResponseData ?  capitalizeNameFirstLetter(ownerDetailsResponseData.ownerFullNameEnglish) : capitalizeNameFirstLetter(pTravelername)}</div>
                <div className="travel-person-fee">{languageData?.sar} {renderPricebyCPApi()?.price ? renderPricebyCPApi()?.price?.toFixed(2) : renderPricebyCoverageplanAPI()?.price?.toFixed(2)}</div>
              </div>
            </div>
          )}
          {(() => {
            if ((leftStep === 3 || leftStep === 4) && travellerType === "1") {
              const travellerDetails = renderPricebyCPApi()?.travellers?.length
                ? renderPricebyCPApi()?.travellers
                : renderPricebyCoverageplanAPI()?.travellers;
              const groupedCoverageData = groupCoverageByRiskId(travellerDetails);
              
              return groupedCoverageData.map((group: any, index: number) => (
                <React.Fragment key={index}>
                    <div className="travel-person-group">
                    <div className="travel-person-group-one">
                      <div className="travel-person-group-name">{group.nationalIqamaId}</div>
                      <div className="travel-person-group-price">{languageData?.sar} {group.price?.toFixed(2)}</div>
                    </div>
                    {group.coverages.length > 1 && (() => {
                      const hasWinterSports = group.coverages.some((item) => item.coverageCode === "WSC");
                      const hasCovid = group.coverages.some((item) => item.coverageCode === "CV");
                      return (
                      <>
                        <div className="travel-person-group-two">
                        <div className="add-benefit-heading">{languageData?.additional_benefits1}</div>
                        </div>
                        <div className="travel-person-group-three">
                        <div className={`add-benefit ${hasWinterSports ? 'benefit-bg' : 'non-benefit-bg' }`}>                             
                          Winter-Sports
                          {hasWinterSports ? (
                          <CheckBoxIcon className="travel-checkbox-icon" />
                          ) : (
                          <CheckBoxOutlineBlankIcon className="travel-checkbox-blank-icon" />
                          )}
                        </div>
                        <div className={`add-benefit ${hasCovid ? 'benefit-bg' : 'non-benefit-bg' }`}>
                          Covid-19
                          {hasCovid ? (
                          <CheckBoxIcon className="travel-checkbox-icon" />
                          ) : (
                          <CheckBoxOutlineBlankIcon className="travel-checkbox-blank-icon" />
                          )}
                        </div>
                        </div>
                      </>
                      );
                    })()}
                    </div>
                </React.Fragment>
              ))
            }
          })()}
          </div>
          <div className="order-travel-body-content">
          <div className="order-travel-body-package-content-light">
            <div>{languageData?.adminfees}</div>
            <div>{languageData?.sar} {renderPricebyCPApi()?.adminFee ? renderPricebyCPApi()?.adminFee?.toFixed(2) : renderPricebyCoverageplanAPI()?.adminFee?.toFixed(2)}</div>
          </div>
          </div>
        <hr className="horizontal-travel-line" />
        <div className="order-travel-body-content walaa-medium-500">
          <div className="order-travel-body-package-content">
            <div>{languageData?.subtotal}</div>
            <div>{languageData?.sar} {travelsubtotal?.toFixed(2)}</div>
          </div>
        </div>
        <hr className="horizontal-travel-line" />
        <div className="order-travel-body-content">
          <div className="order-travel-body-package-content-light">
            <div>{languageData?.vat_amount} (15%)</div>
            <div>{languageData?.sar} {renderPricebyCPApi()?.vat ? renderPricebyCPApi()?.vat?.toFixed(2) : renderPricebyCoverageplanAPI()?.vat?.toFixed(2)}</div>
          </div>
        </div>

      </React.Fragment>
    );
  };

  useEffect(() => {
    makeApiCall();
  }, []);

  useEffect(() => {
    if (isMounted && requestPayload && schemeCode === null && requestPayload?.schemeCode === DEFAULT_SCHEME_CODE) {
      handleCalculatePremium(requestPayload)
    }
  }, [schemeCode, requestPayload, isMounted]);

  return (
    <Card className="order-summary-travel-premium-breakup w-100">
      <div className="order-header justify-content-between flex-row">
        <div className="order-title walaa-medium-500">
        {leftStep === 4 ?  languageData?.order_summary : title}

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
      <div className="insurancename">  {leftStep === 4 ?  languageData?.title : ""} </div> 
      <div className={`order-body ${leftStep === 3 && travellerType==="1" ? "vertical-scroll" : ""}`}>{premiumBreakUpBody(subtitle)}</div>
      <div className="order-summary-footer walaa-medium-500">
        <div className="left">{languageData?.net_premium}</div>
        <div className="right">
          {languageData?.sar} {renderPricebyCPApi()?.netpremium ? renderPricebyCPApi()?.netpremium?.toFixed(2) : renderPricebyCoverageplanAPI()?.netpremium?.toFixed(2)}
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
