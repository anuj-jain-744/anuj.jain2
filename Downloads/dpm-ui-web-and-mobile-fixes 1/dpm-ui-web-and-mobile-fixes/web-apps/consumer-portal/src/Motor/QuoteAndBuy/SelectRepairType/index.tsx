import React, { useEffect, useState } from "react";
import { Card, Modal } from "react-bootstrap";
import Info from "assets/CancelPolicy/Info.svg";
import "./styles.scss";
import ViewBenefitModal from "../ViewBenefitModal";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import data from "./RepairType.json";
import RepairOption from "./RepairOption";
import { calculatePremium } from "../utils/calculatePremium";
import { calculatePremium as calculateHomePremium } from "Home/QuoteAndBuy/utils/calculatePremium";
import CompareBenefitsAllCoverages from "../CoveragePlan/CoveragePlanLeft/SelectCoveragePlan/CompareBenefitsAllCoverages";
import { LanguageData } from "types/languageData";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";
import { resetCoverageCodePayload } from "utils/quoteAndBuy";
import { productIDs } from "constant";

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
    homePremiumResponse,
    availableRepairTypes,
    setAvailableRepairTypes,
    productName,
  } = useQuoteAndBuyContext();

  const { setSelectedContetBenefits, selectedContetBenefits } = usePHQuoteBuyContext();


  const [smShow, setSmShow] = useState<boolean>(false);
  const [benefitShow, setBenefitShow] = useState<boolean>(false);
  const [selectedRepairType, setSelectedRepairType] = useState<string | null>(null);

  // Maintain available repair types based on premium data
  useEffect(() => {
    if (compWorkShop ?? compAgency ?? compMath ?? comp3rdParty) {
      const types = [];
      if (compWorkShop) types.push('workShop');
      if (compMath) types.push('math');
      if (compAgency) types.push('agency');
      if (comp3rdParty) types.push('thirdParty');

      if (!availableRepairTypes.length ||
        JSON.stringify(types.sort()) !== JSON.stringify(availableRepairTypes.sort())) {
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

    }
  }, [compWorkShop, compAgency, compMath, sliderValueDeductibles]);

  const handleRadioChecked = (repairName: string) => {
    setRepairTypeSelected(repairName);

    if (selectedContetBenefits && selectedContetBenefits?.length > 0) {
      const updatedPayload = resetCoverageCodePayload(requestPayload, languageData?.defaultCoverageCode);
      updateRequestPayload(updatedPayload);
      setSelectedContetBenefits([]);
    }
  };

  const handleViewBenefitsClick = (repairType: string) => {
    setSelectedRepairType(repairType);
    setBenefitShow(true);
  };

  const handleTooltipClick = () => {
    setSmShow(true);
  };

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
    "buildingcontents": [
      {
        name: data["Walaa Care Gold"].title,
        key: 'walaacaregold',
        description: data["Walaa Care Gold"].description,
      },
      {
        name: data["Walaa Care Gold +"].title,
        key: 'walaacaregold+',
        description: data["Walaa Care Gold +"].description,
      }
    ],
    "contents": [
      {
        name: data["Walaa Care"].title,
        key: 'walaacare',
        description: data["Walaa Care"].description,
      },
      {
        name: data["Walaa Care +"].title,
        key: 'walaacare+',
        description: data["Walaa Care +"].description,
      }
    ]
  };

  // Memoized repair options based on available types
  const repairOptions = React.useMemo(() => ({
    ...baseRepairOptions,
    comprehensive: coveragePlanSelected === "comprehensive"
      ? baseRepairOptions.comprehensive.filter(option =>
        availableRepairTypes.includes(option.key)
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

  const options = repairOptions[coveragePlanSelected] ?? [];
  const totalOptions = options.length;

  return (
    <>
      <Modal
        className="repair-type-modal"
        show={smShow}
        onHide={() => setSmShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header className="header walaa-medium-500" closeButton>
          <div>{languageData?.repair_type}</div>
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
            {languageData?.isLatest ? languageData.coverage_type : data.selectRepairType}
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
              <img src={Info} alt="Tooltip_Logo" onClick={handleTooltipClick} />
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
                languageData={languageData}
                onViewBenefitsClick={handleViewBenefitsClick}
                onChangehandler={() => handleRadioChecked(option.name)}
                isRepairTypeSelected={repairTypeSelected === option.name}
              />
            );
          })}
        </div>
      </Card>
    </>
  );
};

export default RepairType;