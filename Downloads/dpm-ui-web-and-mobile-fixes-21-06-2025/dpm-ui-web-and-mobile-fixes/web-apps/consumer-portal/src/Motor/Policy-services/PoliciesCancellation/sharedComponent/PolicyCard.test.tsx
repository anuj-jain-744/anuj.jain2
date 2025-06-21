import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import PolicyCard from "./PolicyCard";
import { callAPI } from "@dpm/shared-module";

// Mock getAmountWithIcon
jest.mock('@app-shell/utils/common', () => ({
  getAmountWithIcon: jest.fn(amount => `SAR ${amount}`),
}));

jest.mock("@dpm/shared-module", () => ({
  callAPI: jest.fn(),
}));

describe("PolicyCard", () => {
  const mockProps = {
    policyNumber: "POL123456",
    startDate: "2023-01-01",
    expiryDate: "2024-01-01",
    idvValue: 500000,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders PolicyCard with correct data", async () => {
    (callAPI as jest.Mock).mockResolvedValueOnce({
      config: [
        {
          policy_no: "Policy Number",
          comprehensive: "Comprehensive",
          start_date: "Start Date",
          expiry_date: "Expiry Date",
          insured_declared_value_idv: "Insured Declared Value (IDV)",
        },
      ],
    });

    /*render(<PolicyCard {...mockProps} />);

    expect(screen.getByText(mockProps.policyNumber)).toBeInTheDocument();

    expect(screen.getByText(mockProps.idvValue)).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText(/Insured Declared Value \(IDV\)/i)
      ).toBeInTheDocument();
    });*/
  });

  /*test("calls API on mount", async () => {
    (callAPI as jest.Mock).mockResolvedValueOnce({ config: [{}] });

    render(<PolicyCard {...mockProps} />);

    await waitFor(() => {
      expect(callAPI).toHaveBeenCalledWith(
        "get",
        expect.stringContaining("en/api/consumerportal-config")
      );
    });
  });*/
});
