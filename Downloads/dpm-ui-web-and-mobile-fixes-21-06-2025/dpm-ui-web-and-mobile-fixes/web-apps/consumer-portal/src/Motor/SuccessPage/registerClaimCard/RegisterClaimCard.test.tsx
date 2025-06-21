import React from "react";
import { render, screen } from "@testing-library/react";
import RegisterClaimCard from ".";
import { LanguageData } from "types/languageData";

// Mocking the assets
jest.mock("assets/SuccessPage/Nissan.svg", () => "Nissan.svg");
jest.mock("assets/SuccessPage/Line_new.svg", () => "Line_new.svg");
jest.mock("assets/SuccessPage/Download.svg", () => "Download.svg");

// Mock getAmountWithIcon
jest.mock("@app-shell/utils/common", () => ({
  getAmountWithIcon: jest.fn((amount) => `SAR ${amount}`),
}));

describe("RegisterClaimCard", () => {
  const langDataMock: LanguageData = {
    motor_claim_no: "Motor Claim No",
    case_reference_no: "Case Reference No",
    owner_id_label: "Owner ID",
    download_claim_documents: "Download Claim Documents",
    we_have_received_your_appl: "We have received your application.",
  };

  const claimDataMock = {
    claimNo: "12345",
    claimsInfo: {
      refNo: "ABC-1234",
      ownerId: "owner-123",
    },
  };

  test("should render the RegisterClaimCard with correct data", () => {
    render(<RegisterClaimCard claimData={claimDataMock} langData={langDataMock} />);

    // Assert the motor claim number is displayed
    expect(screen.getByText("Motor Claim No")).toBeInTheDocument();
    expect(screen.getByText("12345")).toBeInTheDocument();

    // Assert the case reference number is displayed
    expect(screen.getByText("Case Reference No")).toBeInTheDocument();
    expect(screen.getByText("ABC-1234")).toBeInTheDocument();

    // Assert the owner ID is displayed
    expect(screen.getByText("Owner ID")).toBeInTheDocument();
    expect(screen.getByText("owner-123")).toBeInTheDocument();

    // Assert the download link text is displayed
    expect(screen.getByText("Download Claim Documents")).toBeInTheDocument();

    // Assert the footer note content is displayed
    expect(screen.getByText("Note :")).toBeInTheDocument();
    expect(screen.getByText("We have received your application.")).toBeInTheDocument();
  });

  test("should render the correct images", async() => {
    render(<RegisterClaimCard claimData={claimDataMock} langData={langDataMock} />);

    // Assert images are rendered correctly
    const nissanImage = screen.getByAltText("Motor Claim No");
    expect(nissanImage).toBeInTheDocument();
    expect(nissanImage).toHaveAttribute("src", "Download.svg");

    const lineImage = screen.getByAltText("Owner ID");
    expect(lineImage).toBeInTheDocument();
    expect(lineImage).toHaveAttribute("src", "Download.svg");
    
    const downloadImage = screen.getByAltText("Download Claim Documents");
    expect(downloadImage).toBeInTheDocument();
    expect(downloadImage).toHaveAttribute("src", "Download.svg");
  });
});
