type ITextboxType = {
  type: "text" | "number" | "password" | "tel";
  title?: string;
  name: string;
  placeholder: string;
  onChangehandler?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlurhandler?: (event: React.FocusEvent<HTMLInputElement>) => void;
  value?: string;
  maxLengthIs?: number;
  errorValue?: string;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  dataTestId?: string | undefined;
};

function ThemeTextbox({
  type,
  title,
  name,
  placeholder,
  onChangehandler,
  onBlurhandler,
  value,
  maxLengthIs,
  errorValue,
  onKeyDown,
  dataTestId
}: ITextboxType) {
  return (
    <div className="pt-2">
      <input
        data-testid={dataTestId}
        type={type}
        placeholder={placeholder}
        className="w-100 register-input"
        name={name}
        onChange={onChangehandler}
        value={value}
        maxLength={maxLengthIs}
        onBlur={onBlurhandler}
        onKeyDown={onKeyDown}
      />
      <div className="validationText">{errorValue}&nbsp;</div>
    </div>
  );
}

export default ThemeTextbox;
