import React, { useState } from "react";
import { Button, Col, Modal, Row, Form, Accordion } from "react-bootstrap";
import DownhillSkiingOutlinedIcon from "@mui/icons-material/DownhillSkiingOutlined";
import CoronavirusOutlinedIcon from "@mui/icons-material/CoronavirusOutlined";
import GppMaybeOutlinedIcon from "@mui/icons-material/GppMaybeOutlined";
import { FullCalender } from "components/Calendar/fullcalender";
import Info from "components/TravelerAddDetails/info";
import { formatToCalendarDate } from "utils/formatDate";
import { toTitleCase } from "utils/quoteAndBuy";
import { covergaeTypes, familtyFlowConstants } from "../constantsTravel";
import "./index.scss";
import { LanguageData } from "types/languageData";
import { travelersInfo } from "Motor/QuoteAndBuy/QuoteAndBuyContext";

interface EditTravellerProps {
  langData: LanguageData;
  person: travelersInfo;
  onSave: (updatedValues: Partial<travelersInfo>) => void;
  onClose: () => void;
}

const EditTraveller: React.FC<EditTravellerProps> = ({
  langData,
  person,
  onSave,
  onClose,
}) => {
  const [expiryDate, setExpiryDate] = useState<string | Date>(
    formatToCalendarDate(person.passportExpiryDate ?? "")
  );
  const [inputs, setInputs] = useState({
    primaryTraveller: person.travellerNameEnglish || "",
    primaryTravellerPassportNo: person.passportNumber || "",
    primaryTravellerPassportExp: person.passportExpiryDate || "",
    primaryTravellerDOB: person.dateOfBirth || "",
    primaryTravellerRelation: person.relation || "",
    primaryTravellerPolicyCoverage: person.policyCoverage || [],
  });
  const [coverages, setCoverages] = useState(person.policyCoverage ?? []);
  const [travelWintersportscoverage, settravelWintersportscoverage] = useState(
    coverages.some((item) => item.coverageCode === covergaeTypes.winterSports)
  );
  const [travelCovidcoverage, settravelCovidcoverage] = useState(
    coverages.some((item) => item.coverageCode === covergaeTypes.covid)
  );

  const onFieldChange = (event: any) => {
    const { name, value } = event.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddBenefit = (coverageCode: string, status: boolean) => {
    const coverage = { coverageCode: coverageCode };
    const updatedCoverages = coverages.filter(
      (item: typeof coverage) => item.coverageCode !== coverageCode
    );
    if (status === false) updatedCoverages.push(coverage);
    setCoverages(updatedCoverages);
    if (coverageCode === covergaeTypes.winterSports)
      settravelWintersportscoverage(!status);
    else settravelCovidcoverage(!status);
  };

  const handleSubmit = () => {
    const duplicateDat = {
      travellerNameEnglish: inputs.primaryTraveller,
      passportNumber: inputs.primaryTravellerPassportNo,
      passportExpiryDate:
        expiryDate?.toLocaleString() ?? person.passportExpiryDate,
      policyCoverage: coverages,
    };
    onSave(duplicateDat);
    onClose();
  };

  return (
    <Modal
      show={true}
      centered
      onHide={onClose}
      className="modal-lg info-modal-main EditTraveler"
    >
      <Modal.Header closeButton className="info-modal-head">
        <Modal.Title className="add-modal-title">
          {langData?.edit_traveller_details}{" "}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="add-modal-body">
        <div className="traveler-section-popup">
          <div className="traveler-content">
            <Accordion
              defaultActiveKey={["0"]}
              className="accor-open w-100 coverage-travelinfo"
            >
              <Accordion.Item eventKey="0">
                <div className="acc-head">
                  <div className="acc-head-strip"></div>
                  <span className="acc-head-validation-success"></span>

                  <div className="acc-head-titles-align">
                    {toTitleCase(inputs.primaryTraveller)}
                    &nbsp;
                    <div className="acc-head-strip-sub">
                      {familtyFlowConstants.TITLES.SELF} | {person.personAge}{" "}
                      Years
                    </div>
                  </div>

                  {inputs.primaryTraveller === "" ||
                  inputs.primaryTravellerPassportExp == "" ||
                  inputs.primaryTravellerPassportNo === "" ? (
                    <div className="text-incomplete">
                      <GppMaybeOutlinedIcon className="acc-warning-icon" />
                      {langData?.incomplete}
                    </div>
                  ) : null}
                </div>

                <div className="p-2 acc-body">
                  <div className="container mt-4">
                    <Form>
                      <Row
                        className="mb-3 form-block-1"
                        controlId="formName"
                        style={{ display: "flex" }}
                      >
                        <Col>
                          <div className="form-element">
                            <div className="form-element-label">
                              {langData?.traveller_name}
                              <span className="text-danger">*</span>
                            </div>

                            <Form.Control
                              name="primaryTraveller"
                              placeholder="Enter Name"
                              className="form-element-field"
                              type="text"
                              value={
                                inputs?.primaryTraveller ?? ""
                                  ? toTitleCase(inputs?.primaryTraveller)
                                  : ""
                              }
                              onChange={onFieldChange}
                              maxLength={50}
                            />
                          </div>
                        </Col>

                        <Col>
                          <div className="form-element">
                            <div className="form-element-label">
                              {langData?.traveller_passport_no}
                              <span className="text-danger">*</span>
                            </div>
                            <Form.Control
                              name="primaryTravellerPassportNo"
                              placeholder={
                                langData?.traveller_passport_no_placeholder
                              }
                              className="form-element-field"
                              type="text"
                              value={inputs.primaryTravellerPassportNo}
                              onChange={onFieldChange}
                              maxLength={10}
                            />
                          </div>
                        </Col>

                        <Col>
                          <div className="form-element">
                            <div className="form-element-label">
                              {langData?.traveller_passport_exp_date}
                              <span className="text-danger">*</span>
                              <Info popUpData={langData?.passport_info} />
                            </div>
                          </div>

                          <FullCalender
                            value={expiryDate}
                            setValue={(value) => {
                              console.log(value);
                              setExpiryDate(value ?? "");
                            }}
                            format="DD/MM/YYYY"
                            placeholder={
                              langData?.traveller_passport_exp_date_placeholder
                            }
                            showSwitch={false}
                            maxDate={false}
                          />
                        </Col>
                      </Row>

                      <Row className="mb-3 form-block-2">
                        <Col md={3}>
                          <div className="form-block-2-elements">
                            <div className="form-block-2-element-label">
                              {langData?.traveller_dob}
                            </div>
                            <div className="form-block-2-element-value">
                              {person.dateOfBirth?.split("-").join("/")}
                            </div>
                          </div>
                        </Col>
                        <Col md={1} className="seprator"></Col>
                        <Col md={3}>
                          <div className="form-block-2-elements">
                            <div className="form-block-2-element-label">
                              {langData?.traveller_relation}
                            </div>
                            <div className="form-block-2-element-value">
                              {person.relation || "Self"}
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </div>
              </Accordion.Item>
            </Accordion>
            {person.personAge <= 50 && (
              <div className="sub-accor-open sub-accordion">
                <div className="benfit-block">
                  <div className="benfit-block-title">
                    {langData?.benfit_title}
                  </div>
                  <div className="benfit-content">
                    <div
                      className={`${
                        !travelWintersportscoverage
                          ? "benfit-one"
                          : "benfit-one benfit-one-select"
                      }`}
                    >
                      <div className="left-icon">
                        <DownhillSkiingOutlinedIcon />
                      </div>
                      <div className="benfit-data">
                        <div className="benfit-title">
                          {langData?.benfit_sports} &nbsp;
                          <Info popUpData={langData?.benfit_sports_info} />
                        </div>
                        <div className="benfit-sub-title">
                          {/* Replace with api data */}
                        </div>
                      </div>
                      <div className="benfit-right">
                        <div
                          className={` ${
                            !travelWintersportscoverage
                              ? "benfit-button"
                              : "benfit-remove-btn"
                          }`}
                        >
                          <div
                            className="benfit-button-text"
                            data-testid="travelWintersportscoverage"
                            onClick={() =>
                              handleAddBenefit(
                                covergaeTypes.winterSports,
                                travelWintersportscoverage
                              )
                            }
                          >
                            {` ${
                              !travelWintersportscoverage
                                ? langData?.add_button
                                : langData?.remove_button
                            }`}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="benfit-content-space"></div>
                    <div
                      className={`${
                        !travelCovidcoverage
                          ? "benfit-one"
                          : "benfit-one benfit-one-select"
                      }`}
                    >
                      <div className="left-icon">
                        <CoronavirusOutlinedIcon />
                      </div>
                      <div className="benfit-data benfit-data-right">
                        <div className="benfit-title">
                          {langData?.benfit_covid} &nbsp;
                          <Info popUpData={langData?.benfit_covid_info} />
                        </div>
                        <div className="benfit-sub-title">
                          {/* Replace with api data */}
                        </div>
                      </div>
                      <div className="benfit-right">
                        <div
                          className={` ${
                            !travelCovidcoverage
                              ? "benfit-button"
                              : "benfit-remove-btn"
                          }`}
                        >
                          <div
                            onClick={() =>
                              handleAddBenefit(
                                covergaeTypes.covid,
                                travelCovidcoverage
                              )
                            }
                            className="benfit-button-text"
                            data-testid="travelCovidcoverage"
                          >
                            {` ${
                              !travelCovidcoverage
                                ? langData?.add_button
                                : langData?.remove_button
                            }`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary add-cancel-btn" onClick={onClose}>
          {langData?.cancel}
        </Button>
        <Button
          disabled={
            inputs.primaryTraveller === "" ||
            inputs.primaryTravellerPassportExp == "" ||
            inputs.primaryTravellerPassportNo === ""
          }
          variant="primary"
          onClick={handleSubmit}
        >
          {langData?.submit}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditTraveller;
