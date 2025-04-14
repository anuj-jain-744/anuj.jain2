import React, { useState, useEffect } from "react";
import { Accordion, Col, Form, Row } from "react-bootstrap";
import "./index.scss";
import DownhillSkiingOutlinedIcon from "@mui/icons-material/DownhillSkiingOutlined";
import CoronavirusOutlinedIcon from "@mui/icons-material/CoronavirusOutlined";
import GppMaybeOutlinedIcon from "@mui/icons-material/GppMaybeOutlined";
import Info from "../../TravelerAddDetails/info";
import { FullCalender } from "components/Calendar/fullcalender";
import Delete from "../../../assets/Travel/Delete.svg";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { getFullAge } from "utils/getFullAge";
import { AlertBox } from "components/AlertBox";
import { subtractDates } from "utils/subtractDates";
import { getInnerTextBetweenTags } from "utils/GetInnerTextBetweenTags";
import {
  isTravellerAdult,
  isTravellerChild,
  isTravellerSenior,
  toTitleCase,
} from "utils/quoteAndBuy";
import { TRAVELER_DEFAULT_VALUES, PASSPORT_EXP_DATE, INVALID_PRICE_FORMAT_ERROR_MSG } from "constant";
import { familtyFlowConstants } from "components/Travel/constantsTravel";
import { travelersInfo } from "Motor/QuoteAndBuy/QuoteAndBuyContext";
import { formatToCalendarDate } from "utils/formatDate";

interface TravelerFamilyProps {
  count: number;
  data: { [key: string]: string };
  defaultActiveValue?: string | Number | undefined;
  familyType?: string;
  setTravelers: React.Dispatch<React.SetStateAction<Array<travelersInfo>>>;
  travelers: Array<travelersInfo>;
  handleDelete?: any;
  handleInputChangeBenfit?: any;
  handleRemoveCoverage?: any;
}

