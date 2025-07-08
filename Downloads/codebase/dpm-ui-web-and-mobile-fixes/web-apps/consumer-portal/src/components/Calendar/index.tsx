import { memo, useEffect, useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import type { Value } from "react-multi-date-picker";
import arabic from "react-date-object/calendars/arabic";
import arabic_ar from "react-date-object/locales/arabic_ar";

import "./index.scss";
import SwitchButton from "components/SwitchButton";
import calendarData from "./calendar.json";
import InputIcon from "react-multi-date-picker/components/input_icon"

interface SharedCalendarProps {
  value: Value | null | undefined;
  setValue?: (value: Value | null) => void;
  format?: string;
  placeHolder?: string;
  showSwitch?: boolean;
  switchLabel?: boolean;
  isOn?: boolean;
  isonlyMonthPickerEnable?: boolean;
  minDate?: DateObject | Value;
  maxDate?: DateObject | Value;
  setIsOn?: (val: boolean) => void;
  isCalendarIcon?: boolean;
  onOpenPickNewDate?: boolean;
  disabled?: boolean;
}

interface DateProps {
  currentDate?: DateObject,
  value?: Value | null,
}

export const SharedCalendar: React.FC<SharedCalendarProps> = memo(
  ({
    value,
    setValue,
    format,
    placeHolder = "",
    showSwitch = true,
    switchLabel,
    isOn,
    setIsOn,
    isonlyMonthPickerEnable,
    minDate,
    maxDate,
    isCalendarIcon,
    onOpenPickNewDate = false,
    disabled = false,
  }) => {
    const [props, setProps] = useState<DateProps>({
      currentDate: minDate || new DateObject().subtract(18, "years")
    });

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

    const getCurrentDate = () => {
      const currentDate = new DateObject().subtract(18, "years");
      if(maxDate && minDate) {
        return minDate > maxDate ? maxDate: minDate;
      }
      return currentDate;
    }
    const handleToggle = (val: boolean) => {
      setIsOn && setIsOn(!val)
    }
    useEffect(() => {
      if (value)
        setProps({
          value: value,
        })
    }, [value]);

    useEffect(() => {
      setProps({
        currentDate: getCurrentDate(),
      });
      setValue && setValue(null);
    }, [isOn]);

    const formatDate = (date: DateObject | null, format: string) => {
      if (!date) return "";
      return date.format(format);
    };
    return (
      <div className="d-flex calendar-switch">
        <DatePicker
          {...props}
          onChange={(e) => {
            if (e && setValue)
              setValue(e)
          }}
          editable={true}
          disabled={disabled}
          format={format}
          calendar={isOn ? arabic : undefined}
          locale={isOn ? arabic_ar : undefined}
          minDate={maxDate || new DateObject().subtract(100, "years")}
          maxDate={maxDate || new DateObject().subtract(18, "years")}
          onlyMonthPicker={!isonlyMonthPickerEnable}
          months={
            isOn
              ? arabiCMonth
              : [
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
                ]
          }
          digits={calendarData.digits}
          placeholder	= {placeHolder}
          onOpenPickNewDate={onOpenPickNewDate}
          render={
            isCalendarIcon ? (
              <InputIcon className={`calendar-icontoggle ${isOn ? "calendar-icon-right" : ""}`} />
            ) : (
              <input type="text" className="w-100 date-picker-icon" placeholder={placeHolder} value={value ? formatDate(new DateObject(value), format || "MM/YYYY") : ""} />
            )
          }
        />
        {showSwitch && isOn !== undefined && (
          <div className="switchContainer d-flex align-items-center">
            <SwitchButton
              isOn={isOn}
              handleToggle={() => handleToggle(isOn)}
            />
            {switchLabel && <span className={`${isOn ? "label" : "disabled-label"} walaa-regular-400`}>{switchLabel}</span>}
          </div>
        )}
      </div>
    );
  });
