import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EndorsementTravellerSection from "./index";

const mockLanguageData = {
  refundable_amount_endorsement: "Refundable Amount",
  sar: "SAR",
  travelers_added: "Travelers Added",
  travelers_removed: "Travelers Removed",
  travelers_benefits_removed: "Travelers Benefits Removed",
  additional_benefits1: "Additional Benefits",
  benfit_covid: "COVID Benefits",
  existing_travelers: "Existing Travelers",
};

describe("EndorsementTravellerSection Component", () => {
  it("renders correctly with 'Add' sectionName", () => {
    render(
      <EndorsementTravellerSection
        languageData={mockLanguageData}
        sectionName="Add"
      />
    );

    expect(screen.getByText("1 Travelers Added")).toBeInTheDocument();
    expect(screen.getByText("Refundable Amount")).toBeInTheDocument();

    
    const sarElements = screen.getAllByText("SAR");
    expect(sarElements.length).toBeGreaterThan(0); 
    expect(sarElements[0]).toBeInTheDocument(); 

    expect(screen.getByText("Additional Benefits")).toBeInTheDocument();
    expect(screen.getByText("COVID Benefits")).toBeInTheDocument();
  });

  it("renders correctly with 'Remove' sectionName", () => {
    render(
      <EndorsementTravellerSection
        languageData={mockLanguageData}
        sectionName="Remove"
      />
    );

    expect(screen.getByText("1 Travelers Removed")).toBeInTheDocument();
    expect(screen.getByText("Refundable Amount")).toBeInTheDocument();

    const sarElements = screen.getAllByText("SAR");
    expect(sarElements.length).toBeGreaterThan(0);
    expect(sarElements[0]).toBeInTheDocument();
  });

  it("renders correctly with 'Benefits' sectionName", () => {
    render(
      <EndorsementTravellerSection
        languageData={mockLanguageData}
        sectionName="Benefits"
      />
    );

    expect(screen.getByText("1 Travelers Benefits Removed")).toBeInTheDocument();
    expect(screen.getByText("Refundable Amount")).toBeInTheDocument();

    const sarElements = screen.getAllByText("SAR");
    expect(sarElements.length).toBeGreaterThan(0);
    expect(sarElements[0]).toBeInTheDocument();

    expect(screen.getByText("Existing Travelers")).toBeInTheDocument();
  });
  it("handles accordion open and close state", async () => {
    render(
      <EndorsementTravellerSection
        languageData={mockLanguageData}
        sectionName="Add"
      />
    );
  
    const accordionHeader = screen.getByText("1 Travelers Added");
    userEvent.click(accordionHeader);
  
    expect(screen.getByText("Additional Benefits")).toBeInTheDocument();
  
    userEvent.click(accordionHeader);
    
    await waitFor(() => {
      const accordionButton = screen.getByRole("button", { name: /1 Travelers Added/i });
      expect(accordionButton).toHaveAttribute("aria-expanded", "false");
    });
    
    const accordionCollapse = screen.getByText("Additional Benefits").closest('.accordion-collapse');
    expect(accordionCollapse).not.toHaveClass('show'); 
  });
  it("renders correctly with undefined languageData", () => {
    render(
      <EndorsementTravellerSection
        languageData={undefined}
        sectionName="Add"
      />
    );

    expect(screen.queryByText("Refundable Amount")).not.toBeInTheDocument();
    expect(screen.queryByText("SAR")).not.toBeInTheDocument();
  });
});