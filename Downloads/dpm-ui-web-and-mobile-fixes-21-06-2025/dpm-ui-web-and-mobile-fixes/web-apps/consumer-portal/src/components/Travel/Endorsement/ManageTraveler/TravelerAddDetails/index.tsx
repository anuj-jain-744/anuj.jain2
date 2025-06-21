import React, { useEffect, useState } from "react";
import { Accordion, Form, Row, Col } from "react-bootstrap";
import "./index.scss";
import Info from "./info";
import { FullCalender } from "../Calendar/fullcalender";
import { TravelerAdult, TravelerChild, TravelerSenior } from "../TravelerFamily";
import DownhillSkiingOutlinedIcon from "@mui/icons-material/DownhillSkiingOutlined";
import CoronavirusOutlinedIcon from "@mui/icons-material/CoronavirusOutlined";
import GppMaybeOutlinedIcon from "@mui/icons-material/GppMaybeOutlined";
import AddAdditionalTraveller from "./AddAdditionalTraveller";
import { getAge } from "utils/getAge";
import { subtractDates } from "utils/subtractDates";
import { getInnerTextBetweenTags } from "utils/GetInnerTextBetweenTags";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import useUpdateRequestPayload from "hook/travel/useUpdateRequestPayload";
import { useCalculatePremiumApi } from "hook/travel/useCalculatePremiumApi";
import { worldwidecalculatePremium, worldwideexceptcalculatePremium, europecalculatePremium } from "../QuoteAndBuy/Commonfunction";
import { AlertBox } from "components/AlertBox";
import { INTERNAL_SERVER_ERROR, SOMETHING_WENT_WRONG } from "constant";

interface TravelerAddDetailsData {
  data: {[key: string]: string};
}

