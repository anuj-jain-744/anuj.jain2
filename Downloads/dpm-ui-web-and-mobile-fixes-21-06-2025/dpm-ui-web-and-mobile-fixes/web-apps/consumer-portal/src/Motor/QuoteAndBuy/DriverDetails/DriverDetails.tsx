import React, { useEffect, useState } from "react";
import style from "./DriverDetails.module.scss";
import verticleLine from "assets/QuoteAndBuy/verticleLine.svg";
import deleteIcon from "assets/QuoteAndBuy/delete.svg";
import DriverDetailsModal from "../DriverDetailsModal/DriverDetailsModal";
import { LanguageData } from "types/languageData";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { getGenderProfileIcon, geteDriverRelation, truncateName } from "utils/quoteAndBuy";
import RemoveVehicleModal from "../RemoveVehicleModal/RemoveVehicleModal";
import { getDriverIdentifier } from "utils/driverIdentifier";
import { useSelector } from 'react-redux';
import { RootState, } from "@dpm/shared-module";

interface DriverDetailsProps {
  languageData: LanguageData | undefined | null;
  handleClose?: (val: boolean) => void;
}

const DriverDetails: React.FC<DriverDetailsProps> = ({ languageData, handleClose}) => {
  const { driverDetails: driverDetailsData, driverDetailsResponseData, setDriverDetailsResponseData, setDriverDetails, showManageDriverModal, setSelectedDriverID, selectedDriverID} =
    useQuoteAndBuyContext();

  const [updatedDriverData, setUpdatedDriverData] = useState(driverDetailsResponseData);
  const [showRemoveDriverModal, setShowRemoveDriverModal] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState<any>(null);

  const handleCloseModal = () => {
    setSelectedDriverID(null);
    setShowRemoveDriverModal(false);
    setDriverToDelete(null);
  };

  const handleDriverDetails = (driverID: string) => {
    setSelectedDriverID(driverID);
    if(handleClose) {
      handleClose(false);
    }
  };

  const handleDeleteDriver = (driver: any) => {
    setDriverToDelete(driver);
    setShowRemoveDriverModal(true);
  };

  const handleConfirmDelete = () => {
    if (driverToDelete) {
      // Filter out the driver with the matching driverID
      const updatedDriverData = driverDetailsResponseData.filter(
        (item) => item.driverID !== driverToDelete.driverID
      );

      const updatedDriverDetailsData = driverDetailsData.filter(
        (item) => item.driverID !== driverToDelete.driverID
      );

      setDriverDetails(updatedDriverDetailsData);
      setDriverDetailsResponseData(updatedDriverData);
      handleCloseModal();
    }
  };
  const {userInfo}= useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const additionalDriverDetails = driverDetailsResponseData?.filter(
      (item) => item?.driverID !== userInfo?.userId && item?.mainDriverInd !== "Y"
    );
    setUpdatedDriverData(additionalDriverDetails);
  }, [driverDetailsResponseData, userInfo?.userId]);


  return (
    <div className={style.container}>
      {updatedDriverData?.map((driver, index) => (
        <div className={style.row} key={index}>
          <div className={style.iconContainer}>
            <div className={style.icon}>
              <img src={getGenderProfileIcon(driver?.gender)} width={"40px"} height={"40px"} alt="Driver Imaga" />
            </div>
            <div className={style.frame}>
              <div className={style.text}>
                <div className={style.label} title={driver?.driverName}>
                    {truncateName(driver?.driverName, 12)}
                </div>
              </div>
              <div className={style.value}>
                <div className={style.valueInput}>
                  {driver?.driverNameArabic}
                </div>
              </div>
            </div>
          </div>
          <img src={verticleLine} alt="verticleLine" />
          <div className={style.fieldContainer}>
            <div className={style.field}>
              <div className={style.fieldLabel}>
                {getDriverIdentifier(driver?.driverID, languageData)}
              </div>
            </div>
            <div className={style.field}>
              <div className={style.fieldValue}>{driver?.driverID}</div>
            </div>
          </div>
          <img src={verticleLine} alt="verticleLine" />
          <div className={style.fieldContainer}>
            <div className={style.field}>
              <div className={style.fieldLabel}>
                {languageData?.relationship}
              </div>
            </div>
            <div className={style.field}>
              <div className={style.fieldValue}>
                {driver?.additionalDriverDetails?.driverRelationship &&
                  geteDriverRelation(
                    parseInt(
                      driver?.additionalDriverDetails?.driverRelationship
                    )
                  )}
              </div>
            </div>
          </div>
          <img src={verticleLine} alt="verticleLine" />
          <div className={style.iconContainer}>
            <div
              className={style.driverText}
              onClick={() => handleDriverDetails(driver?.driverID)}
            >
              <div
                className={style.driverLabel}
                data-testid={`driver-details-label-${index}`}
              >
                {languageData?.driver_details}
              </div>
            </div>
            <img
              src={deleteIcon}
              alt="delete icon"
              className={style.crossicon}
              onClick={() => handleDeleteDriver(driver)}
            />
          </div>
          {selectedDriverID === driver?.driverID && (
            <DriverDetailsModal
              show={true}
              onHide={handleCloseModal}
              languageData={languageData}
              driverID={driver?.driverID}
            />
          )}
        </div>
      ))}
      {showRemoveDriverModal && (
        <RemoveVehicleModal
          show={showRemoveDriverModal}
          onHide={handleCloseModal}
          languageData={languageData}
          title={languageData?.remove_driver ?? "Remove Driver"}
          description={languageData?.are_you_sure_you_want_to_remove_driver ?? "Are you sure you want to remove driver?"}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default DriverDetails;