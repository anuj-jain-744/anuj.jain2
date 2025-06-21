import React, { useRef, useState } from "react";
import { Button, Col, Modal, Row, Form, Accordion } from "react-bootstrap";
import DownhillSkiingOutlinedIcon from "@mui/icons-material/DownhillSkiingOutlined";
import CoronavirusOutlinedIcon from "@mui/icons-material/CoronavirusOutlined";
import GppMaybeOutlinedIcon from "@mui/icons-material/GppMaybeOutlined";
import Info from "components/TravelerAddDetails/info";
import { formatToCalendarDate } from "utils/formatDate";
import {
  isTravellerAdult,
  isTravellerChild,
  isTravellerSenior,
  isValidCalendarDateFormat,
  isValidName,
  isValidNameEdit,
  isValidPassportExpiry,
  isValidPassportNum,
  isValidPassportNumEdit,
  toTitleCase,
} from "utils/quoteAndBuy";
import { covergaeTypes, familtyFlowConstants } from "../constantsTravel";
import "./index.scss";
import { LanguageData } from "types/languageData";
import { travelersInfo } from "Motor/QuoteAndBuy/QuoteAndBuyContext";
import {
  getFamilyMemberTypeFromRelation,
  getRelation,
} from "utils/getRelation";
import { getInnerTextBetweenTags } from "utils/GetInnerTextBetweenTags";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { getFullAge } from "utils/getFullAge";
import { getAmountWithIcon } from "@app-shell/utils/common";
import { InputCalendar } from "components/Calendar/inputCalendar";
import { DateObject } from "react-multi-date-picker";

interface EditTravellerProps {
  langData: LanguageData;
  person: travelersInfo;
  onSave: (updatedValues: Partial<travelersInfo>) => void;
  onClose: () => void;
}

interface DataRef {
  passportNumError: string;
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
  const [dob, setDob] = useState<string | Date>(
    formatToCalendarDate(person.dateOfBirth ?? "")
  );
  const [inputs, setInputs] = useState({
    name: isValidName(person.travellerNameEnglish)
      ? toTitleCase(person.travellerNameEnglish.trimEnd())
      : "",
    passportNo: person.passportNumber,
    primaryTravellerPassportExp: person.passportExpiryDate || "",
    primaryTravellerDOB: person.dateOfBirth || "",
    primaryTravellerRelation: person.relation || "",
    primaryTravellerPolicyCoverage: person.policyCoverage || [],
  });

  const dataRef = useRef<DataRef>({
    passportNumError:
      person.passportNumber === ""
        ? langData.passport_num_required
        : isValidPassportNum(person.passportNumber) === false
        ? langData.passport_num_invalid
        : "",
  });
  const [coverages, setCoverages] = useState(person.policyCoverage ?? []);
  const [travelWintersportscoverage, settravelWintersportscoverage] = useState(
    coverages.some((item) => item.coverageCode === covergaeTypes.winterSports)
  );
  const [travelCovidcoverage, settravelCovidcoverage] = useState(
    coverages.some((item) => item.coverageCode === covergaeTypes.covid)
  );
  const [dobAlertMessage, setDobAlertMessage] = useState<string | null>(null);
  const [passportAlertMessage, setPassportAlertMessage] = useState<
    string | null
  >(null);
  const [updatedAge, setUpdatedAge] = useState<number>(person.personAge);
  const [relation, setRelation] = useState<string | undefined>(person.relation);

  const { travelDateRange } = useQuoteAndBuyContext();

  const [travelStartDate] = travelDateRange;

