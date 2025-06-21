import ThemeButton from "components/ThemeComponents/ThemeButton";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { DateObject, Value } from "react-multi-date-picker";
import { LanguageData } from "types/languageData";
import arabic from "react-date-object/calendars/arabic";
import arabic_en from "react-date-object/locales/arabic_en";
import TypographyAndIcon from "components/ThemeComponents/TypographyAndIcon";
import { checkAgeLimit } from "utils/formatDate";
import { RenewPolicyAlert, after30, after45, after90 } from "Motor/QuoteAndBuy/CoveragePlan/ConstantValue/ConstantValue";
import "./index.scss"
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { productIDs } from "../../../constant";
import { InputCalendar } from "components/Calendar/inputCalendar";
import { isValidDate } from "utils/calendarValidation";

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

  // Rearrange to yyyy/mm/dd
  const convertDateYmd = (date: string): string => {
    const [day, month, year] = date.split("/"); // Split the date into day, month, and year
    return `${year}/${month}/${day}`;
  };

  const convertedDate = convertDateYmd(String(dateValue ?? ""));

  const minDate = isRenewpolicy ? new DateObject(convertedDate).subtract(RenewPolicyAlert, "days") : new DateObject().add(1, "days");
  const maxDate = isRenewpolicy ? new DateObject(convertedDate).add(after30, "days") : new DateObject().add(productType === productIDs.travel ? after90 : after45, "days")

  useEffect(() => {
    let dob = dateValue;
    if (dateValue) {
      if (isOn) {
        dob = typeof dob === "string" ? dob : new DateObject(dateValue).convert(arabic, arabic_en).format();
      } else {
        dob = typeof dob === "string" ? dob : new DateObject(dateValue).format();
      }
      setOwnerDOB(dob);
    }
  }, [dateValue, isOn]);

  const checkValue = (RegExp(/home/i).exec(languageData?.isLatest as string));

  const setDatepickerValue = (value: Value | string) => {
    const isValid = isValidDate(String(value), isOn, maxDate, minDate);
    if (!isValid && value) {
      setIsError(true);
      return;
    } else {
      setIsError(false);
    }
    setDateValue(value)
  }

  // on save click handler
  const clickHandler = () => {
    const isValid = isValidDate(String(ownerDOB), isOn, maxDate, minDate);
    if (!isValid) {
      setIsError(true);
      return;
    }
    changeHandler(ownerDOB);
  };

  useEffect(() => {
    if (policyDate) {
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
      <Modal.Header closeButton={true} className="pb-0 border-0">
        <Modal.Title className="walaa-medium-500">
          {languageData?.modify_policy_start_date}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="add-driver-modal pb-0">
        <div className="p-1 ChangePolicyStartDateContainer">
          <div className="walaa-regular-400 title">
            <TypographyAndIcon
              text={languageData?.policy_start_date as string}
              required={false}
            />
          </div>
          <div className={`calendarContainer`}>
            <InputCalendar
              value={dateValue as Value}
              showSwitch={true}
              setValue={setDatepickerValue}
              format={format}
              isOn={isOn}
              switchLabel={languageData?.hirji ?? ""}
              setIsOn={setIsOn}
              isonlyMonthPickerEnable={false}
              maxDate={maxDate.format("DD/MM/YYYY")}
              minDate={minDate.format("DD/MM/YYYY")}
              isCalendarIcon={isCalendarIcon}
              errorMessage={isError ? languageData?.policyStartDateError : ""}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0">
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
              title={checkValue ? languageData?.update : languageData?.save}
              onClickhandler={clickHandler}
            />}
            {(languageData && checkValue === null) && <ThemeButton
              classes=""
              isDisabled={isError}
              title={languageData?.update}
              onClickhandler={clickHandler}
              data-testid="update-btn"
            />}
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangePolicyStartDate;
