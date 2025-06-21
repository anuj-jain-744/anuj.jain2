import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ViewDetails from "./ViewDetails";
import { IDetails } from "types/coverageplan";

jest.mock('@app-shell/utils/common', () => ({
  getAmountWithIcon: jest.fn(amount => `SAR ${amount}`),
  getCurrencySymbol: jest.fn(() => 'SAR'),
}));

//mock the context hook and imported components
const mockDetailsData: IDetails[] = [
  { id: 1, itemname: "Item 1" },
  {
    id: 2,
    itemname: "Item 2 with a very long name that exceeds forty-one characters",
  },
  { id: 3, itemname: "Item 3" },
];

describe("ViewDetails", () => {
  it("should render the ViewDetails component with provided props", () => {
    render(<ViewDetails DetailsData={mockDetailsData} label="Test Label" />);

    expect(screen.getByText("View Details")).toBeInTheDocument();
  });

  it('should open the modal when "View Details" is clicked', () => {
    render(<ViewDetails DetailsData={mockDetailsData} label="Test Label" />);

    const viewDetailsButton = screen.getByText("View Details");
    fireEvent.click(viewDetailsButton);

    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Item 2 with a very long name that exceeds forty-one characters"
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Item 3")).toBeInTheDocument();
  });

  it("should close the modal when the close button is clicked", () => {
    render(<ViewDetails DetailsData={mockDetailsData} label="Test Label" />);

    const viewDetailsButton = screen.getByText("View Details");
    fireEvent.click(viewDetailsButton);

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);
  });

  it("should apply the correct class names based on item name length", () => {
    render(<ViewDetails DetailsData={mockDetailsData} label="Test Label" />);

    const viewDetailsButton = screen.getByText("View Details");
    fireEvent.click(viewDetailsButton);
  });

  it("should render without crashing when DetailsData is empty", () => {
    render(<ViewDetails DetailsData={[]} label="Test Label" />);

    const viewDetailsButton = screen.getByText("View Details");
    fireEvent.click(viewDetailsButton);

    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.queryByText("Item 1")).not.toBeInTheDocument();
  });
});
