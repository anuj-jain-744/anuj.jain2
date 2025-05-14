import React, { useState, useEffect } from "react";
import { Accordion, Col, Form, Row } from "react-bootstrap";
import "./index.scss";
import { DateObject } from "react-multi-date-picker";
import DownhillSkiingOutlinedIcon from "@mui/icons-material/DownhillSkiingOutlined";
import { getInnerTextBetweenTags } from "utils/GetInnerTextBetweenTags";
import CoronavirusOutlinedIcon from "@mui/icons-material/CoronavirusOutlined";
import GppMaybeOutlinedIcon from "@mui/icons-material/GppMaybeOutlined";
import Info from "../../../TravelerAddDetails/info";
import { FullCalender } from "components/Calendar/fullcalender";
import { getFullAge } from "utils/getFullAge";
import { AlertBox } from "components/AlertBox";
import { subtractDates } from "utils/subtractDates";
import { toTitleCase } from "utils/quoteAndBuy";

export type Traveler = {
  id: number;
  name: string;
  passportNo: string;
  passportExpiry: string;
  dob: string;
  relation: number;
};

interface TravelerFamilyProps {
  count: number;
  data: { [key: string]: string };
  defaultActiveValue?: string | Number | undefined;
  familyType?: string;
  setTravelers?: React.Dispatch<React.SetStateAction<Traveler[]>>;
  travelers?: Traveler[];
  activeAccordionkey: string | null;
  setAtiveAccordionkey: (key: string) => void;
  sectionKey: string;
  travelerIndex: number;
  globalIndex: number;
  onValidityChange: (index: number, isValid: boolean) => void;
}

