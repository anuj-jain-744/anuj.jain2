import React, { useEffect, useState } from 'react';
import { FullCalender } from 'components/Calendar/fullcalender';
import ThemeDropdown from 'components/ThemeDropdown/ThemeDropdown';
// import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';
import { Col, Row } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import { useApiCall } from '@dpm/shared-module';
import { useLocation } from 'react-router-dom';
import "./index.scss"
import TermsAndCon from 'claims/register/compensation/TermsAndCon';
import { AlertBox } from 'components/AlertBox';

const ExtendTravelPeriod = ({ travelData,cardData,languageData }) => {

  // TODO: need to for rference to make new context  : 
  // const {selectedPeriod, setSelectedPeriod, travelStartDate, setTravelStartDate, 
  //   isTermCondition,setIsTermCondition } = useQuoteAndBuyContext(); 

  const [apiErrorMessage, setApiErrorMessage] = useState({
    title: "",
    description: "",
  });
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [travelStartDate, setTravelStartDate] = useState<string | number | Date>(new Date());
  const [isTermCondition,setIsTermCondition] = useState<boolean>(false);
  const [isDisabled, setIsdisabled] = useState<boolean>(true); 
  const [dropdownItems, setDropdownItems] = useState<string[]>([]);
  const [extendedPolicyEndDate, setExtendedPolicyEndDate] = useState<string>(""); 
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [inputError, setInputError] = useState<InitialValueProps | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const location = useLocation();
  const propsData = location?.state?.data;

  const handleDateChange = (date: Date | null) => {
    setTravelStartDate(date);
    
  };

  // travel period API call strats
 const { makeApiCall: makeTravelMasterApiCall, isLoading, errors, data : masterData } = 
 useApiCall(21,"/MasterData/V1/GetTravelPeriod","get");

 useEffect(() => { 
   makeTravelMasterApiCall(); 
 }, []);
 
 useEffect(() => {  
   if (masterData) {
     const travelPeriodData =(masterData as any).model?.content?.map(
       (item: any) => item.codeDesc
     );
     setDropdownItems(travelPeriodData);
   }
 }, [masterData]);
   // travel period API call ends 


  // calculate travel end date starts
  const TravelPeriod=selectedPeriod ? selectedPeriod.split(" ")[0] : ""
  
  const calculateEndDate = (startDate: Date, days: number): string => {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + days);
    const day = endDate.getDate().toString().padStart(2, '0');
    const month = (endDate.getMonth() + 1).toString().padStart(2, '0');
    const year = endDate.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const travelEndDate = travelStartDate ? calculateEndDate(new Date(travelStartDate as string | number | Date), parseInt(TravelPeriod)) : "";
   // calculate travel end date starts

   useEffect(() => {
    setIsdisabled(isLoading);
    if (errors) {
      setApiErrorMessage({
        title: errors?.name || "Internal Server Erroe",
        description: errors.messages?.message_en ?? "Something went wrong gfdgfdg!",
      });
      setShowAlertModal(true);
    }
    // if (masterData) { 
    //   setLeftStep(0);
    // }
  }, [errors, isLoading, masterData]);

  useEffect(() => {
    if (!isDisabled) {
      setInputError(null);
    }
  }, [isDisabled]);

   const onSelectPeriod = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriod(event.target.value); 
    setExtendedPolicyEndDate(`${selectedPeriod} + ${travelStartDate}`);
    setIsVisible(true);
  };  
  
  return (
    <>
     <AlertBox
        title={apiErrorMessage.title}
        description={apiErrorMessage.description}
        showAlertModal={showAlertModal}
        setShowAlertModal={setShowAlertModal}
        data-testid="alert-box"
      />
      <div className="left-card endoresment_container">
        <div className="header walaa-medium-500">
          <div className="header-body">
            {travelData?.extend_travel_period}
          </div>
        </div>
        <div className="header-border"></div>
        <div className="body"> 
            <div className='travel-content'> 
                <p className='para-travel'>  {travelData?.policy_premium_text} </p>
                <div className='blue-travel-container'>
                  <Row className="row-3-travel travel-fields"> 
                    <Col className="travel-form-group col-6">
                      <label className="form-check-label"> {travelData?.current_policy_end_date} </label>
                      <FullCalender
                        value={travelStartDate}
                        onChange={handleDateChange}
                        format="DD/MM/YYYY"
                        placeholder="DD/MM/YYYY"
                        setValue={setTravelStartDate} 
                        data-testid="calendar"
                      />
                      
                    </Col>
                    <Col className="travel-form-group col-6">
                      <label className="form-check-label"> {travelData?.extend_travel_period} {" "}<span className="mandate_star">*</span></label>
                      <div className="drop-container">
                        <ThemeDropdown
                          onChangehandler={onSelectPeriod}
                          value={dropdownItems}
                          classes={"policy-list"}
                          placeholder={"Select days"}
                          selectedValue={selectedPeriod}
                          data-testid="dropdown"
                        /> 
                      </div>
                    </Col>
                  </Row>
                  {isVisible && (
                  <Row>
                    <Col className="travel-form-group col-12">
                      <label className="form-check-label">
                      {travelData?.extended_policy_end_date} <span className="mandate_star">*</span>
                      </label> 
                      <p className='walaa-medium-500'> {travelEndDate} </p>
                    </Col>
                  </Row>
                  )}
                </div>
            </div> 
        </div> 
      </div>
      <TermsAndCon
        languageData={languageData as travelData}
        isChecked={isTermCondition} 
        setIsChecked={setIsTermCondition}
      />
    </> 
  );
};

export default ExtendTravelPeriod;