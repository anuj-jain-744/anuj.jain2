import React from "react";
import { render, fireEvent } from "@testing-library/react";
import CoverageItem from "./CoverageItem";
import data from "./ViewBenefitModal.json";

jest.mock("assets/QuoteAndBuy/Cancel.svg", () => "cancel-icon.svg");
jest.mock("assets/QuoteAndBuy/Approve.svg", () => "approve-icon.svg");
jest.mock('@mui/icons-material/ExpandLess', () => jest.fn(() => <div>ExpandLessIcon</div>));
jest.mock('@mui/icons-material/ExpandMore', () => jest.fn(() => <div>ExpandMoreIcon</div>));


// Mock getAmountWithIcon
jest.mock('@app-shell/utils/common', () => ({
  getAmountWithIcon: jest.fn(amount => `SAR ${amount}`),
  getCurrencySymbol: jest.fn(() => 'SAR'),
  getCurrencySymbolForSR: jest.fn(() => 'SAR'),
}));
describe("CoverageItem", () => {
  const defaultProps = {
    items: {
      type: "Coverage Type",
      child: true,
      value: "Yes",
      isApproved: true,
      classname: "test-class",
    },
    accordians: "accordian1",
    openAccordion: ["Coverage Type"],
    triggerViewBenefit: jest.fn(),
    isHome: "home",
  };

  test("renders CoverageItem component", () => {
    const { getByText, getByAltText } = render(<CoverageItem {...defaultProps} />);
   // expect(getByText("Coverage Type")).toBeInTheDocument();
    expect(getByAltText(data.approved)).toBeInTheDocument();
    expect(getByAltText("Yes")).toBeInTheDocument();
  });

  // test("calls triggerViewBenefit when type is clicked", () => {
  //   const { getByText } = render(<CoverageItem {...defaultProps} />);
  //   // fireEvent.click(getByText("Coverage Type"));
  //   // expect(defaultProps.triggerViewBenefit).toHaveBeenCalledWith("Coverage Type");
  // });

  test("renders value correctly", () => {
    const { getByText, getByAltText } = render(<CoverageItem {...defaultProps} />);
    expect(getByAltText("Yes")).toBeInTheDocument();
  });

  test("renders approval status correctly", () => {
    const { getByAltText } = render(<CoverageItem {...defaultProps} />);
    expect(getByAltText(data.approved)).toBeInTheDocument();
  });

  test("renders '-' when isApproved is '-'", () => {
    const props = {
      ...defaultProps,
      items: {
        ...defaultProps.items,
        isApproved: "-",
      },
    };
    const { getByText } = render(<CoverageItem {...props} />);
    expect(getByText("-")).toBeInTheDocument();
  });

  test("renders child icon when child is true", () => {
    const { getByText } = render(<CoverageItem {...defaultProps} />);
    expect(getByText("ExpandLessIcon")).toBeInTheDocument();
  });

  test("does not render child icon when child is false", () => {
    const props = {
      ...defaultProps,
      items: {
        ...defaultProps.items,
        child: false,
      },
    };
    const { queryByText } = render(<CoverageItem {...props} />);
    expect(queryByText("ExpandMoreIcon")).not.toBeInTheDocument();
  });
});