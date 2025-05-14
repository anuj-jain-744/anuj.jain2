import React, { useEffect } from "react";
import style from "./DriverNameCard.module.scss";
import "./style.scss";
import driverIcon from "assets/QuoteAndBuy/driver.svg";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import useCalculatePremiumPayload from "Motor/QuoteAndBuy/hooks/useCalculatePremiumPayload";
import { useCalculatePremiumApi } from "hook/motor/useCalculatePremiumApi";

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

  return (
    <div className={`${style.container} justify-content-start px-2`}>
      <div className="row">
        {driverDetailsData.slice(1).filter(driver => (driver.mainDriverInd === 'N' || !driver.mainDriverInd)).map((driver, index) => (
          <React.Fragment key={index}>
            <div className="col pt-1 driver-card-col ps-1">
              <div className="driver-card-container">
                <div className="d-flex driver-card-wrapper">
                  <div className="driver-card-icn">
                    <img src={driverIcon} alt="driver icon" />
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
