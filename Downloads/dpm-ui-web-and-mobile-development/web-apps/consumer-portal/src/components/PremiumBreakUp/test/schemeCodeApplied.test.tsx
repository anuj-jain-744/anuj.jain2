import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SchemeCodeApplied from "../schemeCodeApplied";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";

// Mock the context
jest.mock("components/hooks/useQuoteAndBuyContext", () => ({
  useQuoteAndBuyContext: jest.fn(),
}));

describe("SchemeCodeApplied Component", () => {
  it("renders the promo code and images correctly", () => {
    const mockSetSchemeCode = jest.fn();
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({ setSchemeCode: mockSetSchemeCode });

    render(<SchemeCodeApplied promoCodeApplied="TEST123" />);

    expect(screen.getByText("TEST123")).toBeInTheDocument();
    expect(screen.getAllByRole("img")).toHaveLength(2); // Two images
  });

  it("calls setSchemeCode with null when close icon is clicked", () => {
    const mockSetSchemeCode = jest.fn();
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({ setSchemeCode: mockSetSchemeCode });

    render(<SchemeCodeApplied promoCodeApplied="TEST123" />);
    
    const closeIcon = screen.getAllByRole("img")[1]; // Second image is the close icon
    fireEvent.click(closeIcon);

    expect(mockSetSchemeCode).toHaveBeenCalledWith(null);
  });
});