import Form from "react-bootstrap/Form";

type ITextareaType = {
  placeholder: string;
  classes?: string;
  onChangehandler?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function ThemeTextarea({
  placeholder,
  classes,
  onChangehandler,
}: ITextareaType) {
  return (
    <div className="pt-2">
      <Form.Control
        as="textarea"
        placeholder={placeholder}
        className={classes}
        onChange={onChangehandler}
      />
    </div>
  );
}

export default ThemeTextarea;
