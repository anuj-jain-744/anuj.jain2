import { useState, useEffect } from "react";
import { Benefit } from "types/quoteAndBuy";
import { LanguageData } from "types/languageData";
import "./styles.scss";
import { AlertBox } from "components/AlertBox";
import { Card } from "react-bootstrap";
import { convertCoverageToBenefits, addAddtionalBenefitsToPremium, skipToSelectSameBenefits } from "utils/quoteAndBuy";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";
import BenefitCard from "./BenefitCard";
import { useCalculatePremiumApi } from "hook/home/useCalculatePremiumApi";
import { IComprehensive } from "../../QuoteAndBuy/CoveragePlan/ConstantValue/ConstantValue";
import { SHOW_DEFAULT_BENEFIT } from "constant"

interface AdditionalBenifitProps {
  languageData: LanguageData;
  repairTypeSelected: string | undefined | null;
}

function AdditionalBenefits({ languageData, repairTypeSelected }: Readonly<AdditionalBenifitProps>) {
  const { selectedBenefits, setSelectedBenefits, compWorkShop, comp3rdParty, compAgency, compMath, homePremiumResponse, setHomePremiumResponse, requestPayload,
    updateRequestPayload, isRenewpolicy, isTpOnly } = useQuoteAndBuyContext();

  const { apiErrorMessage, setApiErrorMessage, resetApiErrorMessage, showAlertModal, setShowAlertModal, formAddressSelection } = usePHQuoteBuyContext()

  const { handleCalculatePremium, isError, isLoadingCalculatePremium, data } = useCalculatePremiumApi();

  const [showAllBenefits, setShowAllBenefits] = useState(false);
  const [tempBenefits, setTempBenefits] = useState<Benefit>({});
  
  useEffect(() => {
    if (data && !isLoadingCalculatePremium) {
      if (tempBenefits.payloadRequest) {
        updateRequestPayload(tempBenefits.payloadRequest);
      }
      if (tempBenefits?.benefitCode) {
        setSelectedBenefits((prev: Benefit) =>
          prev.some((benefit: Benefit) => benefit.benefitCode === tempBenefits.benefitCode)
            ? prev.filter((benefit: Benefit) => benefit.benefitCode !== tempBenefits.benefitCode)
            : [...prev, tempBenefits]
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

  const isHome = homePremiumResponse && Object.keys(homePremiumResponse).length > 0;
  const toggleBenefit = async (benefit: Benefit
  ) => {
    const { benefitCode, benefitId } = benefit
    if (isHome) {
      const requestPayloadScheme = addAddtionalBenefitsToPremium(
        requestPayload,
        benefit?.benefitCode
      );
      setTempBenefits({
        ...benefit,
        payloadRequest: requestPayloadScheme,
      });
      await handleCalculatePremium(requestPayloadScheme);
    } else {

      setSelectedBenefits((prev) => {
        return skipToSelectSameBenefits(prev, benefitCode, benefitId, benefit.benefitPrice, benefit.benefitNameEn, benefit.benefitNameAr);
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
    const coverageType = repairTypeSelected.replace(/\s+/g, '').toLowerCase();
    benefits = convertCoverageToBenefits(homePremiumResponse[coverageType]?.purchasedCoverage, languageData, benefits, formAddressSelection)
    benefits.sort((a, b) => b.benefitPrice - a.benefitPrice);
  } else {
    benefits.sort((a, b) => a.benefitPrice - b.benefitPrice);
  }

  const mostPurchasedBenefits = Array.isArray(isHome ? languageData?.home_additional_benefits : languageData?.motor_additional_benefits);

  if (mostPurchasedBenefits) {
    // Most Purchased Additional Benefits items
    benefits.forEach((item) => {
      const mostPurchased = languageData?.home_additional_benefits?.findIndex((value: { key: string, mostpurchased: number }) => value?.key === item?.benefitCode && value?.mostpurchased)
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
          benefitNameEn: benefit.benefitNameEn,
          benefitPrice: benefit.benefitPrice,
          benefitCode: benefit.benefitCode,
          benefitNameAr: benefit.benefitNameAr,
          benefitId: benefit.benefitId,
        }));
      setSelectedBenefits([
        ...zeroPriceBenefits,
        ...selectedBenefits.filter(
          (somebenefit: Benefit) =>
            !zeroPriceBenefits.some(
              (zerobenefit: Benefit) => zerobenefit.benefitCode === somebenefit.benefitCode
            )
        ),
      ]);
    }
  }, [benefits, isHome]);

  //most purchased benefits mapping
  const motor_add_benef = languageData?.motor_additional_benefits || [];

  benefits.forEach((benefit: Benefit) => {
    const isMostPurchased = Array.isArray(motor_add_benef) && motor_add_benef.some(
      (motorBenefit: { key: string, plan: string }) =>
        motorBenefit?.key === benefit?.benefitCode
    );

    // If a match is found, add the mostPurchased key
    if (isMostPurchased) {
      benefit.mostPurchased = 1;
    }
  });
  const benefitsToShow = showAllBenefits
    ? benefits : benefits?.slice(0, SHOW_DEFAULT_BENEFIT);
  const additionalBenefitsCount = Array.isArray(benefits) ? benefits?.length - SHOW_DEFAULT_BENEFIT : 0;

  // for third party and renew policy case only
  useEffect(() => {
    if (isRenewpolicy && isTpOnly) {
      setSelectedBenefits(
        benefits
          ?.filter((benefit) => benefit.benefitPrice === 0)
          ?.map((benefit) => ({
            benefitCategory: benefit.benefitCategory,
            benefitCode: benefit.benefitCode,
            benefitId: benefit.benefitId,
            benefitNameAr: benefit.benefitNameAr,
            benefitNameEn: benefit.benefitNameEn,
            benefitPrice: benefit.benefitPrice,
            mostPurchased: benefit.mostPurchased,
            description: benefit.description || "", // Ensure description is included
          }))
      );
    }
  }, [isTpOnly, isRenewpolicy])

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
        {languageData && benefitsToShow?.map((benefit, index) => (
          <BenefitCard
            key={`${benefit.benefitId}_${index}`}
            mostPurchased={benefit?.mostPurchased}
            isHome={isHome}
            loading={tempBenefits && tempBenefits.benefitNameEn === benefit.benefitNameEn}
            benefitCode={benefit.benefitCode}
            languageData={languageData}
            title={benefit.benefitNameEn}
            description={benefit.description}
            price={benefit.benefitPrice.toFixed(2)}
            isAdded={selectedBenefits.some(
              (selectedBenefit) =>
                selectedBenefit.benefitId === benefit.benefitId
            )}
            onToggle={() =>
              toggleBenefit(benefit)
            }
          />
        ))}
      </div>
      {Array.isArray(benefits) && benefits.length > SHOW_DEFAULT_BENEFIT && (
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