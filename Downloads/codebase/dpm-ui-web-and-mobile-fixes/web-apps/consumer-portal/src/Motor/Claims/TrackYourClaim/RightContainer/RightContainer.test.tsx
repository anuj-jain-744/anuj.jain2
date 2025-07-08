import React from "react";
import { render } from "@testing-library/react";
import RightContainer from "./RightContainer";
import { useClaimContext } from "Motor/ClaimHooks/useClaimContext";

// Mock child components
jest.mock("./DownloadDocLink/DownloadDocLink", () => () => <div>Mocked DownloadDocLink</div>);
jest.mock("./ContactCard/ContactCard", () => () => <div>Mocked ContactCard</div>);
jest.mock("../RightContainer/ClaimVehicleInfo/ClaimVehicleInfo", () => () => <div>Mocked ClaimVehicleInfo</div>);
jest.mock("./../../../../components/Claim/ClaimDetailCard", () => () => <div>Mocked ClaimDetailCard</div>);

// Mock useClaimContext
jest.mock("Motor/ClaimHooks/useClaimContext", () => ({
  useClaimContext: jest.fn(),
}));

describe("RightContainer Component", () => {
  it("renders ClaimDetailCard when filteredTrackClaimInfo is available", () => {
    (useClaimContext as jest.Mock).mockReturnValue({
      productName: "motor",
      trackClaimInfo: {
        motor: "motor",
        case_reference_no: "12345",
        not_applicable: "N/A",
        owner_id_label: "Owner ID",
      },
      trackNewData: {
        vehicleMake: "Toyota",
        plateNo: "ABC123",
        caseReferenceNo: "12345",
        ownerID: "Owner123",
      },
    });

    const { getByText } = render(<RightContainer languageData={{}} />);

    expect(getByText("Mocked ClaimDetailCard")).toBeInTheDocument();
    expect(getByText("Mocked DownloadDocLink")).toBeInTheDocument();
    expect(getByText("Mocked ContactCard")).toBeInTheDocument();
  });

  it("renders ClaimVehicleInfo when filteredTrackClaimInfo is null", () => {
    (useClaimContext as jest.Mock).mockReturnValue({
      productName: "unknown",
      trackClaimInfo: null,
      trackNewData: null,
    });

    const { getByText } = render(<RightContainer languageData={{}} />);

    expect(getByText("Mocked ClaimVehicleInfo")).toBeInTheDocument();
    expect(getByText("Mocked DownloadDocLink")).toBeInTheDocument();
    expect(getByText("Mocked ContactCard")).toBeInTheDocument();
  });
});