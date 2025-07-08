import React, { useState, useEffect, useRef, useMemo } from "react";
import { Accordion, Col, Form, Row } from "react-bootstrap";
import Info from "../../TravelerAddDetails/info";
import ModalPopUp from "components/Travel/TravelInfoCard/PopUp/ModalPopUp";
import { InputCalendar } from "components/Calendar/inputCalendar";
import DownhillSkiingOutlinedIcon from "@mui/icons-material/DownhillSkiingOutlined";
import CoronavirusOutlinedIcon from "@mui/icons-material/CoronavirusOutlined";
import GppMaybeOutlinedIcon from "@mui/icons-material/GppMaybeOutlined";
import { DateObject } from "react-multi-date-picker";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { getAmountWithIcon } from "@app-shell/utils/common";
import { formatDateObjectTo, formatToCalendarDate } from "utils/formatDate";
import {
  isValidName,
  isValidNameEdit,
  isValidPassportExpiry,
  isValidPassportNum,
  isValidPassportNumEdit,
  isValidTravelerDOB,
  toTitleCase,
  isValidCalendarDateFormat,
  hasTravelBenefit,
} from "utils/quoteAndBuy";
import { getFullAge } from "utils/getFullAge";
import { getInnerTextBetweenTags } from "utils/GetInnerTextBetweenTags";
import deleteIcon from "../../../assets/Travel/Delete.svg";
import {
  CONFIRM_MSG_DELETE,
  POPUP_FOR,
  genderCodes,
  SENIOR_CITIZEN_VALIDATION_MSG,
  travelerTypeIdMap,
  DATE_FORMATS,
} from "constant";
import {
  familtyFlowConstants,
  covergaeTypes,
} from "components/Travel/constantsTravel";
import "./index.scss";

interface Props {
  data: { [key: string]: string };
  defaultActiveValue?: string | number | undefined;
  familyType: string;
  setTravelers: React.Dispatch<React.SetStateAction<Array<Travel.Traveler>>>;
  travelers: Array<Travel.Traveler>;
  handleDelete?: (familyMemberType: string, person: Travel.Traveler) => void;
  handleInputChangeBenfit?: (
    person: Travel.Traveler,
    benefit: string,
    familyMemberType: string
  ) => void;
  handleRemoveCoverage?: (
    person: Travel.Traveler,
    benefit: string,
    familyMemberType: string
  ) => void;
  setLeftStep?: (step: number) => void;
  isAddTravelerValidation: boolean;
  setShouldShowInvalidSrCitizenDeletedAlert?: (flag: boolean) => void;
}

type DataRef = {
  familyMemberType: string;
  removePerson: Partial<Travel.Traveler>;
  untouched: Array<string>;
  completed: Array<string>;
  passportNumErrors: Record<string, string>;
  expiryErrors: Record<string, string>;
  dobErrors: Record<string, string>;
};

