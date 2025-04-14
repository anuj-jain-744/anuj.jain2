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
  value: Value | null;
  setValue: (value: Value) => void;
  format?: string;
  placeHolder?: string;
  showSwitch?: boolean;
  switchLabel?: string;
  isOn: boolean;
  isonlyMonthPickerEnable?: boolean;
  minDate?: DateObject;
  maxDate?: DateObject;
  setIsOn: (val: boolean) => void;
  isCalendarIcon?: boolean;
  onOpenPickNewDate?: boolean;
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

    const handleToggle = (val: boolean) => {
      setIsOn(!val)
    }
    useEffect(() => {
      if (value)
        setProps({
          value: value,
        })
    }, [value]);

    useEffect(() => {
      setProps({
        currentDate: new DateObject().subtract(18, "years")
      });
      setValue(null);
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
            if (e)
              setValue(e)
          }}
          editable={true}
          format={format}
          calendar={isOn ? arabic : undefined}
          locale={isOn ? arabic_ar : undefined}
          minDate={minDate}
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
              <input type="text" className="w-100 date-picker-icon" placeholder={placeHolder} value={value ? formatDate(new DateObject(value), format) : ""} />
            )
          }
        />
        {showSwitch && (
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