const TravelerFamily: React.FC<TravelerFamilyProps> = React.memo(
  ({
    count,
    data,
    defaultActiveValue,
    familyType,
    setTravelers,
    travelers,
    activeAccordionkey,
    setAtiveAccordionkey,
    sectionKey,
    travelerIndex,
    onValidityChange,
    globalIndex,
  }) => {
    const [selectedAccordian, setSelectedAccordian] = useState<unknown>([]);
    const isOpen = activeAccordionkey === sectionKey;
    const [winterBenfit, setWinterBenfit] = useState<boolean>(false);
    const [covidBenfit, setCovidBenfit] = useState<boolean>(false);

    const [expiryDate, setExpiryDate] = useState<string | number | Date>("");
    const [isOn, setIsOn] = useState<boolean>(false);
    const [nonCompletedSections, setNonCompletedSections] = useState<Array>([]);
    const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string | null>("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [age, setAge] = useState<number>("");
    const innerText: string | null = getInnerTextBetweenTags(
      data?.passport_info,
      "<p>",
      "</p>"
    );
    const [showErrorDate, setShowErrorDate] = useState<boolean>(false);
    const [showErrorDob, setShowErrorDob] = useState<boolean>(false);
    const [spanText, setSpanText] = useState<string>("");
    const policyStartDate = "12/03/2025";

    const isChidValidAge = (dobInput: string | Date): boolean => {
      const dob = new Date(dobInput);
      if (isNaN(dob.getTime())) return false;
      const now = new Date();
      const ageInMilliseconds = now.getTime() - dob.getTime();
      const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
      const ageInMonths = ageInMilliseconds / (1000 * 60 * 60 * 24 * 30.44); // approx avg month

      return ageInMonths >= 3 && ageInYears < 18;
    };

    const handleClose = () => {
      setShowAlertModal(false);
      if (
        alertMessage ===
        getInnerTextBetweenTags(data?.passport_info, "<p>", "</p>")
      )
        setExpiryDate("");
    };
    const traveler = travelers?.[travelerIndex] || {};
    const handleInputChange = (
      field: string | { coverageCode: string },
      value: string | number | { coverageCode: string }
    ) => {
      const updatedTravelers = [...(travelers || [])];
      const newErrors: { [key: string]: string } = {};
      let isValid = true;
      let localShowErrorDate = false;
      let localShowErrorDob = false;

      if (typeof field === "string") {
        const {
          error,
          isValid: fieldValid,
          showErrorDate,
          showErrorDob,
          formattedValue,
        } = validateField(field, value, policyStartDate, data, travelerIndex);

        if (!fieldValid) isValid = false;
        if (error) newErrors[field] = error;
        localShowErrorDate = showErrorDate;
        localShowErrorDob = showErrorDob;
        if (field === "passportExpiry") {
          setShowErrorDate(showErrorDate);
        }

        if (field === "dob") {
          setShowErrorDob(showErrorDob);
        }

        updatedTravelers[travelerIndex] = {
          ...(updatedTravelers[travelerIndex] || {}),
          [field]: formattedValue !== undefined ? formattedValue : value,
        };

        if (field === "relation") {
          const selectedRelationKey = value as string;
          const selectedRelationValue =
            data?.relations?.[selectedRelationKey] || "";
          updatedTravelers[travelerIndex].relationText = selectedRelationValue;
        }
      } else if (typeof field === "object" && field.coverageCode) {
        const code = field.coverageCode;
        const existingCodes =
          updatedTravelers[travelerIndex]?.coverageCode ?? undefined;

        let newCodes;

        if (existingCodes) {
          const alreadyExists = existingCodes.some(
            (item: { coverageType: string }) => item.coverageType === code
          );

          newCodes = alreadyExists
            ? existingCodes.filter(
                (item: { coverageType: string }) => item.coverageType !== code
              )
            : [...existingCodes, { coverageType: code }];
        } else {
          // If it was previously undefined, start a new array
          newCodes = [{ coverageType: code }];
        }

        updatedTravelers[travelerIndex] = {
          ...updatedTravelers[travelerIndex],
          coverageCode: newCodes,
        };
      }

      if (setTravelers) {
        setTravelers(updatedTravelers);
      }

      const travelerData = updatedTravelers[travelerIndex];
      const hasEmptyFields =
        !travelerData?.name ||
        !travelerData?.passportNo ||
        !travelerData?.passportExpiry ||
        !travelerData?.dob ||
        !travelerData?.relation ||
        travelerData?.relation === "0";
      const isValidForm =
        Object.keys(newErrors).length === 0 &&
        !localShowErrorDate &&
        !localShowErrorDob;
      const finalValidation = !hasEmptyFields && isValidForm;
      setIsFormValid(finalValidation);
      onValidityChange(globalIndex, finalValidation);
      setErrors(newErrors);
    };

    const validateField = (
      field: string,
      value: any,
      policyStartDate: DateObject,
      data: any,
      travelerIndex: number
    ): {
      error?: string;
      formattedValue?: string;
      showErrorDate: boolean;
      showErrorDob: boolean;
      isValid: boolean;
    } => {
      let isValid = true;
      let error;
      let showErrorDate = false;
      let showErrorDob = false;
      let formattedValue = value;
      switch (field) {
        case "name":
          if (!value) {
            error = data?.edit_traveler_popup_name_error_msg;
            isValid = false;
          }
          break;

        case "passportNo":
          if (!value) {
            error = data?.edit_traveler_popup_passportno_error_msg;
            isValid = false;
          }
          break;

        case "passportExpiry":
          const pptExpiry = new DateObject(value);
          formattedValue = pptExpiry.format("YYYY-MM-DD");
          const diffDays = subtractDates(
            policyStartDate,
            pptExpiry.format("DD/MM/YYYY")
          );
          if (Math.abs(diffDays) < 180) {
            showErrorDate = true;
            isValid = false;
          }
          break;

        case "dob":
          const dobObj = new DateObject(value);
          formattedValue = dobObj.format("YYYY-MM-DD");
          const formattedupdateDob = dobObj.format("DD/MM/YYYY");
          const age = getFullAge(formattedupdateDob, "/");
          setAge(age);
          if (familyType === "Child") {
            if (!isChidValidAge(formattedValue)) {
              showErrorDob = true;
              setSpanText("Child age should be 3 month to below 18 years");
              isValid = false;
            }
          } else if (familyType === "Adult") {
            if (!(age >= 18 && age < 65)) {
              showErrorDob = true;
              setSpanText("Adult age should be above 18 and below 65");
              isValid = false;
            }
          } else if (familyType === "Senior Citizen") {
            if (age <= 65) {
              showErrorDob = true;
              setSpanText("Senior citizen are above 65 years");
              isValid = false;
            }
          }

          break;

        case "relation":
          if (value === "0") {
            error = "Please select a relation.";
            isValid = false;
          }
          break;
      }
      return { error, isValid, formattedValue, showErrorDate, showErrorDob };
    };

    const getGlobalTravelerNumber = () => {
      const allKeys = document.querySelectorAll("[data-traveler-section]");
      const keys = Array.from(allKeys).map((el) =>
        el.getAttribute("data-traveler-section")
      );
      const currentIndex = keys.findIndex((key) => key === sectionKey);
      return currentIndex + 1;
    };

    useEffect(() => {
      if (defaultActiveValue === "0") {
        setSelectedAccordian([0]);
      }
    }, [defaultActiveValue]);

    const checkStringAvailability = (
      str: string,
      arr: Array<{ [key: string]: string }>
    ): boolean => {
      return arr && arr.some((obj) => Object.values(obj).includes(str));
    };

    const dateFormatted = (dateValue) => {
      const date = new Date(dateValue);
      const formattedDate = date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      return formattedDate;
    };
    return (
      <div className="custom-accordion-container">
        <AlertBox
          title={`Error`}
          description={alertMessage}
          showAlertModal={showAlertModal}
          setShowAlertModal={handleClose}
        />
        {count > 0 &&
          Array.from({ length: count }, (_, i) => (
            <Accordion
              activeKey={isOpen ? "0" : null}
              onSelect={() => {
                setAtiveAccordionkey(sectionKey);
              }}
              className={`${
                isOpen ? "accor-open" : "accor-close"
              } w-100 coverage-travelinfo`}
              key={i}
              data-traveler-section={sectionKey}
            >
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <div className="acc-head">
                    <div className="acc-head-strip"></div>
                    <span
                      className={`${
                        isFormValid
                          ? "acc-head-validation-success"
                          : "acc-head-validation-error"
                      }
                      }`}
                    ></span>
                    <div className="acc-head-titles-align">
                      {traveler.name
                        ? toTitleCase(traveler.name)
                        : `${familyType} ${getGlobalTravelerNumber()}`}
                      &nbsp;
                      <div className="acc-head-strip-sub">
                        {defaultActiveValue
                          ? "Self"
                          : `Traveller ${getGlobalTravelerNumber()}`}{" "}
                        | {traveler.personAge} Years
                      </div>
                    </div>
                    {nonCompletedSections.includes(i) ? (
                      <div className="text-incomplete">
                        <GppMaybeOutlinedIcon className="acc-warning-icon" />
                        {data?.incomplete}
                      </div>
                    ) : null}
                  </div>
                  {!defaultActiveValue && (
                    <div className="warning-info">
                      {familyType === "Senior Citizen" ? (
                        <div className="icon-style">
                          <GppMaybeOutlinedIcon className="acc-warning-icon-blue" />
                        </div>
                      ) : null}
                    </div>
                  )}
                </Accordion.Header>
                <Accordion.Body className="p-2 acc-body">
                  <div className="container mt-4">
                    <Form className="form">
                      <Row
                        className="mb-3 form-block-1"
                        controlId="formName"
                        style={{ display: "flex" }}
                      >
                        <Col>
                          <div className="form-element">
                            <div className="form-element-label">
                              {data?.traveller_name}
                              <span className="text-danger">*</span>
                            </div>

                            <Form.Control
                              placeholder={data?.traveller_name_placeholder}
                              className="form-element-field"
                              type="text"
                              maxLength={50}
                              name="name"
                              value={traveler.name || ""}
                              onChange={(e) =>
                                handleInputChange("name", e.target.value)
                              }
                              isInvalid={!!errors.name}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.name}
                            </Form.Control.Feedback>
                          </div>
                        </Col>
                      </Row>

                      <Row>
                        <Col>
                          <div className="form-element">
                            <div className="form-element-label">
                              {data?.traveller_passport_no}
                              <span className="text-danger">*</span>
                            </div>
                            <Form.Control
                              placeholder={
                                data?.traveller_passport_no_placeholder
                              }
                              className="form-element-field"
                              maxLength={10}
                              value={traveler.passportNo || ""}
                              onChange={(e) =>
                                handleInputChange("passportNo", e.target.value)
                              }
                              isInvalid={!!errors.passportNo}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.passportNo}
                            </Form.Control.Feedback>
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
                            setValue={(value: Date | null) =>
                              handleInputChange("passportExpiry", value)
                            }
                            format={"DD/MM/YYYY"}
                            isOn={isOn}
                            showSwitch={false}
                            setIsOn={setIsOn}
                            placeholder={
                              data?.traveller_passport_exp_date_placeholder
                            }
                            maxDate={false}
                            customProps={{
                              onOpenPickNewDate: false,
                              currentDate: "",
                              value: dateFormatted(traveler.passportExpiry),
                            }}
                          />
                          {showErrorDate && (
                            <span className="date-error-msg">{innerText}</span>
                          )}
                        </Col>
                      </Row>
                      <Row className="mb-3 form-block-2">
                        <Col>
                          <div className="form-element">
                            <div className="form-element-label">
                              {data?.traveller_dob}
                              <span className="text-danger">*</span>
                            </div>
                            <FullCalender
                              value={dateFormatted(traveler.dob)}
                              setValue={(value: Date | null) =>
                                handleInputChange("dob", value)
                              }
                              format={"DD/MM/YYYY"}
                              isOn={isOn}
                              showSwitch={false}
                              setIsOn={setIsOn}
                              placeholder={data?.traveller_dob_placeholder}
                              minDate={false}
                            />
                            {showErrorDob && (
                              <span className="date-error-msg">{spanText}</span>
                            )}
                          </div>
                        </Col>
                        <Col>
                          <div className="form-element">
                            <div className="form-element-label">
                              {data?.traveller_relation}
                              <span className="text-danger">*</span>
                            </div>
                            {familyType === "primary" ? (
                              <div className="walaa-medium-500">
                                {travelers[i]?.relation === "1" ? "Self" : ""}
                              </div>
                            ) : (
                              <Form.Select
                                onChange={(e) =>
                                  handleInputChange("relation", e.target.value)
                                }
                                aria-label="Default select realtion-select"
                                size="lg"
                                value={traveler.relation || 0}
                                isInvalid={!!errors.relation} // corrected key from `realtion` to `relation`
                              >
                                <option value={0}>Select</option>
                                {data?.relations &&
                                  Object.keys(data.relations)
                                    .filter((relationKey) => {
                                      const label =
                                        data.relations[
                                          relationKey
                                        ]?.toLowerCase();
                                      if (familyType === "Child") {
                                        return (
                                          label === "son" ||
                                          label === "daughter"
                                        );
                                      }
                                      if (
                                        familyType === "Adult" ||
                                        familyType === "Senior Citizen"
                                      ) {
                                        return label === "spouse";
                                      }
                                      return true; // fallback to show all if needed
                                    })
                                    .map((relationKey) => (
                                      <option
                                        key={relationKey}
                                        value={relationKey}
                                      >
                                        {data.relations[relationKey]}
                                      </option>
                                    ))}
                              </Form.Select>
                            )}
                            <Form.Control.Feedback type="invalid">
                              {errors.realtion}
                            </Form.Control.Feedback>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                  {age >= 50 ? (
                    ""
                  ) : (
                    <Row className="traveladdon-details">
                      <Col>
                        <div className="benfit-block">
                          <div className="benfit-block-title">
                            {data?.additonal_benefits}
                          </div>

                          <div className="benfit-content">
                            {/* WSC Benefit Block */}
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
                                  <div className="info-align">
                                    {data?.benfit_sports} &nbsp;
                                    <Info
                                      popUpData={data?.benfit_sports_info}
                                    />
                                  </div>
                                  <div>
                                    <p className="sub-title">
                                      {data?.percentage_of_premium}
                                    </p>
                                  </div>
                                </div>
                                <div className="benfit-sub-title">
                                  {/* Replace with API data if needed */}
                                </div>
                              </div>

                              <div
                                className="benfit-right"
                                onClick={() =>
                                  checkStringAvailability(
                                    "WSC",
                                    traveler.coverageCode
                                  )
                                    ? handleInputChange(
                                        { coverageCode: "WSC" },
                                        { coverageCode: "WSC" }
                                      )
                                    : handleInputChange(
                                        { coverageCode: "WSC" },
                                        { coverageCode: "WSC" }
                                      )
                                }
                              >
                                <div
                                  className={`${
                                    checkStringAvailability(
                                      "WSC",
                                      traveler.coverageCode
                                    )
                                      ? "benfit-remove-btn"
                                      : "benfit-button"
                                  }`}
                                >
                                  <div className="benfit-button-text">
                                    {checkStringAvailability(
                                      "WSC",
                                      traveler.coverageCode
                                    )
                                      ? data?.remove_button
                                      : data?.add_button}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="benfit-content-space"></div>

                            {/* CV Benefit Block */}
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
                                  <div className="info-align">
                                    {data?.benfit_covid} &nbsp;
                                    <Info popUpData={data?.benfit_covid_info} />
                                  </div>
                                  <p className="sub-title">{data?.sar_200}</p>
                                </div>
                                <div className="benfit-sub-title">
                                  {/* Optional subtitle or additional info */}
                                </div>
                              </div>

                              <div
                                className="benfit-right"
                                onClick={() =>
                                  checkStringAvailability(
                                    "CV",
                                    traveler.coverageCode
                                  )
                                    ? handleInputChange(
                                        { coverageCode: "CV" },
                                        { coverageCode: "CV" }
                                      )
                                    : handleInputChange(
                                        { coverageCode: "CV" },
                                        { coverageCode: "CV" }
                                      )
                                }
                              >
                                <div
                                  className={`${
                                    checkStringAvailability(
                                      "CV",
                                      traveler.coverageCode
                                    )
                                      ? "benfit-remove-btn"
                                      : "benfit-button"
                                  }`}
                                >
                                  <div className="benfit-button-text">
                                    {checkStringAvailability(
                                      "CV",
                                      traveler.coverageCode
                                    )
                                      ? data?.remove_button
                                      : data?.add_button}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  )}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          ))}
      </div>
    );
  }
);

export default TravelerFamily;
