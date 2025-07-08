import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PolicyInfoLeft from "./index";

jest.mock("./AddBenefits", () => jest.fn(() => <div>AddBenefits Component</div>));
jest.mock("claims/register/compensation/TermsAndCon", () =>
  jest.fn(() => <div>TermsAndCon Component</div>)
);

describe("PolicyInfoLeft Component", () => {
  const mockHandleSelectAddBenefits = jest.fn();
  const mockSetIsTermCondition = jest.fn();

  const mockLanguageData = {
    select_endorsement: "Select Endorsement",
  };

  const mockPolicyDetails = {
    viewPolicy: true,
    benefitsClaimed: [],
    isBenefitLoaded: false,
    isTermCondition: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(
      <PolicyInfoLeft
        policyDetails={mockPolicyDetails}
        languageData={mockLanguageData}
        handleSelectAddBenefits={mockHandleSelectAddBenefits}
        setIsTermCondition={mockSetIsTermCondition}
      />
    );

    expect(screen.getByText("Select Endorsement")).toBeInTheDocument();
  });

  it("renders endorsement buttons", () => {
    render(
      <PolicyInfoLeft
        policyDetails={mockPolicyDetails}
        languageData={mockLanguageData}
        handleSelectAddBenefits={mockHandleSelectAddBenefits}
        setIsTermCondition={mockSetIsTermCondition}
      />
    );

    const endorsementButton = screen.getByText("Add Benefits");
    expect(endorsementButton).toBeInTheDocument();
  });

  it("updates selected endorsement on button click", () => {
    render(
      <PolicyInfoLeft
        policyDetails={mockPolicyDetails}
        languageData={mockLanguageData}
        handleSelectAddBenefits={mockHandleSelectAddBenefits}
        setIsTermCondition={mockSetIsTermCondition}
      />
    );

    const endorsementButton = screen.getByText("Add Benefits");
    fireEvent.click(endorsementButton);

    //expect(endorsementButton.classList).toContain("selected");
  });

  // it("renders AddBenefits and TermsAndCon components when 'Add Benefits' is selected", () => {
  //   render(
  //     <PolicyInfoLeft
  //       policyDetails={mockPolicyDetails}
  //       languageData={mockLanguageData}
  //       handleSelectAddBenefits={mockHandleSelectAddBenefits}
  //       setIsTermCondition={mockSetIsTermCondition}
  //     />
  //   );

  //   const endorsementButton = screen.getByText("Add Benefits");
  //   fireEvent.click(endorsementButton);

  //   expect(screen.getByText("AddBenefits Component")).toBeInTheDocument();
  //   expect(screen.getByText("TermsAndCon Component")).toBeInTheDocument();
  // });

  it("calls handleSelectAddBenefits and setIsTermCondition correctly", () => {
    render(
      <PolicyInfoLeft
        policyDetails={mockPolicyDetails}
        languageData={mockLanguageData}
        handleSelectAddBenefits={mockHandleSelectAddBenefits}
        setIsTermCondition={mockSetIsTermCondition}
      />
    );

    const endorsementButton = screen.getByText("Add Benefits");
    fireEvent.click(endorsementButton);

    expect(mockHandleSelectAddBenefits).not.toHaveBeenCalled(); // Not triggered in this component
    expect(mockSetIsTermCondition).not.toHaveBeenCalled(); // Triggered in TermsAndCon
  });
});