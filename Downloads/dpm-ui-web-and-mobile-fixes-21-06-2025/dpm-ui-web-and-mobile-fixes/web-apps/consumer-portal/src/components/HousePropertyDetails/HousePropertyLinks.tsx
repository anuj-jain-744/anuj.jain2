import React, { useState } from "react";
import "./index.scss";
import PhotoIcon from "../../assets/Home/photo.png";
import AddBenefits from "../../assets/Home/List.png";
import AddOns from "../../assets/Home/Add-ons.png";
import ContentBenefitsModal from "../ContentBenefits";
import AdditionalBenefitModal from "../AddionalBenefits";
import PropertyPhotosModal from "../PropertyPhotos";
import { LanguageData } from "types/languageData";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";

interface HousePropertyProps {
  languageData: LanguageData;
}

const HousePropertyLinks: React.FC<HousePropertyProps> = ({ languageData }) => {
  const [showContentBenefitsModal, setShowContentBenefitsModal] = useState(false);
  const [showAddBenefModal, setShowAddBenefModal] = useState(false);
  const [showPropertyPhotosModal, setShowPropertyPhotosModal] = useState(false);

  const { selectedBenefits } = useQuoteAndBuyContext();
  const { selectedContetBenefits } = usePHQuoteBuyContext();

  const handlePropertyPhotos = () => {
    setShowPropertyPhotosModal(true);
  };

  const handleContentBenefits = () => {
    setShowContentBenefitsModal(true);
  };

  const handleAddBenef = () => {
    setShowAddBenefModal(true);
  };

  const handleCloseModal = () => {
    setShowPropertyPhotosModal(false);
    setShowContentBenefitsModal(false);
    setShowAddBenefModal(false);
  };

  return (
    <>
      <div className="vehi-bot">
        {/* <div className="popup-link" > */}
        <div className="popup-link" onClick={handlePropertyPhotos}>
          <img src={PhotoIcon} alt="" />
          <span>{languageData?.view_property_photos.toString()}</span>
        </div>
        {/* <div className="popup-link"> */}
        <div className="popup-link" onClick={handleContentBenefits}>
          <img src={AddOns} alt="" />
          <span>
            {languageData?.view_content_benefits.toString()}{" "}
            {Array.isArray(selectedContetBenefits) &&
              selectedContetBenefits.length
              ? `(${selectedContetBenefits.length})`
              : ""}
          </span>
        </div>
        <div className="popup-link" onClick={handleAddBenef}>
          <img src={AddBenefits} alt="" />
          <span>
            {languageData?.additional_benefits.toString()}{" "}
            {Array.isArray(selectedBenefits) && selectedBenefits.length
              ? `(${selectedBenefits.length})`
              : ""}
          </span>
        </div>
      </div>

      {showPropertyPhotosModal && (
        <PropertyPhotosModal
        show={showPropertyPhotosModal}
        onHide={handleCloseModal}
        languageData={languageData}
      />
      )}
      {showContentBenefitsModal && (
        <ContentBenefitsModal
          show={showContentBenefitsModal}
          onHide={handleCloseModal}
          languageData={languageData}
        />
      )}

      {showAddBenefModal && (
        <AdditionalBenefitModal
          show={showAddBenefModal}
          onHide={handleCloseModal}
          languageData={languageData}
        />
      )}
    </>
  );
};

export default HousePropertyLinks;
