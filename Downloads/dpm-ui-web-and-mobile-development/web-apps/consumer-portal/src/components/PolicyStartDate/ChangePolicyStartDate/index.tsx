import ThemeButton from "components/ThemeComponents/ThemeButton";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { DateObject, Value } from "react-multi-date-picker";
import { LanguageData } from "types/languageData";
import { SharedCalendar } from "components/Calendar";
import arabic from "react-date-object/calendars/arabic";
import arabic_en from "react-date-object/locales/arabic_en";
import TypographyAndIcon from "components/ThemeComponents/TypographyAndIcon";
import { checkAgeLimit } from "utils/formatDate";
import { RenewPolicyAlert, after30, after45, after180 } from "Motor/QuoteAndBuy/CoveragePlan/ConstantValue/ConstantValue";
import "./index.scss"
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import {  productIDs } from "../../../constant";

interface IPolicyStartDate {
  closeHandler: () => void;
  languageData: LanguageData | undefined | null;
  changeHandler: (policyData: Value | undefined) => void;
  policyDate?: Value;
  isCalendarIcon?: boolean;
  isOnVal?: boolean;
  productType?: string;

}

//change date component
const ChangePolicyStartDate: React.FC<IPolicyStartDate> = ({
  closeHandler,
  languageData,
  changeHandler,
  policyDate,
  isCalendarIcon,
  isOnVal,
  productType,
}) => {
  const [dateValue, setDateValue] = useState<string | number | Value>();
  const format = "DD/MM/YYYY";
  const [isOn, setIsOn] = useState<boolean>(isOnVal ?? false);
  const [ownerDOB, setOwnerDOB] = useState<string | number | Value>();
  const [isError, setIsError] = useState<boolean>(false);

  const {
   isRenewpolicy,
  } = useQuoteAndBuyContext();

  useEffect(() => {
    let dob = dateValue;
    if(dateValue) {
      if (isOn) {
        dob = typeof dob === "string" ? dob : new DateObject(dateValue).convert(arabic, arabic_en).format();
      } else {
        dob = typeof dob === "string" ? dob : new DateObject(dateValue).format();
      }
      setOwnerDOB(dob);
    }
  }, [dateValue, isOn]);

  type CheckAgeProps = {
    value: string;
    error: boolean;
  };

  const checkValue = (RegExp(/home/i).exec(languageData?.isLatest as string));

  const setDatepickerValue = (value: Value | string) => {
    if (checkValue) {
      const limit: CheckAgeProps = checkAgeLimit(value as string)
      if (limit.error) {
        setIsError(true)
      } else {
        setIsError(false)
        setDateValue(limit.value)
      }
    } else {
      setDateValue(value)
    }
  }

  // on save click handler
  const clickHandler = () => {
    changeHandler(ownerDOB);
  };

  // Rearrange to yyyy/mm/dd
  const convertDateYmd = (date: string): string => {
    const [day, month, year] = date.split("/"); // Split the date into day, month, and year
    return `${year}/${month}/${day}`;
  };

const convertedDate = convertDateYmd(String(dateValue ?? ""));

  useEffect(() => {
    if(policyDate) {
      // setIsOn();
      setDateValue(policyDate);
    }
  }, [policyDate])

  return (
    <Modal
      show={true}
      onHide={closeHandler}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className={checkValue ? "latestPolicyDateModal" : "ChangePolicyStartDateModal"}
    >
      <Modal.Header closeButton={checkValue ? false : true} className="pb-0 border-0">
        <Modal.Title className="walaa-medium-500">
          {languageData?.modify_policy_start_date}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={checkValue ? "latestPolicyDateContainer" :"p-1 ChangePolicyStartDateContainer"}>
          <div className="walaa-regular-400 title">
            <TypographyAndIcon
              text={languageData?.policy_start_date as string}
              required={false}
            />
          </div>
            <div className={`calendarContainer ${isOn ? "calendar-icon-right" : ""}`}>
            <SharedCalendar
              value={dateValue as Value}
              showSwitch={!checkValue}
              setValue={setDatepickerValue}
              format={format}
              isOn={isOn}
              switchLabel={!checkValue && languageData?.hirji}
              setIsOn={setIsOn}
              isonlyMonthPickerEnable={true}
              minDate={isRenewpolicy ? new DateObject(convertedDate).subtract(RenewPolicyAlert, "days"): new DateObject().add(1, "days")}
              maxDate={isRenewpolicy ? new DateObject(convertedDate).add(after30, "days"):new DateObject().add(productType === productIDs.travel?after180:after45, "days")}
              isCalendarIcon={isCalendarIcon}
              onOpenPickNewDate={true}
            />
            {isError && <span className="error-message">{languageData?.policyStartDateError}</span>}
            </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <div className="d-flex align-items-center gap-2">
          <div>
            <ThemeButton
              classes="register-call2action btn btn-link btn-lg border border-black"
              isDisabled={false}
              title={languageData?.cancel as string}
              onClickhandler={closeHandler}
            />
          </div>
          <div>
          {(languageData && checkValue) && <ThemeButton
              classes=""
              isDisabled={isError}
              title={checkValue ? languageData?.update : languageData?.save }
              onClickhandler={clickHandler}
            />}
            {(languageData && checkValue === null)&& <ThemeButton
              classes=""
              isDisabled={isError}
              title= {languageData?.update }
              onClickhandler={clickHandler}
              data-testId="update-btn"
            />}
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangePolicyStartDate;
