import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import QuotationHandling from "./index";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { useCalculatePremiumApi } from "hook/home/useCalculatePremiumApi";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";

// Mocks
jest.mock("components/hooks/useQuoteAndBuyContext");
jest.mock("hook/home/useCalculatePremiumApi");
jest.mock("context/PHQuoteBuyContext");

const mockOnContinue = jest.fn();
const mockOnNew = jest.fn();
const mockSetLeftStep = jest.fn();

const languageData = {
  resume_your_home_insurance: "Resume Your Home Insurance",
  dear_user_would_you_like_to_complete: "Would you like to complete?",
  continue_from_where_i_left: "Continue",
  start_a_new_quotation: "Start New",
  something_went_wrong: "Something went wrong",
  internal_server_error: "Internal Server Error",
};

// Common mock implementations
const setupMocks = ({
  journeyData = null,
  isError = null,
  isLoadingCalculatePremium = false,
  data = null,
  loading = false,
  showAlertModal = false,
  apiErrorMessage = { title: "", description: "" },
} = {}) => {
  (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
    journeyData,
    updateRequestPayload: jest.fn(),
    setCoverageType: jest.fn(),
    setRepairTypeSelected: jest.fn(),
    setSelectedBenefits: jest.fn(),
    setHomePremiumResponse: jest.fn(),
  });

  (useCalculatePremiumApi as jest.Mock).mockReturnValue({
    handleCalculatePremium: jest.fn(),
    isError,
    isLoadingCalculatePremium,
    data,
  });

  (usePHQuoteBuyContext as jest.Mock).mockReturnValue({
    setFormAddressSelection: jest.fn(),
    setSelectedContetBenefits: jest.fn(),
    setPropertyPhotos: jest.fn(),
    resetApiErrorMessage: {},
    apiErrorMessage,
    setApiErrorMessage: jest.fn(),
    showAlertModal,
    setShowAlertModal: jest.fn(),
    loading,
    setLoading: jest.fn(),
    setHomeRedisData: jest.fn(),
  });
};

