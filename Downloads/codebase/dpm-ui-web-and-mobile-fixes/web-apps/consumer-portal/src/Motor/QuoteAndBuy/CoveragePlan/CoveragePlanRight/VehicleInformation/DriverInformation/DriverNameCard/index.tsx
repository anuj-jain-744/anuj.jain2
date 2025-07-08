import React, { useEffect, useState } from "react";
import style from "./DriverNameCard.module.scss";
import "./style.scss";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import useCalculatePremiumPayload from "Motor/QuoteAndBuy/hooks/useCalculatePremiumPayload";
import { useCalculatePremiumApi } from "hook/motor/useCalculatePremiumApi";
import { getGenderProfileIcon } from "utils/quoteAndBuy";
import { useSelector } from 'react-redux';
import { RootState, } from "@dpm/shared-module";

interface IDriverNameCard {
  isMounted: boolean;
}

const DriverNameCard: React.FC<IDriverNameCard> = ({isMounted}) => {
  const { driverDetailsResponseData: driverDetailsData } = useQuoteAndBuyContext();
  const requestPayload = useCalculatePremiumPayload();
  const { handleCalculatePremium } = useCalculatePremiumApi();
  useEffect(() => {
    if(!isMounted && driverDetailsData && driverDetailsData.length > 1 && requestPayload) {
      if(requestPayload.policyRisk.drivers.length === driverDetailsData.length)
        handleCalculatePremium(requestPayload);
    }
  }, [driverDetailsData, requestPayload]);

  const [updatedDriverData, setUpdatedDriverData] = useState(driverDetailsData);


  const {userInfo}= useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const additionalDriverDetails = driverDetailsData?.filter(
      (item) => item?.driverID !== userInfo?.userId && item?.mainDriverInd !== "Y"
    );
    setUpdatedDriverData(additionalDriverDetails);
  }, [driverDetailsData, userInfo?.userId]);

  if (!driverDetailsData || driverDetailsData.length <= 1) {
    return null;
  }
  
  return (
    <div className={`${style.container} justify-content-start px-2`}>
      <div className="row driver-row-one">
        {updatedDriverData.map((driver, index) => (
          <React.Fragment key={driver.driverID + index}>
            <div className="col pt-1 driver-card-col ps-1">
              <div className="driver-card-container">
                <div className="d-flex driver-card-wrapper">
                  <div className="driver-card-icn">
                    <img src={getGenderProfileIcon(driver?.gender)} width={"40px"} height={"40px"} alt="Driver Imaga" />
                  </div>
                  <div className="d-flex flex-column driver-card-info">
                    <div className="driver-title" title={driver?.driverName}>
                      {driver?.driverName}
                    </div>
                    <div
                      className="driver-title"
                      title={driver?.driverNameArabic}
                    >
                      {driver?.driverNameArabic}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
export default DriverNameCard;
