import React, { useEffect, useMemo, useState , useRef } from "react"; 
import {sanitizeHtml, useApiCall} from "@dpm/shared-module";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Row, Col, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.scss";
import { FullCalender } from "../../Calendar/fullcalender";
import ThemeDropdown from "../../ThemeDropdown/ThemeDropdown";
import { AlertBox } from "components/AlertBox";
import CounterComponent from "components/CounterComp";
import { useQuoteAndBuyContext } from "../../hooks/useQuoteAndBuyContext";
import SeniorCitizenAlert from "./SeniorCitizenAlert"
import { useLocation } from "react-router-dom";
import { toCamelCase } from "utils/quoteAndBuyTravel";
import { DateObject } from "react-multi-date-picker"; 
interface InitialValueProps {
  [key: string]: string;
}
import { SeniorCtzAge , AdultAge } from "constant";
 
interface VehicalDetailsProps {
  travelData: { [key: string]: string }; 
  setLeftStep: (val: number) => void;
}

const ValidateTravel: React.FC<VehicalDetailsProps> = ({
  travelData, 
  setLeftStep,
}) => {

  // context
  const {selectedPeriod, setSelectedPeriod, travelStartDate, setTravelStartDate, isToggleOn, setIsToggleOn ,
     totalCount , setTotalCount , setTravellerType , adultCount, setAdultCount, childCount, 
     setChildCount, srCitizenCount, setSrCitizenCount, ownerDetailsResponseData, 
  } = useQuoteAndBuyContext();

  const [inputError, setInputError] = useState<InitialValueProps | null>(null);
  const [isDisabled, setIsdisabled] = useState<boolean>(true);
  const [isModal, setIsModal] = useState<boolean>(false); 
  const [maxAdultLimit, setmaxAdultLimit] = useState<number>(2);
  const [maxSrCitizenLimit, setmaxsrCitizenLimit] = useState<number>(2);
 
  const [apiErrorMessage, setApiErrorMessage] = useState({
    title: "",
    description: "",
  });
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [isOn, setIsOn] = useState<boolean>(false);
  const [dropdownItems, setDropdownItems] = useState<string[]>([]);

  const location = useLocation();
  const propsData = location?.state?.data;
  const calenderRef = useRef<any>(null)

  const handleDateChange = (date: Date | null) => {
    setTravelStartDate(date);
  };

useEffect(()=>{
    if(travelStartDate===null)
    {
    setTravelStartDate(null);
    }
  },[travelStartDate]);

  useEffect(()=>{
    if(travelStartDate){
      const today = new DateObject().format("DD/MM/YYYY")
      const formattedSelectedDate = new DateObject(travelStartDate).format("DD/MM/YYYY")
      if(formattedSelectedDate === today){
        setTimeout(() => {
          setTravelStartDate("")
        }, 0)
        
        if(calenderRef.current?.clear){
          calenderRef.current.clear();
        }
      }
    }
    
    },[travelStartDate])
    
    const getTomorrowDate = () =>{
      return new DateObject().add(1,"day").format("DD/MM/YYYY");
    }
    useEffect(()=>{
      if(travelStartDate === ""){
        setTravelStartDate(getTomorrowDate)
      }
    },[setTravelStartDate, travelStartDate])
  
  
  // Counter component starts 
  const handleTotalChange = (type: string, change: number) => {
    let newAdultCount = adultCount;
    let newChildCount = childCount;
    let newSrCitizenCount = srCitizenCount; 
    switch (type) {
      case 'adult':
        newAdultCount = (adultCount ?? 0) + change;
        setAdultCount(newAdultCount);
        break;
      case 'child':
        newChildCount = (childCount ?? 0) + change;
        setChildCount(newChildCount);
        break;
      case 'senior':
        newSrCitizenCount = (srCitizenCount ?? 0) + change;
        setSrCitizenCount(newSrCitizenCount);
        break;
      default:
        break;
    }
    setTotalCount((newAdultCount ?? 0) + (newChildCount ?? 0) + (newSrCitizenCount ?? 0));
};
  // Counter component ends

  
 
// set traveller value based on toggle starts
  const handleToggleClick = () => {
    setIsToggleOn((prev) => !prev); 
    setInputError(null);
    setTravellerType(isToggleOn ?  "1" :  " 2");
    setAdultCount(defaultCount.adult);
    setChildCount(defaultCount.child);
    setSrCitizenCount(defaultCount.senior);
    setTotalCount(defaultCount.adult + defaultCount.child + defaultCount.senior);
  };
  
// set traveller value based on toggle ends
 
// travel period API call strats
 const { makeApiCall: makeTravelMasterApiCall, isLoading, errors, data : masterData } = useApiCall(21,"/MasterData/V1/GetTravelPeriod","get");

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

  useEffect(() => {
    setIsdisabled(isLoading);
    if (errors) {
      setApiErrorMessage({
        title: errors?.name || "Internal Server Error",
        description: errors.messages?.message_en ?? "Something went wrong !",
      });
      setShowAlertModal(true);
    }
    if (masterData) { 
      setLeftStep(0);
    }
  }, [errors, isLoading, masterData]);

  useEffect(() => {
    if (!isDisabled) {
      setInputError(null);
    }
  }, [isDisabled]);

  const onSelectPeriod = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriod(event.target.value);
  }; 

  const replaceName = (text: string, actualName: string): string => {

    const formattedName = actualName.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
    return text.replace("<<NAME>>", formattedName); //TODO: replace with actual name once API is integrated
  };

  const nameincamelcase = toCamelCase(propsData?.ownerDetail?.ownerFullNameEnglish);


 
   // to get the age of primary raveller starts
   const calculateAge = (dobArray: string[]): number => {
    const [day, month, year] = dobArray.map(Number);
    const dob = new Date(year, month - 1, day);
    const diffMs = Date.now() - dob.getTime();
    const ageDt = new Date(diffMs); 
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  };  
  const propsdob = location?.state?.data?.ownerDetail?.ownerDobG.split("-"); 
  const primaryTravellerDOB = propsdob;
  const PrimTravlerage = calculateAge(primaryTravellerDOB);

  
  const defaultCount = useMemo(() => {
    const seniorCtzAgeNumber = parseInt(SeniorCtzAge, 10);
    const adultAgeNumber = parseInt(AdultAge, 10);
    return {
      child: 0,
      adult: PrimTravlerage >= adultAgeNumber && PrimTravlerage <= seniorCtzAgeNumber ? 1 : 0,
      senior: PrimTravlerage > seniorCtzAgeNumber ? 1 : 0
    };
  },[PrimTravlerage]);
 
 
  useEffect(() => {
    const seniorCtzAgeNumber = parseInt(SeniorCtzAge, 10);
     const adultAgeNumber = parseInt(AdultAge, 10);
    if (PrimTravlerage > seniorCtzAgeNumber ) {
      setSrCitizenCount(1);
      
    } else if( PrimTravlerage >= adultAgeNumber && PrimTravlerage <= seniorCtzAgeNumber ) {
      setAdultCount(1);
      
    }
  }, [PrimTravlerage]);
 

