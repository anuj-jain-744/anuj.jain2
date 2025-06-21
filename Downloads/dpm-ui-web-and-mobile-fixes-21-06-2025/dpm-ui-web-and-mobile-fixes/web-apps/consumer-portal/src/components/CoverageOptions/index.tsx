import React, { useEffect, useState } from "react";
import "./index.scss";
import CompareBenefitsTravel from "./CompareBenefitsTravel";
import { Modal } from "react-bootstrap";
import comparebenefits from "../QuoteAndBuy/MockData/comparebenefits.json";
import CloseIcon from "@mui/icons-material/Close";
import { TravelData } from "types/languageData";
import ThemeRadioCheckbox from "components/ThemeComponents/ThemeRadioCheckbox";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { worldwidecalculatePremium, worldwideexceptcalculatePremium, europecalculatePremium } from "../QuoteAndBuy/Commonfunction";
import CompareBenefitPopup from "./CompareBenefitPopup/CompareBenefitPopup";
import ViewBenefitPopup from "./ViewBenefitPopup/ViewBenefitPopup";
import { TRAVELER_COVERAGE_TYPE, TRAVELER_COVERAGE_COMPARE } from "constant";
import { getAmountWithIcon } from "@app-shell/utils/common";

type TravelType = 1 | 2;

interface Coverageoption {
  name: string;
  price: number;
  duration: string;
  coverageFor: string;
  ispopular?: boolean;
  travelType: TravelType[];
  tooltip: string;
}

interface TaxFeeBreakdown {
  amount: number;
  percentage: number;
  type: string;
}

interface PricingOption {
  finalAmount: number;
  premiumDue: number;
  taxFeeBreakdowns: TaxFeeBreakdown[];
}

interface PremiumInfo {
  annualPremium: number;
  finalPremium: number;
  grossPremium: number;
  netPremium: number;
}

interface PurchasedCoverage {
  coverageCode: string;
  coverageName: string;
  premiumInfo: PremiumInfo;
}

interface CoverageType {
  coverageType: string;
  coverageTypeCode: string;
  pricingOptions: PricingOption[];
  purchasedCoverage: PurchasedCoverage[];
}

interface coveragedata {
  // coveragedata: Coverageoption[];


  policyEffectiveDate: string;
  policyExpiryDate: string;
  previousPolicyNo: string | null;
  renewalInd: string;
  coveragePlan: string;
  coveragePlanCode: string;
  coverageTypes: CoverageType[];
}
interface CoverageSelectorProps {
  coveragedata: coveragedata;
  TravelData: TravelData;
  travelType: string;
  coveragePlanSelected: string;

}

interface comparebenefits {
  name: string;
  price: number;
  duration: string;
  coverage: string;
  benefits: {
    category: string;
    items: {
      name: string;
      value: string | number;
    }[];
  }[];
}