const TravelerFamily: React.FC<TravelerFamilyProps> = React.memo(
  ({
    data,
    defaultActiveValue,
    familyType,
    setTravelers,
    travelers,
    handleDelete,
    handleInputChangeBenfit,
    handleRemoveCoverage,
  }) => {
    const [selectedAccordian, setSelectedAccordian] = useState<any>([]);

    const [winterBenfit, setWinterBenfit] = useState<boolean>(false);
    const [covidBenfit, setCovidBenfit] = useState<boolean>(false);
    const [validation, setValidation] = useState<number>(0);
    const [expiryDate, setExpiryDate] = useState<Record<string, string | Date>>(
      Object.fromEntries(
        travelers.map((item) => [
          item.uiId,
          formatToCalendarDate(item.passportExpiryDate),
        ])
      )
    );
    const [isOn, setIsOn] = useState<boolean>(false);
    const [activeKey, setActiveKey] = useState<string | null>("0");
    const [completedSections, setCompletedSections] = useState<Array<string>>(
      []
    );
    const [nonCompletedSections, setNonCompletedSections] = useState<
      Array<string>
    >([]);
    const [dobAlertMessage, setDobAlertMessage] = useState<string | null>("");
    const [passportAlertMessage, setPassportAlertMessage] = useState<string | null>("");

    const truncateCovidCoverageAmount = (price: string) => {
      const [currency, amountStr] = price.split(' ');
      
      const roundOffAmount = parseFloat(amountStr)

      if(isNaN(roundOffAmount)){
        throw new Error(INVALID_PRICE_FORMAT_ERROR_MSG)
      }

      return `${currency} ${Math.trunc(roundOffAmount)}`
    }

    

    const {
      ownerDetailsResponseData,
      setIsAddTravelerValidation,
      travelStartDate,
    } = useQuoteAndBuyContext();

    const handleInputChange = (
      person: travelersInfo,
      field: string | { coverageCode: string },
      value: string | number | { coverageCode: string }
    ) => {
      let changes: Partial<travelersInfo> = {};
      const getUpdatedData = (
        prevTravelers: Array<travelersInfo>,
        updatedtraveller: travelersInfo
      ) =>
        prevTravelers.map((item) => {
          return item.uiId === person.uiId ? updatedtraveller : item;
        });
      let formattedDate = "";
      let alertMsg = "";
      if (field === "passportExpiryDate" || field === "dateOfBirth") {
        formattedDate = value.toLocaleString() ?? "";
        if (field === "passportExpiryDate") {
          const start = travelStartDate?.toLocaleString();
          const end = value?.toLocaleString();
          const days = subtractDates(end, start);
          if (days < 180) {
            const innerText: string | null = getInnerTextBetweenTags(
              data?.passport_info,
              "<p>",
              "</p>"
            );
            setPassportAlertMessage(innerText);
          } else {
            setPassportAlertMessage('')
            changes.passportExpiryDate = formattedDate
          };
        } else {
          const age = getFullAge(formattedDate, "/");
          if (
            familyType === familtyFlowConstants.TITLES.CHILD &&
            isTravellerChild(age) === false
          )
            alertMsg = data.age_lessthan_18;
          else if (
            familyType === familtyFlowConstants.TITLES.ADULT &&
            isTravellerAdult(age) === false
          )
            alertMsg = data.age_lessthan_60;
          else if (
            familyType === familtyFlowConstants.TITLES.SR_CITIZEN &&
            (isTravellerSenior(age) === false ||
              age > familtyFlowConstants.seniorAgeLimit)
          )
            alertMsg = data.age_greaterthan_80;
          else {
            const policyCoverage = Array.isArray(person.policyCoverage)
              ? person.policyCoverage
              : [];
            changes = {
              [field]: formattedDate,
              personAge: age,
              policyCoverage: age > 50 ? [] : policyCoverage,
            };
          }
        }
      } else if (field === "relation") {
        let travelerGender = person.gender;
        if (ownerDetailsResponseData?.gender === "M" && value === "2") {
          travelerGender = "F";
        }
        if (ownerDetailsResponseData?.gender === "F" && value === "2") {
          travelerGender = "M";
        }
        if (value === "3") travelerGender = "M";
        if (value === "4") travelerGender = "F";
        changes = {
          gender: travelerGender,
          relation: value as string,
        };
      } else changes = { [field as string]: value };
      const updatedPerson = { ...person, ...changes };
      setDobAlertMessage(alertMsg);
      if (alertMsg) {
        return;
      } else setTravelers((prev) => getUpdatedData(prev, updatedPerson));
      handleValidations(updatedPerson, alertMsg === "");
    };

    //accordion opened/not state
    const [isOpen, setOpen] = useState<boolean>(false);
    //accordion on body open handler fn
    const clickEnterHandler = (i: number) => {
      setValidation(1);
      setOpen(true);
      setIsAddTravelerValidation(true);
      const duplicate = [...selectedAccordian];
      duplicate.push(i);
      setSelectedAccordian(duplicate);
    };
    //accordion on body close handler fn
    const clickExitHandler = (i: number) => {
      setOpen(false);
      const duplicate = selectedAccordian.filter((item: any) => item !== i);
      setSelectedAccordian(duplicate);
    };

    useEffect(() => {
      if (defaultActiveValue === "0") {
        setOpen(true);
        setSelectedAccordian([0]);
      }
    }, [defaultActiveValue]);

    const checkStringAvailability = (
      str: string,
      arr: Array<{ [key: string]: string }>
    ): boolean => {
      return arr && arr.some((obj) => Object.values(obj).includes(str));
    };

    const handleValidations = (
      person: travelersInfo,
      isValid: boolean = true
    ) => {
      const sectionIndex = completedSections.indexOf(person.uiId);
      if (
        isValid === true &&
        person.travellerNameEnglish &&
        person.passportNumber &&
        person.passportExpiryDate &&
        person.dateOfBirth &&
        person.relation
      ) {
        if (sectionIndex === -1)
          setCompletedSections(completedSections.concat([person.uiId]));
        if (nonCompletedSections.includes(person.uiId))
          setNonCompletedSections(
            nonCompletedSections.filter((item) => item !== person.uiId)
          );
      } else {
        if (sectionIndex !== -1)
          setCompletedSections(
            completedSections.filter((item) => item !== person.uiId)
          );
        if (nonCompletedSections.includes(person.uiId) === false)
          setNonCompletedSections(nonCompletedSections.concat([person.uiId]));
      }
    };

    return (
      <div className="custom-accordion-container">

        {travelers.map((item, index) => (
          <Accordion
            defaultActiveKey={[defaultActiveValue]}
            className={`${selectedAccordian.includes(index) ? "accor-open" : "accor-close"
              } w-100 coverage-travelinfo`}
            key={item.uiId}
          >
            <Accordion.Item eventKey={activeKey}>
              <Accordion.Header>
                <div className="acc-head">
                  <div className="acc-head-strip"></div>
                  <span
                    className={`${completedSections.includes(item.uiId)
                      ? "acc-head-validation-success"
                      : `${nonCompletedSections.includes(item.uiId)
                        ? "acc-head-validation-error"
                        : "acc-head-validation-inactive"
                      }`
                      }
                      }`}
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
                          : `Traveller ${index + 1}`}
                        {item?.personAge ? ` | ${item?.personAge} Years` : ""}
                      </div>
                    )}
                  </div>
                  {nonCompletedSections.includes(item.uiId) ? (
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
                        src={Delete}
                        alt="delete"
                        className="delete-icon"
                        onClick={() => handleDelete(familyType, item)}
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
                            value={
                              item?.travellerNameEnglish ?? ""
                                ? toTitleCase(item?.travellerNameEnglish)
                                : ""
                            }
                            onChange={(e) =>
                              handleInputChange(
                                item,
                                "travellerNameEnglish",
                                e.target.value
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
                            value={
                              item?.passportNumber !==
                                TRAVELER_DEFAULT_VALUES.passPortNumber
                                ? item?.passportNumber
                                : ""
                            }
                            onChange={(e) =>
                              handleInputChange(
                                item,
                                "passportNumber",
                                e.target.value
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
                            value: expiryDate[item.uiId],
                          }}
                        />
                        {passportAlertMessage && <span className="text-danger validation-msg">{passportAlertMessage}</span>}
                      </Col>
                    </Row>
                    <Row className="mb-3 form-block-2">
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
                          <FullCalender
                            // value={travelers[i]?.dateOfBirth}
                            value={item?.dateOfBirth}
                            setValue={(value: Date | null) =>
                              handleInputChange(item, "dateOfBirth", value)
                            }
                            format={"DD/MM/YYYY"}
                            isOn={isOn}
                            showSwitch={false}
                            setIsOn={setIsOn}
                            placeholder={data?.traveller_dob_placeholder}
                            minDate={false}
                            customProps={{
                              onOpenPickNewDate: false,
                              currentDate: "",
                            }}
                          />
                        )}
                        {dobAlertMessage && <span className="text-danger validation-msg">{dobAlertMessage}</span>}
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
                                Object.keys(data?.relations).map(
                                  (relation: string) => (
                                    <option
                                      selected={
                                        item?.relation === relation
                                          ? true
                                          : false
                                      }
                                      value={relation}
                                    >
                                      {data?.relations[relation]}
                                    </option>
                                  )
                                )}
                            </Form.Select>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </Form>
                </div>
                <div
                  className={`${isOpen ? "sub-accor-open" : "sub-accor-close"
                    } sub-accordion`}
                >
                  <div className="benfit-block">
                    <div className="benfit-block-title">
                      {data?.benfit_title}
                    </div>
                    {(item?.personAge && item?.personAge >= 50) ||
                      familyType === familtyFlowConstants.TITLES.SR_CITIZEN ? (
                      <div className="benfit-block-sub-title">
                        No benefits available for above 50 years of age
                      </div>
                    ) : (
                      <div className="benfit-content">
                        <div
                          className={`${!winterBenfit
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
                              {data?.percentage_of_premium}
                            </div>
                          </div>
                          <div className="benfit-right">
                            <div
                              className={` ${item?.policyCoverage &&
                                checkStringAvailability(
                                  "WSC",
                                  item?.policyCoverage
                                )
                                ? "benfit-remove-btn"
                                : "benfit-button"
                                }`}
                            >
                              {checkStringAvailability(
                                "WSC",
                                item?.policyCoverage
                              ) ? (
                                <div
                                  onClick={() =>
                                    handleRemoveCoverage(
                                      item,
                                      "WSC",
                                      familyType
                                    )
                                  }
                                  className="benfit-button-text"
                                >
                                  {` ${checkStringAvailability(
                                    "WSC",
                                    item?.policyCoverage
                                  )
                                    ? data?.remove_button
                                    : data?.add_button
                                    }`}
                                </div>
                              ) : (
                                <div
                                  onClick={() =>
                                    handleInputChangeBenfit(
                                      item,
                                      "policyCoverage",
                                      "WSC",
                                      familyType
                                    )
                                  }
                                  className="benfit-button-text"
                                >
                                  {` ${!checkStringAvailability(
                                    "WSC",
                                    item?.policyCoverage
                                  )
                                    ? data?.add_button
                                    : data?.remove_button
                                    }`}
                                </div>
                              )}
                              {/* <div
                              onClick={() =>
                                handleInputChange(i, "policyCoverage", {coverageCode: "WSC"})
                              }
                              className="benfit-button-text"
                            >
                              {` ${travelers[i]?.policyCoverage && checkStringAvailability("WSC", travelers[i]?.policyCoverage) ? data?.remove_button : data?.add_button}`}
                            </div> */}
                            </div>
                          </div>
                        </div>

                        <div className="benfit-content-space"></div>
                        <div
                          className={`${!covidBenfit
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
                            {truncateCovidCoverageAmount(data?.sar_200)}
                            </div>
                          </div>
                          <div className="benfit-right">
                            <div
                              className={` ${item?.policyCoverage &&
                                checkStringAvailability(
                                  "CV",
                                  item?.policyCoverage
                                )
                                ? "benfit-remove-btn"
                                : "benfit-button"
                                }`}
                            >
                              {checkStringAvailability(
                                "CV",
                                item?.policyCoverage
                              ) ? (
                                <div
                                  onClick={() =>
                                    handleRemoveCoverage(item, "CV", familyType)
                                  }
                                  className="benfit-button-text"
                                >
                                  {` ${checkStringAvailability(
                                    "CV",
                                    item?.policyCoverage
                                  )
                                    ? data?.remove_button
                                    : data?.add_button
                                    }`}
                                </div>
                              ) : (
                                <div
                                  onClick={() =>
                                    handleInputChangeBenfit(
                                      item,
                                      "policyCoverage",
                                      "CV",
                                      familyType
                                    )
                                  }
                                  className="benfit-button-text"
                                >
                                  {` ${!checkStringAvailability(
                                    "CV",
                                    item?.policyCoverage
                                  )
                                    ? data?.add_button
                                    : data?.remove_button
                                    }`}
                                </div>
                              )}
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
        ))}
      </div>
    );
  }
);

export default TravelerFamily;