// Validation adult senior sitizen count go beyond 2
const handleValidation = (adultCount: number, srCitizenCount: number) => {
  
  switch (true) {
    case adultCount === 1 && srCitizenCount === 1:
      setmaxAdultLimit(1);
      setmaxsrCitizenLimit(1);
      break;
    case adultCount === 1 && srCitizenCount === 0:
      setmaxAdultLimit(2);
      setmaxsrCitizenLimit(1);
      break;
    case adultCount === 0 && srCitizenCount === 1:
      setmaxAdultLimit(1);
      setmaxsrCitizenLimit(2);
      break;
    case adultCount === 2 && srCitizenCount === 0:
      setmaxAdultLimit(2);
      setmaxsrCitizenLimit(0);
      break;
    case adultCount === 0 && srCitizenCount === 2:
      setmaxAdultLimit(0);
      setmaxsrCitizenLimit(2);
      break;
    default:
      break;
  }
  
};
useEffect(() => {
     handleValidation(adultCount ?? 0, srCitizenCount ?? 0);
},[adultCount,srCitizenCount]);

  return (
    <div className="travel-detail-wrapper">
      <AlertBox
        title={apiErrorMessage.title}
        description={apiErrorMessage.description}
        showAlertModal={showAlertModal}
        setShowAlertModal={setShowAlertModal}
      />

      {/* Modal box starts */}
      <Modal
        size="lg"
        show={isModal}
        centered
        onHide={() => {
          setIsModal(false);
        }}
        className="validate-travel"
      >
        <Modal.Header closeButton>
        <h2
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(travelData?.traveller_popup_title),
            }}
          ></h2>
        </Modal.Header>
        <div className="actual-content">
         
          <div className="modal-traveller-content">
            {travelData?.traveller_popup_content && (
              <div
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(travelData?.traveller_popup_content),
                }}
              ></div>
            )}
          </div>
        </div>
      </Modal>
      {/* Modal box starts */}

      <div className="vehical-detail-content">
        <div className="vehical-section">
          {/* Title starts */}
          <div className="vehical-heading " data-testid="vehicalHead">
            {travelData?.travelDetails}
          </div>
          {/* Title ends */}
          
          <div className="vehical-content">
          <div className="travel-content">
              <Row> 
                <Col className="para-travel">
                  {/* <p>{travelData?.welcome_text} </p> */}
                  {travelData?.welcome_text && (replaceName(travelData?.welcome_text,nameincamelcase ?? "") )}
                </Col>
              </Row>
              <Row className="row-3-travel travel-fields">
                <Col className="travel-form-group col-4">
                  <label className="form-check-label">
                    {travelData?.travel_period}{" "}
                    <span className="mandate_star">*</span>
                  </label>
                  <div className="drop-container">
                    <ThemeDropdown
                      onChangehandler={onSelectPeriod}
                      value={dropdownItems}
                      classes={"policy-list"}
                      placeholder={"Select days"}
                      selectedValue={selectedPeriod}
                    />
                    {inputError?.selectedPeriod && (
                      <p className="input-error">{inputError.selectedPeriod}</p>
                    )}
                  </div>
                </Col>
                <Col className="travel-form-group col-4">
                  <label className="form-check-label">
                    {travelData?.travel_start_date}{" "}
                    <span className="mandate_star">*</span>
                  </label> 
                   <FullCalender
                    ref={calenderRef}
                    value={travelStartDate}
                    onChange={handleDateChange}
                    minDate={new DateObject()}
                    format="DD/MM/YYYY"
                    placeholder="DD/MM/YYYY"
                    setValue={setTravelStartDate}
                    isOn={isOn}
                    setIsOn={setIsOn}
                  /> 
                  {inputError?.travelStartDate && (
                    <p className="input-error">{inputError.travelStartDate}</p>
                  )}
                </Col>
                <Col className="travel-form-group col-4">
                  <label className="form-check-label">
                    {travelData?.travellerType} <span className="mandate_star">*</span>
                  </label>
                  <div className="toggle-wrapper">
                    <div className="product-toggle-wrapper">
                      <div className="product-toggle walaa-medium-500">
                        <div
                          data-testid="self-toggle"
                          className={isToggleOn ? "selected" : "default"}
                          onClick={handleToggleClick}
                        >
                          {travelData?.self}
                        </div>
                        <div
                          data-testid="family-toggle"
                          className={!isToggleOn ? "selected" : "default"}
                          onClick={handleToggleClick}
                        >
                          {travelData?.family}
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              {/* Self and family toggle starts */}
              {!isToggleOn && (
                <div className="travelers-num-container travel-fields">
                  <div className="age-title">
                    {" "}
                    {travelData?.select_number_of_travellers}{" "}
                    <span className="mandate_star">*</span>
                    <InfoOutlinedIcon
                      onClick={() => setIsModal(true)}
                      className="tooltip-icon"
                    />
                  </div>
                  <Row>
                  <Col className="age-input-warp travel-fields">
                    <Row className="age-input-box col-4">
                      {travelData?.children && (
                        <div
                          className="form-check-label"
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(travelData?.children),
                          }}
                        ></div>
                      )}
                       <CounterComponent
                          type="child"
                          maxLimit={6}
                          totalLimit={totalCount}
                          onTotalChange={handleTotalChange}
                          defaultCount = {defaultCount.child}
                        />
                    </Row>
                    <Row className="age-input-box col-4">
                      {travelData?.adult && (
                        <div
                          className="form-check-label"
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(travelData?.adult),
                          }}
                        ></div>
                      )}
                     <CounterComponent
                        type="adult"
                        maxLimit={maxAdultLimit}
                        totalLimit={totalCount}
                        onTotalChange={handleTotalChange}
                        defaultValue={adultCount} 
                        defaultCount = {defaultCount.adult}
                      />
                    </Row>
                    <Row className="age-input-box col-4">
                      {travelData?.senior_citizen && (
                        <div
                          className="form-check-label"
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(travelData?.senior_citizen),
                          }}
                        ></div>
                      )}
                      <CounterComponent
                          type="senior"
                          maxLimit={maxSrCitizenLimit}
                          totalLimit={totalCount}
                          onTotalChange={handleTotalChange}
                          defaultValue={srCitizenCount}
                        
                          defaultCount = {defaultCount.senior}
                        />
                    </Row>
                    
                  </Col>
                  </Row>
                  
                  {(srCitizenCount !== 0) && ( <Row>
                      <Col>
                      <SeniorCitizenAlert message={travelData?.senior_citizen_alert_msg} />
                      </Col>
                    </Row>)}
                 
                  {inputError?.totalCount && (
                    <p className="input-error">{inputError.totalCount}</p>
                  )}
                </div>
              )}
              {/* Self and family toggle ends */} 
            
            </div>
          </div>
        </div>
        <br />
      </div>
    </div>
  );
};

export default ValidateTravel;
