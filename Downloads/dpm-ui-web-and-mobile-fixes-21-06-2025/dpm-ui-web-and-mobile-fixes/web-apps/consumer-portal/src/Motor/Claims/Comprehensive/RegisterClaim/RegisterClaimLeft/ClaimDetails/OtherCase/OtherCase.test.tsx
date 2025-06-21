import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import OtherCase from "./index"; 
import { DataContext } from "DataContext";

describe("OtherCase Component", () => {
    const data = {
        your_liability_and_estimate_details:"Your Liability and Estimate Details",
        claim_details:"Claim Details",
        registration_details:"Registration Details",
        date_of_loss: "Date of Loss",
        estimated_amount: "Estimated Amount",
        your_liability: "Your Liability %",
        taqdeer_no_optional: "Taqdeer No. (Optional)",
        upload_the_supporting_docs: "Upload Supporting Documents.",
        claimant_details: "Claimant Details",
        mobile_number: "Mobile No.",
        email: "Email ID (optional)",
      }
    const mockProps = {
        onChangehandler: jest.fn(),
        errorValue: "",
        estimateErrorValue: "",
        onLossDateChangehandler: jest.fn(),
        type: "comprehensiveOD",
        setFileData: jest.fn(),
        lossDescription: "",
        othersClaimInfo: {
          isSequenceNo: true,
          SequenceNo: "123", // Changed from ["123"] to "123"
          ClaimType: "motorCoverageTypes.comp",
          lossType: "1",
        },
        cityData: [],
        garageData: [],
        isDamageRepairSelected: false,
        estAmountUpdate: "1000",
      };
  

  it("renders the component correctly", () => {
    render(<DataContext.Provider value={data}>
        <OtherCase {...mockProps} />
      </DataContext.Provider>);

    // Check if the component renders the liability and estimate details
    expect(screen.getByText(/Estimated Amount/i)).toBeInTheDocument();
    expect(screen.getByText(/Your Liability and Estimate Details/i)).toBeInTheDocument();
    expect(screen.getByText(/Taqdeer No/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload Supporting Documents./i)).toBeInTheDocument();
    expect(screen.getByText(/Your Liability %/i)).toBeInTheDocument();
  });
});