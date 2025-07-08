import { memo, useEffect, useRef, useState } from "react";
import { DateObject, Calendar } from "react-multi-date-picker";
import type { Value } from "react-multi-date-picker";
import arabic from "react-date-object/calendars/arabic";
import arabicEn from "react-date-object/locales/arabic_en";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { useCommonContext } from "@dpm/shared-module";
import "./index.scss";
import SwitchButton from "components/SwitchButton";
import { arabicMonthinEnglish } from "@app-shell/utils/common";

interface SharedCalendarProps {
  value: Value | null;
  setValue: (value: Value) => void;
  format?: string;
  showSwitch?: boolean;
  switchLabel?: string;
  isOn: boolean;
  setIsOn: (val: boolean) => void;
  monthlyPicker?: boolean;
  maxDate?: string; //DD/MM/YYYY
  minDate?: string; //DD/MM/YYYY
  name?: string;
  errorClass?: string;
  errorMessage: string;
  onFieldChange: (name: string, value: string, required?: boolean) => void;
  arabicPlaceholder?: string;
  isArabic?: boolean;
}

interface DateProps {
  currentDate?: DateObject;
  value?: Value | null;
}

export const SharedCalendar: React.FC<SharedCalendarProps> = memo(
  ({
    value,
    setValue,
    format = "MM/YYYY",
    showSwitch = true,
    switchLabel,
    isOn,
    setIsOn,
    monthlyPicker = true,
    maxDate,
    minDate,
    name = "",
    errorClass,
    onFieldChange,
    errorMessage,
    arabicPlaceholder,
    isArabic,
  }) => {
    const [showCalendar, setShowCalendar] = useState<boolean>(false);
    const [calendarDate, setCalendarDate] = useState<Value>("");
    const { currentLanguage } = useCommonContext();

    const calendarRef = useRef<HTMLDivElement | null>(null);

    const [props, setProps] = useState<DateProps>({
      currentDate: new DateObject().subtract(18, "years"),
    });

    const convertDateYmd = (date: string, flag: boolean = true): string => {
      const [day, month, year] = date.split("/"); // Split the date into day, month, and year
      return format === "MM/YYYY" && flag ? `${month}/${day}` : `${year}/${month}/${day}`;
    };

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


    const handleToggle = (val: boolean) => {
      setIsOn(!val);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      let raw = e.target.value;
      // Auto-slash logic
      if (e.key !== "Backspace") {
        if (raw.length === 2 && !raw.includes("/")) {
          raw = raw + "/";
        } else if (raw.length > 2 && !raw.includes("/")) {
          raw = raw.slice(0, 2) + "/" + raw.slice(2, 6);
        }
      }

      if (raw.length === 7 || raw.length === 10) {
        const dataVal = raw.length === 7 ? "01/" + raw : raw;
        setCalendarDate(new DateObject({
          date: (convertDateYmd(dataVal, false)),
          calendar: isOn ? arabic : undefined,
          locale: isOn ? arabicEn : undefined,
        }));
      } else {
        setCalendarDate("");
      }
      setValue(raw);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/-/g, '/');
      const regex = /^[^\D][/\d]*$/;
      if (raw && !regex.test(raw)) {
        e.preventDefault();
        return;
      }
      if ((raw.length >= 4 || raw.length === 2) && raw[raw.length - 1] === '/') {
        e.preventDefault();
        return;
      }
      setValue(raw);
    };

    const handleFocus = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/-/g, '/');
      const regex = /^[^\D][/\d]*$/;
      if (raw && !regex.test(raw)) {
        e.preventDefault();
        return;
      }
      if ((raw.length >= 4 || raw.length === 2) && raw[raw.length - 1] === '/') {
        e.preventDefault();
        return;
      }
      setValue(raw);
    };

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
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
          ];
        }
      }
    }

    useEffect(() => {
      if (calendarDate) {
        setProps({ value: calendarDate });
      } else {
        setProps({ currentDate: new DateObject().subtract(18, "years") });
      }
    }, [calendarDate]);

    useEffect(() => {
      setProps({ currentDate: new DateObject().subtract(18, "years") });
      setValue(null);
    }, [isOn]);

    useEffect(() => {
      if (onFieldChange) {
        onFieldChange(name, value as string, true);
      }
    }, [value]);

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

    return (
      <>
        <div className={`d-flex calendar-switch ${errorClass}`}>
          <span className="d-flex align-items-center cursor-pointer" onClick={() => setShowCalendar(val => !val)} role="button" tabIndex={0} onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              setShowCalendar(val => !val);
            }
          }}>
            <CalendarMonthOutlinedIcon />
          </span>
          <div className="calendar-input-group">
            <input
              className={`data-filled`}
              type="text"
              onChange={handleChange}
              onKeyUp={handleKeyDown}
              onFocus={handleFocus}
              name={name}
              autoComplete="off"
              value={value as string | number}
              required
              maxLength={7}
              pattern="^(0[1-9]|1[0-2])\/\\d{4}$"
              placeholder={isArabic ? arabicPlaceholder : "DOB (MM/YYYY)"}
            />
            {errorMessage && (
              <div className="validation-error">{errorMessage}</div>
            )}
          </div>
          {showCalendar && (
            <Calendar
              ref={calendarRef}
              {...props}
              onChange={(e) => {
                if (e) {
                  const month = e.month.number > 9 ? e.month.number : "0" + e.month.number;
                  setValue(`${month}/${e.year}`);
                  setCalendarDate(e);
                  setShowCalendar(false);
                }
              }}
              format={format}
              calendar={isOn ? arabic : undefined}
              locale={isOn ? arabicEn : undefined}
              maxDate={
                maxDate
                  ? new DateObject({
                    date: new Date(convertDateYmd(maxDate, false)),
                    calendar: isOn ? arabic : undefined,
                    locale: isOn ? arabicEn : undefined,
                  }).format(format)
                  : undefined
              }
              minDate={
                minDate
                  ? new DateObject({
                    date: new Date(convertDateYmd(minDate, false)),
                    calendar: isOn ? arabic : undefined,
                    locale: isOn ? arabicEn : undefined,
                  }).format(format)
                  : undefined
              }
              onlyMonthPicker={monthlyPicker}
              months={getMonth(isOn)}
              digits={["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]}
            />
          )}
          {showSwitch && (
            <div className="d-flex align-items-center p-3 padding-right-0">
              <SwitchButton
                isOn={isOn}
                handleToggle={() => {
                  handleToggle(isOn);
                  setValue("");
                }}
              />
              {switchLabel && (
                <span className={`${isOn ? "label" : "disabled-label"} walaa-regular-400`}>
                  {switchLabel}
                </span>
              )}
            </div>
          )}
        </div>
      </>
    );
  }
);

