import { render, screen } from "@testing-library/react";
import VehicalPolicyDetails from "../VehicalPolicyDetails"; // Adjust the path as needed
import { getAmountWithIcon } from "@app-shell/utils/common";

// Mock the getAmountWithIcon function
jest.mock("@app-shell/utils/common", () => ({
  getAmountWithIcon: jest.fn((value) => `Icon ${value}`),
}));

describe("VehicalPolicyDetails Component", () => {
  const mockPolicyDetail = [
    { label: "Policy Number", value: "12345", isAmount: false },
    { label: "Premium Amount", value: "5000", isAmount: true },
    { label: "Coverage Type", value: "Comprehensive", isAmount: false },
  ];

  it("displays the correct labels and values", () => {
    render(<VehicalPolicyDetails policyDetail={mockPolicyDetail} />);

    // Check labels
    expect(screen.getByText("Policy Number")).toBeInTheDocument();
    expect(screen.getByText("Premium Amount")).toBeInTheDocument();
    expect(screen.getByText("Coverage Type")).toBeInTheDocument();

    // Check values
    expect(screen.getByText("12345")).toBeInTheDocument();
    expect(screen.getByText("Comprehensive")).toBeInTheDocument();
  });

  it("renders the amount with icon for isAmount items", () => {
    render(<VehicalPolicyDetails policyDetail={mockPolicyDetail} />);

    // Check that getAmountWithIcon is called for isAmount items
    expect(getAmountWithIcon).toHaveBeenCalledWith("5000");

    // Check that the value is rendered with the icon
    expect(screen.getByText("Icon 5000")).toBeInTheDocument();
  });
});