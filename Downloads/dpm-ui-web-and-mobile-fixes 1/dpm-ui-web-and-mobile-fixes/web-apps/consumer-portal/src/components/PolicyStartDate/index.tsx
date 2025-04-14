import React, { ReactNode, useEffect, useState } from "react";
import { Card,Row,Col } from "react-bootstrap";
import EditSquare from "assets/QuoteAndBuy/edit_square.svg";
import "./style.scss";
import ChangePolicyStartDate from "./ChangePolicyStartDate";
import { LanguageData } from "types/languageData";
import { Value } from "react-multi-date-picker";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { getFormattedDate, convertDateFormat } from "Motor/QuoteAndBuy/CoveragePlan/CommonFunction/CommonFunction";
import { coverage_plan_for_renew, dummy_policy_num } from "Motor/QuoteAndBuy/CoveragePlan/ConstantValue/ConstantValue";
import ThemeAlert from "components/ThemeAlert";
import {  productIDs } from "../../../../corporate-portal/src/constant";


interface IPolicyStartDate {
  languageData: LanguageData | undefined | null;
  isCalendarIcon?: boolean;
  productType?: string;
}

const PolicyStartDate: React.FC<IPolicyStartDate> = ({ languageData, isCalendarIcon,productType }) => {
  //policy start Date selected Is from context api hook
  const { setPolicyStartDate, policyStartDate, setPolicyStartDateAPI,travelStartDate,setTravelStartDate } = useQuoteAndBuyContext();

  //modal dialog hook handler
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  //policy start Date selected Is
  const [policyDate, setPolicyDate] = useState<Value | null | undefined>(null);

  //click handler fn to enable edit policystartDate
  const clickHandler = () => {
    setShow(true);
  };

  //set initial policystartDate to current date hook
  useEffect(() => {
    if(productType === productIDs.travel){
      if (travelStartDate === null) {
        setPolicyDate(getFormattedDate()); //local selected date
        setTravelStartDate(getFormattedDate()); //updated date to context api hook for UI display
        } else {
        setPolicyDate(travelStartDate ? travelStartDate.toString() : null); //local selected date
      }
    }
    else{
  
    if (policyStartDate === null) {
      setPolicyDate(getFormattedDate()); //local selected date
      setPolicyStartDate(getFormattedDate()); //updated date to context api hook for UI display
      setPolicyStartDateAPI(convertDateFormat(getFormattedDate())); //updated date to context api hook for API submit payload for mm/dd/yyyy format
    } else {
      setPolicyDate(policyStartDate as string); //local selected date
    }
  }
  }, []);
  
  //change policystartDate handler fn
  const changeHandler = (value: Value | undefined) => {
    if(productType === productIDs.travel){
      setPolicyDate(value); //local selected date
      setTravelStartDate(value as string); //updated date to context api hook for UI display 
      setShow(false);
    }
    else
    {
        setPolicyDate(value); //local selected date
        setPolicyStartDate(value as string); //updated date to context api hook for UI display 
        setPolicyStartDateAPI(convertDateFormat(value as string)); //updated date to context api hook for API submit payload for mm/dd/yyyy format
        setShow(false);
    }
  };
  
  return (
    <React.Fragment>
      <Card className="policystart-card w-100">
        <Card.Body className="w-100" onClick={clickHandler}>
          {coverage_plan_for_renew ? (
            <div className="d-flex align-items-center justify-content-between">
              <div className="ps-2 d-flex flex-column">
                <div className="existing-policy">
                  {languageData?.existing_policy_no}
                </div>
                <div className="walaa-medium-500 existing-policy-val">
                  {dummy_policy_num}
                </div>
              </div>
              <div className="policystart-icn-container">
                <ThemeAlert
                  variant="danger"
                  title={
                    `${languageData?.policy_expiring_on}` +
                    ` ` +
                    `${policyDate}`
                  }
                  classes="alert-danger walaa-medium-500 alert-text"
                />
              </div>
            </div>
          ) : productType === productIDs.travel ? (
            <Row>
            <Col>
              <Row className="align-items-center justify-content-between">
                <Col>
                  <Row className="align-items-center justify-content-between">
                    <Col xs="auto" className="ps-2">
                      {languageData?.policy_start_date}:
                      <span className="px-1 walaa-medium-500">{policyDate as ReactNode}</span>
                    </Col>
           
                    <Col xs="auto" className="policystart-icn-container">
                      <img src={EditSquare} alt="edit" />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col className="travel-policy-start-text">{languageData?.start_date_message}</Col>
              </Row>
            </Col>
          </Row>
            ) : (
              <>
              <div className="d-flex align-items-center justify-content-between">
              <div className="ps-2">
                {languageData?.policy_start_date}:
                <span className="px-1 walaa-medium-500">
                {policyDate as ReactNode}
                </span>
              </div>
              <div className="policystart-icn-container">
                <img src={EditSquare} alt="edit" />
              </div>
            </div>
            
            </>
          )}
        </Card.Body>
      </Card>
      {/* Change policystartDate modal dialog component */}
      {show && (
        <ChangePolicyStartDate
          languageData={languageData}
          closeHandler={handleClose}
          changeHandler={changeHandler}
          policyDate={policyDate}
          isOnVal={parseInt((policyDate as string)?.split("/")[2]) !== new Date().getFullYear()}
          isCalendarIcon={isCalendarIcon}
          data-testid="date-picker"
          productType={productIDs.travel}
        />
      )}
    </React.Fragment>
  );
};
export default PolicyStartDate;
