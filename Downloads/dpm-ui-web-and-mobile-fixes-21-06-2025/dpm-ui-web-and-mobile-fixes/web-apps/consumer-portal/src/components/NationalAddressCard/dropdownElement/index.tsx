import React from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface FloorForm {
  floors_options: string[];
}

interface DropdownElementProps {
  floor_form: FloorForm;
  handleDropdownSelect: (option: string) => void;
  selectedElement: string;
}

export const DropdownElement: React.FC<DropdownElementProps> = ({
  floor_form,
  handleDropdownSelect,
  selectedElement,
}) => {
  return (
    <DropdownButton
      title={
        <div className="dropdown-title d-flex">
          {selectedElement}
          <ExpandMoreIcon />
        </div>
      }
    >
      {floor_form?.floors_options.map((option, index) => (
        <Dropdown.Item
          key={index}
          onClick={() => handleDropdownSelect(option)}
          className={`${selectedElement === option ? "selected" : ""}`}
        >
          {option}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
};
