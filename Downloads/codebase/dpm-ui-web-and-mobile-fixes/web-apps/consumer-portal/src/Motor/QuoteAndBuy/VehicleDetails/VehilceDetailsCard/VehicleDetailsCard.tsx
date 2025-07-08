import React, { useState } from "react";
import style from "./VehicleDetailsCard.module.scss";
import deleteIcon from "assets/QuoteAndBuy/delete.svg";
import verticleLine from "assets/QuoteAndBuy/verticleLine.svg";
import vechile from "assets/QuoteAndBuy/vehicle.svg";
import BottomSection from "./BottomSection";
import VehicleDetailsModal from "./../../VehicleDetailsModal/VehicleDetailsModal";
import RemoveVehicleModal from "Motor/QuoteAndBuy/RemoveVehicleModal/RemoveVehicleModal";
import { LanguageData } from "types/languageData";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { getPlateNumber } from "utils/getPlateNumber";
import { getModelIcon } from "utils/getModelIcon";
import { NOT_APPLICABLE } from "@dpm/shared-module";
import { getVehicleMakeModel } from "utils/quoteAndBuy";

interface VehicleDetailsCardProps {
  languageData: LanguageData | undefined | null;
  navigateTo?: (url: string) => void;
  leftStep?: number;
  setLeftStep?: (val: number) => void;
}

const VehicleDetailsCard: React.FC<VehicleDetailsCardProps> = ({
  languageData, navigateTo, leftStep, setLeftStep
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showRemoveVehicleModal, setShowRemoveVehicleModal] = useState(false);
  const { vehicleDetails, vehicleDetailsResponseData, makeModelResponse } =
    useQuoteAndBuyContext();

  const handleVehicleDetails = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowRemoveVehicleModal(false);
  };

  const handleRemoveVehicleModal = () => {
    setShowRemoveVehicleModal(true);
  };

  return (
    <div className={style.container}>
      <div className={style.cardSection}>
        <div className={style.cardFrame}>
          <div className={style.cardFrameContainer}>
            <div className={style.vehicleHeading}>
              <div className={style.logIcon}>
                <img
                  className={style.vehicleIcon}
                  src={getModelIcon(
                    vehicleDetailsResponseData?.vehicleMakeTextEn,
                    vehicleDetailsResponseData?.vehicleMakeId,
                    makeModelResponse || []
                  )}
                  alt="car icon"
                />
              </div>
              <div className={style.vehicleTitle}>
                <div className={style.vehicleTitleContainer}>
                  <div className={style.vehicleTitleLabel}>
                    <div className={style.vehicleTitleLabelText}>
                      {getVehicleMakeModel(vehicleDetailsResponseData) ??
                        NOT_APPLICABLE}
                    </div>
                  </div>
                  {/* Keeping in case we need it later */}
                  {/* <div className={style.vehicleTitleLabel}>
                    <div className={style.vehicleInputLabelText}>
                      {vehicleDetailsResponseData
                        ? getPlateNumber(vehicleDetailsResponseData)
                        : NOT_APPLICABLE}
                    </div>
                  </div> */}
                </div>
              </div>
              {/* Keeping in case we need it later */}
              {/* <div className={style.vehicleInsurance}>
                <div className={style.vehicleInsuranceText}>
                  New Vehicle Insurance
                </div>
              </div> */}
            </div>
            <div
              className={style.vehicleDeletIcon}
              onClick={handleRemoveVehicleModal}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleRemoveVehicleModal();
                }
              }}
            >
              <img src={deleteIcon} alt="delete icon" />
            </div>
          </div>
          <div className={style.cardContentContainer}>
            <div className={style.cardValueContainer}>
              <div className={style.cardLabel}>
                {languageData?.number_plate}
              </div>
              <div className={style.cardInput}>
                {vehicleDetailsResponseData
                  ? getPlateNumber(vehicleDetailsResponseData)
                  : NOT_APPLICABLE}
              </div>
            </div>
            <img src={verticleLine} alt="verticle line" />
            <div className={style.cardValueContainer}>
              <div className={style.cardLabel}>
                {vehicleDetails?.vehicleSequenceNo
                  ? languageData?.vehicle_sequence
                  : "CustomCard No"}
              </div>

              <div className={style.cardInput}>
                {vehicleDetails?.vehicleSequenceNo
                  ? vehicleDetails?.vehicleSequenceNo
                  : vehicleDetails?.vehicleCustomID}
              </div>
            </div>
            <img src={verticleLine} alt="verticle line" />
            <div className={style.cardValueContainer}>
              <div className={style.cardLabel}>
                {languageData?.registration_year_label}
              </div>
              <div className={style.cardInput}>
                {vehicleDetailsResponseData?.manufactureYear ?? NOT_APPLICABLE}
              </div>
            </div>
            <img src={verticleLine} alt="verticle line" />
            <div className={style.cardValueContainer}>
              <div className={style.cardLabel}>{languageData?.colour}</div>
              <div className={style.cardInput}>
                {vehicleDetailsResponseData?.vehicleColourEn ?? NOT_APPLICABLE}
              </div>
            </div>
            <img src={verticleLine} alt="verticle line" />
            <div className={style.cardValueContainer}>
              <div className={style.cardLabel}>{languageData?.chassis_no}</div>
              <div className={style.cardInput}>
                {vehicleDetailsResponseData?.chassisNumber ?? NOT_APPLICABLE}
              </div>
            </div>
          </div>
          <div
            className={style.cardBottomContainer}
            onClick={handleVehicleDetails}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleVehicleDetails();
              }
            }}
          >
            <img src={vechile} alt="vehicle icon" />
            <div className={style.bottomText}>
              {languageData?.review_vehicle_details}
            </div>
          </div>
        </div>
      </div>
      <BottomSection languageData={languageData} />
      {showModal && (
        <VehicleDetailsModal
          show={showModal}
          onHide={handleCloseModal}
          languageData={languageData}
        />
      )}
      {showRemoveVehicleModal && (
        <RemoveVehicleModal
          show={showRemoveVehicleModal}
          onHide={handleCloseModal}
          languageData={languageData}
          navigateTo={navigateTo}
          leftStep={leftStep}
          setLeftStep={setLeftStep}
        />
      )}
    </div>
  );
};

export default VehicleDetailsCard;
