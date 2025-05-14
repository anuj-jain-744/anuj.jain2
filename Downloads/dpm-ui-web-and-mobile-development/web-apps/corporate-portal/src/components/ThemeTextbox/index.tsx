type ITextboxType = {
  type: "text" | "number" | "password" | "tel";
  title?: string;
  name: string;
  placeholder: string;
  onChangehandler?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlurhandler?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDownHandler?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  value?: string;
  maxLengthIs?: number;
  errorValue?: string;
};

export const ThemeTextbox:React.FC<ITextboxType> = ({
  type,
  title,
  name,
  placeholder,
  onChangehandler,
  onBlurhandler,
  onKeyDownHandler,
  value,
  maxLengthIs,
  errorValue
}) => {
  return (
    <div className="pt-2">
      <input
        type={type}
        placeholder={placeholder}
        className="w-100 register-input"
        name={name}
        onChange={onChangehandler}
        value={value}
        maxLength={maxLengthIs}
        onBlur={onBlurhandler}
        onKeyDown={onKeyDownHandler}
      />
      <div className="validationText">{errorValue}&nbsp;</div>
    </div>
  )
}
