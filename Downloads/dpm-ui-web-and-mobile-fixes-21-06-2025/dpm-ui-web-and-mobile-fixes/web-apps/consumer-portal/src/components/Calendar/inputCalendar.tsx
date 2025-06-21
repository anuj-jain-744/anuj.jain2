import { memo, useEffect, useRef, useState } from "react";
import { DateObject, Calendar } from "react-multi-date-picker";
import type { CalendarProps, Value } from "react-multi-date-picker";
import arabic from "react-date-object/calendars/arabic";
import gregorian_ar from "react-date-object/locales/gregorian_ar";

import arabicEn from "react-date-object/locales/arabic_en";
import { useCommonContext } from "@dpm/shared-module";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";

import "./index.scss";
import SwitchButton from "components/SwitchButton";
import { arabicMonthinEnglish } from "@app-shell/utils/common";
interface InputCalendarProps {
  value: Value | null | undefined;
  setValue: (value: Value | null) => void;
  format?: string;
  showSwitch?: boolean;
  switchLabel?: string;
  isOn?: boolean;
  isonlyMonthPickerEnable?: boolean;
  minDate?: string; //DD/MM/YYYY
  maxDate?: string; //DD/MM/YYYY
  setIsOn?: (val: boolean) => void;
  errorMessage?: string;
  setErrorMessage?: (val: string) => void;
  isCalendarIcon?: boolean;
  disabled?: boolean;
  customProps?: Partial<CalendarProps>;
  isModal?: boolean;
  className?: string;
  iconClassName?: string;
  inputClassName?: string;
}

interface DateProps {
  currentDate?: DateObject;
  value?: Value | null;
}

