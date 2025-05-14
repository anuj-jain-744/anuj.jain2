import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Modal } from "react-bootstrap";
import { DateObject } from "react-multi-date-picker";
import ThemeDropdown from "../../ThemeDropdown/ThemeDropdown";
import { FullCalender } from "../../Calendar/fullcalender";
import CounterComponent from "components/CounterComp";
import SeniorCitizenAlert from "./SeniorCitizenAlert";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useQuoteAndBuyContext } from "../../hooks/useQuoteAndBuyContext";
import { sanitizeHtml } from "@dpm/shared-module";
import { toCamelCase } from "utils/quoteAndBuyTravel";
import { DATE_FORMAT } from "constant";
import "./index.scss";
import {
  isTravellerAdult,
  isTravellerChild,
  isTravellerSenior,
} from "utils/quoteAndBuy";
interface InitialValueProps {
  [key: string]: string;
}

interface VehicalDetailsProps {
  langData: { [key: string]: string };
  travelPeriods: Array<Travel.TravelPeriodOption>;
}

const ValidateTravel: React.FC<VehicalDetailsProps> = ({
  langData,
  travelPeriods,
}) => {
  // context
  const {
    ownerDetailsResponseData: owner,
    selectedPeriod,
    setSelectedPeriod,
    travelStartDate,
    setTravelStartDate,
    isToggleOn,
    setIsToggleOn,
    setTravellerType,
    setPrimaryTravelers,
    setTravelers,
    setTravelersChild,
    setTravelersSrcitizen,
    setTravelCoverageTypeCode,
    adultCount,
    setAdultCount,
    childCount,
    setChildCount,
    srCitizenCount,
    setSrCitizenCount,
    setCoverageType,
    setRepairTypeSelected,
    setTravelCoveragePlan,
    setTravelCoverageType,
    setTravelCoverage,
  } = useQuoteAndBuyContext();

  const [inputError, setInputError] = useState<InitialValueProps | null>(null);
  const [isModal, setIsModal] = useState<boolean>(false);
  const [isOn, setIsOn] = useState<boolean>(false);

  // Counter component starts
  const handleTotalChange = (type: string, change: number) => {
    let newAdultCount = adultCount;
    let newChildCount = childCount;
    let newSrCitizenCount = srCitizenCount;
    switch (type) {
      case "adult":
        newAdultCount = (adultCount ?? 0) + change;
        setAdultCount(newAdultCount);
        break;
      case "child":
        newChildCount = (childCount ?? 0) + change;
        setChildCount(newChildCount);
        break;
      case "senior":
        newSrCitizenCount = (srCitizenCount ?? 0) + change;
        setSrCitizenCount(newSrCitizenCount);
        break;
      default:
        break;
    }
  };
  // Counter component ends

  // set traveller value based on toggle starts
  const handleToggleClick = () => {
    setIsToggleOn((prev) => !prev);
    setInputError(null);
    setTravellerType(isToggleOn ? "1" : "2");
    setPrimaryTravelers((prev) =>
      prev.map((item) => ({ ...item, policyCoverage: [] }))
    );
    setChildCount(defaultCount.child);
    setTravelersChild([]);
    setAdultCount(defaultCount.adult);
    setTravelers([]);
    setSrCitizenCount(defaultCount.senior);
    setTravelersSrcitizen([]);
    setCoverageType(null);
    setRepairTypeSelected(null);
    setTravelCoveragePlan(null);
    setTravelCoverageType(null);
    setTravelCoverageTypeCode(null);
    setTravelCoverage(null);
  };

  const onSelectPeriod = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const item = travelPeriods.find((item) => item.value === value);
    setSelectedPeriod(item ?? { label: "", value: "" });
  };

  const replaceName = (text: string, actualName: string): string => {
    const formattedName = actualName
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
    return text.replace("<<NAME>>", formattedName); //TODO: replace with actual name once API is integrated
  };

  const nameincamelcase = toCamelCase(owner?.ownerFullNameEnglish ?? "");

  const defaultCount = useMemo(() => {
    return {
      child: isTravellerChild(owner?.age) ? 1 : 0,
      adult: isTravellerAdult(owner?.age) ? 1 : 0,
      senior: isTravellerSenior(owner?.age) ? 1 : 0,
    };
  }, [owner]);

  return (
    <div className="travel-detail-wrapper">
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
              __html: sanitizeHtml(langData?.traveller_popup_title),
            }}
          ></h2>
        </Modal.Header>
        <div className="actual-content">
          <div className="modal-traveller-content">
            {langData?.traveller_popup_content && (
              <div
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(langData?.traveller_popup_content),
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
            {langData?.travelDetails}
          </div>
          {/* Title ends */}

          <div className="vehical-content">
            <div className="travel-content">
              <Row>
                <Col className="para-travel">
                  {langData?.welcome_text &&
                    replaceName(langData?.welcome_text, nameincamelcase ?? "")}
                </Col>
              </Row>
              <Row className="row-3-travel travel-fields">
                <Col className="travel-form-group col-4">
                  <label className="form-check-label">
                    {langData?.travel_period}{" "}
                    <span className="mandate_star">*</span>
                  </label>
                  <div className="drop-container">
                    <ThemeDropdown
                      onChangehandler={onSelectPeriod}
                      value={travelPeriods}
                      classes={"policy-list"}
                      placeholder={"Select days"}
                      selectedValue={selectedPeriod.value}
                    />
                    {inputError?.selectedPeriod && (
                      <p className="input-error">{inputError.selectedPeriod}</p>
                    )}
                  </div>
                </Col>
                <Col className="travel-form-group col-4">
                  <label className="form-check-label">
                    {langData?.travel_start_date}{" "}
                    <span className="mandate_star">*</span>
                  </label>
                  <FullCalender
                    value={travelStartDate}
                    format={DATE_FORMAT}
                    placeholder={DATE_FORMAT}
                    setValue={setTravelStartDate}
                    isOn={isOn}
                    setIsOn={setIsOn}
                    customProps={{
                      onOpenPickNewDate: false,
                      currentDate: new DateObject().add(1, "days"),
                      minDate: new DateObject().add(1, "days"),
                    }}
                  />
                  {inputError?.travelStartDate && (
                    <p className="input-error">{inputError.travelStartDate}</p>
                  )}
                </Col>
                <Col className="travel-form-group col-4">
                  <label className="form-check-label">
                    {langData?.travellerType}{" "}
                    <span className="mandate_star">*</span>
                  </label>
                  <div className="toggle-wrapper">
                    <div className="product-toggle-wrapper-Ui-Tabs">
                      <div className="product-toggle walaa-medium-500">
                        <div
                          data-testid="self-toggle"
                          className={isToggleOn ? "selected" : "default"}
                          onClick={handleToggleClick}
                        >
                          {langData?.self}
                        </div>
                        <div
                          data-testid="family-toggle"
                          className={!isToggleOn ? "selected" : "default"}
                          onClick={handleToggleClick}
                        >
                          {langData?.family}
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
                    {langData?.select_number_of_travellers}{" "}
                    <span className="mandate_star">*</span>
                    <InfoOutlinedIcon
                      onClick={() => setIsModal(true)}
                      className="tooltip-icon"
                    />
                  </div>
                  <Row>
                    <Col className="age-input-warp travel-fields">
                      <Row className="age-input-box col-4">
                        {langData?.children && (
                          <div
                            className="form-check-label"
                            dangerouslySetInnerHTML={{
                              __html: sanitizeHtml(langData?.children),
                            }}
                          ></div>
                        )}
                        <CounterComponent
                          type="child"
                          maxLimit={6}
                          onTotalChange={handleTotalChange}
                          defaultValue={childCount}
                          defaultCount={defaultCount.child}
                        />
                      </Row>
                      <Row className="age-input-box col-4">
                        {langData?.adult && (
                          <div
                            className="form-check-label"
                            dangerouslySetInnerHTML={{
                              __html: sanitizeHtml(langData?.adult),
                            }}
                          ></div>
                        )}
                        <CounterComponent
                          type="adult"
                          maxLimit={2 - srCitizenCount}
                          onTotalChange={handleTotalChange}
                          defaultValue={adultCount}
                          defaultCount={defaultCount.adult}
                        />
                      </Row>
                      <Row className="age-input-box col-4">
                        {langData?.senior_citizen && (
                          <div
                            className="form-check-label"
                            dangerouslySetInnerHTML={{
                              __html: sanitizeHtml(langData?.senior_citizen),
                            }}
                          ></div>
                        )}
                        <CounterComponent
                          type="senior"
                          maxLimit={2 - adultCount}
                          onTotalChange={handleTotalChange}
                          defaultValue={srCitizenCount}
                          defaultCount={defaultCount.senior}
                        />
                      </Row>
                    </Col>
                  </Row>

                  {srCitizenCount !== 0 && (
                    <Row>
                      <Col>
                        <SeniorCitizenAlert
                          message={langData?.senior_citizen_alert_msg}
                        />
                      </Col>
                    </Row>
                  )}

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
