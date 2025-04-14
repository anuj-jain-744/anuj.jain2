import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import "./style.scss";
import ThemeButton from "components/ThemeButton/ThemeButton";
import { LoaderOverlay } from "components/OTPValidation";
import { AlertBox } from "components/AlertBox";
import { LanguageData } from "types/languageData";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { useCalculatePremiumApi } from "hook/home/useCalculatePremiumApi";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";

interface QuotationHandlingProps {
  readonly onContinue: () => void;
  readonly onNew: () => void;
  readonly show: boolean;
  readonly languageData: LanguageData;
  readonly setLeftStep: (step: number) => void;
}

function QuotationHandling({
  onContinue,
  onNew,
  show,
  languageData,
  setLeftStep,
}: QuotationHandlingProps) {
  const { journeyData } = useQuoteAndBuyContext();
  const [premiumPayload, setPremiumPayload] = useState<string | null>(null);
  const { handleCalculatePremium, isError, isLoadingCalculatePremium, data } = useCalculatePremiumApi()

  const {
    setFormAddressSelection,
    setSelectedContetBenefits,
    setPropertyPhotos,
    resetApiErrorMessage,
    apiErrorMessage,
    setApiErrorMessage,
    showAlertModal,
    setShowAlertModal,
    loading,
    setLoading,
  } = usePHQuoteBuyContext();

  const {
    updateRequestPayload,
    setCoverageType,
    setRepairTypeSelected,
    setSelectedBenefits,
    setSchemeCode,
    setPolicyStartDate,
    setHomePremiumResponse
  } = useQuoteAndBuyContext();

  const updateContext = (data: { [key: string]: string }) => {
    const {
      currentStep,
      formAddressSelection,
      payloadScheme,
      coverageType,
      selectedBenefits,
      selectedContetBenefits,
      propertyPhotos,
      repairTypeSelected,
      schemeCode,
      policyStartDate
    } = data;

    setLeftStep(currentStep ? parseInt(currentStep) : 0);
    formAddressSelection && setFormAddressSelection(formAddressSelection);
    payloadScheme && updateRequestPayload(payloadScheme);
    coverageType && setCoverageType(coverageType);
    selectedBenefits && setSelectedBenefits(selectedBenefits);
    selectedContetBenefits && setSelectedContetBenefits(selectedContetBenefits);
    propertyPhotos && setPropertyPhotos(propertyPhotos);
    repairTypeSelected && setRepairTypeSelected(repairTypeSelected);
    schemeCode && setSchemeCode(schemeCode);
    policyStartDate && setPolicyStartDate(policyStartDate);
  }

  const handleContinue = async () => {
    if (journeyData) {
      const data = JSON.parse(journeyData);
      if (data?.currentStep > 1) {
        setLoading(true);
        setPremiumPayload(data?.payloadScheme);
      } else {
        updateContext(data);
        onContinue();
      }
    }
  };

  const handleModalClose = () => {
    setShowAlertModal(false);
    setApiErrorMessage(resetApiErrorMessage);
  }

  useEffect(() => {
    if (data && !isLoadingCalculatePremium) {
      setLoading(false);
      setPremiumPayload(null);
      const redisData = JSON.parse(journeyData);
      if (journeyData) {
        updateContext(redisData);
      }
      setHomePremiumResponse(data);
      onContinue();
    }
  }, [data, isLoadingCalculatePremium])

  useEffect(() => {
    if (isError && isLoadingCalculatePremium) {
      setLoading(false);
      setPremiumPayload(null);
      setShowAlertModal(true);
      setApiErrorMessage({
        title: isError?.name || languageData?.internal_server_error,
        description: isError.messages?.message_en ?? languageData?.something_went_wrong,
      });
    }
  }, [isError, isLoadingCalculatePremium])

  useEffect(() => {
    if (premiumPayload) {
      handleCalculatePremium(premiumPayload);
    }
  }, [premiumPayload]);

  return (
    <Modal className="resume-jorney-parent-container" show={show} centered>
      {loading && <LoaderOverlay />}
      <AlertBox
        title={apiErrorMessage.title}
        description={apiErrorMessage.description}
        showAlertModal={showAlertModal}
        setShowAlertModal={handleModalClose}
      />
      <div className="resume-journey-container">
        <div className="journey walaa-medium-500">
          {languageData?.resume_your_home_insurance}
        </div>
        <div className="journey-content">
          {languageData?.dear_user_would_you_like_to_complete}
        </div>
        <hr className="horizontal-line" />
        <div className="bottom-btns">
          <ThemeButton
            isDisabled={false}
            title={languageData?.continue_from_where_i_left}
            classes={"continue-btn walaa-medium-500"}
            variant="outline"
            onClickhandler={handleContinue}
          />
          <ThemeButton
            isDisabled={false}
            title={languageData?.start_a_new_quotation}
            classes={"new-quotation-btn walaa-medium-500"}
            variant="policyPrimary"
            onClickhandler={onNew}
          />
        </div>
      </div>
    </Modal>
  );
}

export default QuotationHandling