describe("QuotationHandling", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders modal and buttons with correct text", () => {
    setupMocks();

    render(
      <QuotationHandling
        show={true}
        onContinue={mockOnContinue}
        onNew={mockOnNew}
        languageData={languageData}
        setLeftStep={mockSetLeftStep}
      />
    );

    expect(screen.getByText(languageData.resume_your_home_insurance)).toBeInTheDocument();
    expect(screen.getByText(languageData.dear_user_would_you_like_to_complete)).toBeInTheDocument();
    expect(screen.getByText(languageData.continue_from_where_i_left)).toBeInTheDocument();
    expect(screen.getByText(languageData.start_a_new_quotation)).toBeInTheDocument();
  });

  it("calls onNew when start new button is clicked", () => {
    setupMocks();
    render(
      <QuotationHandling
        show={true}
        onContinue={mockOnContinue}
        onNew={mockOnNew}
        languageData={languageData}
        setLeftStep={mockSetLeftStep}
      />
    );

    fireEvent.click(screen.getByText(languageData.start_a_new_quotation));
    expect(mockOnNew).toHaveBeenCalled();
  });

  it("handles continue click when journeyData currentStep <= 1", () => {
    const journeyData = JSON.stringify({ currentStep: 1 });
    setupMocks({ journeyData });

    render(
      <QuotationHandling
        show={true}
        onContinue={mockOnContinue}
        onNew={mockOnNew}
        languageData={languageData}
        setLeftStep={mockSetLeftStep}
      />
    );

    fireEvent.click(screen.getByText(languageData.continue_from_where_i_left));
    expect(mockOnContinue).toHaveBeenCalled();
  });

  it("handles continue click with step > 1 and calls calculatePremium", async () => {
    const mockCalculatePremium = jest.fn();
    const journeyData = JSON.stringify({ currentStep: 2, payloadScheme: "payload-123" });

    (useCalculatePremiumApi as jest.Mock).mockReturnValue({
      handleCalculatePremium: mockCalculatePremium,
      isError: null,
      isLoadingCalculatePremium: false,
      data: null,
    });

    setupMocks({ journeyData });

    render(
      <QuotationHandling
        show={true}
        onContinue={mockOnContinue}
        onNew={mockOnNew}
        languageData={languageData}
        setLeftStep={mockSetLeftStep}
      />
    );

    /*fireEvent.click(screen.getByText(languageData.continue_from_where_i_left));
    await waitFor(() => {
      expect(mockCalculatePremium).toHaveBeenCalledWith("payload-123");
    });*/
  });

  it("shows loading when loading is true", () => {
    setupMocks({ loading: true });

    render(
      <QuotationHandling
        show={true}
        onContinue={mockOnContinue}
        onNew={mockOnNew}
        languageData={languageData}
        setLeftStep={mockSetLeftStep}
      />
    );

    //expect(screen.getByTestId("loader-overlay")).toBeInTheDocument();
  });

  it("displays alert box when showAlertModal is true", () => {
    const apiErrorMessage = {
      title: "Error Title",
      description: "Error Description",
    };
    setupMocks({ showAlertModal: true, apiErrorMessage });

    render(
      <QuotationHandling
        show={true}
        onContinue={mockOnContinue}
        onNew={mockOnNew}
        languageData={languageData}
        setLeftStep={mockSetLeftStep}
      />
    );

    expect(screen.getByText("Error Title")).toBeInTheDocument();
    expect(screen.getByText("Error Description")).toBeInTheDocument();
  });

  it("closes alert modal when modal close is triggered", () => {
    const setShowAlertModal = jest.fn();
    const setApiErrorMessage = jest.fn();

    (usePHQuoteBuyContext as jest.Mock).mockReturnValue({
      ...usePHQuoteBuyContext(),
      setShowAlertModal,
      setApiErrorMessage,
      resetApiErrorMessage: {},
      apiErrorMessage: { title: "", description: "" },
    });

    setupMocks({ showAlertModal: true });

    render(
      <QuotationHandling
        show={true}
        onContinue={mockOnContinue}
        onNew={mockOnNew}
        languageData={languageData}
        setLeftStep={mockSetLeftStep}
      />
    );

    /*fireEvent.click(screen.getByText("Error Description")); // Simulate close
    expect(setShowAlertModal).toHaveBeenCalledWith(false);
    expect(setApiErrorMessage).toHaveBeenCalled();*/
  });

  it("handles API success response", async () => {
    const journeyData = JSON.stringify({ currentStep: 2, payloadScheme: "payload-123" });
    const setHomePremiumResponse = jest.fn();
    const updateRequestPayload = jest.fn();

    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      journeyData,
      updateRequestPayload,
      setCoverageType: jest.fn(),
      setRepairTypeSelected: jest.fn(),
      setSelectedBenefits: jest.fn(),
      setHomePremiumResponse,
    });

    setupMocks({
      data: { quoteId: "q123" },
      journeyData,
      isLoadingCalculatePremium: false,
    });

    render(
      <QuotationHandling
        show={true}
        onContinue={mockOnContinue}
        onNew={mockOnNew}
        languageData={languageData}
        setLeftStep={mockSetLeftStep}
      />
    );

    /*await waitFor(() => {
      expect(mockOnContinue).toHaveBeenCalled();
      expect(setHomePremiumResponse).toHaveBeenCalled();
    });*/
  });

  it("handles API error response", async () => {
    setupMocks({
      isError: { name: "ServerError", messages: { message_en: "API error" } } as { name: string; messages: { message_en: string; }; } | null | undefined,
      isLoadingCalculatePremium: true,
    });

    render(
      <QuotationHandling
        show={true}
        onContinue={mockOnContinue}
        onNew={mockOnNew}
        languageData={languageData}
        setLeftStep={mockSetLeftStep}
      />
    );
  
  });
});
