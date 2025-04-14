import DatePicker from "react-multi-date-picker";
import type { Value } from "react-multi-date-picker";
import arabic from "react-date-object/calendars/arabic";
import arabic_en from "react-date-object/locales/arabic_en";
import InputIcon from "react-multi-date-picker/components/input_icon"

type IDatePickerType = {
  name: string;
  placeholder: string;
  onChangehandler?: (Date) => void;
  value?: Date;
  format?: string;
  calendarType?: string;
  errorValue?: string;
};

function ThemeDatePicker({
  name,
  placeholder,
  onChangehandler,
  value,
  format,
  calendarType,
  errorValue
}: IDatePickerType) {
  return (
    <div className="pt-2">
      {calendarType && calendarType == "Hijri" ? (
        <DatePicker
          name={name}
          placeholder={placeholder}
          onChange={onChangehandler}
          value={value}
          format={format}
          calendar={arabic}
          locale={arabic_en}
          calendarPosition="bottom-center"
          render={<InputIcon />}
        />
      ) : (
        <DatePicker
          name={name}
          placeholder={placeholder}
          onChange={onChangehandler}
          value={value}
          format={format}
          calendarPosition="bottom-center"
          render={<InputIcon />}
        />
      )}
      <div className="validationText">{errorValue}&nbsp;</div>
    </div>
  );
  //className="w-100 register-input"
}

export default ThemeDatePicker;
