import React, { useEffect, useState } from "react";
import { Accordion, Button, Card, Col, Form, Row } from "react-bootstrap";
import "./style.scss";
import { TravelData } from "types/languageData";
import Info from "../TravelerAddDetails/info";
import { FullCalender } from "../../../../corporate-portal/src/components/Calendar/fullcalender";
import ThemeDropdown from "../../../src/pages/travel/Policy-services/policyCancellation/sharedComponent/ThemeDropdown";
import ThemeTextbox from "../ThemeTextbox/ThemeTextbox";
import ThemeCheckButton from "../../../../corporate-portal/src/components/ThemeCheckButton";
import ThemeTextarea from "components/ThemeComponents/ThemeTextarea";
import DeleteBin from "../../../src/claims/assets/svg/icons/Delete.svg";
import Upload from "assets/IbanValidation/Upload.svg";
import { sanitizeHtml } from "@dpm/shared-module";


interface TravelEstimateProps {
  data?: TravelData;
}

const TravelerEstimate: React.FC<TravelEstimateProps> = ({
  data
}) => {
  const [dateOfLoss, setdateOfLoss] = useState<Date | null>(null);
  const [accordions, setAccordions] = useState<number[]>([]);
  const [isOpen, setOpen] = useState<boolean>(true);
  const [buttonStatus, setbuttonStatus] = useState<boolean>(false);
  interface AccordionItem {
    causeOfLoss: string;
    lossAmount: string;
    lossDescription: string;
    travellersImpacted: boolean[];
    file: File | null;
    subValues: string[];
  }
  const options = [
    "Javed Al-Mutairi",
    "Basma Al-Mutairi",
    "Fahd Al-Mutairi",
    "Assma Al-Mutairi",
    "FAtima Al-mutairi",
    "All"
  ];
  const selectedOptions = ["Javed Al-Mutairi"];
  const mockdropdownitems = [
    "Flight Delay or Cancellation ",
    "Missing Luguage",
    "Burglary",
    "Health issue/Death",
    "Others",

  ]
  const handleDateLoss = (date: Date | null) => {
    setdateOfLoss(date);
  };


  const clickEnterHandler = () => {
    setOpen(true);
  };

  const clickExitHandler = () => {
    setOpen(false);
  };

  const dropdownItems = data && data?.cause_of_loss?.map((item: { code: string; value: string }) => {
    return { value: item?.code, item: item?.value };
  });

  const [inputValues, setInputValues] = useState<AccordionItem[]>([
    { causeOfLoss: '', lossAmount: '', lossDescription: '', travellersImpacted: new Array(options.length).fill(false), file: null, subValues: [] }
  ]);

  const handleInputChange = (index: number, field: keyof AccordionItem, value: any) => {

    const newInputValues = [...inputValues];

    if (!newInputValues[index]) {
      newInputValues[index] = { causeOfLoss: '', lossAmount: '', lossDescription: '', travellersImpacted: new Array(options.length).fill(false), file: null, subValues: [] };
    }
    newInputValues[index][field] = value;

    setInputValues(newInputValues);
    if (field === 'causeOfLoss') {
      handleCauseOfLossChange(index, value);
    }

  };

  const handleCauseOfLossChange = (index: number, code: string) => {
    const selectedOption = (data?.cause_of_loss || []).find(option => option.code === code);
    const newInputValues = [...inputValues];
    newInputValues[index].causeOfLoss = code;
    newInputValues[index].subValues = selectedOption ? selectedOption.sub_values : [];
    setInputValues(newInputValues);
    console.log(selectedOption, newInputValues);
  };

  const handleCheckboxChange = (index: number, checkboxIndex: number) => {
    const newInputValues = [...inputValues];
    newInputValues[index].travellersImpacted[checkboxIndex] = !newInputValues[index].travellersImpacted[checkboxIndex];
    setInputValues(newInputValues);
  };


  const removeAccordion = (index: number) => {
    setAccordions(accordions.filter((_, i) => i !== index));
    setInputValues(inputValues.filter((_, i) => i !== index));


  };


  const addAccordion = () => {
    setAccordions([...accordions, accordions.length]);

  };


  useEffect(() => {

    const isAddButtonDisabled = accordions.length > 0 && inputValues.some(value => !value.lossAmount);
    setbuttonStatus(isAddButtonDisabled);

  }, [accordions, inputValues]);




  return (

    <div className="estimate-wrapper">
      <div className="estimate-content">
        <div className="estimate-section">
          <div className="estimate-heading" data-testid="estimatemain">
            {data?.estimate_description}
            <Info popUpData={data?.estimate_popup || ""} />
          </div>
          <div className="traveler-content">
            <div className="container mt-3">
              <Form>
                <Row className="mb-3 form-block-1" controlId="formName" style={{ display: 'flex' }}>
                  <Col>
                    <div className="form-element">
                      <div className="form-element-label">
                        {data?.date_of_loss}
                        <span className="text-danger">*</span>
                      </div>
                    </div>

                    <FullCalender
                      value={dateOfLoss || new Date()}
                      property={handleDateLoss}
                      format="DD/MM/YYYY"
                      placeholder={data?.traveller_passport_exp_date_placeholder}
                      setValue={(value: Date | null) => setdateOfLoss(value)}
                      showSwitch={false}
                      minDate={false}
                      maxDate={false}
                    />
                  </Col>
                </Row>
              </Form>
            </div>
            <>

              {accordions.map((accordion, index) => (

                <Accordion className="estimate-accordion" defaultActiveKey="0">

                  <Accordion.Item eventKey={`${index}`}>

                    <Accordion.Button as={Card.Header} eventKey={`${index}`}>
                      <div className="ac-content">
                        <div className="ac-head">
                          {data?.estimate_text} {index + 1}
                        </div>
                        <div className="del-col">
                          <img className="icons-delete" src={DeleteBin} alt="Delete" onClick={() => removeAccordion(index)} />
                        </div>
                      </div>

                    </Accordion.Button>



                    <Accordion.Body onEntered={clickEnterHandler} onExiting={clickExitHandler}>

                      <div>
                        <Row>
                          <Col>
                            <label className="label-text">
                              {data?.cause_of_loss_text}
                              <span className="text-danger">*</span>
                            </label>
                            <div className="drop-container">

                              <ThemeDropdown
                                id="causeofloss-dropdown"
                                value={dropdownItems}
                                onChangehandler={(e) => handleInputChange(index, 'causeOfLoss', e.target.value)}
                              />
                            </div>
                          </Col>
                          <Col>
                            <label className="label-text">
                              {data?.estimated_loss_text}
                              <span className="text-danger">*</span>
                            </label>
                            <div className="drop-container">
                              <ThemeTextbox
                                name="lossamount"
                                placeholder="Enter Estimated Loss Amount"
                                type="text"
                                onChangehandler={(e) => handleInputChange(index, 'lossAmount', e.target.value)}
                              />
                            </div>
                          </Col>
                        </Row>
                        <Row className="mt-3">
                          <Col className="label-text">{data?.travellers_impacted}</Col>
                        </Row>
                        <Row>
                          {options && options.length > 0 && options.map((val: string, checkboxIndex: number) => (
                            <Col md={3} className="checkbox-container" key={checkboxIndex}>
                              <ThemeCheckButton
                                index={checkboxIndex}
                                value={val}
                                isSearched={true}
                                selectOptions={selectedOptions}
                                handleOnchange={() => handleCheckboxChange(index, checkboxIndex)}
                              />
                            </Col>
                          ))}
                        </Row>
                        <Row className="mt-3">
                          <Col className="label-text">{data?.description_of_loss}</Col>
                        </Row>
                        <Row>
                          <Col>
                            <ThemeTextarea
                              placeholder="Description of Loss"
                              classes="themetextarea-cust"
                              onChangehandler={(e) => handleInputChange(index, 'lossDescription', e.target.value)}
                            />
                          </Col>
                        </Row>
                      </div>

                    </Accordion.Body>
                  </Accordion.Item>
                  <div className={`${isOpen ? "sub-accor-open" : "sub-accor-close"} sub-accordion`}>
                    <div className="label-text">{data?.upload_doc_text}</div>
                    <div className="label-text"> {data?.supported_file_type && (
                      <div

                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(data?.supported_file_type) }}
                      />
                    )}</div>
                    {inputValues[index].subValues.length > 0 && (
                      inputValues[index].subValues.map((subValue, subIndex) => (
                        <div className="estimate-block">

                          <div className="estimate-content">
                            {subValue}<span className="text-danger">*</span>
                            <div className="f-upload">
                              <img src={Upload} alt="Upload" /> {data?.upload}
                            </div>
                          </div>

                        </div>
                      ))
                    )}

                  </div>

                </Accordion>
              ))}


            </>
          </div>

          <div className="estimate-footer">

            <div className={`estimate-footer-btn ${buttonStatus ? "estimate-footer-btn-disabled" : ""}`}>
              <button className={`traveler-add-btn ${buttonStatus ? "travelbutton-disabled" : ""}`} onClick={addAccordion} disabled={buttonStatus}>  + Add Estimate</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default TravelerEstimate;
