import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import "./index.scss";
import Delete from "assets/QuoteAndBuy/delete.svg";
import BeneImg from "assets/QuoteAndBuy/BenefitImg.svg";
import Home_Benefit_Icon from "assets/Home/home_benefits.png";
import closeIcon from "assets/QuoteAndBuy/closeIcon.svg";
import { AlertBox } from "components/AlertBox";
import style from "../../Motor/QuoteAndBuy/VehicleDetailsModal/VehicleDetailsModal.module.scss";
import { useCalculatePremiumApi } from "hook/home/useCalculatePremiumApi";
import { useQuoteAndBuyContext } from "../hooks/useQuoteAndBuyContext";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";
import { LanguageData } from "types/languageData";
import { convertCoverageToBenefits, addAddtionalBenefitsToPremium, skipToSelectSameBenefits } from "utils/quoteAndBuy";
import { getAmountWithIcon } from "@app-shell/utils/common";
import { LoaderOverlay } from "@app-shell/components/Loader";
import { CalculatePremiumApiPayload } from "types/HomeCalculatePremiumApiPayload";
import approveIcon from "assets/QuoteAndBuy/Approve.svg";
import { sanitizeHtml } from "@dpm/shared-module";
import { Benefit } from "types/quoteAndBuy";

interface BenefitProps {
  show: boolean;
  onHide: () => void;
  languageData: LanguageData;
}

interface StateEventProps {
  benefitModal: boolean;
  type: string | undefined;
  benefitNameEn: string | undefined;
  benefitNameAr: string | undefined;
  benefitPrice: string | number | undefined;
  benefitCode: string | undefined;
  benefitId: string | number | undefined;
  loading: boolean;
  payloadRequest: CalculatePremiumApiPayload | null;
  errorTitle: string | undefined;
  errorDescription: string | undefined;
}

