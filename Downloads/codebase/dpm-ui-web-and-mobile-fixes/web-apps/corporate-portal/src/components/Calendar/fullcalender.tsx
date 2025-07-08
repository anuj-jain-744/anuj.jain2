import { memo, useEffect, useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import type { Value } from "react-multi-date-picker";
import arabic from "react-date-object/calendars/arabic";
import arabic_ar from "react-date-object/locales/arabic_ar";
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import "./index.scss";
import SwitchButton from "components/SwitchButton";

 interface FullCalenderProps {
  value: Value | null;
  setValue: (value: Value) => void;
  format?: string;
  showSwitch?: boolean;
  switchLabel?: string;
  isOn: boolean;
  setIsOn: (val: boolean) => void;
  placeholder?: string;
  minDate?: boolean;
}

interface DateProps {
  currentDate?: DateObject,
  value?: Value | null,
}

export const FullCalender: React.FC<FullCalenderProps> = memo(
  ({
    value,
    setValue,
    format = "DD/MM/YYYY",
    showSwitch = true,
    switchLabel,
    isOn,
    setIsOn,
    placeholder,
    minDate = true,
  }) => {
    const [props, setProps] = useState<DateProps>({
      currentDate: new DateObject().subtract(18, "years")
    });

    const handleToggle = (val: boolean) => {
      setIsOn(!val)
    };

    useEffect(() => {
      if (value)
        setProps({
          value: value,
        })
    }, [value]);

    const formattedCurrentDate = new DateObject().format("DD/MM/YYYY");

    return (
      <div className="d-flex calendar-switch">
        <DatePicker 
         {...props}
         onChange={(e) => {
           if (e)
             setValue(e)
         }}
         editable={false}
         format={format}
         calendar={isOn ? arabic : undefined}
         locale={isOn ? arabic_ar : undefined}
         minDate={minDate ? new DateObject() : ""} 
         maxDate={new DateObject().add(180, "days")}
         onOpenPickNewDate={true}
         months={isOn ? [] : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]}
         digits={["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]}
         render={(value, openCalendar) => (
          <div className="date-picker-input">
              <input
                value={value}
                readOnly
                onClick={openCalendar}
                placeholder={placeholder ?? formattedCurrentDate}
              />
              <CalendarMonthOutlinedIcon className="calendar-icon" />
            </div>
        )}
       />
        {showSwitch && (
          <div className="d-flex align-items-center">
            <SwitchButton
              isOn={isOn}
              handleToggle={() => {
                handleToggle(isOn);
                setValue("");
              }}
            />
            {switchLabel && <span className={`${isOn ? "label" : "disabled-label"} walaa-regular-400`}>{switchLabel}</span>}
          </div>
        )}
      </div>
    );
  });