import React, { useEffect, useState } from "react";
import { LoaderOverlay } from "@app-shell/components/Loader";
import { Card, Modal } from "react-bootstrap";
import Info from "assets/CancelPolicy/Info.svg";
import "./styles.scss";
import ViewBenefitModal from "../ViewBenefitModal";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import data from "./RepairType.json";
import RepairOption from "./RepairOption";
import { calculatePremium } from "../utils/calculatePremium";
import { calculatePremium as calculateHomePremium } from "Home/QuoteAndBuy/utils/calculatePremium";
import { useCalculatePremiumApi } from "hook/home/useCalculatePremiumApi";
import CompareBenefitsAllCoverages from "../CoveragePlan/CoveragePlanLeft/SelectCoveragePlan/CompareBenefitsAllCoverages";
import { LanguageData } from "types/languageData";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";
import { resetCoverageCodePayload } from "utils/quoteAndBuy";
import { productIDs } from "constant";
import { AlertBox } from "components/AlertBox";
import { CalculatePremiumApiPayload } from "types/HomeCalculatePremiumApiPayload";

interface RepairTypeInfoProps {
  title: string;
  description: string;
}

interface RepairTypeProps {
  languageData: LanguageData;
  coveragePlanSelected: string;
}

interface RepairOptionType {
  name: string;
  price?: number | null;
  description: string;
  key: string;
}

interface StateEventProps {
  payloadRequest: CalculatePremiumApiPayload | null;
  coverageType: string | null;
  errorTitle?: string | null;
  errorDescription?: string | null;
  loading: boolean;
}

export const RepairTypeInfo: React.FC<RepairTypeInfoProps> = ({ title, description }) => (
  <div className="repair-type">
    <div className="repair-type-header walaa-medium-500">{title}</div>
    <div className="repair-type-body walaa-regular-400">{description}</div>
  </div>
);

