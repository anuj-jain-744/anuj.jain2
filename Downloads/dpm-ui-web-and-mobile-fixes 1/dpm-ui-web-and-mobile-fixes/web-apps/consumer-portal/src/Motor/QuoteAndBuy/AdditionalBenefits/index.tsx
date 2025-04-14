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

interface AdditionalBenifitProps {
  languageData: LanguageData;
  repairTypeSelected: string | undefined | null;
}

function AdditionalBenefits({ languageData, repairTypeSelected }: Readonly<AdditionalBenifitProps>) {

  const { selectedBenefits, setSelectedBenefits, compWorkShop, comp3rdParty, compAgency, compMath, homePremiumResponse, setHomePremiumResponse, requestPayload, updateRequestPayload } = useQuoteAndBuyContext();
  const { apiErrorMessage, setApiErrorMessage, resetApiErrorMessage, showAlertModal, setShowAlertModal } = usePHQuoteBuyContext()
  const { handleCalculatePremium, isError, isLoadingCalculatePremium, data } = useCalculatePremiumApi();
  const [showAllBenefits, setShowAllBenefits] = useState(false);
  const [tempBenefits, setTempBenefits] = useState({});

  useEffect(() => {
    if (data && !isLoadingCalculatePremium) {
      if (tempBenefits.payloadRequest) {
        updateRequestPayload(tempBenefits.payloadRequest);
      }
      setSelectedBenefits((prev) =>
        prev.some((benefit) => benefit.title === tempBenefits.title)
          ? prev.filter((benefit) => benefit.title !== tempBenefits.title)
          : [...prev, { title: tempBenefits.title, price: tempBenefits.price, code: tempBenefits.code }]
      );
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

  const toggleBenefit = async (benefitTitle: string, benefitPrice: number, benefitCode: string) => {
    if (isHome) {
      const requestPayloadScheme = addAddtionalBenefitsToPremium(requestPayload, benefitCode);
      setTempBenefits({ title: benefitTitle, price: benefitPrice, code: benefitCode, payloadRequest: requestPayloadScheme });
      await handleCalculatePremium(requestPayloadScheme);
    } else {
      setSelectedBenefits((prev) =>
        prev.some((benefit) => benefit.title === benefitTitle)
          ? prev.filter((benefit) => benefit.title !== benefitTitle)
          : [...prev, { title: benefitTitle, price: benefitPrice, code: benefitCode }]
      );
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


  if (isHome && repairTypeSelected) { // check the condition is it home to add additional benefits data from calculate premium api
    const coverageType = repairTypeSelected.replace(/\s+/g, '').toLowerCase();
    benefits = convertCoverageToBenefits(homePremiumResponse[coverageType].purchasedCoverage, languageData)
  }

  benefits.sort((a, b) => a.benefitPrice - b.benefitPrice);

  const mostPurchasedBenefits = Array.isArray(languageData?.motor_additional_benefits);

  if (mostPurchasedBenefits) {
    // Most Purchased Additional Benefits items 
    benefits.forEach((item) => {
      const mostPurchased = languageData?.motor_additional_benefits?.findIndex((value: { key: string, mostpurchased: number, plan: string }) => value?.key === item?.benefitCode && value?.mostpurchased && value?.plan === repairTypeSelected)
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

  const benefitsToShow = showAllBenefits
    ? benefits : benefits.slice(0, 2);
  const additionalBenefitsCount = Array.isArray(benefits) ? benefits.length - 2 : 0;

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
              toggleBenefit(benefit.benefitNameEn, benefit.benefitPrice, benefit.benefitCode)
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