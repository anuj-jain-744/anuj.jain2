type ITextboxType = {
  type: "text" | "number" | "password" | "tel";
  name: string;
  placeholder: string;
  onChangehandler?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlurhandler?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  value?: string;
  maxLengthIs?: number;
  errorValue?: string;
};

function ThemeTextbox({
  type,
  name,
  placeholder,
  onChangehandler,
  onBlurhandler,
  onKeyDown,
  onFocus,
  value,
  maxLengthIs,
  errorValue,
}: ITextboxType) {
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
        onKeyDown={onKeyDown}
        onFocus={onFocus}
      />
      <div className="validationText">{errorValue}&nbsp;</div>
    </div>
  );
}

export default ThemeTextbox;
