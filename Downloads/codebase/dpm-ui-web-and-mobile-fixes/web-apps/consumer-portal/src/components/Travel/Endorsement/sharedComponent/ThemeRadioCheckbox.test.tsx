import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ThemeRadioCheckbox from "./ThemeRadioCheckbox";

describe("ThemeRadioCheckbox component", () => {
    test("renders with given label and type radio", () => {
        render(
          <ThemeRadioCheckbox
            label="Option 1"
            type="radio"
            defaultChecked={false}
            classes="test-class"
            name="testGroup"
          />
        );
      
        const radios = screen.getAllByRole("radio");
        const input = radios.find((r) => r.getAttribute("value") === "Option 1");
        expect(input).toBeDefined();
        if (!input) throw new Error("Input not found");
      
        // Check input attributes
        expect(input).toHaveAttribute("type", "radio");
        expect(input).not.toBeChecked();
        expect(input).toHaveAttribute("name", "testGroup");
      
        // Check that the closest container has your custom class
        expect(input.closest(".test-class")).toBeInTheDocument();
      });

  test("renders with type checkbox and defaultChecked true", () => {
    render(
      <ThemeRadioCheckbox
        label="Check me"
        type="checkbox"
        defaultChecked={true}
        classes="checkbox-class"
      />
    );

    const checkboxes = screen.getAllByRole("checkbox");
    const input = checkboxes.find((c) => c.getAttribute("value") === "Check me");

    expect(input).toBeDefined();
    if (!input) throw new Error("Input not found");

    expect(input).toBeChecked();
    expect(input).toHaveAttribute("name", "group1"); // default name
  });

  test("calls onChangehandler when changed (switch case)", () => {
    const onChangeMock = jest.fn();

    render(
      <ThemeRadioCheckbox
        label="Switch me"
        type="switch"
        defaultChecked={false}
        classes="switch-class"
        onChangehandler={onChangeMock}
        name="switchGroup"
      />
    );

    // For switches, the input type is checkbox actually
    const checkboxes = screen.getAllByRole("checkbox");
    const input = checkboxes.find((c) => c.getAttribute("value") === "Switch me");

    expect(input).toBeDefined();
    if (!input) throw new Error("Input not found");

    fireEvent.click(input);

    expect(onChangeMock).toHaveBeenCalledTimes(1);
  });
});
