import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import HomeCompareBenefits from "../HomeCompareBenefits";
import CoverageItem from "./index";
import { Modal } from "react-bootstrap";

jest.mock('react-bootstrap', () => ({
  Modal: Object.assign(({ show, children }) => (show ? <div>{children}</div> : null),
    { Header: ({ children, ...props }) => (<div {...props}>{children}
<button aria-label="Close" onClick={props.onHide}>X</button>
</div>),Body: ({ children }) => <div>{children}</div>,}),}));

describe("CoverageItem Component", () => {
  const mockTriggerViewBenefit = jest.fn();
  const mockItem = {
    type: "Coverage A",
    type1: "Yes",
    type2: "No",
    child: true,
  };

  test("renders CoverageItem correctly", () => {
    render(
      <CoverageItem
        items={mockItem}
        accordians={""}
        openAccordion={[]}
        triggerViewBenefit={mockTriggerViewBenefit}
      />
    );
    expect(screen.getByText("Coverage A >>")).toBeInTheDocument();
  });

  test("calls triggerViewBenefit when button is clicked", () => {
    render(
      <CoverageItem
        items={mockItem}
        accordians={""}
        openAccordion={[]}
        triggerViewBenefit={mockTriggerViewBenefit}
      />
    );
    fireEvent.click(screen.getByText("Coverage A >>"));
    expect(mockTriggerViewBenefit).toHaveBeenCalledWith("Coverage A");
  });
});

describe("HomeCompareBenefits Component", () => {
  const mockOnClose = jest.fn();
  const mockLanguageData = {
    "plan_accordians": ["Coverage A"],
    "plan_headers": ["Header1", "Plan 1", "Plan 2"],
    compare_benefits: "Compare Benefits",
    sar: "SAR",
  };

  test("renders HomeCompareBenefits modal correctly", () => {
    render(
      <HomeCompareBenefits
        showCompareBenefits={true}
        languageData={mockLanguageData}
        coveragePlanSelected={"plan"}
        onClose={mockOnClose}
      />
    );
    expect(screen.getByText("Compare Benefits")).toBeInTheDocument();
    expect(screen.getByText("Coverage Type")).toBeInTheDocument();
  });

  test('expands nested accordion items on click', () => {
    const nestedLanguageData = {
      plan_accordians: ['Main Benefit'],
      plan_headers: ['Header', 'Plan A', 'Plan B'],
      compare_benefits: 'Compare Benefits',
      sar: 'SAR',
      plan: [{
        plana: ['Yes', 'No', 'Yes'],
        planb: ['No', 'Yes', 'Yes'],
        benefits: ['Main Benefit', 'Sub Benefit A', 'Sub Benefit B']
      }]
    };
    render(
  <HomeCompareBenefits
        showCompareBenefits={true}
        languageData={nestedLanguageData}
        coveragePlanSelected="plan"
        onClose={jest.fn()}
      />
    );
    // Click to expand accordion
    fireEvent.click(screen.getByText('Main Benefit >>'));
    // Check nested benefits rendered
    expect(screen.getByText('Sub Benefit A >>')).toBeInTheDocument();
    expect(screen.getByText('Sub Benefit B >>')).toBeInTheDocument();
  });
  
  test('renders Yes/No values and icons correctly in CoverageItem', () => {
    const singleItemData = {
      plan_accordians: [],
      plan_headers: ['Header', 'Plan A', 'Plan B'],
      compare_benefits: 'Compare Benefits',
      sar: 'SAR',
      plan: [{
        plana: ['Yes'],
        planb: ['No'],
        benefits: ['Emergency Cover']
      }]
  
    };
    render(
  <HomeCompareBenefits
        showCompareBenefits={true}
        languageData={singleItemData}
        coveragePlanSelected="plan"
        onClose={jest.fn()}
      />
    );
    expect(screen.getByText('Emergency Cover >>')).toBeInTheDocument();
    expect(screen.getByAltText('Yes')).toBeInTheDocument(); // icon
    expect(screen.getByText('No')).toBeInTheDocument();     // fallback text
  });
  
  test("calls onClose when modal close button is clicked", () => {
    render(
      <HomeCompareBenefits
        showCompareBenefits={true}
        languageData={mockLanguageData}
        coveragePlanSelected={"plan"}
        onClose={mockOnClose}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('renders gracefully with missing benefits data', () => {
    const incompleteData = {
      plan_headers: ['Header', 'Plan A'],
      plan_accordians: ['Unknown Benefit'],
      compare_benefits: 'Compare Benefits',
      sar: 'SAR',
      plan: [{}], // no benefits
    };
    render(
  <HomeCompareBenefits
        showCompareBenefits={true}
        languageData={incompleteData}
        coveragePlanSelected="plan"
        onClose={jest.fn()}
      />
    );
    expect(screen.getByText('Compare Benefits')).toBeInTheDocument();
  });
});
