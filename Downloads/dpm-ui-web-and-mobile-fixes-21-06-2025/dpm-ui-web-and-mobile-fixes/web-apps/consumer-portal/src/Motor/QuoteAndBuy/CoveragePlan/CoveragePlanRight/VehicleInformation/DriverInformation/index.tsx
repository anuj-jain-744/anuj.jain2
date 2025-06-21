import { Card } from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";
import { LanguageData } from "types/languageData";
import DriverNameCard from "./DriverNameCard";
import React, { useState, useEffect } from "react";
import { AddDriver } from "components/AddDriver/index";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import useHandleDriverData from "hook/motor/useHandleDriverData";
import { AlertBox } from "components/AlertBox";
import { ErrorResponse } from "types/ErrorResponse";
import { ERROR, SOMETHING_WENT_WRONG } from "constant";
import { DriverDetailsResponseData } from "types/quoteAndBuy";
import { DriverDetailsFormsData } from "types/DriverDetailsApi";
import { useReusableAlert } from "../../../../../../../src/hooks/useReusableAlert";
import { useCheckDuplicateDriver } from "../../../../../../../src/hooks/useCheckDuplicateDriver";

interface IDriverInformation {
  languageData: LanguageData | undefined | null;
}

const DriverInformation: React.FC<IDriverInformation> = ({ languageData }) => {
  const { driverDetailsResponseData } = useQuoteAndBuyContext();
  const { handleDriverAdded } = useHandleDriverData();
  // showdriver modal for adding driver
  const [showDriverModal, setShowDriverModal] = React.useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const [updatedDriverData, setUpdatedDriverData] = useState(driverDetailsResponseData);
  // Hook for duplicate check

  const { checkIfDriverExists } = useCheckDuplicateDriver();

  // Reusable AlertBox hook
  const {
    apiErrorMessage,
    showAlertModal,
    setShowAlertModal,
    triggerAlert,
  } = useReusableAlert();

  const handleAddDriver = () => {
    setShowDriverModal(true);
    setIsMounted(false);
  };
  


  // Handle error from API or AddDriver component

  const handleDriverError = (driverError: ErrorResponse) => {
    triggerAlert(
      driverError?.name || ERROR,
      driverError.messages?.message_en ?? SOMETHING_WENT_WRONG
    );
  };

  //  Handle after driver is added

  const handleDriverAddedWrapper = (
    driverData: DriverDetailsResponseData,
    formData?: DriverDetailsFormsData
  ) => {

    console.log("Checking for duplicates on add:", formData?.ownerId);
    const isDuplicate =
      formData?.ownerId && checkIfDriverExists(formData.ownerId);
    console.log(" Duplicate found?", isDuplicate);

    if (isDuplicate) {
      triggerAlert(
        languageData?.driver_already_added || "Driver already added",
        languageData?.add_new_driver || "Please add a new driver"
      );
      console.log("Triggered Alert Modal from reusable hook");
      return;
    }

    //  Continue with original logic
    handleDriverAdded(driverData, formData);
  };

  useEffect(() => {
    setUpdatedDriverData(driverDetailsResponseData);
  }, [driverDetailsResponseData]);


  return (
    <Card className="w-100 driver-information-card">
      <Card.Body>
        <div className="row d-flex flex-column">
          <div className={`${driverDetailsResponseData.length > 0 ? "col pb-2" : "col"}`}>
            <div className="d-flex align-items-center justify-content-between">
              <div className="additional-driver-title walaa-medium-500">
                {languageData?.additional_drivers}
              </div>
             <div
                className={`d-flex align-items-center add-driver-container link-offset-3 ${driverDetailsResponseData.length > 3 ? 'disabledDriver' : ''}`}
                onClick={driverDetailsResponseData.length > 3 ? undefined : handleAddDriver}
              >
                <div className="add-driver-icon">
                  <AddIcon />
                </div>
                <div className="walaa-regular-400 add-driver-title">
                  {languageData?.add_driver}
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <DriverNameCard isMounted={isMounted}/>
          </div>
        </div>
        {showDriverModal && languageData && (
          <AddDriver
            showAddDriver={showDriverModal}
            setShowAddDriver={setShowDriverModal}
            languageData={languageData}
            isQuote={true}
            onDriverAdded={handleDriverAddedWrapper}
            onDriverAddedError={handleDriverError}
            triggerAlert={triggerAlert}
          />
        )}
        <AlertBox
          title={apiErrorMessage.title}
          description={apiErrorMessage.description}
          showAlertModal={showAlertModal}
          setShowAlertModal={setShowAlertModal}
        />
      </Card.Body>
    </Card>
  );
};

export default DriverInformation;