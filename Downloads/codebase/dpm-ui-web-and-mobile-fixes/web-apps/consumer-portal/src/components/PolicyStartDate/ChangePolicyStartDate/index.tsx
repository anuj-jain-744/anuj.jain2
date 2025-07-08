import ThemeButton from "components/ThemeComponents/ThemeButton";
import React, { memo } from "react";
import { Modal } from "react-bootstrap";
import { DateObject, Value } from "react-multi-date-picker";
import { LanguageData } from "types/languageData";
import { InputCalendar } from "components/Calendar/inputCalendar";
import TypographyAndIcon from "components/ThemeComponents/TypographyAndIcon";
import "./index.scss";

interface IPolicyStartDate {
  closeHandler: () => void;
  languageData: LanguageData | undefined | null;
  changeHandler: (policyData: Value | undefined) => void;
  policyDate?: Value;
  isCalendarIcon?: boolean;
  isOnVal?: boolean;
  setValue: (value: Value | string) => void;
  setIsOn: (isOn: boolean) => void;
  isError: boolean;
  minDate: DateObject | null;
  maxDate: DateObject | null;
  ownerDOB: string | number | Value | undefined;
  checkValue: unknown;
  dateValue: string | number | Value | undefined;
}

const ChangePolicyStartDate: React.FC<IPolicyStartDate> = memo(({
  closeHandler,
  languageData,
  changeHandler,
  policyDate,
  isCalendarIcon,
  isOnVal,
  setValue,
  setIsOn,
  isError,
  minDate,
  maxDate,
  ownerDOB,
  checkValue,
  dateValue,
}) => {
  const format = "DD/MM/YYYY";

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
              setValue={setValue}
              format={format}
              isOn={isOnVal}
              switchLabel={languageData?.hirji ?? ""}
              setIsOn={setIsOn}
              isonlyMonthPickerEnable={false}
              maxDate={maxDate ? maxDate.format("DD/MM/YYYY") : undefined}
              minDate={minDate ? minDate.format("DD/MM/YYYY") : undefined}
              isCalendarIcon={isCalendarIcon}
              errorMessage={isError && !policyDate ? languageData?.policyStartDateError : ""}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0">
        <div className="d-flex align-items-center gap-2">
          <ThemeButton
            classes="register-call2action btn btn-link btn-lg border border-black"
            isDisabled={false}
            title={languageData?.cancel as string}
            onClickhandler={closeHandler}
          />
          {languageData && (
            <ThemeButton
              classes=""
              isDisabled={isError}
              title={checkValue === null ? languageData.update : checkValue ? languageData.update : languageData.save}
              onClickhandler={() => changeHandler(ownerDOB)}
              data-testid={checkValue === null ? "update-btn" : undefined}
            />
          )}
        </div>
      </Modal.Footer>
    </Modal>
  );
});

export default ChangePolicyStartDate;

