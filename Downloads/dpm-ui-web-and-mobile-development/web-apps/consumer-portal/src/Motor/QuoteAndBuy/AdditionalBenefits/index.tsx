import { useState, useEffect } from "react";
import { Benefit } from "types/quoteAndBuy";
import { LanguageData } from "types/languageData";
import "./styles.scss";
import { AlertBox } from "components/AlertBox";
import { Card } from "react-bootstrap";
import { convertCoverageToBenefits, addAddtionalBenefitsToPremium } from "utils/quoteAndBuy";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";
import BenefitCard from "./BenefitCard";
import { useCalculatePremiumApi } from "hook/home/useCalculatePremiumApi";
import {IComprehensive} from "../../QuoteAndBuy/CoveragePlan/ConstantValue/ConstantValue";

interface AdditionalBenifitProps {
  languageData: LanguageData;
  repairTypeSelected: string | undefined | null;
}

function AdditionalBenefits({ languageData, repairTypeSelected }: Readonly<AdditionalBenifitProps>) {
  const { selectedBenefits, setSelectedBenefits, compWorkShop, comp3rdParty, compAgency, compMath, homePremiumResponse, setHomePremiumResponse, requestPayload, updateRequestPayload, viewPolicyData, isRenewpolicy } = useQuoteAndBuyContext();

  const { apiErrorMessage, setApiErrorMessage, resetApiErrorMessage, showAlertModal, setShowAlertModal } = usePHQuoteBuyContext()

  const { handleCalculatePremium, isError, isLoadingCalculatePremium, data } = useCalculatePremiumApi();

  const [showAllBenefits, setShowAllBenefits] = useState(false);
  const [tempBenefits, setTempBenefits] = useState({});
  const [hasMappedBenefits, setHasMappedBenefits] = useState(false); // Flag to check if benefits have been mapped

  useEffect(() => {
    if (data && !isLoadingCalculatePremium) {
      if (tempBenefits.payloadRequest) {
        updateRequestPayload(tempBenefits.payloadRequest);
      }
     
      if(tempBenefits?.code){
        setSelectedBenefits((prev) =>
        prev.some((benefit) => benefit.title === tempBenefits.title)
          ? prev.filter((benefit) => benefit.title !== tempBenefits.title)
          : [...prev, { title: tempBenefits.title, price: tempBenefits.price, code: tempBenefits.code,id: tempBenefits.id }]
      );
      }
      
      setTempBenefits({});
      setHomePremiumResponse(data);
    }
  }, [data, isLoadingCalculatePremium])

  useEffect(() => {
    if (isError && isLoadingCalculatePremium) {
      setTempBenefits({});
      setShowAlertModal(true);
      setApiErrorMessage({
        title: isError?.name || languageData?.internal_server_error,
        description: isError.messages?.message_en ?? languageData?.something_went_wrong,
      });
    }
  }, [isError, isLoadingCalculatePremium])

  const handleModalClose = () => {
    setShowAlertModal(false);
    setApiErrorMessage(resetApiErrorMessage);
  }

  const premiumResponseKeys = homePremiumResponse && Object.keys(homePremiumResponse);
  const isHome = homePremiumResponse && premiumResponseKeys.length > 0;
  const toggleBenefit = async (
    benefitTitle: string,
    benefitPrice: number,
    benefitCode: string,
    benefitId: number
  ) => {
    if (isHome) {
      const requestPayloadScheme = addAddtionalBenefitsToPremium(
        requestPayload,
        benefitCode
      );
      setTempBenefits({
        title: benefitTitle,
        price: benefitPrice,
        code: benefitCode,
        id: benefitId,
        payloadRequest: requestPayloadScheme,
      });
      await handleCalculatePremium(requestPayloadScheme);
    } else {
      setSelectedBenefits((prev) => {
        if (!benefitCode || !benefitId) return prev; // Skip if code or id is missing

        const existingIndex = prev.findIndex(
          (item) => item.code === benefitCode
        );

        // Case 1: Same code & id → Remove it
        if (existingIndex !== -1 && prev[existingIndex].id === benefitId) {
          return prev.filter((_, i) => i !== existingIndex);
        }

        // Case 2: Same code, different id → Replace it
        if (existingIndex !== -1 && prev[existingIndex].id !== benefitId) {
          return prev.map((item, i) =>
            i === existingIndex
              ? {
                  title: benefitTitle,
                  price: benefitPrice,
                  code: benefitCode,
                  id: benefitId,
                }
              : item
          );
        }

        // Case 3: Code doesn't exist → Add it
        return [
          ...prev,
          {
            title: benefitTitle,
            price: benefitPrice,
            code: benefitCode,
            id: benefitId,
          },
        ];
      });
    }
  };

  const getBenefits = () => {
    switch (repairTypeSelected) {
      case "Workshop Repair":
        return compWorkShop?.benefits ?? [];
      case "Mawthoq Repair":
        return compMath?.benefits ?? [];
      case "Agency Repair":
        return compAgency?.benefits ?? [];
      case "thirdParty":
      default:
        return comp3rdParty?.benefits ?? []; 
    }
  }

  let benefits: Benefit[] = getBenefits() || [];

  if (isHome && repairTypeSelected) {
     // check the condition is it home to add additional benefits data from calculate premium api
     benefits = convertCoverageToBenefits(languageData?.coverage_beneits, languageData);
  }

  benefits.sort((a, b) => a.benefitPrice - b.benefitPrice);

  const mostPurchasedBenefits = Array.isArray(isHome ? languageData?.home_additional_benefits : languageData?.motor_additional_benefits);

  if (mostPurchasedBenefits) {
    // Most Purchased Additional Benefits items
    benefits.forEach((item) => {
      const mostPurchased = languageData?.home_additional_benefits?.findIndex((value: { key: string, mostpurchased: number}) => value?.key === item?.benefitCode && value?.mostpurchased)
      if (mostPurchased !== -1) {
        item['mostPurchased'] = mostPurchased;
      }
      return item;
    })
  }

  useEffect(() => {
    if (!isHome) {
      const zeroPriceBenefits = benefits
        .filter((benefit) => benefit.benefitPrice === 0)
        .map((benefit) => ({
          title: benefit.benefitNameEn,
          price: benefit.benefitPrice,
          code: benefit.benefitCode,
        }));
      setSelectedBenefits([
        ...zeroPriceBenefits,
        ...selectedBenefits.filter(
          (somebenefit) =>
            !zeroPriceBenefits.some(
              (zerobenefit) => zerobenefit.code === somebenefit.code
            )
        ),
      ]);
    }
  }, [benefits, isHome]);

  // viewPolicy response Benefits
  const policyBenefits = viewPolicyData?.policyLob[0]?.policyRisk[0]?.policyCoverage;

  const capitalizedStr = IComprehensive.charAt(0).toUpperCase() + IComprehensive.slice(1);

  const existBenefits = policyBenefits?.filter(item => item.coverageName !== capitalizedStr);

 //additional benefit mapping
  useEffect(() => {
    if (isRenewpolicy && !hasMappedBenefits) {
      const mappedItems = existBenefits.map((item) => ({
        code: item.coverageCode,
        title: item.coverageName,
        price: item.premiumInfo?.finalPremium,
      }));

      setSelectedBenefits((prevBenefits) => {
        // Filter out items with duplicate titles
        const filteredItems = mappedItems.filter(
          (newBenefit) => !prevBenefits.some((existingBenefit) => existingBenefit.title === newBenefit.title)
        );

        // Add only unique items to the array
        return [...prevBenefits, ...filteredItems];
      });
      setHasMappedBenefits(true); // Set the flag to true after mapping
    }
  }, [isRenewpolicy, existBenefits, setSelectedBenefits, hasMappedBenefits]);


  const benefitsToShow = showAllBenefits
    ? benefits : benefits.slice(0, 2);
  const additionalBenefitsCount = Array.isArray(benefits) ? benefits.length - 2 : 0;

  //most purchased benefits mapping
  const motor_add_benef = languageData?.motor_additional_benefits || [];

  benefits.forEach((benefit) => {
    const isMostPurchased = Array.isArray(motor_add_benef) && motor_add_benef.some(
      (motorBenefit: { key: string, plan: string }) =>
        motorBenefit?.key === benefit?.benefitCode
    );

    // If a match is found, add the mostPurchased key
    if (isMostPurchased) {
      benefit.mostPurchased = 1;
    }
  });

  return (
    <Card className="additional-benefits-container">
      <AlertBox
        title={apiErrorMessage.title}
        description={apiErrorMessage.description}
        showAlertModal={showAlertModal}
        setShowAlertModal={handleModalClose}
      />
      <div className="header walaa-medium-500">
        {languageData?.additional_benefits} ({benefits.length})
      </div>
      <hr className="horizontal-line" />
      <div className="cards-container">
        {languageData && benefitsToShow?.map((benefit) => (
          <BenefitCard
            key={benefit.benefitId}
            mostPurchased={benefit?.mostPurchased}
            isHome={isHome}
            loading={tempBenefits && tempBenefits.title === benefit.benefitNameEn}
            benefitCode={benefit.benefitCode}
            languageData={languageData}
            title={benefit.benefitNameEn}
            description={benefit.description}
            price={benefit.benefitPrice.toFixed(2)}
            isAdded={selectedBenefits.some(
              (selectedBenefit) =>
                selectedBenefit.title === benefit.benefitNameEn
            )}
            onToggle={() =>
              toggleBenefit(benefit.benefitNameEn, benefit.benefitPrice, benefit.benefitCode, benefit.benefitId)
            }
          />
        ))}
      </div>
      {Array.isArray(benefits) && benefits.length > 2 && (
        <div className="show-more-container">
          <button
            className="show-more-btn walaa-medium-500"
            onClick={() => setShowAllBenefits(!showAllBenefits)}
          >
            {showAllBenefits
              ? languageData?.show_less_benefits
              : `${"Show More Benefits"} (${additionalBenefitsCount})`}
          </button>
        </div>
      )}
    </Card>
  );
}

export default AdditionalBenefits;