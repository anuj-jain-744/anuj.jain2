import React, { useEffect, useState } from "react";
import "./index.scss";
import VehiIcon from "../../assets/QuoteAndBuy/vehicle.svg";
import AddBenefits from "../../assets/QuoteAndBuy/AddBenefits.svg";
import Driver from "../../assets/QuoteAndBuy/Steering.svg";

import VehicleDetailsModal from "../../Motor/QuoteAndBuy/VehicleDetailsModal/VehicleDetailsModal";
import AdditionalDriverModal from "../AdditionalDriverModal";
import AdditionalBenefitModal from "../AddionalBenefits";

import { LanguageData } from "types/languageData";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { AddDriver } from "components/AddDriver";
import DriverDetailsModal from "Motor/QuoteAndBuy/DriverDetailsModal/DriverDetailsModal";
import useHandleDriverData from "hook/motor/useHandleDriverData";
import useCalculatePremiumPayload from "Motor/QuoteAndBuy/hooks/useCalculatePremiumPayload";
import { useCalculatePremiumApi } from "hook/motor/useCalculatePremiumApi";
import { useCheckDuplicateDriver } from "hooks/useCheckDuplicateDriver";
import { DriverDetailsResponseData } from "types/quoteAndBuy";
import { DriverDetailsFormsData } from "types/DriverDetailsApi";
import { useReusableAlert } from "hooks/useReusableAlert";
import { AlertBox } from "components/AlertBox";

interface VehicalLinksProps {
  languageData: LanguageData | undefined | null;
}

const VehicalLinks: React.FC<VehicalLinksProps> = ({ languageData }) => {
  const [showModal, setShowModal] = useState(false);
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [showAddBenefModal, setShowAddBenefModal] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const [showDriverModal, setShowDriverModal] = useState(false);

  const { checkIfDriverExists } = useCheckDuplicateDriver();

  const {
    apiErrorMessage,
    showAlertModal,
    setShowAlertModal,
    triggerAlert,
  } = useReusableAlert();

  const { selectedDriverID, showManageDriverModal, setSelectedDriverID, setShowManageDriverModal, selectedBenefits, driverDetailsResponseData } =
    useQuoteAndBuyContext();
  const { handleDriverAdded } = useHandleDriverData();

  const handleVehicleDetails = () => {
    setShowModal(true);
  };

  const handleDriverAddedWrapper = (
    driverData: DriverDetailsResponseData,
    formData?: DriverDetailsFormsData
  ) => {
    const isDuplicate =
      formData?.ownerId && checkIfDriverExists(formData.ownerId);

    if (isDuplicate) {
      triggerAlert(
        languageData?.driver_already_added || "Driver already added",
        languageData?.add_new_driver || "Please add a new driver"
      );
      return;
    }

    handleDriverAdded(driverData, formData);
  };

  const handleAddDriver = () => {
    setShowAddDriverModal(true);
    setShowManageDriverModal(true);
    setIsMounted(false);
  };

  const handleAddBenef = () => {
    setShowAddBenefModal(true);
  };

  const openAddDriverModal = () => {
    setShowAddDriverModal(false);
    setShowDriverModal(true);
  }
  const handleCloseModal = () => {
    setShowModal(false);
    setShowAddDriverModal(false);

    setShowAddBenefModal(false);
  };

  const handleCloseDriverModal = () => {
    // setSelec
    setSelectedDriverID(null);
    handleCloseModal();
    setShowManageDriverModal(false);
  }
  const requestPayload = useCalculatePremiumPayload();
  const { handleCalculatePremium } = useCalculatePremiumApi();

  useEffect(() => {
    if (!isMounted && driverDetailsResponseData && driverDetailsResponseData.length > 1 && requestPayload) {
      if (requestPayload.policyRisk.drivers.length === driverDetailsResponseData.length)
        handleCalculatePremium(requestPayload);
    }
  }, [driverDetailsResponseData, requestPayload]);

  const benfitsLength = (selectedBenefits ?? []).filter((benefit) => benefit.benefitNameEn !== undefined).length;

  return (
    <>
      <div className="vehi-bot">
        {/* <div className="popup-link" > */}
        <div className="popup-link" onClick={handleVehicleDetails}>
          <img src={VehiIcon} alt="" />
          <span>{languageData?.review_vehicle_details?.toString()}</span>
        </div>
        {/* <div className="popup-link"> */}
        <div className="popup-link" onClick={handleAddDriver}>
          <img src={Driver} alt="" />
          <span>
            {languageData?.driver_details?.toString()}{" "}
            {Array.isArray(driverDetailsResponseData) &&
              driverDetailsResponseData.length > 1 &&
              driverDetailsResponseData.length
              ? `(${driverDetailsResponseData.slice(1).length})`
              : ""}
          </span>
        </div>
        <div className="popup-link" onClick={handleAddBenef}>
          <img src={AddBenefits} alt="" />
          <span>
            {languageData?.additional_benefits?.toString()}{" "}
            {Array.isArray(selectedBenefits) && selectedBenefits.length
              ? `(${benfitsLength})`
              : ""}
          </span>
        </div>
      </div>

      {showModal && (
        <VehicleDetailsModal
          show={showModal}
          onHide={handleCloseModal}
          languageData={languageData}
        />
      )}

      {showDriverModal && languageData && (
        <AddDriver
          showAddDriver={showDriverModal}
          setShowAddDriver={setShowDriverModal}
          languageData={languageData}
          isQuote={true}
          onDriverAdded={handleDriverAddedWrapper}
          triggerAlert={triggerAlert}
        />)}

      {selectedDriverID && showManageDriverModal && (
        <DriverDetailsModal
          show={true}
          onHide={handleCloseDriverModal}
          languageData={languageData}
          driverID={selectedDriverID}
        />
      )}
      <AdditionalDriverModal
        show={showAddDriverModal}
        onHide={handleCloseModal}
        languageData={languageData}
        openAddDriverModal={openAddDriverModal}
      />

      {showAddBenefModal && languageData && (
        <AdditionalBenefitModal
          show={showAddBenefModal}
          onHide={handleCloseModal}
          languageData={languageData}
        />
      )}

      <AlertBox
        title={apiErrorMessage.title}
        description={apiErrorMessage.description}
        showAlertModal={showAlertModal}
        setShowAlertModal={setShowAlertModal}
      />
    </>
  );
};

export default VehicalLinks;
