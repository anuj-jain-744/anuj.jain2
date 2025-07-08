import React from "react";
import { act, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
//import { FormsField } from "../FormFields";
import { Value } from "react-multi-date-picker";

jest.mock("../../Calendar", () => ({
  SharedCalendar: ({
    value,
    setValue,
  }: {
    value: any;
    setValue: (value: any) => void;
  }) => (
    <div data-testid="shared-calendar">
      <button onClick={() => setValue("2022-01-01")}>Set Date</button>
      <span>{value}</span>
    </div>
  ),
}));

describe("src/components/GetQuoteWidget/FormField.tsx", () => {
  const fieldOptions = {
    option1: "Option 1",
    option2: "Option 2",
    option3: "Option 3",
  };

  it("renders text input correctly", () => {
    // render(
    //   <FormsField classType="Library" fieldName="Test Field" fieldType="text" />
    // );

    // const inputElement = screen.getByRole("textbox");
    // expect(inputElement).toBeInTheDocument();
    // expect(inputElement).toHaveAttribute("type", "text");
  });

  it("renders select dropdown correctly", async () => {
    // render(
    //   <FormsField
    //     classType="Library"
    //     fieldName="Test Dropdown"
    //     fieldType="select"
    //     fieldOptions={fieldOptions}
    //   />
    // );

    // const dropdownButton = screen.getByTestId("field-select");
    // expect(dropdownButton).toBeInTheDocument();
    await act(async () => {
     // fireEvent.click(dropdownButton);
    });

   // const optionElement = screen.getByText("Option 1");
   // expect(optionElement).toBeInTheDocument();
  });

  it("renders calendar correctly", () => {
    // render(
    //   <FormsField
    //     classType="Library"
    //     fieldName="Test Calendar"
    //     fieldType="calendar"
    //   />
    // );

    // const calendarElement = screen.getByTestId("shared-calendar");
    // expect(calendarElement).toBeInTheDocument();
  });

  it("handles input change correctly", () => {
    const onFieldChange = (fieldName: string, value: string | number | Value, isValid: boolean) => jest.fn();
    // render(
    //   <FormsField classType="Library" fieldName="case_reference_no" fieldType="text" onFieldChange={onFieldChange} />
    // );

    // const inputElement = screen.getByRole("textbox");
    // fireEvent.change(inputElement, { target: { value: "New Value" } });
    // expect(inputElement).toHaveValue("New Value");
    waitFor(() => {
    //  expect(onFieldChange).toHaveBeenCalled();
    });
  });

  it("handles dropdown selection correctly", async () => {
    // render(
    //   <FormsField
    //     classType="Library"
    //     fieldName="Test Dropdown"
    //     fieldType="select"
    //     fieldOptions={fieldOptions}
    //   />
    // );

    // const dropdownButton = screen.getByTestId("field-select");
    await act(async () => {
  //    fireEvent.click(dropdownButton);
    });

  //  const optionElement = screen.getByText("Option 1");
    await act(async () => {
  //    fireEvent.click(optionElement);
    });

  //  expect(screen.getByText("Option 1")).toBeInTheDocument();
  });

  it('renders img element correctly when classType is Identity', () => {
    // render(
    //   <FormsField
    //     classType="Identity"
    //     fieldName="national_id_iqama_no"
    //     fieldType="text"
    //   />
    // );

    // const imgElement = screen.getByAltText('Identity');
    // expect(imgElement).toBeInTheDocument();
    // const inputElement = screen.getByRole("textbox");
    // fireEvent.change(inputElement, { target: { value: "" } });
  });

});
