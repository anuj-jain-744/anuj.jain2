import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TermsAndConditionsModal from "./index";

describe("TermsAndConditionsModal", () => {
  let handleStateMock: jest.Mock;

  beforeEach(() => {
    handleStateMock = jest.fn();
  });

  it("renders checkbox and terms link", () => {
    render(<TermsAndConditionsModal handleState={handleStateMock} isTCAccepted={false} />);

    expect(screen.getByRole("checkbox")).toBeInTheDocument();
    expect(screen.getByText(/terms/i)).toBeInTheDocument();
  });

  it("opens the modal when terms text is clicked", () => {
    render(<TermsAndConditionsModal handleState={handleStateMock} isTCAccepted={false} />);

    fireEvent.click(screen.getByText(/terms/i));
    expect(screen.getByText("Terms and Conditions")).toBeInTheDocument();
  });

  it("closes modal on Cancel", () => {
    render(<TermsAndConditionsModal handleState={handleStateMock} isTCAccepted={false} />);
    fireEvent.click(screen.getByText(/terms/i));

    const cancelBtn = screen.getByText(/close/i);
    fireEvent.click(cancelBtn);

    expect(handleStateMock).toHaveBeenCalledWith(false);
  });

  it("accepts terms and sets checkbox", () => {
    render(<TermsAndConditionsModal handleState={handleStateMock} isTCAccepted={false} />);
    fireEvent.click(screen.getByText(/terms/i));

    const acceptBtn = screen.getByText(/accept/i);
    fireEvent.click(acceptBtn);

    expect(handleStateMock).toHaveBeenCalledWith(true);
  });


  it("toggles checkbox when modal is opened with isTCAccepted", () => {
    render(<TermsAndConditionsModal handleState={handleStateMock} isTCAccepted={true} />);

    fireEvent.click(screen.getByText(/terms/i));
    expect(handleStateMock).toHaveBeenCalled();
  });
});
