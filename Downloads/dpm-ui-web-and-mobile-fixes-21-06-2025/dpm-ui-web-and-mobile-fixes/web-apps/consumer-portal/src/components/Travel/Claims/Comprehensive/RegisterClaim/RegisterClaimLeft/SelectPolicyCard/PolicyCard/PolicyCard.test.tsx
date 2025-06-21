import { render, screen, fireEvent } from "@testing-library/react";
import PoliciesCard from "./PoliciesCard";
import { formatDate } from "utils/formatDate";
const mockPolicy = {
  policyNo: "P-OS01-25-605-002444",
  effectiveDate: "2025-05-31",
  expiryDate: "2025-08-30T23:59:59",
  productCode: "TRVL",
  // Include any additional required fields
} as any;

const languageTravelData = {
  policy_number: "Policy Number",
  travel_period: "Travel Period",
  policy_period: "Policy Period"
};// Mock assets
jest.mock("assets/Dashboard/Travel-icon.svg", () => "mocked-travel-icon.svg");

// Mock formatDate
jest.mock('utils/formatDate', () => ({
  formatDate: jest.fn(date => date ? new Date(date).toLocaleDateString() : 'N/A'),
}));

// Mock constants
jest.mock('constant', () => ({
  NA: 'N/A',
  TRAVEL: 'TRVL',
}));

describe('PoliciesCard Component', () => {
  test("renders PoliciesCard with correct policy number and dates", () => {
    const policyWithDates = {
      ...mockPolicy,
      effectiveDate: "2025-05-31",
      expiryDate: "2025-08-30T23:59:59",
    };
  
    render(
      <PoliciesCard
        policy={policyWithDates}
        isSelected={false}
        languageTravelData={languageTravelData}
      />
    );
  
    const valueElements = document.querySelectorAll(".value.walaa-medium-500");
    const expectedDateText = "5/31/2025 - 8/30/2025";
  
    const matchingElement = Array.from(valueElements).find((el) =>
      el.textContent?.includes(expectedDateText)
    );
  
    expect(matchingElement).toBeTruthy();
  });
  
test("calls onClick handler when card is clicked", () => {
  const handleClick = jest.fn();
  render(<PoliciesCard policy={mockPolicy} isSelected={false} onClick={handleClick} languageTravelData={languageTravelData} />);

  const card = screen.getByTestId("policies-register-claim-card-container");
  fireEvent.click(card);

  expect(handleClick).toHaveBeenCalledWith(mockPolicy.policyNo);
});
test("applies selected class when isSelected is true", () => {
  render(<PoliciesCard policy={mockPolicy} isSelected={true} languageTravelData={languageTravelData} />);
  
  const card = screen.getByTestId("policies-register-claim-card-container");
  expect(card).toHaveClass("selected");
})
test("displays N/A when dates are missing", () => {
  const policyWithoutDates = {
    ...mockPolicy,
    effectiveDate: undefined,
    expiryDate: undefined,
  };

  render(
    <PoliciesCard
      policy={policyWithoutDates}
      isSelected={false}
      languageTravelData={{
        policy_number: "Policy Number",
        policy_period: "Policy Period",
        travel_period: "Travel Period",
      }}
    />
  );

  const values = document.querySelectorAll(".value.walaa-medium-500");

  // Find one element that contains BOTH 'N/A' strings (and ignore spacing and trailing dash)
  const matchingElement = Array.from(values).find((el) => {
    const text = el.textContent?.replace(/\s+/g, " ").trim();
    return text?.startsWith("N/A - N/A");
  });

  expect(matchingElement).toBeTruthy();
});



test("displays product logo image", () => {
  render(<PoliciesCard policy={mockPolicy} isSelected={false} languageTravelData={languageTravelData} />);
  
  const img = screen.getByAltText("product-logo");
  expect(img).toBeInTheDocument();
  expect(img).toHaveAttribute("src", "mocked-travel-icon.svg");
});
});
