import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import SuccessTopComponent from "./index";
import * as sharedModule from "@dpm/shared-module";
import * as paymentUtils from "utils/paymentUtils";

jest.mock("@dpm/shared-module", () => ({
  useApiCall: jest.fn(),
}));

jest.mock("utils/paymentUtils", () => ({
  processTransactionId: jest.fn(),
}));

const mockUseApiCall = sharedModule.useApiCall as jest.Mock;
const mockProcessTransactionId = paymentUtils.processTransactionId as jest.Mock;

describe("SuccessTopComponent", () => {
  const mockLanguageData = {
    success: "Success!",
    success_msg_cancel: "Cancellation Success",
    successfully_added: "Successfully added",
    success_msg_review_quotes: "Review your quotes",
    further_questions: "Further questions?",
    contact_walaa: "Contact Walaa",
    successfully_added_driver: "Driver successfully added",
    success_msg_home_reg_claim: "Home claim success",
    travel_claim_success: "Travel claim success",
  };

  const baseProps = {
    status: true,
    data: {
      policyNumber: "POL123",
    },
    flag: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  function renderWithRouter(ui: React.ReactElement, route = "/success/tx123") {
    return render(
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/success/:transactionid" element={ui} />
        </Routes>
      </MemoryRouter>
    );
  }

  it("renders and scrolls to top on mount", () => {
    window.scrollTo = jest.fn();
    mockUseApiCall.mockReturnValue({
      makeApiCall: jest.fn(),
      data: undefined,
    });
    mockProcessTransactionId.mockReturnValue({});

    renderWithRouter(<SuccessTopComponent {...baseProps} />);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("calls makeApiCall once on mount", () => {
    const makeApiCallMock = jest.fn();
    mockUseApiCall.mockReturnValue({
      makeApiCall: makeApiCallMock,
      data: undefined,
    });
    mockProcessTransactionId.mockReturnValue({});

    renderWithRouter(<SuccessTopComponent {...baseProps} />);
    expect(makeApiCallMock).toHaveBeenCalledTimes(1);
  });

  it("renders success icon when loading is false and status is true", () => {
    mockUseApiCall.mockReturnValue({ makeApiCall: jest.fn(), data: undefined });
    mockProcessTransactionId.mockReturnValue({});

    renderWithRouter(<SuccessTopComponent {...baseProps} loading={false} />);
    const img = screen.getByAltText(/success icon/i);
    expect(img).toBeInTheDocument();
  });

  it("renders success icon inside loading div when loading is true", () => {
    mockUseApiCall.mockReturnValue({ makeApiCall: jest.fn(), data: undefined });
    mockProcessTransactionId.mockReturnValue({});

    renderWithRouter(<SuccessTopComponent {...baseProps} loading={true} />);
    const img = screen.getByAltText(/success icon/i);
    expect(img).toBeInTheDocument();
  });

  it("renders cancel success message when status is false and flag is false", () => {
    mockUseApiCall.mockReturnValue({ makeApiCall: jest.fn(), data: { config: [mockLanguageData] } });
    mockProcessTransactionId.mockReturnValue({});

    renderWithRouter(<SuccessTopComponent {...baseProps} status={false} flag={false} />);
    expect(screen.getByText(mockLanguageData.success_msg_cancel)).toBeInTheDocument();
  });

  it("renders review quotes message when flag is true", () => {
    mockUseApiCall.mockReturnValue({ makeApiCall: jest.fn(), data: { config: [mockLanguageData] } });
    mockProcessTransactionId.mockReturnValue({});

    renderWithRouter(<SuccessTopComponent {...baseProps} flag={true} />);
    expect(screen.getByText(mockLanguageData.success_msg_review_quotes)).toBeInTheDocument();
  });

  it("renders successfully_added_driver message when flag is true and driver array is provided", () => {
    mockUseApiCall.mockReturnValue({ makeApiCall: jest.fn(), data: { config: [mockLanguageData] } });
    mockProcessTransactionId.mockReturnValue({ endrosmentNo: "12345" });

    renderWithRouter(
      <SuccessTopComponent
        {...baseProps}
        flag={true}
        typeCode={true}
        driver={["driver1", "driver2"]}
      />
    );
    expect(screen.getByText(/driver successfully added/i)).toBeInTheDocument();
  });

 

  it("renders cancellation text when status is false and flag is false", () => {
    mockUseApiCall.mockReturnValue({ makeApiCall: jest.fn(), data: { config: [mockLanguageData] } });
    mockProcessTransactionId.mockReturnValue({});

    renderWithRouter(
      <SuccessTopComponent
        {...baseProps}
        status={false}
        flag={false}
        data={{ cancellation: "Policy cancelled" }}
        typeCode={false}
      />
    );
    expect(screen.getByText(/policy cancelled/i)).toBeInTheDocument();
  });
});
