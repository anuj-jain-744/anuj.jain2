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
import { convertCoverageToBenefits, addAddtionalBenefitsToPremium } from "utils/quoteAndBuy";
import ExpandSection from "../../Motor/QuoteAndBuy/VehicleDetailsModal/ExpandSection";
import ThemeButton from "components/ThemeButton/ThemeButton";
import { getAmountWithIcon } from "@app-shell/utils/common";

interface BenefitProps {
  show: boolean;
  onHide: () => void;
  languageData: LanguageData;
}

const AdditionalBenefitModal: React.FC<BenefitProps> = ({
  show,
  onHide,
  languageData,
}) => {
  const [recentAddedBen, setRecentAddedBen] = useState<string | null>(null);
  const [showAddBenefModal, setShowAddBenefModal] = useState(show);
  const { 
    selectedBenefits,
    setSelectedBenefits,
    repairTypeSelected, 
    compWorkShop,
    compMath,
    compAgency,
    comp3rdParty,
    homePremiumResponse,
    setHomePremiumResponse, 
    requestPayload, 
    updateRequestPayload 
  } = useQuoteAndBuyContext();
  const { apiErrorMessage, setApiErrorMessage, resetApiErrorMessage, showAlertModal, setShowAlertModal } = usePHQuoteBuyContext()
  const { handleCalculatePremium, isError, isLoadingCalculatePremium, data } = useCalculatePremiumApi();
  const [isExpanded, setIsExpanded] = useState(false);
  const [tempBenefits, setTempBenefits] = useState({});
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
    setShowAddBenefModal(show);
  }, [show]);

  useEffect(() => {
    if (data && !isLoadingCalculatePremium) {
      if (tempBenefits.payloadRequest) {
        updateRequestPayload(tempBenefits.payloadRequest);
      }
      // below if condition is not usable if home team will use in future then can uncomment code
      if (tempBenefits.type === 'add') {
        availableBenefits = convertCoverageToBenefits(languageData?.coverage_beneits, languageData)
        const benefitToAdd = availableBenefits.find(
          (benefit) => benefit.benefitNameEn === tempBenefits.title
        );

        if (benefitToAdd) {
          setSelectedBenefits((prevBenefits) => [
            ...prevBenefits,
            { title: benefitToAdd.benefitNameEn, price: benefitToAdd.benefitPrice, code: benefitToAdd.benefitCode, id: benefitToAdd.benefitId },
          ]);
          setRecentAddedBen(tempBenefits.title);
        }
      } 
      if(tempBenefits?.code) {
        setSelectedBenefits((prev) =>
        prev.some((benefit) => benefit.title === tempBenefits.title)
          ? prev.filter((benefit1) => benefit1.title !== tempBenefits.title)
          : [...prev, { title: tempBenefits.title, price: tempBenefits.price, code: tempBenefits.code,id: tempBenefits.id }]
      );
        setRecentAddedBen(null);
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

  const handleClose = () => {
    setShowAddBenefModal(false);
    onHide();
  };

  const handleExpand = () => {
    setIsExpanded(true);
  };

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

  const handleModalClose = () => {
    setShowAlertModal(false);
    setApiErrorMessage(resetApiErrorMessage);
  }

  const benefData = {
    bene_pop_heading: "Additional Benefits",
    add_benef_head: "Add Additional Benefits",
    btn_txt: "Add",
  };

  let availableBenefits = [];

  if (isHome) {
    availableBenefits = convertCoverageToBenefits(languageData?.coverage_beneits, languageData)
    availableBenefits = availableBenefits.filter(
      (benefit) =>
        !selectedBenefits.some(
          (selectedBenefit) => selectedBenefit.title === benefit.benefitNameEn
        )
    );
  } else {
    availableBenefits = getAvailableBenefits()?.filter(
      (benefit) =>
        !selectedBenefits.some(
          (selectedBenefit) => selectedBenefit.title === benefit.benefitNameEn
        )
    );
  }
  availableBenefits.sort((a, b) => a.benefitPrice - b.benefitPrice);

  return (
    <Modal
      show={showAddBenefModal}
      onHide={handleClose}
      className={`add-driver-pop ${style.mainContainer}`}
      centered
    >
      <div className={style.modalContainer}>
        <AlertBox
          title={apiErrorMessage.title}
          description={apiErrorMessage.description}
          showAlertModal={showAlertModal}
          setShowAlertModal={handleModalClose}
        />
        <div className={style.frame}>
          <div className={style.heading}>{benefData.bene_pop_heading}</div>
          <img
            src={closeIcon}
            alt="close icon"
            className={style.modalCloseIcon}
            onClick={handleClose}
          />
        </div>

        <div className={style.body}>
          <div className={style.fixedContent}>
            <div className="manage-benefits">
              <div className="selected-benefits">
                {selectedBenefits.map((benefit, idx) => (
                  <div
                    key={idx}
                    className={`benef-row ${benefit.title === recentAddedBen ? "recent-added" : ""
                      }`}
                  >
                    <div className="benef-img">
                      <img src={isHome ? Home_Benefit_Icon : BeneImg} alt={benefit.title} />
                    </div>
                    <div className="benef-content">
                      <div className="bene-head">{benefit.title}</div>
                      <div className="bene-val">
                        {getAmountWithIcon(benefit.price)}
                      </div>
                    </div>
                    {benefit.price !==0 ? <div
                      className={`${tempBenefits && tempBenefits.title === benefit.title ? 'delete-action-stop': ''} action`}
                      onClick={() => toggleBenefit(benefit.title, benefit.price, benefit.code, benefit.id)}
                    >
                      <img className="delete" src={Delete} alt="delete" />
                    </div> : 
                    <div className="delete-action-stop action"> 
                      <ThemeButton
                        title={languageData?.freeCover}
                        isDisabled={true}
                        classes={"remove-btn walaa-medium-500"}
                        variant="outline"
                      />
                      </div>
                    }
                  </div>
                ))}
              </div>

              <div className={style.scrollableContent}>

                {!isExpanded ? (
                  <div onClick={handleExpand}>
                    <ExpandSection languageData={languageData} />
                  </div>
                ) : (
                  <div className="available-benefits ">
                    <div className="add-bene-heading">
                      {benefData.add_benef_head}
                    </div>
                    {availableBenefits?.map((benefit, idx) => (
                      <div key={idx} className="aditional-row">
                        
                        <div className="benef-img">
                          <img src={isHome ? Home_Benefit_Icon : BeneImg} alt={benefit.benefitNameEn} />
                        </div>

                        <div className="bene-head">{benefit.benefitNameEn} </div>

                        <div className="bene-rght">
                          <div className="bene-val">
                            {getAmountWithIcon(benefit.benefitPrice)}
                          </div>

                          <div className="butn-div">
                            <button
                              className="btn bordered-btn"
                              onClick={() =>
                                toggleBenefit(benefit.benefitNameEn, benefit.benefitPrice, benefit.benefitCode, benefit.benefitId)
                              }
                            >
                              {(tempBenefits && tempBenefits.title === benefit.benefitNameEn) ? languageData?.loading : benefData.btn_txt}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AdditionalBenefitModal;