  const onFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "passportNo") {
      const newValue = value.trim().toUpperCase();
      const isValidEdit = isValidPassportNumEdit(newValue);
      if (isValidEdit === true && inputs.passportNo !== newValue) {
        if (newValue === "")
          dataRef.current.passportNumError = langData.passport_num_required;
        else {
          const passportNumCheck = isValidPassportNum(newValue);
          dataRef.current.passportNumError =
            passportNumCheck === true ? "" : langData.passport_num_invalid;
        }
        setInputs({ ...inputs, passportNo: newValue });
      }
    } else if (name === "name") {
      const newValue = toTitleCase(value ?? "");
      const isValidEdit = isValidNameEdit(newValue);
      if (isValidEdit === true && inputs.name !== newValue) {
        setInputs({ ...inputs, name: newValue });
      }
    } else setInputs({ ...inputs, [name]: value });
  };

  const handleInputChange = (
    person: travelersInfo,
    field: string | { coverageCode: string },
    value: string | number | { coverageCode: string }
  ) => {
    const formattedDate = value.toLocaleString() ?? "";
    const dateText =
      typeof value === "string" ? value : value?.toLocaleString?.() ?? "";
    const isValidFormat = isValidCalendarDateFormat(dateText);
    if (field === "passportExpiryDate") {
      if (!isValidFormat)
        setPassportAlertMessage(langData?.invalid_date_format);
      else {
        const start = travelStartDate?.format("DD/MM/YYYY");
        const end = value?.toLocaleString();
        const expiryCheck = isValidPassportExpiry(start as string, end);
        if (!expiryCheck) {
          const innerText: string | null = getInnerTextBetweenTags(
            langData?.passport_info,
            "<p>",
            "</p>"
          );
          setPassportAlertMessage(innerText);
        } else {
          setPassportAlertMessage(null);
        }
      }
    } else {
      if (!isValidFormat) setDobAlertMessage(langData?.invalid_date_format);
      else {
        let alertMsg = "";
        const age = getFullAge(formattedDate, "/");
        const relation = getRelation(person.relation || "1");
        const familyMemberType = getFamilyMemberTypeFromRelation(relation);
        if (
          familyMemberType === familtyFlowConstants.TITLES.CHILD &&
          isTravellerChild(age) === false
        )
          alertMsg = langData.age_lessthan_18;
        else if (
          familyMemberType === familtyFlowConstants.TITLES.ADULT &&
          isTravellerAdult(age) === false
        )
          alertMsg = langData.age_lessthan_60;
        else if (
          familyMemberType === familtyFlowConstants.TITLES.SR_CITIZEN &&
          (isTravellerSenior(age) === false ||
            age > familtyFlowConstants.seniorAgeLimit)
        )
          alertMsg = langData.age_greaterthan_80;
        if (alertMsg) setDobAlertMessage(alertMsg);
        else {
          setUpdatedAge(age);
          setDobAlertMessage(alertMsg);
        }
      }
    }
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
      travellerNameEnglish: inputs.name.trimEnd(),
      passportNumber: inputs.passportNo,
      passportExpiryDate:
        expiryDate?.toLocaleString() ?? person.passportExpiryDate,
      relation: relation,
      personAge: updatedAge,
      dateOfBirth: dob?.toLocaleString() ?? person.dateOfBirth,
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
      <Modal.Body className="edit-traveler_add-modal-body">
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
                    {inputs.name}
                    &nbsp;
                    <div className="acc-head-strip-sub">
                      {familtyFlowConstants.TITLES.SELF} |{" "}
                      {updatedAge || person.personAge} Years
                    </div>
                  </div>

                  {isValidName(inputs.name) === false ||
                  inputs.primaryTravellerPassportExp == "" ||
                  inputs.passportNo === "" ? (
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
                              name="name"
                              placeholder="Enter Name"
                              className="form-element-field"
                              type="text"
                              value={inputs.name}
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
                              name="passportNo"
                              placeholder={
                                langData?.traveller_passport_no_placeholder
                              }
                              className="form-element-field"
                              type="text"
                              value={inputs.passportNo}
                              onChange={onFieldChange}
                              maxLength={10}
                            />
                            <span className="text-danger validation-msg">
                              {dataRef.current.passportNumError}
                            </span>
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
                          <InputCalendar
                            className="travel-component-calendar"
                            isCalendarIcon
                            value={expiryDate}
                            setValue={(value) => {
                              handleInputChange(
                                person,
                                "passportExpiryDate",
                                value
                              );
                              setExpiryDate(value ?? "");
                            }}
                            format="DD/MM/YYYY"
                            showSwitch={false}
                            minDate={new DateObject()
                              .add(1, "days")
                              .format("DD/MM/YYYY")}
                          />
                          {passportAlertMessage && (
                            <span className="text-danger validation-msg">
                              {passportAlertMessage}
                            </span>
                          )}
                        </Col>
                      </Row>

                      <Row className="mb-3 form-block-2">
                        <Col md={3}>
                          <div className="form-block-2-elements">
                            <div className="form-block-2-element-label">
                              {langData?.traveller_dob}
                            </div>
                            {getRelation(inputs?.primaryTravellerRelation) ===
                            "Self" ? (
                              <div className="form-block-2-element-value">
                                <Form.Control
                                  name="primaryTravellerDOB"
                                  className="form-element-field"
                                  type="text"
                                  value={inputs?.primaryTravellerDOB
                                    ?.split("-")
                                    .join("/")}
                                  disabled={true}
                                  maxLength={50}
                                />
                              </div>
                            ) : (
                              <InputCalendar
                                className="travel-component-calendar"
                                isCalendarIcon
                                value={dob}
                                setValue={(value) => {
                                  setDob(value ?? "");
                                  handleInputChange(
                                    person,
                                    "dateOfBirth",
                                    value
                                  );
                                }}
                                format="DD/MM/YYYY"
                                showSwitch={false}
                                maxDate={new DateObject().format("DD/MM/YYYY")}
                                customProps={{ maxDate: new Date() }}
                              />
                            )}
                          </div>
                          {dobAlertMessage && (
                            <span className="text-danger validation-msg">
                              {dobAlertMessage}
                            </span>
                          )}
                        </Col>
                        <Col md={1} className="seprator"></Col>
                        <Col md={3}>
                          <div className="form-block-2-elements">
                            <div className="form-block-2-element-label">
                              {langData?.traveller_relation}
                            </div>
                            <div className="form-block-2-element-value">
                              {person.relation === "1" ||
                              person.relation === "2" ? (
                                <Form.Control
                                  name="relation"
                                  className="form-element-field"
                                  type="text"
                                  value={getRelation(person.relation || "1")}
                                  disabled={true}
                                  maxLength={50}
                                />
                              ) : (
                                <Form.Select
                                  onChange={(e) => setRelation(e.target.value)}
                                  aria-label="Default select realtion-select"
                                  size="lg"
                                >
                                  {["3", "4"].map((relation: string) => (
                                    <option
                                      selected={person?.relation === relation}
                                      value={relation}
                                    >
                                      {getRelation(relation)}
                                    </option>
                                  ))}
                                </Form.Select>
                              )}
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </div>
              </Accordion.Item>
            </Accordion>
            {updatedAge >= 50 ||
            getRelation(person.relation) ===
              familtyFlowConstants.TITLES.SR_CITIZEN ? (
              <div className="benfit-block-sub-title">
                {langData?.age_above_50}
              </div>
            ) : (
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
                        <div className="benefit-title">
                          {langData?.benfit_sports} &nbsp;
                          <Info popUpData={langData?.benfit_sports_info} />
                        </div>
                        <div className="benfit-sub-title">
                          {langData?.percentage_of_premium}
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
                        <div className="benefit-title">
                          {langData?.benfit_covid} &nbsp;
                          <Info popUpData={langData?.benfit_covid_info} />
                        </div>
                        <div className="benfit-sub-title">
                          {getAmountWithIcon(langData?.sar_200)}
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
            isValidName(inputs.name) === false ||
            inputs.primaryTravellerPassportExp == "" ||
            isValidPassportNum(inputs.passportNo) === false ||
            !!passportAlertMessage ||
            !!dobAlertMessage
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