const CoverageOptions: React.FC<CoverageSelectorProps> = ({
  travelType,
  coveragedata,
  TravelData,
  coveragePlanSelected

}) => {
  const { setTravelCoverageType, setTravelCoverageTypeCode, travelcoverageTypeCode, travelcoverage, dataWorldwidepearl, dataWorldwidetraveller, setworldwidepearlInitialPrice, setworldwidetravellerInitialPrice, setworldwideCardPrice, setdataworldwidepearlVAT, setdataworldwidepearladminfee, setdataworldwidepearlnetpremium, setdataworldwidetravellerVAT, setdataworldwidetravelleradminfee, setdataworldwidetravellernetpremium, setworldwideexceptpearlInitialPrice, setworldwideexcepttravellerInitialPrice,
    setworldwideexceptCardPrice, setdataworldwideexceptpearlVAT,
    setdataworldwideexceptpearladminfee, setdataworldwideexceptpearlnetpremium,
    setdataworldwideexcepttravellerVAT, setdataworldwideexcepttravelleradminfee,
    setdataworldwideexcepttravellernetpremium, dataWorldwideexceptpearl, dataWorldwideexcepttraveller, dataEuropeeurope, dataEuropeschengen, setEuropeeuropeInitialPrice, setEuropeschengenInitialPrice, setEuropeCardPrice,
    setEuropeeuropeVAT, setdataEuropeeuropeadminfee, setdataEuropeeuropenetpremium,
    setdataEuropeschengenVAT, setdataEuropeschengenadminfee, setdataEuropeschengennetpremium, travelcoverageType } = useQuoteAndBuyContext();

  const [visibleplans, setVisiblePlans] = useState<string | null>(null);
  const [coveragetypeselected, setCoverageTypeSelected] = useState<string | null>(null);


  const [showModal, setShowModal] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);



  const [toolTip, setToolTip] = useState<string | null>(null);
  const [tooltipKey, settooltipKey] = useState<string | null>(null);

  const handleShowModal = (content: string | null) => {
    if (content) {
      setVisiblePlans(content);
      setShowModal(true);
      setToolTip(null);
    }
  };

  const handleShowViewModal = (content: string | null, typecontent: string | null) => {
    if (content) {
      setVisiblePlans(content);
      setCoverageTypeSelected(typecontent)
      setShowViewModal(true);
    }
  };

  const handleToolTipModal = (content: string | null, tooltiptype: string | null) => {
    if (content) {
      setIsModal(true);
      setToolTip(content);
      settooltipKey(tooltiptype);
    }
  }
  const closeTollTip = () => {
    setIsModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowViewModal(false);
  };


  const filterplans = (visibleplans === null) || (visibleplans === "both") ? comparebenefits :
    comparebenefits.filter((plan) => plan.name === visibleplans);

  const PlanSelection = (
    event: React.ChangeEvent<HTMLInputElement>,
    coveragetypecode: string
  ) => {
    setTravelCoverageType(event.target.value);
    setTravelCoverageTypeCode(coveragetypecode);

  };

  useEffect(() => {
    setTravelCoverageType(travelcoverageType);
    setTravelCoverageTypeCode(travelcoverageTypeCode);
  }, [travelcoverageType, travelcoverageTypeCode]);

  useEffect(() => {
    if (dataWorldwidepearl && dataWorldwidetraveller) {
      const priceData = worldwidecalculatePremium(
        dataWorldwidepearl, dataWorldwidetraveller
      );
      setworldwidepearlInitialPrice(priceData?.dataworldwidepearlFinalPrice ?? null);
      setworldwidetravellerInitialPrice(priceData?.dataworldwidetravellerFinalPrice ?? null);
      setworldwideCardPrice(priceData?.minFinalPrice);
      setdataworldwidepearlVAT(priceData?.dataworldwidepearlVAT);
      setdataworldwidepearladminfee(priceData?.dataworldwidepearladminfee);
      setdataworldwidepearlnetpremium(priceData?.dataworldwidepearlnetpremium);
      setdataworldwidetravellerVAT(priceData?.dataworldwidetravellerVAT);
      setdataworldwidetravelleradminfee(priceData?.dataworldwidetravelleradminfee);
      setdataworldwidetravellernetpremium(priceData?.dataworldwidetravellernetpremium);

    }
  }, [dataWorldwidepearl, dataWorldwidetraveller, travelcoverageTypeCode]);

  useEffect(() => {
    if (dataWorldwideexceptpearl && dataWorldwideexcepttraveller) {
      const priceData = worldwideexceptcalculatePremium(
        dataWorldwideexceptpearl, dataWorldwideexcepttraveller
      );
      setworldwideexceptpearlInitialPrice(priceData?.dataworldwideexceptpearlFinalPrice ?? null);
      setworldwideexcepttravellerInitialPrice(priceData?.dataworldwideexcepttravellerFinalPrice ?? null);
      setworldwideexceptCardPrice(priceData?.minFinalPrice);
      setdataworldwideexceptpearlVAT(priceData?.dataworldwideexceptpearlVAT);
      setdataworldwideexceptpearladminfee(priceData?.dataworldwideexceptpearladminfee);
      setdataworldwideexceptpearlnetpremium(priceData?.dataworldwideexceptpearlnetpremium);
      setdataworldwideexcepttravellerVAT(priceData?.dataworldwideexcepttravellerVAT);
      setdataworldwideexcepttravelleradminfee(priceData?.dataworldwideexcepttravelleradminfee);
      setdataworldwideexcepttravellernetpremium(priceData?.dataworldwideexcepttravellernetpremium);

    }
  }, [dataWorldwideexceptpearl, dataWorldwideexcepttraveller, travelcoverageTypeCode]);


  useEffect(() => {
    if (dataEuropeeurope && dataEuropeschengen) {
      const priceData = europecalculatePremium(
        dataEuropeeurope, dataEuropeschengen
      );
      setEuropeeuropeInitialPrice(priceData?.dataEuropeeuropeFinalPrice ?? null);
      setEuropeschengenInitialPrice(priceData?.dataEuropeschengenFinalPrice ?? null);
      setEuropeCardPrice(priceData?.minFinalPrice);
      setEuropeeuropeVAT(priceData?.dataEuropeeuropeVAT);
      setdataEuropeeuropeadminfee(priceData?.dataEuropeeuropeadminfee);
      setdataEuropeeuropenetpremium(priceData?.dataEuropeeuropenetpremium);
      setdataEuropeschengenVAT(priceData?.dataEuropeschengenVAT);
      setdataEuropeschengenadminfee(priceData?.dataEuropeschengenadminfee);
      setdataEuropeschengennetpremium(priceData?.dataEuropeschengennetpremium);

    }
  }, [dataEuropeeurope, dataEuropeschengen, travelcoverageTypeCode]);


  if (coveragedata) {
    coveragedata.coverageTypes.sort((a, b) => a.coverageType.localeCompare(b.coverageType));
  }



  const tooltipOptions = TravelData?.tooltip
    .filter(item => item.key === tooltipKey)
    .map(item => ({
      name: item.title,
      description: item.value
    }))

  const replaceName = (text: string, SelectedPlan: string): string => {
    const selectedPlanName = TravelData.travel_coverage_plan.find(plan => plan.codeid === SelectedPlan)?.title
    return text.replace("<<coverage_type_name>>", selectedPlanName ?? '');
  };


  const CoverageTypeInfo = ({ title, description }) => (
    <div className="repair-type-travel">
      <div className="repair-type-travel-header ">{title}</div>
      <div className="repair-type-travel-body ">{description}</div>
    </div>
  );

  return (<div className="coverage-option-container mt-3">
    <div className="coverageplan-text">{TravelData?.coverage_type_description && (
      replaceName(TravelData?.coverage_type_description, coveragePlanSelected)
    )}

    </div>
    <div className="compare_benefit_main">
      <h5 className="coverage-option-text">{TravelData.select_plan_type}{coveragedata?.coverageTypes?.length > 1 ? ` (${coveragedata?.coverageTypes?.length})` : ''}</h5>
      {coveragedata?.coverageTypes?.length > 1 && (
        <div onClick={() => handleShowModal(travelcoverage)}>
          <CompareBenefitsTravel TravelData={TravelData} />
        </div>
      )}
    </div>
    <div className="row mt-3">
      {
        coveragedata && coveragedata.coverageTypes.map((coverageType: CoverageType, index: number) => {
          const isFirst = index === 0 && coveragedata.coverageTypes.length === 2;
          const isLast = index === 1 && coveragedata.coverageTypes.length === 2;
          const onRecord = index === 0 && coveragedata.coverageTypes.length === 3;
          const onRecordLast = index === 2 && coveragedata.coverageTypes.length === 3;
          const TotalLength = coveragedata.coverageTypes.length === 3;
          const singleRecord = coveragedata.coverageTypes.length === 1;
          const tooltiptype = coverageType.coverageType === 'Traveler' ? "Traveller" : coverageType.coverageType;
          return (
            <div key={index} className={`coverage-col ${isFirst || onRecord ? "border-first" : isLast || onRecordLast ? "border-last" : singleRecord ? "border-first border-last" : "border-none"}  ${index == 1 ? "blue-bg" : "pearl-bg"} ${TotalLength ? "col-md-4" : singleRecord ? "col-md-12" : "col-md-6"}`}>
              <div className="coverage-block">
                <div className="coverage-option-check">
                  <ThemeRadioCheckbox
                    label={coverageType.coverageType}
                    type="radio"
                    defaultChecked={false}
                    classes="body-card-btn-title walaa-medium-500 butt-margin"
                    name="coverage-option"
                    checked={travelcoverageType === coverageType.coverageType}
                    onChangehandler={(
                      event: React.ChangeEvent<HTMLInputElement>
                    ) => PlanSelection(event, coverageType.coverageTypeCode)}
                  />

                </div>
                <div className="icon-container flex-row">
                  <InfoOutlinedIcon
                    onClick={() => handleToolTipModal(travelcoverage, tooltiptype)}
                    className="travel-tooltip-icon"
                  />
                </div>
                {coverageType.coverageType === "Traveler" && <span className={`most-popular-badge ${isLast ? "right-pos-one" : TotalLength && index === 1 ? "right-pos-two" : ""}`}>Most Popular</span>}
              </div>
              <div className="price-wrapper">
                <h4 className="coverage-type-price">
                       {getAmountWithIcon(coverageType?.purchasedCoverage?.[0]?.premiumInfo?.annualPremium, "coverage-price")}
                </h4>
                <button type="button" className="view-benefit-link" onClick={() => handleShowViewModal(travelcoverage, coverageType.coverageType.trim() === TRAVELER_COVERAGE_COMPARE ? TRAVELER_COVERAGE_TYPE : coverageType.coverageType.trim())}>
                  {TravelData?.view_benefits}
                </button>
              </div>


            </div>
          )
        })}
    </div>
    <> <Modal
      maxWidth="md"
      show={isModal}
      centered
      onHide={() => {
        setIsModal(false);
      }}
      className="compare-modal-custom"
    >
      <Modal.Header>
        <Modal.Title data-testid="tooltip-title" className="custom_tooltip_title">{TravelData?.coverage_types}</Modal.Title>
        <CloseIcon data-testid="img-role" className="compare_modal-close-icon" onClick={closeTollTip} />

      </Modal.Header>
      <div className="actual-content">
        {
          tooltipOptions && tooltipOptions.map((info, index) => (
            <CoverageTypeInfo
              key={index}
              title={info.name}
              description={info.description}
            />
          ))
        }
      </div>
    </Modal>
    </>

    {showModal && (
      <CompareBenefitPopup data={TravelData} onClose={() => setShowModal(false)} plan={visibleplans} />

    )}
    {showViewModal && (
      <ViewBenefitPopup data={TravelData} onClose={() => setShowViewModal(false)} plan={visibleplans} coveragetypeselected={coveragetypeselected} />

    )}
  </div>

  )
};

export default CoverageOptions;
