import { memo, useRef, useEffect } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import arabic from "react-date-object/calendars/arabic";
import arabic_locale from "react-date-object/locales/arabic_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
import SwitchButton from "components/SwitchButton";
import CustomDateInput from "./CustomDateInput";
import { validateDOB } from "./dateValidation";

interface DobCalendarProps {
  value: DateObject | null;
  setValue: (value: DateObject | null | string) => void;
  isOn: boolean;
  setIsOn: (val: boolean) => void;
  setErrorMessage: (msg: string) => void;
  field_name: string; // Add this!
  onFieldChange: (name: string, value: string, isValid: boolean) => void;
  languageData?: { [key: string]: string };
  showSwitch?: boolean;
  switchLabel?: string;
  errorClass?: string;
  format?: string;
}

export const DobCalendar: React.FC<DobCalendarProps> = memo(
  ({
    value,
    setValue,
    format = "MM/YYYY",
    isOn,
    setIsOn,
    switchLabel = "Hijri",
    showSwitch = true,
    errorClass = "",
    field_name,
    onFieldChange,
    setErrorMessage,
    languageData,
  }) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    //  Correct Min/Max calculation for both Gregorian and Hijri
    const today = new DateObject();
    const maxGregorian = today.subtract(18, "years");
    const minGregorian = new DateObject(maxGregorian).subtract(100, "years");

    const maxDate = isOn ? maxGregorian.convert(arabic) : maxGregorian;
    const minDate = isOn ? minGregorian.convert(arabic) : minGregorian;

    const handleToggle = () => {
      if (value instanceof DateObject && value.isValid) {
        const convertedDate = isOn
          ? value.convert("gregorian")
          : value.convert("arabic");
        setValue(convertedDate);

        // Force re-validate on toggle:
        const dobString = convertedDate.format("MM/YYYY");
        validateDOB(
          dobString,
          field_name,
          onFieldChange,
          setErrorMessage,
          languageData,
          !isOn // because isOn will flip
        );
      }
      setIsOn(!isOn);
    };

    return (
      <div className={`d-flex calendar-switch ${errorClass}`}>
        <DatePicker
          currentDate={maxDate}
          value={value}
          onChange={(date: DateObject | string | null) => {
            let dobString = "";

            if (isOn) {
              // Hijri calendar - only allow calendar selection
              if (typeof date === "string") {
                setValue(null);
                return;
              }
              if (date?.isValid) {
                setValue(date);
              } else {
                setValue(null);
              }
            } else {
              // Gregorian - allow manual MM/YYYY input
              if (typeof date === "string") {
                const isValidFormat = /^\d{2}\/\d{4}$/.test(date);
                if (isValidFormat) {
                  const fullDate = new DateObject({
                    date: `01/${date}`,
                    format: "DD/MM/YYYY",
                  });
                  if (fullDate.isValid) {
                    setValue(fullDate);
                  } else {
                    setValue(null);
                  }
                } else {
                  setValue(null);
                }
              } else if (date?.isValid) {
                setValue(date);
              } else {
                setValue(null);
              }
            }
          }}
          editable={!isOn}
          format="MM/YYYY"
          calendar={isOn ? arabic : undefined}
          locale={isOn ? arabic_locale : gregorian_en}
          digits={["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]}
          inputRef={inputRef}
          render={<CustomDateInput />}
          minDate={minDate}
          maxDate={maxDate}
          placeholder="Date of Birth"
          onlyMonthPicker
        />
        {showSwitch && (
          <div className="d-flex align-items-center Override_p3text">
            <SwitchButton isOn={isOn} handleToggle={handleToggle} />
            <span
              className={`${
                isOn ? "label" : "disabled-label"
              } walaa-regular-400 ps-2`}
            >
              {switchLabel}
            </span>
          </div>
        )}
      </div>
    );
  }
);
