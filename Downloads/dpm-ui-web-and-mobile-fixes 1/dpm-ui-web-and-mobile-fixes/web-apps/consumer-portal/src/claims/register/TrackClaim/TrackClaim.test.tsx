import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TrackClaim from "./index";
import { callAPI } from "@dpm/shared-module";

jest.mock("@dpm/shared-module", () => ({
  callAPI: jest.fn(),
}));

jest.mock("./components/uploadoc/UploadDoc", () => ({ handleSuccess }: { handleSuccess: any }) => (
  <button onClick={() => handleSuccess(true)}>Upload Document</button>
));

jest.mock("./components/statustree/StatusTree", () => () => <div>Status Tree</div>);

describe("TrackClaim Component", () => {
  const mockLanguageData = {
    track_your_claim: "Track Your Claim",
    motor_claim_no: "Motor Claim No.",
    insurance_type: "Insurance Type",
    comprehensive: "Comprehensive",
    claim_id: "Claim ID",
    current_status: "Current Status",
    download_claim_documents: "Download Claim Documents",
    track_another_claim: "Track Another Claim",
  };

  beforeEach(() => {
    callAPI.mockResolvedValue({ config: [mockLanguageData] });
  });

  test("renders loading state initially", () => {
    render(<TrackClaim />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("fetches and displays language data", async () => {
    render(<TrackClaim />);

    await waitFor(() => {
      expect(screen.getByText("Track Your Claim")).toBeInTheDocument();
      expect(screen.getByText("Motor Claim No.")).toBeInTheDocument();
      expect(screen.getByText("Comprehensive")).toBeInTheDocument();
    });
  });

  test("handles document upload success", async () => {
    render(<TrackClaim />);

    await waitFor(() => {
      expect(screen.getByText("Accident report awaited")).toBeInTheDocument();
    });

    userEvent.click(screen.getByText("Upload Document"));

    await waitFor(() => {
      expect(screen.getByText("Accident report submitted")).toBeInTheDocument();
    });
  });

  test("renders StatusTree component", async () => {
    render(<TrackClaim />);

    await waitFor(() => {
      expect(screen.getByText("Status Tree")).toBeInTheDocument();
    });
  });

  test("renders buttons correctly", async () => {
    render(<TrackClaim />);

    await waitFor(() => {
      expect(screen.getByText("Download Claim Documents")).toBeInTheDocument();
      expect(screen.getByText("Track Another Claim")).toBeInTheDocument();
    });
  });
});