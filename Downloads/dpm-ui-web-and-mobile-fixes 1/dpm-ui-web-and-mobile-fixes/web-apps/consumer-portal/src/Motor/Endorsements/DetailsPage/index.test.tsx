import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import DetailsPage from "./index";
import { DataContext } from "../../../DataContext";
import { callAPI } from "@dpm/shared-module";
import { PaySuccess } from "./PaySuccess";

// Mock callAPI to avoid making real API calls during the test
jest.mock("@dpm/shared-module", () => ({
  callAPI: jest.fn(),
}));

// Mock PaySuccess component to avoid deep testing of its functionality
jest.mock("./PaySuccess", () => ({
  PaySuccess: jest.fn(() => <div>Mocked PaySuccess</div>),
}));

describe("DetailsPage", () => {
  beforeEach(() => {
    // Reset mock calls before each test
    jest.clearAllMocks();
  });

  it("renders correctly", async () => {
    // Prepare mock data for API response
    const mockResponse = { config: [{ key: "value" }] };
    (callAPI as jest.Mock).mockResolvedValue(mockResponse);

    // Render the component
    await act(async () => {
      render(<DetailsPage />);
    });

    // Ensure that PaySuccess component is rendered
    expect(screen.getByText("Mocked PaySuccess")).toBeInTheDocument();
  });

  it("fetches and provides language data from API", async () => {
    // Prepare mock data for API response
    const mockResponse = { config: [{ key: "value" }] };
    (callAPI as jest.Mock).mockResolvedValue(mockResponse);

    // Render the component
    await act(async () => {
      render(<DetailsPage />);
    });

    // Wait for the API call to finish and check if language data is provided
    await waitFor(() => {
      expect(callAPI).toHaveBeenCalledWith("get", expect.stringContaining("consumerportal-config"));
    });
  });

  it("handles error when API call fails", async () => {
    // Simulate API failure
    (callAPI as jest.Mock).mockRejectedValue(new Error("Failed to fetch"));

    // Render the component
    await act(async () => {
      render(<DetailsPage />);
    });

    // Ensure that PaySuccess is still rendered even if the API call fails
    expect(screen.getByText("Mocked PaySuccess")).toBeInTheDocument();
  });
});
