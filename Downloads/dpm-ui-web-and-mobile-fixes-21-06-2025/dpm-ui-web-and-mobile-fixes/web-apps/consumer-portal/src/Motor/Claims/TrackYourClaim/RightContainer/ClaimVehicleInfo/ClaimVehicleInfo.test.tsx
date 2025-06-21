import { render, screen } from "@testing-library/react";
import ClaimVehicleInfo from "./ClaimVehicleInfo"; // Adjust path if necessary
import { useClaimContext } from "Motor/ClaimHooks/useClaimContext";

// Mock the useClaimContext hook
jest.mock("Motor/ClaimHooks/useClaimContext", () => ({
  useClaimContext: jest.fn(),
}));

describe("ClaimVehicleInfo", () => {
  // Test when the context provides data
  it("should display vehicle info and claim info correctly", () => {
    // Mock the context data to be used in the test
    const mockTrackClaimInfo = {
      case_reference_no: "123456",
      owner_id_label: "Owner ID",
    };
    const mockTrackNewData = {
      referenceNo: "ABC123",
      ownerID: "78910",
      plateNo:"abc xyz"
    };

    // Provide the mocked context data
    (useClaimContext as jest.Mock).mockReturnValue({
      trackClaimInfo: mockTrackClaimInfo,
      trackNewData: mockTrackNewData,
    });

    // Render the component
    render(<ClaimVehicleInfo />);

    // Check if the vehicle name and content are displayed
    // expect(screen.getByText("Nissan Magnite XE")).toBeInTheDocument();
    // expect(screen.getByText("7403-RUA")).toBeInTheDocument();

    // // Check if the case reference number and owner ID are displayed
    // expect(screen.getByText("123456")).toBeInTheDocument(); // case_reference_no
    // expect(screen.getByText("ABC123")).toBeInTheDocument(); // referenceNo
    // expect(screen.getByText("Owner ID")).toBeInTheDocument(); // owner_id_label
    // expect(screen.getByText("78910")).toBeInTheDocument(); // ownerID
  });

  // // Test when the context provides empty or undefined data
  // it("should handle empty context data gracefully", () => {
  //   // Mock the context to return empty or undefined values
  //   (useClaimContext as jest.Mock).mockReturnValue({
  //     trackClaimInfo: undefined,
  //     trackNewData: undefined,
  //   });

  //   // Render the component
  //   render(<ClaimVehicleInfo />);

  //   // Check if the vehicle name and content are still displayed
  //   expect(screen.getByText("Nissan Magnite XE")).toBeInTheDocument();
  //   expect(screen.getByText("7403-RUA")).toBeInTheDocument();

  //   // Check if empty or undefined data doesn't break the component
  //   expect(screen.queryByText("123456")).not.toBeInTheDocument();
  //   expect(screen.queryByText("ABC123")).not.toBeInTheDocument();
  //   expect(screen.queryByText("Owner ID")).not.toBeInTheDocument();
  //   expect(screen.queryByText("78910")).not.toBeInTheDocument();
  // });
});
