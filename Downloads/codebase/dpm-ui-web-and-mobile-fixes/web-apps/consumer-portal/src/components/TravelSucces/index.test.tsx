import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TravelSucces from "./index";
import * as useSaveRedisDataHook from "hook/common/useSaveRedisData";

jest.mock("../../Motor/SuccessPage/SuccesRightComponent", () => () => <div>SuccesRightComponent</div>);
jest.mock("../../Motor/SuccessPage/SuccessTopComponent", () => (props: any) => <div>SuccessTopComponent - status: {props.status.toString()}</div>);
jest.mock("../TravelSuccessLeft", () => () => <div>TravelSuccessLeft</div>);
jest.mock("components/Footer", () => () => <div>PolicyFooter</div>);
jest.mock("components/Feedback", () => (props: any) => (
  <div>Feedback - url: {props.url}</div>
));

describe("TravelSucces component", () => {
  const saveRedisDataMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(useSaveRedisDataHook, "default").mockReturnValue({ saveRedisData: saveRedisDataMock });
  });

  const defaultProps = {
    status: true,
    data: { some: "data" },
  };

  it("renders main components and passes props", () => {
    render(<TravelSucces {...defaultProps} flag={true} />);

    expect(screen.getByText(/SuccessTopComponent/)).toBeInTheDocument();
    expect(screen.getByText(/TravelSuccessLeft/)).toBeInTheDocument();
    expect(screen.getByText(/SuccesRightComponent/)).toBeInTheDocument();
    expect(screen.getByText(/PolicyFooter/)).toBeInTheDocument();
    expect(screen.getByText(/Feedback - url: \/Motor\/Claim\/V1\/SubmitFeedback/)).toBeInTheDocument();
  });

  it("calls saveRedisData on mount", () => {
    render(<TravelSucces {...defaultProps} />);
    expect(saveRedisDataMock).toHaveBeenCalledWith("empty", null, 1);
  });

  it("modal shows initially and closes on hide", async () => {
    render(<TravelSucces {...defaultProps} />);

    const modal = screen.getByRole("dialog");
    expect(modal).toBeVisible();

    const closeButton = modal.querySelector('button[aria-label="Close"]');
    expect(closeButton).toBeInTheDocument();

    if (closeButton) {
      fireEvent.click(closeButton);
    }

    await waitFor(() => {
      expect(modal).not.toBeVisible();
    });
  });

  it("renders with cancelPolicyData prop", () => {
    const cancelPolicyData = {
      policyNo: "123",
      endoNo: "456",
    };
    render(<TravelSucces {...defaultProps} cancelPolicyData={cancelPolicyData} />);
    expect(screen.getByText(/TravelSuccessLeft/)).toBeInTheDocument();
  });

  it("defaults flag to false when not provided and renders correctly", () => {
    render(<TravelSucces status={false} data={{ test: 123 }} />);
    
    expect(screen.getByText(/SuccessTopComponent/)).toBeInTheDocument();
    expect(screen.getByText(/TravelSuccessLeft/)).toBeInTheDocument();
    expect(screen.getByText(/SuccesRightComponent/)).toBeInTheDocument();
  }); 
});
