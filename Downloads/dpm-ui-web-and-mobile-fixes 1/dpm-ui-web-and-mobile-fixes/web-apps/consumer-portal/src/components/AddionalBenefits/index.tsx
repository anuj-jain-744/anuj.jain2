import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import "./index.scss";
import Delete from "../../assets/QuoteAndBuy/Delete.svg";
import BeneImg from "../../assets/QuoteAndBuy/BenefitImg.svg";
import Home_Benefit_Icon from "assets/Home/home_benefits.png";
import closeIcon from "../../assets/QuoteAndBuy/closeIcon.svg";
import { AlertBox } from "components/AlertBox";
import style from "../../Motor/QuoteAndBuy/VehicleDetailsModal/VehicleDetailsModal.module.scss";
import { useCalculatePremiumApi } from "hook/home/useCalculatePremiumApi";
import { useQuoteAndBuyContext } from "../hooks/useQuoteAndBuyContext";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";
import { LanguageData } from "types/languageData";
import { convertCoverageToBenefits, addAddtionalBenefitsToPremium } from "utils/quoteAndBuy";
import ExpandSection from "../../Motor/QuoteAndBuy/VehicleDetailsModal/ExpandSection";

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
      if (tempBenefits.type === 'add') {
        const coverageType = repairTypeSelected.replace(/\s+/g, '').toLowerCase();
        availableBenefits = convertCoverageToBenefits(homePremiumResponse[coverageType].purchasedCoverage, languageData)
        const benefitToAdd = availableBenefits.find(
          (benefit) => benefit.benefitNameEn === tempBenefits.title
        );

        if (benefitToAdd) {
          setSelectedBenefits((prevBenefits) => [
            ...prevBenefits,
            { title: benefitToAdd.benefitNameEn, price: benefitToAdd.benefitPrice, code: benefitToAdd.benefitCode },
          ]);
          setRecentAddedBen(tempBenefits.title);
        }
      } else {
        setSelectedBenefits((prevBenefits) =>
          prevBenefits.filter(
            (benefit: { title: string; price: number, code: string; }) =>
              benefit.title !== tempBenefits.title
          )
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

  const handleAddBenefit = async (benefitTitle: string, benefitPrice: number, benefitCode: string) => {
    if (isHome) {
      const requestPayloadScheme = addAddtionalBenefitsToPremium(requestPayload, benefitCode);
      setTempBenefits({ title: benefitTitle, price: benefitPrice, code: benefitCode, payloadRequest: requestPayloadScheme, type: 'add' });
      await handleCalculatePremium(requestPayloadScheme);
    } else {
      const benefitToAdd = compWorkShop?.benefits.find(
        (benefit) => benefit.benefitNameEn === benefitTitle
      );

      if (benefitToAdd) {
        setSelectedBenefits((prevBenefits) => [
          ...prevBenefits,
          { title: benefitToAdd.benefitNameEn, price: benefitToAdd.benefitPrice, code: benefitToAdd.benefitCode },
        ]);
        setRecentAddedBen(benefitTitle);
      }
    }
  };

  const handleRemoveBenefit = async (benefitTitle: string, benefitPrice: number, benefitCode: string) => {
    if (isHome) {
      const requestPayloadScheme = addAddtionalBenefitsToPremium(requestPayload, benefitCode);
      setTempBenefits({ title: benefitTitle, price: benefitPrice, code: benefitCode, payloadRequest: requestPayloadScheme, type: 'remove' });
      await handleCalculatePremium(requestPayloadScheme);
    } else {
      if(benefitPrice !== 0) {
        setSelectedBenefits((prevBenefits) =>
          prevBenefits.filter(
            (benefit: { title: string; price: number; code: string }) =>
              benefit.title !== benefitTitle
          )
        );
        setRecentAddedBen(null);
      }
    }
  };

  const handleModalClose = () => {
    setShowAlertModal(false);
    setApiErrorMessage(resetApiErrorMessage);
  }

  const benefData = {
    bene_pop_heading: "Additional Benefits",
    currency: "SAR",
    add_benef_head: "Add Additional Benefits",
    btn_txt: "Add",
  };

  let availableBenefits = [];

  if (isHome) {
    const coverageType = repairTypeSelected.replace(/\s+/g, '').toLowerCase();
    availableBenefits = convertCoverageToBenefits(homePremiumResponse[coverageType].purchasedCoverage, languageData)
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
                        {benefData.currency} {benefit.price}
                      </div>
                    </div>
                    <div
                      className={`${tempBenefits && tempBenefits.title === benefit.title ? 'delete-action-stop': ''} action`}
                      onClick={() => handleRemoveBenefit(benefit.title, benefit.price, benefit.code)}
                    >
                      <img className="delete" src={Delete} alt="delete" />
                    </div>
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
                            {benefData.currency} {benefit.benefitPrice}
                          </div>

                          <div className="butn-div">
                            <button
                              className="btn bordered-btn"
                              onClick={() =>
                                handleAddBenefit(benefit.benefitNameEn, benefit.benefitPrice, benefit.benefitCode)
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