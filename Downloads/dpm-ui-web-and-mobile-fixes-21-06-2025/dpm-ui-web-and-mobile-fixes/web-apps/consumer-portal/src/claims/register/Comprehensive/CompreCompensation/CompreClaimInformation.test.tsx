import React from "react";
import { render, screen } from "@testing-library/react";
import { DataContext } from "../../../../DataContext";
import CompreClaimInformation from "./CompreClaimInformation";
import { Card } from "react-bootstrap";

// Mock data for DataContext
const mockData = {
  police_case_reference: "Police Case Reference",
  owner_id_label: "Owner ID",
  vehicle_sequence: "Vehicle Sequence"
};

// Mock props for the component
const mockProps = {
  validationData: {
    caseReportId: "CR123456",
    ownerId: "OID123456",
    sequenceNo: "SEQ123456"
  },
  claimsInfo: {
    refNo: "REF123456",
    ownerId: "OID654321"
  }
};

describe("CompreClaimInformation Component", () => {
  test("renders CompreClaimInformation component with correct content", () => {
    render(
      <DataContext.Provider value={mockData}>
        <CompreClaimInformation {...mockProps} />
      </DataContext.Provider>
    );

    // Check if the police case reference title is rendered
    expect(screen.getByText("Police Case Reference")).toBeInTheDocument();

    // Check if the police case reference value is rendered
    expect(screen.getByText("CR123456")).toBeInTheDocument();

    // Check if the owner ID title is rendered
    expect(screen.getByText("Owner ID")).toBeInTheDocument();

    // Check if the owner ID value is rendered
    expect(screen.getByText("OID123456")).toBeInTheDocument();

    // Check if the vehicle sequence title is rendered
    expect(screen.getByText("Vehicle Sequence")).toBeInTheDocument();

    // Check if the vehicle sequence value is rendered
    expect(screen.getByText("SEQ123456")).toBeInTheDocument();
  });

  test("renders fallback values when validationData is missing", () => {
    const fallbackProps = {
      validationData: {},
      claimsInfo: {
        refNo: "REF123456",
        ownerId: "OID654321"
      }
    };

    render(
      <DataContext.Provider value={mockData}>
        <CompreClaimInformation {...fallbackProps} />
      </DataContext.Provider>
    );

    // Check if the police case reference value falls back to claimsInfo refNo
    expect(screen.getByText("REF123456")).toBeInTheDocument();

    // Check if the owner ID value falls back to claimsInfo ownerId
    expect(screen.getByText("OID654321")).toBeInTheDocument();
  });
});