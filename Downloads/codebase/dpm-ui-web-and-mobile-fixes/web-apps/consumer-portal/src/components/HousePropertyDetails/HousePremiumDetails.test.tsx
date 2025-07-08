import React from "react";
import { render, screen } from "@testing-library/react";
import HousePremiumDetails from "./HousePremiumDetails"; // Import the component
import '@testing-library/jest-dom'; // For better assertions

// Mock getAmountWithIcon
jest.mock('@app-shell/utils/common', () => ({
  getAmountWithIcon: jest.fn(amount => `SAR ${amount}`),
}));

// Sample data for testing
const mockHouseDetail = [
  { label: "Policy Period", value: "01 Jan, 2025 - 01 Jan, 2026" },
  { label: "Premium Amount", value: "SAR 5,000" },
  { label: "Coverage Type", value: "Full Coverage" },
];

jest.mock('@app-shell/utils/common', () => ({
  getAmountWithIcon: jest.fn(amount => `SAR ${amount}`),
  getCurrencySymbol: jest.fn(() => 'SAR'),
}));

describe("HousePremiumDetails", () => {
  /*it("renders the component and displays house details correctly", () => {
    render(<HousePremiumDetails houseDetail={mockHouseDetail} />);

    // Check if each item in the houseDetail array is rendered
    mockHouseDetail.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
      expect(screen.getByText(item.value)).toBeInTheDocument();
    });
  });*/

  it("renders correctly with an empty houseDetail array", () => {
    render(<HousePremiumDetails houseDetail={[]} />);

    // Ensure that no labels or values are rendered
    mockHouseDetail.forEach((item) => {
      expect(screen.queryByText(item.label)).not.toBeInTheDocument();
      expect(screen.queryByText(item.value)).not.toBeInTheDocument();
    });
  });

  /*it("handles undefined or missing houseDetail props gracefully", () => {
    render(<HousePremiumDetails houseDetail={undefined as never} />);

    // Ensure that no errors are thrown and the component renders without crashing
    expect(screen.queryByText("Policy Period")).not.toBeInTheDocument();
    expect(screen.queryByText("Premium Amount")).not.toBeInTheDocument();
  });

  it("renders each house item with the correct classNames", () => {
    render(<HousePremiumDetails houseDetail={mockHouseDetail} />);

    // Check if the correct classes are applied to the label and value
    mockHouseDetail.forEach((item, idx) => {
        const label = screen.getByText(item.label);
        const value = screen.getByText(item.value);
        
        expect(label).toHaveClass("poli-label");
        expect(value).toHaveClass("poli-value");

        // Check if each container has the correct class for the individual item
        const container = screen.getAllByTestId("poli-detail-container")[idx];
        expect(container).toBeInTheDocument();
    });
  });*/
});
