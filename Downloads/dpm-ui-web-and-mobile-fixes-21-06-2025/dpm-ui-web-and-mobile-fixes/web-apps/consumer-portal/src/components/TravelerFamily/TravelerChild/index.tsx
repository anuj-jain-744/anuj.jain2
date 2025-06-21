import React, { useState } from "react";
import { Accordion, Col, Form, Row } from "react-bootstrap";
import "./index.scss";
import DownhillSkiingOutlinedIcon from "@mui/icons-material/DownhillSkiingOutlined";
import CoronavirusOutlinedIcon from "@mui/icons-material/CoronavirusOutlined";
import Info from "../../TravelerAddDetails/info";
import { FullCalender } from "../../../../../corporate-portal/src/components/Calendar/fullcalender";
import GppMaybeOutlinedIcon from '@mui/icons-material/GppMaybeOutlined';
import Delete from '../../../assets/Travel/Delete.svg';

interface TravelerChildProps {
    noOfChilds: number;
    data: {[key: string]: string};
}

const TravelerChild: React.FC<TravelerChildProps> = ({ noOfChilds, data }) => {
  const [travelers, setTravelers] = useState<
    Array<{
      childName: string;
      childPassport: string;
      childPassportExp: string;
      childDob: string;
      childRelation: string;
    }>
  >([]);
  const [winterBenfit, setWinterBenfit] = useState<boolean>(false);
  const [covidBenfit, setCovidBenfit] = useState<boolean>(false);
  const [passportExpiryDate, setPassportExpiryDate] = useState<string>("");
  const [childDOB, setChildDOB] = useState<string>("");
  const [validation, setValidation] = useState<number>(0);
  const [isOn, setIsOn] = useState<boolean>(false);
  const handleAddBenefit = (benefit: string, status: boolean) => {
    if (benefit === "winter") {
      setWinterBenfit(!status);
    } else if (benefit === "covid") {
      setCovidBenfit(!status);
    }
  };
  const handleInputChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    setTravelers((prevTravelers) => {
      const updatedTravelers = [...prevTravelers];
      updatedTravelers[index] = {
        ...updatedTravelers[index],
        [field]: value,
      };
      return updatedTravelers;
    });
  };

  const dateChange = (value: string, type: string) => {
    setValidation(2); //validation check for testing
    if (type === "passport") setPassportExpiryDate(value);
    else if (type === "dob") setChildDOB(value);
  };

  const  SelectRelation = () => {
    const realtion = Array.isArray(data?.relations) ? data.relations : [];
    return (
      <Form.Select aria-label="Default select realtion-select" size="lg">
        <option>Select</option>
        {realtion.map((relation: string) => (
          <option value={relation}>{relation}</option>
        ))}
      </Form.Select>
    );
  }

  const renderTravelerInputs = (noOfChild: number) => {
    const inputs = [];
    for (let i = 1; i <= noOfChild; i++) {
      inputs.push(
        <>
        <Row className="mb-3 form-block-1" controlId="formName" style={{display:'flex'}} key={i}>
          <Col>
            <div className="form-element">
              <div className="form-element-label">
              {data?.traveller_name}
                <span className="text-danger">*</span>
              </div>

              <Form.Control
                placeholder="Enter Name"
                className="form-element-field"
                type="text"
                value={travelers[i]?.childName || ""}
                onChange={(e) =>
                  handleInputChange(i, "childName", e.target.value)
                }
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
                placeholder={data?.traveller_passport_no_placeholder}
                className="form-element-field"
                type={travelers[i]?.childPassport || ""}
                onChange={(e) =>
                  handleInputChange(
                    i,
                    "childPassport",
                    parseInt(e.target.value)
                  )
                }
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
              value={passportExpiryDate}
              setValue={() => dateChange(passportExpiryDate, "passport")}
              format={"DD/MM/YYYY"}
              isOn={isOn}
              showSwitch={false}
              setIsOn={setIsOn}
              placeholder={data?.traveller_passport_exp_date_placeholder}
            />
          </Col>
          </Row>
          <Row className="form-block-2">
          <Col xs={6} md={4}>
            <div className="form-element">
              <div className="form-element-label">
              {data?.traveller_dob}
                <span className="text-danger">*</span>
              </div>
            </div>

            <FullCalender
              value={childDOB}
              setValue={() => dateChange(childDOB, "dob")}
              format={"DD/MM/YYYY"}
              isOn={false}
              showSwitch={false}
              setIsOn={setIsOn}
              placeholder={data?.traveller_dob_placeholder}
              minDate={false}
            />
          </Col>
          <Col xs={6} md={4}>
            <div className="form-element">
              <div className="form-element-label">
              {data?.traveller_relation}
                <span className="text-danger">*</span>
              </div>

              {SelectRelation()}
            </div>
          </Col>
        </Row>
        </>
      );
    }
    return inputs;
  };
  //accordion opened/not state
  const [isOpen, setOpen] = useState<boolean>(false);
  //accordion on body open handler fn
  const clickEnterHandler = () => {
    setValidation(1);
    setOpen(true);
  };
  //accordion on body close handler fn
  const clickExitHandler = () => {
    setOpen(false);
  };
  return (
    <>
      {noOfChilds > 0 &&
        Array.from({ length: noOfChilds }, (_, i) => (
          <>
            <Accordion
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
                    {/* <div className="acc-head-title"> */}
                    <div className="acc-head-titles-align">{data?.child_title} {i + 1} &nbsp;
                        <div className="acc-head-strip-sub">Traveler {i + 1}</div>
                    </div>    
                    {validation === 1 ? (
                      <div className="text-incomplete">
                          <GppMaybeOutlinedIcon className="acc-warning-icon" />
                          {data?.incomplete}
                      </div>): null}    
                    {/* </div> */}
                    {/* <div className="acc-head-strip-sub">35 Years</div> */}
                  </div>
                  
                  <div className="acc-delete">
                    <img src={Delete} alt="delete" className="delete-icon" />
                </div>
                </Accordion.Header>
                <Accordion.Body
                  onEntered={clickEnterHandler}
                  onExiting={clickExitHandler}
                  className="p-2 acc-body"
                >
                  <div className="container mt-4">
                    <Form>
                      <Row className="mb-3 form-block-1" controlId="formName">
                        {renderTravelerInputs(1)}
                      </Row>
                    </Form>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            <div
              key={i}
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
                        {/* Replace with Api data */}
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
                    <div className="benfit-data">
                      <div className="benfit-title">
                      {data?.benfit_covid} &nbsp;
                        <Info popUpData={data?.benfit_covid_info} />
                      </div>
                      <div className="benfit-sub-title">
                        {/* Replace with Api data */}
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
        ))}
    </>
  );
};

export default TravelerChild;