const TravelerAddDetails: React.FC<TravelerAddDetailsData> = ({data}) => {
  //accordion opened/not state
  const [isOpen, setOpen] = useState<boolean>(true);
  const [winterBenfit, setWinterBenfit] = useState<boolean>(false);
  const [covidBenfit, setCovidBenfit] = useState<boolean>(false);
  const [validation, setValidation] = useState<number>(0);
  const [adultCount, setAdultCount] = useState<number>(0);
  const [childCount, setChildCount] = useState<number>(0);
  const [srCitizenCount, setSrCitizenCount] = useState<number>(0);
  const [primaryTravellerInputs, setPrimaryTravellerInputs] = useState<{[key:string]:string | number}>({
    primaryTraveller: "",
    primaryTravellerPassportNo: "",
    primaryTravellerPassportExpiryDate: "",
    primaryTravellerDOB: "",
  });
  const [primaryTravellerPED, setPrimaryTravellerPED] = useState<Date | null>(null);
  const {settravelCovidcoverage,settravelWintersportscoverage,dataWorldwidepearl,isAddTravelerValidation, setIsAddTravelerValidation,dataWorldwidetraveller,setworldwidepearlInitialPrice,setworldwidetravellerInitialPrice,
    setworldwideCardPrice,setdataworldwidepearlVAT,setdataworldwidepearladminfee,setdataworldwidepearlnetpremium,
    setdataworldwidetravellerVAT,setdataworldwidetravelleradminfee,setdataworldwidetravellernetpremium
    ,travelCovidcoverage,travelWintersportscoverage,dataWorldwideexceptpearl,dataWorldwideexcepttraveller,setworldwideexceptpearlInitialPrice,setworldwideexcepttravellerInitialPrice,setworldwideexceptCardPrice
    ,setdataworldwideexceptpearlVAT,setdataworldwideexceptpearladminfee,setdataworldwideexceptpearlnetpremium,
    setdataworldwideexcepttravellerVAT,setdataworldwideexcepttravelleradminfee,setdataworldwideexcepttravellernetpremium,
    dataEuropeeurope,dataEuropeschengen,setEuropeeuropeInitialPrice,setEuropeschengenInitialPrice,
    setEuropeCardPrice,setEuropeeuropeVAT,setdataEuropeeuropeadminfee,
    setdataEuropeeuropenetpremium,setdataEuropeschengenVAT,setdataEuropeschengenadminfee,
    setdataEuropeschengennetpremium,ownerDetailsResponseData,setpTravelername,setpTravelerPassportno,setpTravelerPassportexpiry , 
    pTravelerPassportexpiry, pTravelerPassportno, pTravelername, policyStartDate}= useQuoteAndBuyContext(); 
  const requestPayload = useUpdateRequestPayload();
  const { handleCalculatePremium, isError, isCalculateData } = useCalculatePremiumApi();

  const [apiErrorMessage, setApiErrorMessage] = useState({
    title: "",
    description: ""
  });
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [dateDiff, setDateDiff] = useState<number>(0);
  const [passPortAlertText, setPassportAlertText] = useState<string | null>("");
   //accordion on body open handler fn
  const clickEnterHandler = () => {
    setOpen(true);
  };
  //accordion on body close handler fn
  const clickExitHandler = () => {
    setOpen(false);
  };
  const handleAddBenefit = (benefit: string, status: boolean) => {
    if (benefit === "winter") {
      setWinterBenfit(!status);
      settravelWintersportscoverage(!status);
     
      
    } else if (benefit === "covid") {
      setCovidBenfit(!status);
      settravelCovidcoverage(!status);
     
    }
  };

  const addBenefitCalculation = () => {
    const policyRisk = requestPayload && requestPayload.policyRisk ? requestPayload.policyRisk[0] : null;
    if (!policyRisk) return;
    const newpayload = {
      ...requestPayload,
      policyRisk: [
        {
          ...policyRisk,
          policyCoverage: [
            ...(covidBenfit ? [{ coverageCode: "CV" }] : []),
            ...(winterBenfit ? [{ coverageCode: "WSC" }] : [])
          ].filter(coverage => 
            (covidBenfit || coverage.coverageCode !== "CV") &&
            (winterBenfit || coverage.coverageCode !== "WSC")
          )
        }
      ]
    };
   
    handleCalculatePremium(newpayload);
   
  };

  useEffect(() => {
    if (isError) {
      setApiErrorMessage({
        title: isError?.name || INTERNAL_SERVER_ERROR,
        description: isError.messages?.message_en ?? SOMETHING_WENT_WRONG,
      });
      setShowAlertModal(true);
    }
  }, [isError]);

  const handleClose = () => {
    setShowAlertModal(false);
  };


  useEffect(() => {
    addBenefitCalculation();
  },[covidBenfit,winterBenfit]

)
  useEffect(() => {
    
    if (dataWorldwidepearl && dataWorldwidetraveller) {
      const priceData = worldwidecalculatePremium(
        dataWorldwidepearl, dataWorldwidetraveller
      );
      setworldwidepearlInitialPrice(priceData?.dataworldwidepearlFinalPrice ?? null);
      setworldwidetravellerInitialPrice(priceData?.dataworldwidetravellerFinalPrice ?? null);
      setworldwideCardPrice(priceData?.minFinalPrice);
      setdataworldwidepearlVAT(priceData?.dataworldwidepearlVAT);
      setdataworldwidepearladminfee(priceData?.dataworldwidepearladminfee);
      setdataworldwidepearlnetpremium(priceData?.dataworldwidepearlnetpremium);
      setdataworldwidetravellerVAT(priceData?.dataworldwidetravellerVAT);
      setdataworldwidetravelleradminfee(priceData?.dataworldwidetravelleradminfee);
      setdataworldwidetravellernetpremium(priceData?.dataworldwidetravellernetpremium);

    }
  }, [dataWorldwidepearl, dataWorldwidetraveller, travelCovidcoverage,travelWintersportscoverage]);
  useEffect(() => {
    if (dataWorldwideexceptpearl && dataWorldwideexcepttraveller) {
      const priceData = worldwideexceptcalculatePremium(
        dataWorldwideexceptpearl, dataWorldwideexcepttraveller
      );
      setworldwideexceptpearlInitialPrice(priceData?.dataworldwideexceptpearlFinalPrice ?? null);
      setworldwideexcepttravellerInitialPrice(priceData?.dataworldwideexcepttravellerFinalPrice ?? null);
      setworldwideexceptCardPrice(priceData?.minFinalPrice);
      setdataworldwideexceptpearlVAT(priceData?.dataworldwideexceptpearlVAT);
      setdataworldwideexceptpearladminfee(priceData?.dataworldwideexceptpearladminfee);
      setdataworldwideexceptpearlnetpremium(priceData?.dataworldwideexceptpearlnetpremium);
      setdataworldwideexcepttravellerVAT(priceData?.dataworldwideexcepttravellerVAT);
      setdataworldwideexcepttravelleradminfee(priceData?.dataworldwideexcepttravelleradminfee);
      setdataworldwideexcepttravellernetpremium(priceData?.dataworldwideexcepttravellernetpremium);

    }
  }, [dataWorldwideexceptpearl, dataWorldwideexcepttraveller, travelCovidcoverage,travelWintersportscoverage]);
  
  
  useEffect(() => {
    if (dataEuropeeurope && dataEuropeschengen) {
      const priceData = europecalculatePremium(
        dataEuropeeurope, dataEuropeschengen
      );
      setEuropeeuropeInitialPrice(priceData?.dataEuropeeuropeFinalPrice ?? null);
      setEuropeschengenInitialPrice(priceData?.dataEuropeschengenFinalPrice ?? null);
      setEuropeCardPrice(priceData?.minFinalPrice);
      setEuropeeuropeVAT(priceData?.dataEuropeeuropeVAT);
      setdataEuropeeuropeadminfee(priceData?.dataEuropeeuropeadminfee);
      setdataEuropeeuropenetpremium(priceData?.dataEuropeeuropenetpremium);
      setdataEuropeschengenVAT(priceData?.dataEuropeschengenVAT);
      setdataEuropeschengenadminfee(priceData?.dataEuropeschengenadminfee);
      setdataEuropeschengennetpremium(priceData?.dataEuropeschengennetpremium);

    }
  }, [dataEuropeeurope, dataEuropeschengen, travelCovidcoverage,travelWintersportscoverage]);

  useEffect(() => {
      const dob = ownerDetailsResponseData?.ownerDobG?.split('-'); // TODO: get dob from api after otp verification
      if(dob) {
        setPrimaryTravellerInputs({
          ...primaryTravellerInputs,
          primaryTravellerDOB: getAge(`${dob[2]}-${dob[1]}-${dob[0]}`),
        });
      }
    },[]);
  
  useEffect(() => {
    setAdultCount(0);
    setChildCount(0);
    setSrCitizenCount(0);
  }, [adultCount, childCount, srCitizenCount]);

  useEffect(() => {
    if ((primaryTravellerInputs.primaryTraveller &&
  primaryTravellerInputs.primaryTravellerPassportNo && pTravelerPassportexpiry  ) ||
      (pTravelername && pTravelerPassportno && pTravelerPassportexpiry) ) {
      setValidation(2);
      setIsAddTravelerValidation(false)
    } else {
      setValidation(1);
      setIsAddTravelerValidation(true)
    }
   }, [primaryTravellerInputs, pTravelername, pTravelerPassportno, pTravelerPassportexpiry]);
  
  const onFiledChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPrimaryTravellerInputs({
      ...primaryTravellerInputs,
      [name]: value,
    });
    name === "primaryTraveller" && setpTravelername(value);
    name === "primaryTravellerPassportNo" && setpTravelerPassportno(value);
  };
  
  const handleDateChange = (date: Date | null) => { 
    // setPrimaryTravellerPED(date);
    setpTravelerPassportexpiry(date);
  };

  useEffect(() => {
    if (pTravelerPassportexpiry) {
      const formattedDate = pTravelerPassportexpiry.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }); 
      setpTravelerPassportexpiry(formattedDate);
      if(policyStartDate && formattedDate && pTravelerPassportexpiry){
        const dateDiff = subtractDates(policyStartDate, formattedDate);
        setDateDiff(dateDiff);
        const innerText:string | null = getInnerTextBetweenTags(data?.passport_info, '<p>', '</p>');
        setPassportAlertText(innerText);
      }
    }
   }, [pTravelerPassportexpiry, policyStartDate]);
  
  useEffect(() => { 
    const positiveDateDiff = Math.abs(dateDiff);
    if (positiveDateDiff && positiveDateDiff < 180) {
      setValidation(1);
      setIsAddTravelerValidation(true)
      setShowAlertModal(true);
    } else {
      setValidation(2);
      setIsAddTravelerValidation(false);
      setShowAlertModal(false);
    }
  }, [dateDiff]);
 
  const PrimaryTraveler = () => {
    return (
      <>
            <Accordion defaultActiveKey={['0']}
              className={`${
                isOpen ? "accor-open" : "accor-close"
              } w-100 coverage-travelinfo`}
            >
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                    
                    <div className="acc-head">
                    <div className="acc-head-strip"></div>
                    <span className={`${validation === 2 ? 
                        'acc-head-validation-success' : `${validation === 1 ?
                            'acc-head-validation-error' : 'acc-head-validation-inactive'}`                        }
                        }`}></span>
                        
                        <div className="acc-head-titles-align">
                    {primaryTravellerInputs?.primaryTraveller?primaryTravellerInputs?.primaryTraveller:ownerDetailsResponseData?.ownerFullNameEnglish}
                          &nbsp;
                        <div className="acc-head-strip-sub">Self | {primaryTravellerInputs.primaryTravellerDOB} Years</div>
                        </div>
                        
                    {validation === 1 ? (<div className="text-incomplete">
                      <GppMaybeOutlinedIcon className="acc-warning-icon" />
                      {data?.incomplete}
                    </div>): null}
                    </div>
                    
                </Accordion.Header>
                <Accordion.Body
                  onEntered={clickEnterHandler}
                  onExiting={clickExitHandler}
                  className="p-2 acc-body"
                >
                  {PrimaryForm()}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            <div
              className={`${
                isOpen ? "sub-accor-open" : "sub-accor-close"
              } sub-accordion`}
            >
              <div className="benfit-block">
                <div className="benfit-block-title">
                  {data?.benfit_title}
                </div>
                <div className="benfit-content">
                  <div
                    className={`${
                      !winterBenfit
                        ? "benfit-one"
                        : "benfit-one benfit-one-select"
                    }`}
                  >
                    <div className="left-icon">
                      <DownhillSkiingOutlinedIcon />
                    </div>
                    <div className="benfit-data">
                      <div className="benfit-title">
                        {data?.benfit_sports} &nbsp;
                        <Info popUpData={data?.benfit_sports_info} />
                      </div>
                      <div className="benfit-sub-title">
                        {/* Replace with api data */}
                      </div>
                    </div>
                    <div className="benfit-right">
                      <div
                        className={` ${
                          !winterBenfit ? "benfit-button" : "benfit-remove-btn"
                        }`}
                      >
                        <div
                          onClick={() =>
                            handleAddBenefit("winter", winterBenfit)
                          }
                          className="benfit-button-text"
                          data-testid="winterBenfit"
                        >
                          {` ${!winterBenfit ? data?.add_button : data?.remove_button}`}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="benfit-content-space"></div>
                  <div
                    className={`${
                      !covidBenfit
                        ? "benfit-one"
                        : "benfit-one benfit-one-select"
                    }`}
                  >
                    <div className="left-icon">
                      <CoronavirusOutlinedIcon />
                    </div>
                    <div className="benfit-data benfit-data-right">
                      <div className="benfit-title">
                        {data?.benfit_covid} &nbsp;
                        <Info popUpData={data?.benfit_covid_info} />
                      </div>
                      <div className="benfit-sub-title">
                        {/* Replace with api data */}
                      </div>
                    </div>
                    <div className="benfit-right">
                      <div
                        className={` ${
                          !covidBenfit ? "benfit-button" : "benfit-remove-btn"
                        }`}
                      >
                        <div
                          onClick={() => handleAddBenefit("covid", covidBenfit)}
                          className="benfit-button-text"
                          data-testid="covidBenfit"
                        >
                          {` ${!covidBenfit ? data?.add_button : data?.remove_button}`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
      </>
    )
  }

  const PrimaryForm = () => {
    
    return (
        <div className="container mt-4">
      <Form>
        <Row className="mb-3 form-block-1" controlId="formName" style={{display:'flex'}}>
        <Col>
            <div className="form-element">
                <div className="form-element-label">
                {data?.traveller_name}
                    <span className="text-danger">*</span>
                </div> 
                
                <Form.Control
                  name= "primaryTraveller"
                  placeholder={data?.traveller_name_placeholder} 
                  className="form-element-field" 
                  type="text"
                  value={primaryTravellerInputs.primaryTraveller || pTravelername}
                  onChange={onFiledChange}
                  maxLength={50}
 
                />
            </div>
        </Col>

        <Col>
            <div className="form-element">
                <div className="form-element-label">
                {data?.traveller_passport_no}
                    <span className="text-danger">*</span>
                </div> 
                <Form.Control
                  name= "primaryTravellerPassportNo" 
                  placeholder={data?.traveller_passport_no_placeholder} 
                  className="form-element-field" 
                  type="text"
                  value={primaryTravellerInputs.primaryTravellerPassportNo || pTravelerPassportno}
                  onChange={onFiledChange}
                  maxLength={10} 
                />
            </div>
        </Col>
 
        <Col>
            <div className="form-element">
                <div className="form-element-label">
                    {data?.traveller_passport_exp_date}
                    <span className="text-danger">*</span> 
                    <Info popUpData={data?.passport_info} />
                </div> 
            </div>
            
            <FullCalender
              value={pTravelerPassportexpiry}
              onChange={handleDateChange}
              format="DD/MM/YYYY"
              placeholder={data?.traveller_passport_exp_date_placeholder}
              setValue={setpTravelerPassportexpiry}
              showSwitch={false}
              maxDate={false}
            />
        </Col>
        </Row>




        <Row className="mb-3 form-block-2">
          <Col md={3}>
            <div className="form-block-2-elements">
              <div className="form-block-2-element-label">{data?.traveller_dob}</div>
              <div className="form-block-2-element-value">{ownerDetailsResponseData?.ownerDobG?.split('-').join('/')}</div>
            </div>
          </Col>
          <Col md={1} className="seprator"></Col>
          <Col md={3}>
            <div className="form-block-2-elements">
              <div className="form-block-2-element-label">{data?.traveller_relation}</div>
              <div className="form-block-2-element-value">Self</div>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
    )
  }
  return (
    // JSX code for your component's UI
    <div className="traveler-detail-wrapper">
      <AlertBox
        title={apiErrorMessage.title}
        description={apiErrorMessage.description || passPortAlertText}
        showAlertModal={showAlertModal}
        setShowAlertModal={handleClose}
      />
      <div className="traveler-detail-content">
        <div className="traveler-section">
          <div className="traveler-heading" data-testid="travelerHead">
            {data?.add_traveller_page_title}
          </div>
          <div className="traveler-content">
            <div className="details-title">
            {data?.add_traveller_page_desc}
            </div>
            {PrimaryTraveler()}
            <TravelerAdult noOfAdults={adultCount} data={data} />
            <TravelerChild noOfChilds={childCount} data={data} />
            <TravelerSenior noOfsrCitizens={srCitizenCount} data={data} />
          </div>
          { adultCount && childCount && srCitizenCount ? (
            <div className="traveler-footer">
            <div className="footer-btn"> 
              <AddAdditionalTraveller
                data={data}
                adultCount={adultCount}
                childCount={childCount}
                srCitizenCount={srCitizenCount}
                setAdultCount={setAdultCount}
                setChildCount={setChildCount}
                setSrCitizenCount={setSrCitizenCount}
              />
            </div>
          </div>) : null}
        </div>
      </div>
    </div>
  );
};

export default TravelerAddDetails;