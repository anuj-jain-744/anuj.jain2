import { memo, useEffect, useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import type { Value } from "react-multi-date-picker";
import arabic from "react-date-object/calendars/arabic";
import arabic_ar from "react-date-object/locales/arabic_ar";

import "./index.scss";
import SwitchButton from "components/SwitchButton";

interface SharedCalendarProps {
  value: Value | null;
  setValue: (value: Value) => void;
  format?: string;
  showSwitch?: boolean;
  switchLabel?: string;
  isOn: boolean;
  setIsOn: (val: boolean) => void;
  monthlyPicker?: boolean;
  maxDate?: boolean;
  name?: string;
  errorClass?: string;
}

interface DateProps {
  currentDate?: DateObject;
  value?: Value | null;
}

export const SharedCalendar: React.FC<SharedCalendarProps> = memo(
  ({
    value,
    setValue,
    format,
    showSwitch = true,
    switchLabel,
    isOn,
    setIsOn,
    monthlyPicker = true,
    maxDate = true,
    name = "",
    errorClass,
  }) => {
    const [props, setProps] = useState<DateProps>({
      currentDate: new DateObject().subtract(18, "years"),
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
      setIsOn(!val);
    };

    useEffect(() => {
      if (value)
        setProps({
          value: value,
        });
      if (value === "") {
        setProps({
          currentDate: new DateObject().subtract(18, "years"),
        });
      }
    }, [value]);

    useEffect(() => {
      setProps({
        currentDate: new DateObject().subtract(18, "years"),
      });
      setValue(null);
    }, [isOn]);

    return (
      <div className={`d-flex calendar-switch ${errorClass}`}>
        <DatePicker
          {...props}
          onChange={(e) => {
            if (e) setValue(e);
          }}
          editable={true}
          format={format}
          calendar={isOn ? arabic : undefined}
          locale={isOn ? arabic_ar : undefined}
          maxDate={maxDate ? new DateObject().subtract(18, "years") : ""}
          onlyMonthPicker={monthlyPicker}
          name={name}
          onOpenPickNewDate={false}
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
          digits={["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]}
        />
        {showSwitch && (
          <div className="d-flex align-items-center p-3">
            <SwitchButton
              isOn={isOn}
              handleToggle={() => {
                handleToggle(isOn);
                setValue("");
              }}
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
    );
  }
);
