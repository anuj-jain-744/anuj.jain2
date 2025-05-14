import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CoverageItem from "../CoverageItem";
import Approve from "assets/QuoteAndBuy/Approve.svg";
import { commonKeywords } from "constant";

const mockTriggerViewBenefit = jest.fn();

describe("CoverageItem Component", () => {
  const mockItems = {
    type: "Coverage Type",
    child: "Child Value",
    type1: commonKeywords.yes,
    type2: "No",
    classname: "test-class",
  };

  test("renders CoverageItem correctly", () => {
    render(<CoverageItem items={mockItems} triggerViewBenefit={mockTriggerViewBenefit} />);

    expect(screen.getByText("Coverage Type")).toBeInTheDocument();
    expect(screen.getByAltText(commonKeywords.yes)).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
  });

  test("calls triggerViewBenefit on click when child exists", () => {
    render(<CoverageItem items={mockItems} triggerViewBenefit={mockTriggerViewBenefit} />);
    
    fireEvent.click(screen.getByText("Coverage Type"));
    expect(mockTriggerViewBenefit).toHaveBeenCalledWith("Coverage Type");
  });

  test("does not call triggerViewBenefit if no child", () => {
    const itemsWithoutChild = { ...mockItems, child: "" };
    render(<CoverageItem items={itemsWithoutChild} triggerViewBenefit={mockTriggerViewBenefit} />);

    fireEvent.click(screen.getByText("0"));
    expect(mockTriggerViewBenefit).not.toHaveBeenCalled();
  });
});