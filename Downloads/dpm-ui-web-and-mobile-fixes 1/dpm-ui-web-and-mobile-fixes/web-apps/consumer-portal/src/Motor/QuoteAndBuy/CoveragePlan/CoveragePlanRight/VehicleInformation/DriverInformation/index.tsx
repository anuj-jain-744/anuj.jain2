import { Card } from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";
import { LanguageData } from "types/languageData";
import DriverNameCard from "./DriverNameCard";
import React, { useState } from "react";
import { AddDriver } from "components/AddDriver/index";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import useHandleDriverData from "hook/motor/useHandleDriverData";
import { AlertBox } from "components/AlertBox";
import { ErrorResponse } from "types/ErrorResponse";
import { ERROR, SOMETHING_WENT_WRONG } from "constant";

interface IDriverInformation {
  languageData: LanguageData | undefined | null;
}
 
const DriverInformation: React.FC<IDriverInformation> = ({ languageData }) => {
  const { driverDetailsResponseData } = useQuoteAndBuyContext();
  const { handleDriverAdded } = useHandleDriverData();
  // showdriver modal for adding driver
  const [showDriverModal, setShowDriverModal] = React.useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const [apiErrorMessage, setApiErrorMessage] = React.useState({
    title: "",
    description: "",
  });
  const [showAlertModal, setShowAlertModal] = React.useState<boolean>(false);
 
  const handleAddDriver = () => {
    setShowDriverModal(true);
    setIsMounted(false);
  };
 
  const handleDriverError = (driverError: ErrorResponse) => {
    setApiErrorMessage({
      title: driverError?.name || ERROR,
      description: driverError.messages?.message_en ?? SOMETHING_WENT_WRONG,
    });
    setShowAlertModal(true);
  };
 
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
            onDriverAdded={handleDriverAdded}
            onDriverAddedError={handleDriverError}
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