const AdditionalBenefitModal: React.FC<BenefitProps> = ({
  show,
  onHide,
  languageData,
}) => {
  const [recentAddedBen, setRecentAddedBen] = useState<string | null>(null);
  const { selectedBenefits, setSelectedBenefits, repairTypeSelected, compWorkShop, compMath, compAgency, comp3rdParty,
    homePremiumResponse, setHomePremiumResponse, requestPayload, updateRequestPayload
  } = useQuoteAndBuyContext();
  const { formAddressSelection } = usePHQuoteBuyContext()
  const { handleCalculatePremium, isError, isLoadingCalculatePremium, data } = useCalculatePremiumApi();
  const [tempBenefits, setTempBenefits] = useState<StateEventProps>({
    benefitModal: show, type: "", benefitNameEn: "", benefitNameAr: "",
    benefitPrice: "", benefitCode: "", benefitId: "", loading: false, payloadRequest: null, errorTitle: "", errorDescription: ""
  });
  const isHome = homePremiumResponse && Object.keys(homePremiumResponse).length > 0;

  const getAvailableBenefits = () => {
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
  };

  useEffect(() => {
    setTempBenefits((prevProps) => ({ ...prevProps, benefitModal: show }));
  }, [show]);

  useEffect(() => {
    if (data && !isLoadingCalculatePremium && !isError && tempBenefits?.payloadRequest) {
      updateRequestPayload(tempBenefits.payloadRequest);
      if (tempBenefits?.benefitCode) {
        setSelectedBenefits((prev) =>
          prev.some((benefit) => benefit.benefitCode === tempBenefits.benefitCode)
            ? prev.filter((benefit1) => benefit1.benefitCode !== tempBenefits.benefitCode)
            : [...prev, { benefitNameEn: tempBenefits.benefitNameEn, benefitPrice: tempBenefits.benefitPrice, benefitCode: tempBenefits.benefitCode, benefitId: tempBenefits.benefitId }]
        );
        setRecentAddedBen(null);
      }
      setTempBenefits((prevProps) => ({
        ...prevProps, benefitNameEn: "", type: "", benefitPrice: "", benefitCode: "", benefitId: "", loading: false, payloadRequest: null,
      }));
      setHomePremiumResponse(data);
    }
  }, [data, isLoadingCalculatePremium])

  useEffect(() => {
    if (isError && isLoadingCalculatePremium) {
      setTempBenefits((prevProps) => ({
        ...prevProps, benefitNameEn: "", benefitNameAr: "", type: "", benefitPrice: "", benefitCode: "", benefitId: "", loading: false, payloadRequest: null,
        errorTitle: isError?.name || languageData?.internal_server_error,
        errorDescription: isError.messages?.message_en ?? languageData?.something_went_wrong
      }));
    }
  }, [isError, isLoadingCalculatePremium])

  const handleClose = () => {
    setTempBenefits((prevProps) => ({ ...prevProps, benefitModal: false }));
    onHide();
  };


  const toggleBenefit = async (benefitNameEn: string, benefitNameAr: string, benefitPrice: number, benefitCode: string, benefitId: number) => {
    if (isHome) {
      const requestPayloadScheme = addAddtionalBenefitsToPremium(requestPayload, benefitCode);
      setTempBenefits((prevProps) => ({
        ...prevProps, benefitNameEn, benefitNameAr, benefitPrice, benefitCode, benefitId, loading: true,
        payloadRequest: requestPayloadScheme
      }));
      await handleCalculatePremium(requestPayloadScheme);
    } else {
      setSelectedBenefits((prev) => {
        return skipToSelectSameBenefits(prev, benefitCode, benefitId, benefitPrice, benefitNameEn, benefitNameAr);
      });
    }
  };

  const handleModalClose = () => {
    setTempBenefits((prevProps) => ({ ...prevProps, errorTitle: "", errorDescription: "" }));
  }

  let availableBenefits: Benefit[] = [];

  if (isHome) {
    const coverageType = repairTypeSelected.replace(/\s+/g, '').toLowerCase();
    availableBenefits = convertCoverageToBenefits(homePremiumResponse[coverageType]?.purchasedCoverage, languageData, availableBenefits, formAddressSelection)
    availableBenefits = availableBenefits.filter(
      (benefit: { benefitCode?: string, benefitNameEn: string }) =>
        !selectedBenefits.some((selectedBenefit) => selectedBenefit.benefitCode === benefit.benefitCode)
    );
  } else {
    availableBenefits = getAvailableBenefits()?.filter(
      (benefit) => !selectedBenefits.some((selectedBenefit) => selectedBenefit.benefitNameEn === benefit.benefitNameEn)
    );
    availableBenefits.sort((a, b) => a.benefitPrice - b.benefitPrice);
  }

  const additionalBenefitLists = (idx: number, title: string, titleAr: string, price: number, code: string, id: number, isSelectedBenfit = false) => (
    <div key={idx} className={`benef-row ${title === recentAddedBen ? "recent-added" : ""}`}>
      <div className="benef-img">
        <img src={isHome ? Home_Benefit_Icon : BeneImg} alt={title} />
      </div>
      <div className="benef-content additional">
        <div className="bene-head">{title}</div>
        <div className="bene-val">
          {getAmountWithIcon(price)}
        </div>
      </div>
      {(isSelectedBenfit && price) ?
        <button className='action' onClick={() => toggleBenefit(title, titleAr, price, code, id)}>
          <img className="delete" src={Delete} alt="delete" />
        </button> :
        <div className="delete-action-stop action">
          
          <div className="freecover-container">
           <img
          src={approveIcon}
          alt="Approve"
          className="aprrove-icon"
        /> 
      
        <div className="free-cover-text" dangerouslySetInnerHTML={{
          __html: sanitizeHtml(`${languageData?.freecover_text}`),
        }}>


        </div>
        </div>
        </div>
      }
    </div>
  )

  return (
    <Modal
      show={tempBenefits?.benefitModal}
      onHide={handleClose}
      className={`add-driver-pop ${style.mainContainer}`}
      centered
    >
      {tempBenefits?.loading && <LoaderOverlay />}
      <div className={style.modalContainer}>
        <AlertBox
          title={tempBenefits?.errorTitle}
          description={tempBenefits?.errorDescription}
          showAlertModal={Boolean(tempBenefits?.errorTitle && tempBenefits?.errorDescription)}
          setShowAlertModal={handleModalClose}
        />
        <div className={style.frame}>
          <div className={style.heading}>{languageData?.addBenefits ?? languageData?.additional_benefits}</div>
          <img src={closeIcon} alt="close icon" className={style.modalCloseIcon} onClick={handleClose} />
        </div>
        <div className={style.body}>
          <div className={style.fixedContent}>
            <div className="manage-benefits">
              <div className={style.scrollableContent}>
                <div className="selected-benefits">
                  {selectedBenefits.map((benefit: Benefit, idx) => {
                    const price = Number(benefit.benefitPrice);
                    return additionalBenefitLists(idx, benefit.benefitNameEn, benefit.benefitNameAr, price, benefit.benefitCode, benefit.benefitId, true);
                  })}
                  {isHome && availableBenefits.map((benefit, idx) => {
                    const price = Number(benefit.benefitPrice);
                    if (price === 0) {
                      return additionalBenefitLists(idx, benefit.benefitNameEn, benefit?.benefitNameAr, price, benefit.benefitCode, benefit.benefitId);
                    }
                  })}
                </div>
              </div>
              <div className="available-benefits">
                <div className="add-bene-heading">
                  {languageData?.add_additional_benefits}
                </div>
                {availableBenefits?.map((benefit, idx) => {
                  if (Number(benefit.benefitPrice) > 0) {
                    return (
                      <div key={idx} className="aditional-row">
                        <div className="benef-img">
                          <img
                            src={isHome ? Home_Benefit_Icon : BeneImg}
                            alt={benefit.benefitNameEn}
                          />
                        </div>
                        <div className="bene-head">{benefit.benefitNameEn}</div>
                        <div className="bene-rght">
                          <div className="bene-val">
                            {getAmountWithIcon(benefit.benefitPrice)}
                          </div>
                          <div className="butn-div">
                            <button
                              className="btn bordered-btn"
                              onClick={() =>
                                toggleBenefit(
                                  benefit.benefitNameEn,
                                  benefit?.benefitNameAr,
                                  benefit.benefitPrice,
                                  benefit.benefitCode,
                                  benefit.benefitId
                                )
                              }
                            >
                              {languageData?.add ?? languageData?.add_label}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AdditionalBenefitModal;