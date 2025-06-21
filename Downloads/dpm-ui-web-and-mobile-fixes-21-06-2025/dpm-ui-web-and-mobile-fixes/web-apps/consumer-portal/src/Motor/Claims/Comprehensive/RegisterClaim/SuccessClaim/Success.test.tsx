import { render, screen } from "@testing-library/react";
import Success from "./Success";
import Feedback from "components/Feedback";

jest.mock("./SuccessTopComponent", () => jest.fn(() => <div>SuccessTopComponent</div>));
jest.mock("./SuccessLeftComponent", () => jest.fn(() => <div>SuccessLeftComponent</div>));
jest.mock("./SuccesRightComponent", () => jest.fn(() => <div>SuccesRightComponent</div>));
jest.mock("components/Feedback", () => jest.fn(() => <div>Feedback</div>));
jest.mock("components/Footer", () => jest.fn(() => <div>PolicyFooter</div>));

describe("Success Component", () => {
  const mockProps = {
    status: true,
    claimNo: "12345",
    claimLabel: "Claim Label",
    validationData: {
      SourceType: "Online",
      ClaimRequestType: "ClaimRequest",
      CaseReportId: "CR123",
      OwnerId: "Owner123",
      sequenceNo: 1,
      dob: "01-01-1980",
    },
    claimsInfo: {
      refNo: "Ref123",
      ownerId: "Owner123",
    },
    claimResponse: {
      claimNo: "12345",
      subclaimNo: "67890",
    },
  };

  test("should render Success component correctly", () => {
    render(<Success {...mockProps} />);

    // Ensure that all mocked components render
    expect(screen.getByText("SuccessTopComponent")).toBeInTheDocument();
    expect(screen.getByText("SuccessLeftComponent")).toBeInTheDocument();
    expect(screen.getByText("SuccesRightComponent")).toBeInTheDocument();
    expect(screen.getByText("Feedback")).toBeInTheDocument();
    expect(screen.getByText("PolicyFooter")).toBeInTheDocument();
  });

  test("should pass the correct feedbackRequest to Feedback component", () => {
    render(<Success {...mockProps} />);

    const feedbackRequest = {
      SourceType: "Online",
      ClaimRequestType: "ClaimRequest",
      caseReportId: "Ref123",
      ownerId: "Owner123",
      sequenceNo: 1,
      vehicleOwnerDob: "01-01-1980",
      claimNo: "12345",
      subclaimNo: "67890",
      rating: 0,
      message: "Awosome",
    };

    expect(Feedback).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/Motor/Claim/V1/SubmitFeedback",
        feedbackData: feedbackRequest,
      }),
      {}
    );
  });

  test("should render correctly with missing claimsInfo", () => {
    const propsWithMissingClaimsInfo = {
      ...mockProps,
      claimsInfo: undefined,
    };

    render(<Success {...propsWithMissingClaimsInfo} />);

    // Ensure that the component still renders with missing claimsInfo
    expect(screen.getByText("SuccessTopComponent")).toBeInTheDocument();
    expect(screen.getByText("SuccessLeftComponent")).toBeInTheDocument();
    expect(screen.getByText("SuccesRightComponent")).toBeInTheDocument();
    expect(screen.getByText("Feedback")).toBeInTheDocument();
    expect(screen.getByText("PolicyFooter")).toBeInTheDocument();
  });

  test("should render correctly with missing claimResponse", () => {
    const propsWithMissingClaimResponse = {
      ...mockProps,
      claimResponse: undefined,
    };

    render(<Success {...propsWithMissingClaimResponse} />);

    // Ensure that the component still renders with missing claimResponse
    expect(screen.getByText("SuccessTopComponent")).toBeInTheDocument();
    expect(screen.getByText("SuccessLeftComponent")).toBeInTheDocument();
    expect(screen.getByText("SuccesRightComponent")).toBeInTheDocument();
    expect(screen.getByText("Feedback")).toBeInTheDocument();
    expect(screen.getByText("PolicyFooter")).toBeInTheDocument();
  });

  test("should render correctly with status false", () => {
    const propsWithStatusFalse = {
      ...mockProps,
      status: false,
    };

    render(<Success {...propsWithStatusFalse} />);

    // Ensure that the component renders correctly with status false
    expect(screen.getByText("SuccessTopComponent")).toBeInTheDocument();
    expect(screen.getByText("SuccessLeftComponent")).toBeInTheDocument();
    expect(screen.getByText("SuccesRightComponent")).toBeInTheDocument();
    expect(screen.getByText("Feedback")).toBeInTheDocument();
    expect(screen.getByText("PolicyFooter")).toBeInTheDocument();
  });
});
