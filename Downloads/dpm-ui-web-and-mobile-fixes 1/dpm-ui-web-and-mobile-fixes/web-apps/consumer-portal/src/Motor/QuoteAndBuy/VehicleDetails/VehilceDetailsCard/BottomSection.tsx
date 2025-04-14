import React, { useState } from "react";
import style from "./VehicleDetailsCard.module.scss";
import ThemeButton from "components/ThemeButton/ThemeButton";
import DriverDetails from "Motor/QuoteAndBuy/DriverDetails/DriverDetails";
import { AddDriver } from "components/AddDriver/index";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { LanguageData } from "types/languageData";
import { AlertBox } from "components/AlertBox";
import { ERROR, SOMETHING_WENT_WRONG } from "../../../../constant";
import useHandleDriverData from "hook/motor/useHandleDriverData";
import { ErrorResponse } from "types/ErrorResponse";
import { DriverDetailsResponseData } from "types/quoteAndBuy";
import { DriverDetailsFormsData } from "types/DriverDetailsApi";

interface BottomSectionProps {
  languageData: LanguageData | undefined | null;
  onPopShow?: boolean;
  handleClose?: () => void;
  setShowAddDriverModal?: (show: boolean) => void; 
}

const BottomSection: React.FC<BottomSectionProps> = ({
  languageData,
  onPopShow,
  handleClose,
  setShowAddDriverModal
}) => {
  const {
    driverDetailsResponseData: driverDetails,
  } = useQuoteAndBuyContext();
  const { handleDriverAdded } = useHandleDriverData();
  
  const [showDriverModal, setShowDriverModal] = React.useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState({
    title: "",
    description: "",
  });
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);

  const handleAddDriver = () => {
    if(handleClose) {
      handleClose();
    }
    setShowDriverModal(true);
  };

  const handleDriverError = (driverError: ErrorResponse) => {
    setApiErrorMessage({
      title: driverError?.name || ERROR,
      description: driverError.messages?.message_en ?? SOMETHING_WENT_WRONG,
    });
    setShowAlertModal(true);
  };

  const showAlert = (title: string, description: string) => {
    setApiErrorMessage({ title, description });
    setShowAlertModal(true);
  };

  const handleDriverAddedWrapper = (driverData: DriverDetailsResponseData, formData?: DriverDetailsFormsData) => {
    const { isDriverAlreadyAdded } = handleDriverAdded(driverData, formData);

    if (isDriverAlreadyAdded) {
      showAlert(languageData?.driver_already_added as string, languageData?.add_new_driver as string);
    }
  };

  return (
    <>
      <AlertBox
        title={apiErrorMessage.title}
        description={apiErrorMessage.description}
        showAlertModal={showAlertModal}
        setShowAlertModal={setShowAlertModal}
      />
      {onPopShow ? (
        <div className={style.container}>
        <div className={`${style.bottomSection} ${style.popupBottomContent}`}>
          <DriverDetails languageData={languageData} handleClose={setShowAddDriverModal}/>
          <div className={`${style.bottomContent}`}>
            <div className={style.bottomText}>
              {languageData?.add_additional_driver_upto}
            </div>

            <ThemeButton
              isDisabled={driverDetails?.length > 3}
              icon={false}
              variant="outline"
              title={languageData?.add_driver}
              classes="walaa-medium-500"
              onClickhandler={handleAddDriver}
            />
          </div>
        </div>
        </div>
      ) : (
        <div className={style.bottomSection}>
          <div className={style.bottomContent}>
            <div className={style.bottomText}>
              {languageData?.add_additional_driver_upto}
            </div>
            <ThemeButton
              isDisabled={driverDetails?.length > 3}
              icon={false}
              variant="outline"
              title={languageData?.add_driver}
              classes="walaa-medium-500"
              onClickhandler={handleAddDriver}
            />
          </div>
          <DriverDetails languageData={languageData} />
          {showDriverModal && (
            <AddDriver
              showAddDriver={showDriverModal}
              setShowAddDriver={setShowDriverModal}
              languageData={languageData || {}}
              isQuote={true}
              onDriverAdded={handleDriverAddedWrapper}
              onDriverAddedError={handleDriverError}
            />
          )}
        </div>
      )}
    </>
  );
};

export default BottomSection;