const TravelerFamily = ({
  data,
  defaultActiveValue,
  familyType,
  setTravelers,
  travelers,
  handleDelete,
  handleInputChangeBenfit,
  handleRemoveCoverage,
  setLeftStep,
  setShouldShowInvalidSrCitizenDeletedAlert,
}: Props) => {
  const [selectedAccordian, setSelectedAccordian] = useState<any>([]);
  const [names, setNames] = useState<Record<string, string>>(
    Object.fromEntries(
      travelers.map((item) => [
        item.uiId,
        isValidName(item.travellerNameEnglish)
          ? toTitleCase(item.travellerNameEnglish.trimEnd())
          : "",
      ])
    )
  );
  const [passportNums, setPassportNums] = useState<Record<string, string>>(
    Object.fromEntries(
      travelers.map((item) => [
        item.uiId,
        isValidPassportNum(item.passportNumber) ? item.passportNumber : "",
      ])
    )
  );
  const [expiryDate, setExpiryDate] = useState<Record<string, string | Date>>(
    Object.fromEntries(
      travelers.map((item) => [
        item.uiId,
        formatToCalendarDate(item.passportExpiryDate),
      ])
    )
  );
  const [activeKey, setActiveKey] = useState<string | null>("0");
  const [showRemoveModal, setShowRemoveModal] = useState<boolean>(false);
  const [invalidSeniorCitizenAge, setInvalidSeniorCitizenAge] =
    useState<boolean>(false);

  const {
    ownerDetailsResponseData,
    travelDateRange,
    childCount,
    adultCount,
    srCitizenCount,
    setTravellerType,
    setIsToggleOn,
    setCoverageType,
    setTravelCoverageTypeCode,
    setTravelCoveragePlan,
    setTravelCoverageType,
    setTravelCoverage,
  } = useQuoteAndBuyContext();

  const [travelStartDate] = travelDateRange;
  const totalCount = childCount + adultCount + srCitizenCount;
  const INVALID_FAMILY_TRAVELER_COUNT = totalCount === 2;
  const MSG = invalidSeniorCitizenAge
    ? SENIOR_CITIZEN_VALIDATION_MSG
    : INVALID_FAMILY_TRAVELER_COUNT
    ? data.delete_last_valid_family_member
    : CONFIRM_MSG_DELETE;

  const dataRef = useRef<DataRef>({
    removePerson: {},
    familyMemberType: "",
    untouched: [],
    completed: [],
    passportNumErrors: {},
    expiryErrors: {},
    dobErrors: {},
  });
  const passportErrorText = useMemo(
    () => getInnerTextBetweenTags(data?.passport_info, "<p>", "</p>") ?? "",
    [data]
  );

  useMemo(() => {
    for (const person of travelers) {
      const uiId = person.uiId;
      const expiryCheck = isValidPassportExpiry(
        formatDateObjectTo(travelStartDate, DATE_FORMATS["DD/MM/YYYY"]),
        person.passportExpiryDate
      );
      dataRef.current.expiryErrors[uiId] =
        !person.passportExpiryDate || expiryCheck === true
          ? ""
          : passportErrorText;
      const dobCheck = isValidTravelerDOB(person, data ?? {});
      dataRef.current.dobErrors[uiId] = dobCheck === true ? "" : dobCheck;
      const passportNumCheck = person.passportNumber
        ? isValidPassportNum(person.passportNumber)
        : true;
      dataRef.current.passportNumErrors[uiId] =
        passportNumCheck === true ? "" : data?.passport_num_invalid;
      if (
        person.travellerNameEnglish &&
        person.passportNumber &&
        passportNumCheck === true &&
        person.passportExpiryDate &&
        person.dateOfBirth &&
        person.relation &&
        dobCheck === true &&
        expiryCheck === true
      )
        dataRef.current.completed.push(uiId);
      else if (
        !person.passportNumber &&
        !person.passportExpiryDate &&
        (person.type === familtyFlowConstants.TITLES.SELF ||
          (!person.travellerNameEnglish &&
            !person.dateOfBirth &&
            !person.relation))
      )
        dataRef.current.untouched.push(uiId);
    }
  }, []);

  const handleInputChange = (
    person: Travel.Traveler,
    field: string | { coverageCode: string },
    value: string | number | { coverageCode: string }
  ) => {
    const uiId = person.uiId;
    const personIndex = dataRef.current.untouched.indexOf(uiId);
    if (personIndex !== -1) dataRef.current.untouched.splice(personIndex, 1);
    let changes: Partial<Travel.Traveler> = {};
    const getUpdatedData = (
      prevTravelers: Array<Travel.Traveler>,
      updatedtraveller: Travel.Traveler
    ) =>
      prevTravelers.map((item) => {
        return item.uiId === person.uiId ? updatedtraveller : item;
      });
    let dateText = "";
    let expiryCheck = true;
    let dobCheck: string | true = true;
    if (field === "passportExpiryDate" || field === "dateOfBirth") {
      dateText =
        typeof value === "string" ? value : value?.toLocaleString?.() ?? "";
      const isValidFormat = isValidCalendarDateFormat(dateText);
      if (!isValidFormat) {
        const errorMessage = data?.invalid_date_format;
        if (field === "passportExpiryDate") {
          dataRef.current.expiryErrors[uiId] = errorMessage;
          changes.passportExpiryDate = "";
        } else {
          dataRef.current.dobErrors[uiId] = errorMessage;
          changes.dateOfBirth = "";
        }
        setTravelers((prev) =>
          getUpdatedData(prev, {
            ...person,
            ...changes,
          })
        );
        return;
      }

      if (field === "passportExpiryDate") {
        expiryCheck = isValidPassportExpiry(
          travelStartDate as string,
          dateText
        );
        dataRef.current.expiryErrors[uiId] =
          dateText === "" || expiryCheck === true ? "" : passportErrorText;
        changes.passportExpiryDate = expiryCheck === true ? dateText : "";
      } else {
        dobCheck = isValidTravelerDOB(person, data ?? {}, dateText);
        if (
          getFullAge(dateText, "/") > 80 &&
          person.type === familtyFlowConstants.TITLES.SR_CITIZEN
        ) {
          setInvalidSeniorCitizenAge(true);
          handleOpenRemoveModal(familyType, person);
        } else {
          setInvalidSeniorCitizenAge(false);
        }
        dataRef.current.dobErrors[uiId] = dobCheck === true ? "" : dobCheck;
        if (dobCheck === true) {
          const age = getFullAge(dateText, "/");
          const policyCoverage = Array.isArray(person.policyCoverage)
            ? person.policyCoverage
            : [];
          changes = {
            [field]: dateText,
            personAge: age,
            policyCoverage: age > 50 ? [] : policyCoverage,
          };
        } else {
          changes[field] = "";
        }
      }
    } else if (field === "relation") {
      let travelerGender = person.gender;
      if (value === "2") {
        if (ownerDetailsResponseData?.gender === genderCodes.male)
          travelerGender = genderCodes.female;
        else travelerGender = genderCodes.male;
      } else if (value === "3") travelerGender = genderCodes.male;
      else if (value === "4") travelerGender = genderCodes.female;
      changes = {
        gender: travelerGender,
        relation: value as string,
      };
    } else if (field === "passportNumber") {
      const newValue = (value as string).trim().toUpperCase();
      const isValidEdit = isValidPassportNumEdit(newValue);
      if (isValidEdit === true && passportNums[uiId] !== newValue) {
        const newPassportNums = { ...passportNums, [uiId]: newValue };
        setPassportNums(newPassportNums);
        if (newValue === "")
          dataRef.current.passportNumErrors[uiId] = data?.passport_num_required;
        else {
          const passportNumCheck = isValidPassportNum(newValue);
          dataRef.current.passportNumErrors[uiId] =
            passportNumCheck === true ? "" : data?.passport_num_invalid;
        }
        changes = { [field as string]: newValue };
      }
    } else if (field === "travellerNameEnglish") {
      const newValue = toTitleCase((value as string) ?? "");
      const isValidEdit = isValidNameEdit(newValue);
      if (isValidEdit === true && names[uiId] !== newValue) {
        const newNames = { ...names, [uiId]: newValue };
        setNames(newNames);
        changes = { [field as string]: newValue };
      }
    }
    const updatedPerson = { ...person, ...changes };
    const completedIndex = dataRef.current.completed.indexOf(uiId);
    if (
      updatedPerson.travellerNameEnglish &&
      isValidPassportNum(updatedPerson.passportNumber) &&
      updatedPerson.passportExpiryDate &&
      updatedPerson.dateOfBirth &&
      updatedPerson.relation &&
      dobCheck === true &&
      expiryCheck === true
    ) {
      if (completedIndex === -1) dataRef.current.completed.push(uiId);
    } else if (completedIndex !== -1)
      dataRef.current.completed.splice(completedIndex, 1);
    setTravelers((prev) => getUpdatedData(prev, updatedPerson));
  };

  //accordion on body open handler fn
  const clickEnterHandler = (i: number) => {
    const duplicate = [...selectedAccordian];
    duplicate.push(i);
    setSelectedAccordian(duplicate);
  };
  //accordion on body close handler fn
  const clickExitHandler = (i: number) => {
    const duplicate = selectedAccordian.filter((item: any) => item !== i);
    setSelectedAccordian(duplicate);
  };

  const handleOpenRemoveModal = (
    familyType: string,
    item: Travel.Traveler
  ): void => {
    dataRef.current.removePerson = item;
    dataRef.current.familyMemberType = familyType;
    setShowRemoveModal(true);
  };

  const handleRemovePopupSubmit = () => {
    if (INVALID_FAMILY_TRAVELER_COUNT && setLeftStep) {
      setLeftStep(2);
      setTravellerType(travelerTypeIdMap.self);
      setIsToggleOn(true);
      setCoverageType(null);
      setTravelCoverageTypeCode(null);
      setTravelCoveragePlan(null);
      setTravelCoverageType(null);
      setTravelCoverage(null);
    }
    if (invalidSeniorCitizenAge && setShouldShowInvalidSrCitizenDeletedAlert) {
      setShouldShowInvalidSrCitizenDeletedAlert(true);
    }
    handleDelete(
      dataRef.current.familyMemberType,
      dataRef.current.removePerson
    );
    setShowRemoveModal(false);
  };

  useEffect(() => {
    if (defaultActiveValue === "0") {
      setSelectedAccordian([0]);
    }
  }, [defaultActiveValue]);

  return (
    <div className="custom-accordion-container">
      {travelers.map((item, index) => {
        const wsSelected = hasTravelBenefit(item, covergaeTypes.winterSports);
        const cvSelected = hasTravelBenefit(item, covergaeTypes.covid);
        return (
          <Accordion
            defaultActiveKey={[defaultActiveValue]}
            className={`${
              selectedAccordian.includes(index) ? "accor-open" : "accor-close"
            } w-100 coverage-travelinfo`}
            key={item.uiId}
          >
            <Accordion.Item eventKey={activeKey}>
              <Accordion.Header>
                <div className="acc-head">
                  <div className="acc-head-strip"></div>
                  <span
                    className={
                      dataRef.current.completed.includes(item.uiId)
                        ? "acc-head-validation-success"
                        : `${
                            dataRef.current.untouched.includes(item.uiId)
                              ? "acc-head-validation-inactive"
                              : "acc-head-validation-error"
                          }`
                    }
                  ></span>
                  {/* <div className="acc-head-title"> */}
                  <div className="acc-head-titles-align">
                    {item?.travellerNameEnglish
                      ? toTitleCase(item?.travellerNameEnglish)
                      : `${familyType} ${index + 1}`}
                    &nbsp;
                    {defaultActiveValue ? (
                      <div className="acc-head-strip-sub">
                        {`Self`}
                        {item?.personAge ? ` | ${item?.personAge} Years` : ""}
                      </div>
                    ) : (
                      <div className="acc-head-strip-sub">
                        {item?.relation
                          ? ` ${data.relations[item?.relation]}`
                          : `Traveler ${index + 1}`}
                        {item?.personAge ? ` | ${item?.personAge} Years` : ""}
                      </div>
                    )}
                  </div>
                  {dataRef.current.completed.includes(item.uiId) === false &&
                  dataRef.current.untouched.includes(item.uiId) === false ? (
                    <div className="text-incomplete">
                      <GppMaybeOutlinedIcon className="acc-warning-icon" />
                      {data?.incomplete}
                    </div>
                  ) : null}
                </div>
                {!defaultActiveValue && (
                  <div className="warning-info">
                    {familyType === familtyFlowConstants.TITLES.SR_CITIZEN ? (
                      <div className="icon-style">
                        <GppMaybeOutlinedIcon className="acc-warning-icon-blue" />
                      </div>
                    ) : null}
                    <div className="acc-delete">
                      <img
                        src={deleteIcon}
                        alt="delete"
                        className="delete-icon"
                        onClick={() => handleOpenRemoveModal(familyType, item)}
                      />
                    </div>
                  </div>
                )}
              </Accordion.Header>
              <Accordion.Body
                onEntered={() => clickEnterHandler(index)}
                onExiting={() => clickExitHandler(index)}
                className="p-2 acc-body"
              >
                <div className="container mt-4">
                  <Form className="form">
                    <Row
                      className="mb-3 form-block-1 form-block-adult"
                      controlId="formName"
                    >
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
                            maxLength={50}
                            value={names[item.uiId]}
                            onChange={(event) =>
                              handleInputChange(
                                item,
                                "travellerNameEnglish",
                                event.target.value
                              )
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
                            placeholder={
                              data?.traveller_passport_no_placeholder
                            }
                            className="form-element-field"
                            maxLength={10}
                            value={passportNums[item.uiId]}
                            onChange={(event) =>
                              handleInputChange(
                                item,
                                "passportNumber",
                                event.target.value
                              )
                            }
                          />
                          <span className="text-danger validation-msg">
                            {dataRef.current.passportNumErrors[item.uiId]}
                          </span>
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

                        <InputCalendar
                          className="travel-component-calendar"
                          isCalendarIcon
                          value={expiryDate[item.uiId]}
                          setValue={(value: Date | null) => {
                            setExpiryDate({
                              ...expiryDate,
                              [item.uiId]: value ?? "",
                            });
                            handleInputChange(
                              item,
                              "passportExpiryDate",
                              value
                            );
                          }}
                          format="DD/MM/YYYY"
                          showSwitch={false}
                          minDate={new DateObject()
                            .add(1, "days")
                            .format("DD/MM/YYYY")}
                          customProps={{
                            onOpenPickNewDate: false,
                            currentDate: undefined,
                            value: expiryDate[item.uiId],
                          }}
                        />
                        {/* {dataRef.current.expiryErrors[item.uiId] && ( */}
                        <span className="text-danger validation-msg">
                          {dataRef.current.expiryErrors[item.uiId]}
                        </span>
                        {/* )} */}
                      </Col>
                    </Row>
                    <Row className="mb-3 form-block-2 calendar-dob">
                      <Col xs={6} md={4}>
                        <div className="form-element">
                          <div className="form-element-label">
                            {data?.traveller_dob}
                            <span className="text-danger">*</span>
                          </div>
                        </div>
                        {familyType === familtyFlowConstants.TITLES.SELF ? (
                          <div className="walaa-medium-500">
                            {item?.dateOfBirth?.split("-").join("/")}
                          </div>
                        ) : (
                          <InputCalendar
                            className="travel-component-calendar"
                            isCalendarIcon
                            value={item?.dateOfBirth}
                            setValue={(value: Date | null) =>
                              handleInputChange(item, "dateOfBirth", value)
                            }
                            format="DD/MM/YYYY"
                            showSwitch={false}
                            maxDate={new DateObject().format("DD/MM/YYYY")}
                            customProps={{
                              onOpenPickNewDate: false,
                              currentDate: undefined,
                            }}
                          />
                        )}
                        {/* {dataRef.current.dobErrors[item.uiId] && ( */}
                        <span className="text-danger validation-msg">
                          {dataRef.current.dobErrors[item.uiId]}
                        </span>
                        {/* )} */}
                      </Col>
                      <Col xs={6} md={4}>
                        <div className="form-element">
                          <div className="form-element-label">
                            {data?.traveller_relation}
                            <span className="text-danger">*</span>
                          </div>
                          {familyType === familtyFlowConstants.TITLES.SELF ? (
                            <div className="walaa-medium-500">
                              {item?.relation === "1" ? "Self" : ""}
                            </div>
                          ) : (
                            <Form.Select
                              onChange={(e) =>
                                handleInputChange(
                                  item,
                                  "relation",
                                  e.target.value
                                )
                              }
                              aria-label="Default select realtion-select"
                              size="lg"
                            >
                              <option value={0}>Select</option>
                              {data?.relations &&
                                Object.keys(data?.relations)
                                  .filter((relation: string) =>
                                    familyType ===
                                    familtyFlowConstants.TITLES.CHILD
                                      ? relation === "3" || relation === "4"
                                      : true
                                  )
                                  .map((relation: string) => (
                                    <option
                                      selected={item?.relation === relation}
                                      value={relation}
                                    >
                                      {data?.relations[relation]}
                                    </option>
                                  ))}
                            </Form.Select>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </Form>
                </div>
                <div className="sub-accor-open sub-accordion">
                  <div className="traveler-additional-benefit-block">
                    <div className="benefit-block-title">
                      {data?.benfit_title}
                    </div>
                    {(item?.personAge && item?.personAge >= 50) ||
                    familyType === familtyFlowConstants.TITLES.SR_CITIZEN ? (
                      <div className="benefit-block-sub-title">
                        {data?.age_above_50}
                      </div>
                    ) : (
                      <div className="additional-benefit-content">
                        <div
                          className={`traveler-additional-benefit-one ${
                            wsSelected === true
                              ? "additional-benefit-one-select"
                              : ""
                          }`}
                        >
                          <div
                            className={`benefit-one ${
                              wsSelected === true ? "benefit-one-select" : ""
                            }`}
                          >
                            <div className="benefit-left-content">
                              <div className="left-icon">
                                <DownhillSkiingOutlinedIcon />
                              </div>
                              <div className="additional-benefit-data">
                                <div className="additional-benefit-title">
                                  {data?.benfit_sports} &nbsp;
                                  <Info popUpData={data?.benfit_sports_info} />
                                </div>
                                <div className="additional-benefit-sub-title">
                                  {data?.percentage_of_premium}
                                </div>
                              </div>
                            </div>
                            <div className="additional-benefit-right">
                              <div
                                className={`${
                                  wsSelected === true
                                    ? "additional-benefit-remove-btn"
                                    : "additional-benefit-button"
                                }`}
                                onClick={() => {
                                  if (wsSelected === true)
                                    handleRemoveCoverage(
                                      item,
                                      covergaeTypes.winterSports,
                                      familyType
                                    );
                                  else
                                    handleInputChangeBenfit(
                                      item,
                                      covergaeTypes.winterSports,
                                      familyType
                                    );
                                }}
                                role="button"
                                tabIndex={0}
                              >
                                <div className="additional-benfit-button-text">
                                  {wsSelected === true
                                    ? data?.remove_button
                                    : data?.add_button}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="additional-benefit-content-space"></div>

                        <div
                          className={`traveler-additional-benefit-one ${
                            cvSelected === true
                              ? "additional-benefit-one-select"
                              : ""
                          }`}
                        >
                          <div
                            className={`benefit-one ${
                              cvSelected === true ? "benefit-one-select" : ""
                            }`}
                          >
                            <div className="benefit-left-content">
                              <div className="left-icon">
                                <CoronavirusOutlinedIcon />
                              </div>
                              <div className="additional-benefit-data">
                                <div className="additional-benefit-title">
                                  {data?.benfit_covid} &nbsp;
                                  <Info popUpData={data?.benfit_covid_info} />
                                </div>
                                <div className="additional-benefit-sub-title">
                                  {getAmountWithIcon(data?.sar_200)}
                                </div>
                              </div>
                            </div>
                            <div className="additional-benefit-right">
                              <div
                                className={`${
                                  cvSelected === true
                                    ? "additional-benefit-remove-btn"
                                    : "additional-benefit-button"
                                }`}
                                onClick={() => {
                                  if (cvSelected === true)
                                    handleRemoveCoverage(
                                      item,
                                      covergaeTypes.covid,
                                      familyType
                                    );
                                  else
                                    handleInputChangeBenfit(
                                      item,
                                      covergaeTypes.covid,
                                      familyType
                                    );
                                }}
                              >
                                <div className="additional-benfit-button-text">
                                  {cvSelected === true
                                    ? data?.remove_button
                                    : data?.add_button}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        );
      })}
      <ModalPopUp
        show={showRemoveModal}
        handleClose={() => setShowRemoveModal(false)}
        errorMsg={MSG}
        popupUsedFor={
          invalidSeniorCitizenAge
            ? familtyFlowConstants.POPUP_USED.SENIOR_CITIZEN_AGE_VALIDATION
            : INVALID_FAMILY_TRAVELER_COUNT
            ? familtyFlowConstants.POPUP_USED.LAST_FAMILY_MEMBER_NOT_SELF_DELETE
            : POPUP_FOR
        }
        handleSubmitPopup={handleRemovePopupSubmit}
        cmsConfigData={data}
      />
    </div>
  );
};

export default TravelerFamily;
