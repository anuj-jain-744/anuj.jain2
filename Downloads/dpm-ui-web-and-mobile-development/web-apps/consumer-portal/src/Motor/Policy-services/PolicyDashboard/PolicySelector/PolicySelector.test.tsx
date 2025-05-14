import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import PolicySelector from ".";
import {  BrowserRouter as MemoryRouter , useLocation } from "react-router-dom";
import * as reactRedux from "react-redux";
import usePolicyData from "hook/common/usePolicyData";

// Mock necessary dependencies

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));
jest.mock("hook/common/usePolicyData");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

describe("PolicySelector", () => {
  const mockNavigateTo = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset mock before each test
    (reactRedux.useSelector as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        policy: {
          policies: [
            { policyNo: "12345", endorsementNo: "67890", productCode: "TRVL" },
            { policyNo: "98765", endorsementNo: "43210", productCode: "RMCOM" },
            { policyNo: "98766", endorsementNo: "43211", productCode: "home" },
          ],
        },
      })
    );

    // Mock usePolicyData
    (usePolicyData as jest.Mock).mockReturnValue({
      allPolicies: [
        { policyNo: "12345", endorsementNo: "67890", productCode: "TRVL" },
        { policyNo: "98765", endorsementNo: "43210", productCode: "RMCOM" },
        { policyNo: "98766", endorsementNo: "43211", productCode: "home" },
      ],
    });

    // Mock user location state policy
    (useLocation as jest.Mock).mockReturnValue({
      state: {
        data: {
          policyNo: "98765",
          endorsementNo: "43210",
          productCode: "TRVL",
        },
      },
    });
  });

  it("should render the dropdown", async () => {
    // Render the component
    render(
      <PolicySelector
        selectedPolicyInfo={{
          policyNo: "12345",
          endorsementNo: "67890",
          productCode: "TRVL",
        }}
        navigateTo={mockNavigateTo}
      />
    );

    // Check if the selected policy is rendered
    const selectedPolicy = screen.getByText("12345");
    expect(selectedPolicy).toBeInTheDocument();
    fireEvent.click(selectedPolicy);
    const dropdownItem = await screen.findByText("98765");
    expect(dropdownItem).toBeInTheDocument();
    fireEvent.click(dropdownItem);
  });

  it("should navigate to the policy dashboard when a policy is selected", async () => {
    // Render the component
    render(
      <MemoryRouter>
        <PolicySelector
          selectedPolicyInfo={{
            policyNo: "12345",
            endorsementNo: "67890",
            productCode: "TRVL",
          }}
          navigateTo={mockNavigateTo}
        />
      </MemoryRouter>
    );

    // Simulate clicking the dropdown item
    const dropdownBtn = screen.getByText("12345");
    fireEvent.click(dropdownBtn);
    const dropdownItem = await screen.getByText("98765");
    await expect(dropdownItem).toBeInTheDocument();
    await act(() => {
      fireEvent.click(dropdownItem);
    });
    expect(mockNavigateTo).toHaveBeenCalledWith(
      "/Motor/Claim/PolicyDashboard",
      {
        data: {
          policyNo: "98765",
          endorsementNo: "43210",
          productCode: "RMCOM",
        },
      }
    );
  });

  it("should render the correct product image based on productCode", () => {
    // Render the component
    render(
      <PolicySelector
        selectedPolicyInfo={{
          policyNo: "12345",
          endorsementNo: "67890",
          productCode: "TRVL",
        }}
        navigateTo={mockNavigateTo}
      />
    );
    const dropdownBtn = screen.getByText("12345");
    fireEvent.click(dropdownBtn);
    const dropdownItem = screen.getByText("98765");
    expect(dropdownItem).toBeInTheDocument();

    // Check if the correct image for the product code is rendered
    const productImage1 = screen.getByAltText("01-icon");
    const productImage2 = screen.getByAltText("02-icon");
    const productImage3 = screen.getByAltText("03-icon");
    expect(productImage1).toBeInTheDocument();
    expect(productImage2).toBeInTheDocument();
    expect(productImage3).toBeInTheDocument();
  });
  it("if there are only once policy", () => {
    (usePolicyData as jest.Mock).mockReturnValue({
      allPolicies: [{
        policyNo: "12345",
        endorsementNo: "67890",
        productCode: "TRVL",
      }],
    });
    // Render the component
    const {container}=render(
      <PolicySelector
      selectedPolicyInfo={{
        policyNo: "12345",
        endorsementNo: "67890",
        productCode: "TRVL",
      }}
        navigateTo={mockNavigateTo}
      />
    );
    expect(container.querySelector('.hide-container')).toBeInTheDocument();
  });
});
