import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TermsAndConditionsModal from "./index";

jest.mock("../sharedComponent/ThemeButton", () => (props) => (
  <button onClick={props.onClickhandler}>{props.title}</button>
));

jest.mock("./mock.json", () => ({
  agree: "I agree to the terms and conditions.",
  "terms&conditions": "View Terms & Conditions",
  "dialog-heading": "Terms and Conditions",
  "head-one": "Heading 1",
  "content-one": "Content for heading 1.",
  "head-two": "Heading 2",
  "content-two": "Content for heading 2.",
  close: "Close",
  accept: "Accept",
}));

describe("TermsAndConditionsModal", () => {
  let handleStateMock: jest.Mock;

  beforeEach(() => {
    handleStateMock = jest.fn();
  });

  test("renders without crashing", () => {
    render(<TermsAndConditionsModal handleState={handleStateMock} />);
    expect(
      screen.getByText("I agree to the terms and conditions.")
    ).toBeInTheDocument();
  });

  test("opens modal on click of terms and conditions", () => {
    render(<TermsAndConditionsModal handleState={handleStateMock} />);
    fireEvent.click(screen.getByText("View Terms & Conditions"));
    expect(screen.getByText("Terms and Conditions")).toBeVisible();
  });

  test("closes modal on close button click", () => {
    render(<TermsAndConditionsModal handleState={handleStateMock} />);
    fireEvent.click(screen.getByText("View Terms & Conditions"));
    fireEvent.click(screen.getByText("Close"));
    expect(screen.queryByText("Terms and Conditions")).toBeVisible();
  });

  test("handles check and uncheck of terms and conditions", () => {
    render(<TermsAndConditionsModal handleState={handleStateMock} />);

    expect(screen.getByRole("checkbox")).not.toBeChecked();

    fireEvent.click(screen.getByRole("checkbox"));
    expect(screen.getByRole("checkbox")).toBeChecked();
    expect(handleStateMock).toHaveBeenCalledTimes(0);
  });

  test("clicking accept button closes the modal", () => {
    render(<TermsAndConditionsModal handleState={handleStateMock} />);
    fireEvent.click(screen.getByText("View Terms & Conditions"));
    fireEvent.click(screen.getByText("Accept"));
    expect(screen.queryByText("Terms and Conditions")).toBeVisible();
  });
});
