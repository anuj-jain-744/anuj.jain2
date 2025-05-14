import React from "react";
import Form from "react-bootstrap/Form";
type ISelectType = {
  name: string;
  onChangehandler?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
function ThemeSelect({ name, onChangehandler }: ISelectType) {
  return (
    <div className="pt-2">
      <Form.Select>
        <option>{name}</option>
        <option value="1">One</option>
        <option value="2">Two</option>
        <option value="3">Three</option>
      </Form.Select>
    </div>
  );
}

export default ThemeSelect;