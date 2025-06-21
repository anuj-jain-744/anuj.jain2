import React, { useState, useEffect } from "react";
import { Accordion } from "react-bootstrap";
import "./style.scss";
import Travel_Logo from "assets/Dashboard/Travel_MyRequest.svg"
//import DriverInformation from "./DriverInformation";
import { LanguageData } from "types/languageData";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { DATE_FORMATS, travelerTypeIdMap } from "constant";
import { subtractDates } from "utils/subtractDates";
import { formatDateObjectTo } from "utils/formatDate";

interface ITravelInformation {
  languageData: LanguageData | undefined | null;
}

const TravelInformation: React.FC<ITravelInformation> = ({
  languageData,
}) => {


  const { travellerType,travelDateRange } = useQuoteAndBuyContext();

  //accordion opened/not state
  const [isOpen, setOpen] = useState<boolean>(true);
  //accordion on body open handler fn
  const clickEnterHandler = () => {
      setOpen(true);
  };
  //accordion on body close handler fn
  const clickExitHandler = () => {
      setOpen(false);
  };

  useEffect(() => {
    setOpen(true);
  }, []);

  const [travelStartDate, travelEndDate] = travelDateRange;

  return (
    <React.Fragment>
      <Accordion
        defaultActiveKey="0"
        className={`${
          isOpen ? "accor-open" : "accor-close"
        } w-100 coverage-travelinfo`}
      >
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <div className="d-flex align-items-center">
              <div className="logo-container">
                <img src={Travel_Logo} alt="logo" />
              </div>
              <div className="px-2 d-flex flex-column">
                <div className="tranvelinfo-title trvl-padding walaa-regular-400">
                {languageData?.travellerType}
                </div>
                <div className="tranvelinfo-content walaa-medium-500">{travellerType === travelerTypeIdMap.family ? "Family" : travellerType === 'self' ? travellerType.charAt(0).toUpperCase() + travellerType.slice(1) : 'Self'}</div>
              </div>
            </div>
          </Accordion.Header>
          <Accordion.Body
            onEntered={clickEnterHandler}
            onExiting={clickExitHandler}
            className="p-2"
          >
            {/* row 1 */}
            <div className="row">
              <div className="col">
                <div className="d-flex flex-column">
                  <div className="travel-info-title walaa-regular-400">
                    {languageData?.policy_start_date}
                  </div>
                  <div className="travel-infor-content walaa-medium-500">
                    {travelStartDate?.format("DD/MM/YYYY")}
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="d-flex flex-column">
                  <div className="travel-info-title walaa-regular-400">
                    {languageData?.policy_end_date}
                  </div>
                  <div className="travel-infor-content walaa-medium-500">
                    {travelEndDate?.format("DD/MM/YYYY")}
                  </div>
                </div>
              </div>
            </div>

            {/* row 2 */}
            <div className="row pt-3">
              <div className="col">
                <div className="d-flex flex-column">
                  <div className="travel-info-title walaa-regular-400">
                  {languageData?.travel_period}
                  </div>
                  <div className="travel-infor-content walaa-medium-500">
                  {`${subtractDates(formatDateObjectTo(travelEndDate, DATE_FORMATS["DD/MM/YYYY"]).toString(), formatDateObjectTo(travelStartDate, DATE_FORMATS["DD/MM/YYYY"]).toString())} Days`}
                  </div>
                </div>
              </div>
             
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </React.Fragment>
  );
};

export default TravelInformation;
