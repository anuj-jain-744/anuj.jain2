import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Layout from "./index";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { useCalculatePremiumApi } from "hook/travel/useCalculatePremiumApi";
import { useDirectDraftApi } from "hook/travel/useDirectDraftApi";
import { BrowserRouter } from "react-router-dom";

jest.mock("components/hooks/useQuoteAndBuyContext", () => ({
  useQuoteAndBuyContext: jest.fn()
}));

jest.mock("hook/travel/useCalculatePremiumApi", () => ({
  useCalculatePremiumApi: jest.fn()
}));

jest.mock("hook/travel/useDirectDraftApi", () => ({
  useDirectDraftApi: jest.fn()
}));

describe("Layout Component", () => {
  beforeEach(() => {
    useQuoteAndBuyContext.mockReturnValue({
      isTermCondition: true,
      email: "test@example.com",
      coverageType: "comprehensive",
      setCoverageType: jest.fn(),
      setRepairTypeSelected: jest.fn(),
      setStepValue: jest.fn(),
      travelcoverageType: "basic",
      travelcoveragePlan: "standard",
      isAddTravelerValidation: true,
      setQuoteDataResponse: jest.fn(),
      quoteDataResponse: null
    });

    useCalculatePremiumApi.mockReturnValue({
      handleCalculatePremium: jest.fn(),
      isError: false,
      isLoadingCalculatePremium: false,
      isCalculateData: false
    });

    useDirectDraftApi.mockReturnValue({
      handleReviewQuotePremium: jest.fn(),
      isError: false,
      isloadingdirectdraft: false,
      isDirectData: false
    });
  });

  it("renders Layout component correctly", () => {
    render(
      <BrowserRouter>
        <Layout leftPanel={<div>Left Panel</div>} rightPanel={<div>Right Panel</div>} leftStep={1} languageData={null} setLeftStep={jest.fn()} />
      </BrowserRouter>
    );
    
    expect(screen.getByText("Left Panel")).toBeInTheDocument();
    expect(screen.getByText("Right Panel")).toBeInTheDocument();
  });

  it("handles back button click correctly", () => {
    const setLeftStepMock = jest.fn();
    render(
      <BrowserRouter>
        <Layout leftPanel={<div />} rightPanel={<div />} leftStep={2} languageData={null} setLeftStep={setLeftStepMock} />
      </BrowserRouter>
    );
    waitFor(() => {
        const backButton = screen.getByText("Back"); 
        fireEvent.click(backButton);
        expect(setLeftStepMock).toHaveBeenCalledWith(1);
     });
  });

  it("handles select coverage button click correctly", () => {
    const setLeftStepMock = jest.fn();
    render(
      <BrowserRouter>
        <Layout leftPanel={<div />} rightPanel={<div />} leftStep={1} languageData={null} setLeftStep={setLeftStepMock} />
      </BrowserRouter>
    );
    waitFor(() => { 
        const selectCoverageButton = screen.getByText("Select Coverage"); // Assuming button text
        fireEvent.click(selectCoverageButton);
        expect(setLeftStepMock).toHaveBeenCalledWith(2);
    });
    
    
  });

  it("displays alert box on API error", () => {
    useCalculatePremiumApi.mockReturnValue({
      handleCalculatePremium: jest.fn(),
      isError: { name: "Error", messages: { message_en: "Something went wrong" } },
      isLoadingCalculatePremium: false,
      isCalculateData: false
    });

    render(
      <BrowserRouter>
        <Layout leftPanel={<div />} rightPanel={<div />} leftStep={1} languageData={null} setLeftStep={jest.fn()} />
      </BrowserRouter>
    );

    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });
});