const RepairType: React.FC<RepairTypeProps> = ({ languageData, coveragePlanSelected }) => {
  const {
    setRepairTypeSelected,
    repairTypeSelected,
    updateRequestPayload,
    requestPayload,
    compWorkShop,
    compAgency,
    compMath,
    comp3rdParty,
    workShopInitialPrice,
    setWorkShopInitialPrice,
    mathInitialPrice,
    setMathInitialPrice,
    agencyInitialPrice,
    setAgencyInitialPrice,
    setComprehensiveCardPrice,
    sliderValueDeductibles,
    setWsPremiumBreakdown,
    setMathPremiumBreakdown,
    setAgencyPremiumBreakdown,
    setTpPremiumBreakdown,
    homePremiumResponse,
    setHomePremiumResponse,
    availableRepairTypes,
    setAvailableRepairTypes,
    productName,
    setSelectedBenefits,
    coverageType
  } = useQuoteAndBuyContext();

  const { setSelectedContetBenefits, homeRedisData, setHomeRedisData } = usePHQuoteBuyContext();

  // set calculate home premium hooks
  const { handleCalculatePremium, isError, isLoadingCalculatePremium, data: homeCalculatePremiumResponse } = useCalculatePremiumApi();
  const [homePremiumHandling, setHomePremiumHandling] = useState<StateEventProps>({
    payloadRequest: null,
    coverageType: null,
    errorTitle: null,
    errorDescription: null,
    loading: false
  });
  const [smShow, setSmShow] = useState<boolean>(false);
  const [benefitShow, setBenefitShow] = useState<boolean>(false);
  const [selectedRepairType, setSelectedRepairType] = useState<string | null>(null);
  const isHome = homePremiumResponse && Object.keys(homePremiumResponse).length > 0;

  // Maintain available repair types based on premium data
  useEffect(() => {
    if (compWorkShop ?? compAgency ?? compMath ?? comp3rdParty) {
      const types = [];
      if (compWorkShop) types.push('workShop');
      if (compMath) types.push('math');
      if (compAgency) types.push('agency');
      if (comp3rdParty) types.push('thirdParty');

      if (!availableRepairTypes.length ||
        JSON.stringify(types.sort((a, b) => a.localeCompare(b))) !== JSON.stringify(availableRepairTypes.sort((a, b) => a.localeCompare(b)))) {
        setAvailableRepairTypes(types);
      }
    }
  }, [compWorkShop, compAgency, compMath]);

  // Update prices when premium data changes
  useEffect(() => {

    if (compWorkShop ?? compAgency ?? compMath) {
      const priceData = calculatePremium(
        compWorkShop,
        compAgency,
        compMath
      );

      setWorkShopInitialPrice(priceData?.compWorkShopFinalPrice ?? null);
      setAgencyInitialPrice(priceData?.compAgencyFinalPrice ?? null);
      setMathInitialPrice(priceData?.compMathFinalPrice ?? null);
      setComprehensiveCardPrice(priceData?.minFinalPrice);

      // Update breakdowns
      setWsPremiumBreakdown(priceData.compWorkShopData?.premiumBreakdowns || []);
      setMathPremiumBreakdown(priceData.compMataData?.premiumBreakdowns || []);
      setAgencyPremiumBreakdown(priceData.compAgencyData?.premiumBreakdowns || []);
      setTpPremiumBreakdown(
        Array.isArray(comp3rdParty?.pricingOptions) &&
          comp3rdParty?.pricingOptions.length > 0
          ? comp3rdParty?.pricingOptions[0]?.premiumBreakdowns
          : []
      );
    }
  }, [compWorkShop, compAgency, compMath, sliderValueDeductibles]);

  const handleRadioChecked = (repairName: string) => {
    //reset the additional and content benefits when selecting the other palns for home product
    if (isHome) {
      if (!homeRedisData) {
        setHomePremiumResponse({});
      }
      const updatedPayload = resetCoverageCodePayload(requestPayload, languageData?.defaultCoverageCode);
      handleCalculatePremium(updatedPayload);
      setHomePremiumHandling((prevprops) => ({ ...prevprops, payloadRequest: updatedPayload, coverageType: repairName, loading: true }));
    } else {
      setRepairTypeSelected(repairName);
    }
  };

  // trigger the useEffect to call the calculation premium API showed the price under coverage plan and type
  useEffect(() => {
    if (homeCalculatePremiumResponse && !isError && !isLoadingCalculatePremium && homePremiumHandling?.payloadRequest && homePremiumHandling?.coverageType) {
      updateRequestPayload(homePremiumHandling.payloadRequest);
      setRepairTypeSelected(homePremiumHandling.coverageType);
      setSelectedContetBenefits([]);
      setSelectedBenefits([]);
      setHomeRedisData(false);
      setHomePremiumHandling((prevprops) => ({ ...prevprops, payloadRequest: null, coverageType: null, loading: false }));
      setHomePremiumResponse(homeCalculatePremiumResponse);
    }
  }, [homeCalculatePremiumResponse, isError, isLoadingCalculatePremium, homePremiumHandling])

  useEffect(() => {
    if (isError && isLoadingCalculatePremium) {
      setHomePremiumHandling((prevprops) => ({
        ...prevprops, loading: false,
        errorTitle: isError?.name || languageData?.internal_server_error,
        errorDescription: isError.messages?.message_en ?? languageData?.something_went_wrong,
      }));
    }
  }, [isError, isLoadingCalculatePremium])

  const handleViewBenefitsClick = (repairType: string) => {
    setSelectedRepairType(repairType);
    setBenefitShow(true);
  };

  const handleTooltipClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setSmShow(true);
  };

  const coverageForPlans = (plan: string) => {
    const coverageTypes = languageData[`${plan}_headers`]?.slice(1);
    let items = [];
    if (coverageTypes) {
      for (const type of coverageTypes) {
        const data = type.trim();
        const coverageDetails = (languageData?.most_popular_coverage_plans as unknown as {name: string;  key: string;}[]).filter(item => item.name === data.trim());
        coverageDetails[0]['key'] = data.replace(/\s+/g, '').toLowerCase();
        items.push(coverageDetails[0]);
      }
    }
    return items;
  }

  // Base repair options configuration
  const baseRepairOptions = {
    "comprehensive": [
      {
        name: data["Workshop Repair"].title,
        price: workShopInitialPrice,
        description: data["Workshop Repair"].description,
        key: 'workShop',
      },
      {
        name: data["Mawthoq Repair"].title,
        price: mathInitialPrice,
        description: data["Mawthoq Repair"].description,
        key: 'math',
      },
      {
        name: data["Agency Repair"].title,
        price: agencyInitialPrice,
        description: data["Agency Repair"].description,
        key: 'agency',
      }
    ],
    "buildingcontents": coverageForPlans('buildingcontents'),
    "contents": coverageForPlans('contents')
  };

  // Memoized repair options based on available types
  const repairOptions = React.useMemo(() => ({
    ...baseRepairOptions,
    comprehensive: coveragePlanSelected === "comprehensive"
      ? baseRepairOptions.comprehensive.filter(option =>
        (availableRepairTypes || []).includes(option.key)
      )
      : baseRepairOptions.comprehensive
  }), [coveragePlanSelected, availableRepairTypes, workShopInitialPrice, agencyInitialPrice, mathInitialPrice]);

  // Reset repair type selection if no longer available
  useEffect(() => {
    if (coveragePlanSelected === "comprehensive" && repairTypeSelected) {
      const selectedOptionExists = repairOptions.comprehensive.some(
        option => option.name === repairTypeSelected
      );

      if (!selectedOptionExists && repairOptions.comprehensive.length > 0) {
        handleRadioChecked(repairOptions.comprehensive[0].name);
      } else if (!selectedOptionExists) {
        setRepairTypeSelected(null);
      }
    }
  }, [coveragePlanSelected, repairOptions.comprehensive]);

  const calculatePrice = (option: RepairOptionType): number | null => {
    let price = option.price ?? null;
    if (option.key && !['workShop', 'math', 'agency'].includes(option.key)) {
      const repairOptionData = { [option.key]: homePremiumResponse[option.key] };
      const priceData = calculateHomePremium(repairOptionData);
      price = priceData.minFinalPrice;
    }
    return price;
  };

  const handleModalClose = () => {
    setHomePremiumHandling((prevprops) => ({
      ...prevprops,
      errorTitle: null,
      errorDescription: null,
    }));
  }

  const options = repairOptions[coveragePlanSelected] ?? [];
  const totalOptions = options.length;

  return (
    <>
      {homePremiumHandling.loading && <LoaderOverlay />}
      <AlertBox
        title={homePremiumHandling.errorTitle}
        description={homePremiumHandling.errorDescription}
        showAlertModal={Boolean(homePremiumHandling.errorTitle && homePremiumHandling.errorDescription)}
        setShowAlertModal={handleModalClose}
      />
      <Modal
        className="repair-type-modal"
        show={smShow}
        onHide={() => setSmShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header className="header walaa-medium-500" closeButton>
          <div>{languageData?.repair_type ?? languageData?.coverage_types}</div>
        </Modal.Header>
        <div className="sub-heading">
          {options.map((info, index) => (
            <RepairTypeInfo
              key={index}
              title={info.name}
              description={info.description}
            />
          ))}
        </div>
      </Modal>


      {selectedRepairType && (
        <ViewBenefitModal
          show={benefitShow}
          coveragePlanSelected={coveragePlanSelected}
          languageData={languageData}
          onHide={() => setBenefitShow(false)}
          price={
            options.find((option) => option.name === selectedRepairType)
              ?.price
          }

          repairType={selectedRepairType}
        />
      )}


      <Card className="repair-type-card-container">
        <div className={`header-container ${productName === productIDs.motor ? "justify-content-start" : ""}`}>
          <div className="header-content walaa-medium-500">
            {languageData?.isLatest ? languageData?.coverage_type : data.selectRepairType}
            ({repairOptions[coveragePlanSelected]?.length ?? 0})
          </div>
          {productName !== productIDs.motor && (
            <div>
              <CompareBenefitsAllCoverages
                languageData={languageData}
                coveragePlanSelected={coveragePlanSelected}
              />
            </div>
          )}
          {productName === productIDs.motor && (
            <div className="benefits-tooltip-icon">
              <img src={Info} alt="" onClick={handleTooltipClick} />
            </div>
          )}
        </div>
        <div className="plans">
          {options.map((option, index) => {
            const price = calculatePrice(option);
            return (
              <RepairOption
                key={index}
                name={option.name}
                totalOptions={totalOptions}
                price={price}
                index={index}
                coverageType={coverageType}
                languageData={languageData}
                onViewBenefitsClick={handleViewBenefitsClick}
                onChangehandler={() => handleRadioChecked(option.name)}
                isRepairTypeSelected={repairTypeSelected === option.name}
                handleTooltipClick={handleTooltipClick}
              />
            );
          })}
        </div>
      </Card>
    </>
  );
};

export default RepairType;
