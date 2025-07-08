import DatePicker from "react-multi-date-picker";
import arabic from "react-date-object/calendars/arabic";
import arabic_en from "react-date-object/locales/arabic_en";
//import InputIcon from "react-multi-date-picker/components/input_icon"
import DateObject from "react-date-object";

type IDatePickerType = {
  name: string;
  placeholder: string;
  onChangehandler?: (date: DateObject | null, options: { validatedValue: string | string[]; input: HTMLElement; isTyping: boolean; }) => void | false;
  value?: Date;
  format?: string;
  calendarType?: string;
  errorValue?: string;
};

export const ThemeDatePicker:React.FC<IDatePickerType> = ({
  name,
  placeholder,
  onChangehandler,
  value,
  format,
  calendarType,
  errorValue
}) => {
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
          //render={<InputIcon />}
        />
      <div className="validationText">{errorValue}&nbsp;</div>
    </div>
  )
}

