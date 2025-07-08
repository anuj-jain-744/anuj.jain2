import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SchemeCodeApplied from "./schemeCodeApplied";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";

jest.mock("components/hooks/useQuoteAndBuyContext");

describe("SchemeCodeApplied", () => {
  const setSchemeCodeMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      setSchemeCode: setSchemeCodeMock,
    });
  });

  it("renders promo code and images", () => {
    render(<SchemeCodeApplied promoCodeApplied="PROMO123" />);
    expect(screen.getByText("PROMO123")).toBeInTheDocument();
    expect(screen.getAllByAltText("PROMO123").length).toBe(2);
  });

  it("calls setSchemeCode(null) when cross icon is clicked", () => {
    render(<SchemeCodeApplied promoCodeApplied="PROMO123" />);
    const crossIcon = screen.getAllByAltText("PROMO123")[1];
    fireEvent.click(crossIcon);
    expect(setSchemeCodeMock).toHaveBeenCalledWith(null);
  });
});
