import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import BranchCard from "./index";

describe("BranchCard Component", () => {
  it("renders BranchCard with children", () => {
    render(
      <BranchCard>
        <div>Test Child</div>
      </BranchCard>
    );
    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });

  it("applies activeCard and theme classes", () => {
    render(
      <BranchCard activeCard={true} theme="custom-theme">
        <div>Test Child</div>
      </BranchCard>
    );
    const branchCard = screen.getByText("Test Child").parentElement;
    expect(branchCard).toHaveClass("active-card");
    expect(branchCard).toHaveClass("custom-theme");
  });

  it("renders CardText with text and className", () => {
    render(<BranchCard.Title title="Test Title" />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Title")).toHaveClass("branch-card-text-title");
  });

  it("renders ContactNo with phone number", () => {
    render(<BranchCard.ContactNo phone="123-456-7890" />);
    expect(screen.getByText("123-456-7890")).toBeInTheDocument();
  });

  it("renders Email with email address", () => {
    render(<BranchCard.Email email="test@example.com" />);
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("renders WorkingDay with working days", () => {
    render(<BranchCard.WorkingDay working_days="Monday - Friday" />);
    expect(screen.getByText("Monday - Friday")).toBeInTheDocument();
  });
});

describe("BranchCard.WorkingHour Component", () => {
  it("renders preset working hours", () => {
    const presetDayData = [{ day: "Monday", workingHour: "9:00 AM - 5:00 PM" }];
    const completeDaydata = [
      { day: "Monday", workingHour: "9:00 AM - 5:00 PM" },
      { day: "Tuesday", workingHour: "9:00 AM - 5:00 PM" },
    ];

    render(
      <BranchCard.WorkingHour
        presetDayData={presetDayData}
        completeDaydata={completeDaydata}
      />
    );

    expect(screen.getByTestId("working-hour-title")).toBeInTheDocument();
  });

  it("toggles to show complete working hours", () => {
    const presetDayData = [{ day: "Monday", workingHour: "9:00 AM - 5:00 PM" }];
    const completeDaydata = [
      { day: "Monday", workingHour: "9:00 AM - 5:00 PM" },
      { day: "Tuesday", workingHour: "9:00 AM - 5:00 PM" },
    ];

    render(
      <BranchCard.WorkingHour
        presetDayData={presetDayData}
        completeDaydata={completeDaydata}
      />
    );

    // Toggle expansion
    fireEvent.click(screen.getByTestId("working-hour-wrapper"));
  });
});