export const InputCalendar: React.FC<InputCalendarProps> = memo(
  ({
    className,
    value,
    setValue,
    format = "MM/YYYY",
    showSwitch = true,
    switchLabel,
    isOn,
    setIsOn,
    isonlyMonthPickerEnable = false,
    minDate,
    maxDate,
    isCalendarIcon,
    errorMessage,
    setErrorMessage,
    disabled,
    customProps = {},
    isModal = true,
    iconClassName,
    inputClassName,
  }) => {
    const [showCalendar, setShowCalendar] = useState<boolean>(false);
    const [calendarDate, setCalendarDate] = useState<Value>("");
    const [inputValue, setInputValue] = useState<string>(value as string || "");
    const { currentLanguage } = useCommonContext();
    const [isInputChanged, setIsInputChanged] = useState<boolean>(false);

    const calendarRef = useRef<HTMLDivElement | null>(null);
    const arabiCMonth = [
      "محرم",
      "صفر",
      "ربیع الاول",
      "ربیع الثانی",
      "جمادی الاول",
      "جمادی الثانی",
      "رجب",
      "شعبان",
      "رمضان",
      "شوال",
      "ذو القعدة",
      "ذو الحجة",
    ];

    const convertDateYmd = (date: string, flag: boolean = false, isHizri: boolean= false): string => {
      const [day, month, year] = date.split("/"); // Split the date into day, month, and year
      return format === "MM/YYYY" && flag? `${month}/${day}` :  (isHizri ? `${year}/${month}/${parseInt(day)+1}`:`${year}/${month}/${day}`) ;

    };

    const [props, setProps] = useState<DateProps>({
      currentDate: minDate
        ? new DateObject({ date: new Date(convertDateYmd(minDate)) })
        : new DateObject().subtract(18, "years"),
    });

    const getMonth = (isOn: boolean) => {
      if (currentLanguage === "ar") {
        if (isOn) {
          return arabiCMonth.map((month) => month);
        } else {
          return gregorian_ar.months.map((month) => month);
        }
      } else {
        if (isOn) {
          return arabicMonthinEnglish.map((month) => month);
        } else {
          return [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
        }
      }
    };

    const getCurrentDate = () => {
      const currentDate = new DateObject().subtract(18, "years");
      if (maxDate && minDate && format !== "MM/YYYY") {
        const mxDate = new Date(convertDateYmd(maxDate));
        const mnDate = new Date(convertDateYmd(minDate));
        const dateVal = mnDate > mxDate ? maxDate : minDate;
        return new DateObject({ date: new Date(convertDateYmd(dateVal)) });
      }
      return currentDate;
    };

    const handleToggle = (val: boolean) => {
      setIsOn && setIsOn(!val);
    };

    useEffect(() => {
      if (calendarDate) {
        const currentDate = format === "MM/YYYY" ? "01/"+ inputValue: inputValue;
        setProps({ value: new DateObject({
          date: convertDateYmd(currentDate as string, false),
          calendar: isOn ? arabic : undefined,
          locale: isOn ? arabicEn : undefined,
        }) });
      } else {
        setProps({ currentDate: format === "MM/YYYY" ? new DateObject().subtract(18, "years"): new DateObject().add(1, "days") } );
      }
    }, [calendarDate]);

    useEffect(() => {
      if (format === "MM/YYYY") {
        setProps({
          currentDate: getCurrentDate(),
        });
        setValue(null);
        setCalendarDate("");
        setShowCalendar(false);
        setInputValue("");
      } else {
        if(value) {
          let date: DateObject | undefined;
          if(isOn) {
              date = new DateObject({
                date: new Date(convertDateYmd(value as string, false, isOn)), 
                calendar: isOn ? arabic: undefined,
                locale: isOn ? arabicEn: undefined,
            });
          } else if (showSwitch === true) {
            date = new DateObject({
              date: (convertDateYmd(value as string, false, isOn)),
              calendar: arabic,
            });

            date.subtract(1, "days");
            date.convert(undefined, undefined);
          } else {
            date = new DateObject({
              date: (convertDateYmd(value as string)),
            });
          }
            setValue(date.format(format));
            setCalendarDate(date);
            setShowCalendar(false);
            setInputValue(date.format(format) as string);
        }
      }
    }, [isOn, format]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          calendarRef.current &&
          !calendarRef.current?.contains(event.target as Node)
        ) {
          setShowCalendar(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    useEffect(() => {
      if(!isInputChanged && value) {
        setInputValue(value as string);
        setCalendarDate(new DateObject({
          date: new Date(convertDateYmd(value as string, false, isOn)),
          calendar: isOn ? arabic : undefined,
          locale: isOn ? arabicEn : undefined,
        }));
      }
    }, [value, isInputChanged]);

    return (
      <>
        <div
          className={`d-flex calendar-switch-consumer ${
            !isModal ? "" : "is-position-relative"
          } ${className ? className : "pt-1"}`}
        >
          {isCalendarIcon && (
            <span
              className="d-flex align-items-center cursor-pointer calendar-icon"
              role="button"
              tabIndex={0}
              onClick={() => !disabled && setShowCalendar((val) => !val)}
            >
              <CalendarMonthOutlinedIcon className={iconClassName || ""} />
            </span>
          )}
          <input
            className={`w-100 register-input ${
              errorMessage ? "error-class" : ""
            } ${inputClassName ? inputClassName : ""}`}
            type="text"
            disabled={disabled}
            onChange={(e) => {
              setIsInputChanged(true);
              let raw = e.target.value;
              const digitsOnly = raw.replace(/\D/g, "");
              if (format === "MM/YYYY") {
                // Auto-slash logic
                if (digitsOnly.length === 2 && !raw.includes("/")) {
                  raw = digitsOnly + "/";
                } else if (digitsOnly.length > 2) {
                  raw = digitsOnly.slice(0, 2) + "/" + digitsOnly.slice(2, 6);
                } else {
                  raw = digitsOnly;
                }

                // if deleting back to 2 digits, ensure no lingering slash
                if (raw.length === 3 && raw[2] !== "/") {
                  raw = raw.slice(0, 2);
                }
              } else {
                if (digitsOnly.length <= 2) {
                  raw = digitsOnly.length === 2  && !raw.includes("/") ? digitsOnly + "/" : digitsOnly;
                } else if (digitsOnly.length <= 4) {
                  const dateVal = digitsOnly.slice(0, 2) + "/" + digitsOnly.slice(2);
                  raw = digitsOnly.length === 2  && raw.lastIndexOf("/") === 5 ? dateVal + "/" : dateVal;
                } else if (digitsOnly.length <= 8) {
                  raw =
                    digitsOnly.slice(0, 2) +
                    "/" +
                    digitsOnly.slice(2, 4) +
                    "/" +
                    digitsOnly.slice(4);
                } else {
                  
                  raw =
                    digitsOnly.slice(0, 2) +
                    "/" +
                    digitsOnly.slice(2, 4) +
                    "/" +
                    digitsOnly.slice(4, 8);
                }
                // if deleting back to 2 digits, ensure no lingering slash
                if ((raw.length === 3 && raw[2] !== "/")) {
                  raw = raw.slice(0, 2);
                } else if (raw.length === 6 && raw[5] !== "/") {
                  raw = raw.slice(0, 5);
                }
              }
              
                         
              setInputValue(raw);
            }}
            onBlur={() => {
              // isValidDate(e, isOn, minDate, maxDate)
              setValue(inputValue);
              if(inputValue && inputValue.length ===7 || inputValue.length === 10) {
                const dataVal = inputValue.length === 7 ?  "01/"+inputValue : inputValue;
                setCalendarDate(new DateObject({
                  date: (convertDateYmd(dataVal, false)),
                  calendar: isOn ? arabic: undefined,
                  locale: isOn ? arabicEn: undefined,
                }));
              }  
            }}
            value={inputValue as string}
            required
            maxLength={format === "MM/YYYY" ? 7 : 10}
            pattern="^(0[1-9]|1[0-2])\/\\d{4}$"
            placeholder={format}
            onKeyDown={(e) => {
              if (e.key === "/") {
                e.preventDefault();
              }
            }}
          />
          {showCalendar && (
            <Calendar
              ref={calendarRef}
              {...props}
              {...customProps}
              maxDate={
                maxDate
                  ? new DateObject({
                      date: new Date(convertDateYmd(maxDate, false, isOn)),
                      calendar: isOn ? arabic: undefined,
                      locale: isOn ? arabicEn: undefined,
                    }).format(format)
                  : maxDate
              }
              minDate={
                minDate
                  ? new DateObject({
                      date: new Date(convertDateYmd(minDate, false, isOn)),
                      calendar: isOn ? arabic: undefined,
                      locale: isOn ? arabicEn: undefined,
                    }).format(format)
                  : minDate
              }
              onChange={(e) => {
                if (e) {
                  setIsInputChanged(true);
                  const dayNumber = e.day > 9 ? e.day : "0" + e.day;
                  const month =
                    e.month.number > 9 ? e.month.number : "0" + e.month.number;
                  const dateValue =
                    format === "MM/YYYY"
                      ? `${month}/${e.year}`
                      : `${dayNumber}/${month}/${e.year}`;
                  setInputValue(dateValue);
                  setValue(dateValue);
                  setCalendarDate(e);
                  setShowCalendar(false);
                  setErrorMessage && setErrorMessage("");
                }
              }}
              format={format}
              calendar={isOn ? arabic : undefined}
              locale={isOn ? arabicEn : undefined}
              onlyMonthPicker={isonlyMonthPickerEnable}
              months={getMonth(!!isOn)}
              digits={["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]}
            />
          )}
          {showSwitch && (
            <div className="switchContainer d-flex align-items-center">
              <SwitchButton
                isOn={!!isOn}
                handleToggle={() => handleToggle(!!isOn)}
              />
              {switchLabel && (
                <span
                  className={`${
                    isOn ? "label" : "disabled-label"
                  } walaa-regular-400`}
                >
                  {switchLabel}
                </span>
              )}
            </div>
          )}
        </div>
        {errorMessage && <span className="validationText">{errorMessage}&nbsp;</span>}
      </>
    );
  }
);
