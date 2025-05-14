import Form from "react-bootstrap/Form";

type ITextareaType = {
  placeholder: string;
  name?: string;
  classes?: string;
  value?: string;
  onChangehandler?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function ThemeTextarea({
  placeholder,
  classes,
  name,
  onChangehandler,
  value,
}: ITextareaType) {
  return (
    <div className="pt-2">
      <Form.Control
        as="textarea"
        value={value ?? ""}
        name={name}
        placeholder={placeholder}
        className={classes}
        onChange={onChangehandler}
      />
    </div>
  );
}

export default ThemeTextarea;
