import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import RepairOption from "./RepairOption";

jest.mock("@mui/icons-material/InfoOutlined", () => () => <span data-testid="info-icon">i</span>);

jest.mock('@app-shell/utils/common', () => ({
    getAmountWithIcon: jest.fn(amount => `SAR ${amount}`),
}));

jest.mock("./RepairType.json", () => ({
  viewBenefits: "View Benefits",
}));

const mockProps = {
  price: 1000,
  name: "Test Plan",
  index: 0,
  totalOptions: 2,
  onViewBenefitsClick: jest.fn(),
  onChangehandler: jest.fn(),
  handleTooltipClick: jest.fn(),
  isRepairTypeSelected: false,
  coverageType: "comprehensive",
  languageData: {
    guidelines_title: "Guidelines",
    most_popular: "Most Popular",
    most_popular_coverage_plans: [
      { is_popular: 1, name: "Test Plan" },
    ],
  },
};

describe("RepairOption", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly and triggers onChange on container click", () => {
    render(<RepairOption {...mockProps} />);
    const container = screen.getByText("Test Plan").closest(".repair-option-container");
    fireEvent.click(container!);
    expect(mockProps.onChangehandler).toHaveBeenCalledWith("Test Plan");
  });

  it("displays most popular label when applicable", () => {
    render(<RepairOption {...mockProps} />);
    expect(screen.getByText("Most Popular")).toBeInTheDocument();
  });

  it("does not display most popular label if plan is not popular", () => {
    const props = {
      ...mockProps,
      languageData: {
        ...mockProps.languageData,
        most_popular_coverage_plans: [
          { is_popular: 0, name: "Test Plan" },
        ],
      },
    };
    render(<RepairOption {...props} />);
    expect(screen.queryByText("Most Popular")).not.toBeInTheDocument();
  });

  it("renders price with currency icon", () => {
    render(<RepairOption {...mockProps} />);
    expect(screen.getByText("SAR 1000")).toBeInTheDocument();
  });

  it("calls handleTooltipClick when tooltip icon is clicked", () => {
    render(<RepairOption {...mockProps} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(mockProps.handleTooltipClick).toHaveBeenCalled();
  });

  it("calls onViewBenefitsClick when 'View Benefits' is clicked", () => {
    render(<RepairOption {...mockProps} />);
    const link = screen.getByText("View Benefits");
    fireEvent.click(link);
    expect(mockProps.onViewBenefitsClick).toHaveBeenCalledWith("Test Plan");
  });

  it("passes correct props to ThemeRadioCheckbox", () => {
    const { container } = render(<RepairOption {...mockProps} />);
    const radio = container.querySelector("input[type='radio']");
    expect(radio).toBeInTheDocument();
    expect(radio).not.toBeChecked();
  });

  it("applies correct classes for two options", () => {
    const { container } = render(<RepairOption {...mockProps} />);
    expect(container.firstChild).toHaveClass("repair-option-container");
    expect(container.firstChild).toHaveClass("twooptions");
    expect(container.firstChild).toHaveClass("comprehensive");
  });
});
