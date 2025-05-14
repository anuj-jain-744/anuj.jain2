import DatePicker from "react-multi-date-picker";
import type { Value } from "react-multi-date-picker";
import arabic from "react-date-object/calendars/arabic";
import arabic_en from "react-date-object/locales/arabic_en";
import InputIcon from "react-multi-date-picker/components/input_icon"

type IDatePickerType = {
  name: string;
  placeholder: string;
  onChangehandler?: any;
  value?: Date;
  format?: string;
  calendarType?: string;
  onlyMonthPicker?: boolean;
  errorValue?: string;
};

function ThemeDatePicker({
  name,
  placeholder,
  onChangehandler,
  value,
  format,
  calendarType,
  onlyMonthPicker=false,
  errorValue
}: IDatePickerType) {
  return (
    <div className="pt-2">
      <DatePicker
          name={name}
          placeholder={placeholder}
          onChange={(date, options) => onChangehandler && onChangehandler(date, options)}
          value={value}
          format={format}
          calendar={calendarType === "Hijri" ? arabic : undefined}
          locale={calendarType === "Hijri" ? arabic_en : undefined}
          calendarPosition="bottom-center"
          render={<InputIcon />}
          onlyMonthPicker={onlyMonthPicker}
        />
      <div className="validationText">{errorValue}&nbsp;</div>
    </div>
  );
  //className="w-100 register-input"
}

export default ThemeDatePicker;
