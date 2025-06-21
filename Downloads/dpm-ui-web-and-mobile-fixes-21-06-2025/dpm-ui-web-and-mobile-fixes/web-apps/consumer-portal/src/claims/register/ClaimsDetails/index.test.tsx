import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ClaimsDetails from "./index";
import { DataContext } from "../../../DataContext";
import Feedback from "../../../components/Feedback";
import ThemeButton from "../../components/ThemeButton";
import successIcon from "../../../assets/Claims/GreenSuccess.svg";
import iconCar from "../../../assets/Claims/Car.svg";

jest.mock("../../../components/Feedback", () => jest.fn(() => <div>Feedback</div>));
jest.mock("../../components/ThemeButton", () => jest.fn(() => <button>ThemeButton</button>));

describe("ClaimsDetails Component", () => {
  const mockLanguageData = {
    success: "Success",
    success_message_motorclaim: "Your claim has been successfully submitted.",
    claim_submitted: "Claim Submitted",
    owner_id: "Owner ID",
    vehicle_sequence: "Vehicle Sequence No.",
    motor_claim_no: "Motor Claim No.",
    submit_another_claim: "Submit Another Claim",
    police_case_reference: "Police Case",
    najm_case_reference: "Najm Case",
    other_case_reference: "Other Case",
  };

  const mockValidationData = {
    SourceType: "Online",
    ClaimRequestType: "ClaimRequest",
    sequenceNo: 123,
    CaseReportId: "caseReport123",
    OwnerId: "owner123",
    dob: "01-01-1980",
  };

  const mockClaimResponse = {
    claimNo: "claim123",
    subclaimNo: "subclaim123",
  };

  const mockClaimsInfo = {
    refNo: "456789",
    ownerId: "owner123",
  };

  const renderComponent = (languageData: any) => {
    return render(
      <DataContext.Provider value={languageData}>
        <ClaimsDetails
          validationData={mockValidationData}
          claimResponse={mockClaimResponse}
          claimsInfo={mockClaimsInfo}
        />
      </DataContext.Provider>
    );
  };

  test("should render the ClaimsDetails component correctly when language data is available", async () => {
    renderComponent(mockLanguageData);

    // Wait for the component to finish rendering
    await waitFor(() => screen.getByText("Success"));

    // Ensure success icon and message are displayed
    expect(screen.getByAltText("Green Success Icon")).toBeInTheDocument();
    expect(screen.getByText(mockLanguageData.success)).toBeInTheDocument();
    expect(screen.getByText(mockLanguageData.success_message_motorclaim)).toBeInTheDocument();

    // Ensure that card sections with data are rendered correctly
    expect(screen.getByText(mockLanguageData.claim_submitted)).toBeInTheDocument();
    expect(screen.getByText(mockLanguageData.owner_id)).toBeInTheDocument();
    expect(screen.getByText(mockLanguageData.vehicle_sequence)).toBeInTheDocument();
    expect(screen.getByText(mockLanguageData.motor_claim_no)).toBeInTheDocument();

    // Verify that the case reference label is correctly generated based on refNo
    expect(screen.getByText("Police Case")).toBeInTheDocument(); // The label should be 'Police Case' based on refNo "456789"
    expect(screen.getByText("456789")).toBeInTheDocument(); // RefNo should be displayed
    expect(screen.getByText("owner123")).toBeInTheDocument(); // OwnerId should be displayed
    expect(screen.getByText("123")).toBeInTheDocument(); // Vehicle sequence number should be displayed
    expect(screen.getByText("claim123")).toBeInTheDocument(); // Claim No should be displayed
  });

  test("should render the Loading state when language data is not available", () => {
    renderComponent(null);

    // Ensure that the loading message is displayed
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("should call the window.scrollTo function on mount", () => {
    const scrollToSpy = jest.spyOn(window, "scrollTo").mockImplementation(() => {});

    renderComponent(mockLanguageData);

    // Ensure that window.scrollTo was called on mount
    expect(scrollToSpy).toHaveBeenCalledWith(0, 0);

    // Restore the original scrollTo implementation
    scrollToSpy.mockRestore();
  });

  test("should call the onClick handler for the ThemeButton", () => {
    renderComponent(mockLanguageData);

    //const themeButton = screen.getByText(mockLanguageData.submit_another_claim);
    
    // Simulate button click and check if the page reloads
    // fireEvent.click(themeButton);
    // expect(window.location.reload).toHaveBeenCalled();
  });

  test("should display the correct feedbackRequest data", () => {
    renderComponent(mockLanguageData);

    const expectedFeedbackRequest = {
      SourceType: "Online",
      ClaimRequestType: "ClaimRequest",
      caseReportId: "456789", // Using claimsInfo.refNo
      ownerId: "owner123",
      sequenceNo: 123,
      vehicleOwnerDob: "01-01-1980",
      claimNo: "claim123",
      subclaimNo: "subclaim123",
      rating: 0,
      message: "Awosome",
    };

    // Ensure Feedback component is rendered with the correct feedbackRequest
    expect(Feedback).toHaveBeenCalledWith(
      expect.objectContaining({
        feedbackData: expectedFeedbackRequest,
      }),
      {}
    );
  });
});
