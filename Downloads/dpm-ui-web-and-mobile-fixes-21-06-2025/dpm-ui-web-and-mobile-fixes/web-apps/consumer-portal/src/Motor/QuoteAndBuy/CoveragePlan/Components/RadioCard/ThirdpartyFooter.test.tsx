import React from "react";
import { render, screen } from "@testing-library/react";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { compensationTypeCardFinalVAT } from "../../CommonFunction/CommonFunction";
import { getAmountWithIcon } from "@app-shell/utils/common";
import ThirdpartyFooter from "./ThirdpartyFooter";

// Mock dependencies
jest.mock("components/hooks/useQuoteAndBuyContext");
jest.mock("../../CommonFunction/CommonFunction", () => ({
  compensationTypeCardFinalVAT: jest.fn(),
}));
jest.mock("@app-shell/utils/common", () => ({
  getAmountWithIcon: jest.fn(),
}));

describe("ThirdpartyFooter Component", () => {
  const mockUseQuoteAndBuyContext = useQuoteAndBuyContext as jest.Mock;

  beforeEach(() => {
    mockUseQuoteAndBuyContext.mockReturnValue({
      comp3rdParty: {
        pricingOptions: [
          {
            finalAmount: 1000,
            taxFeeBreakdowns: [{ percentage: 5 }],
          },
        ],
      },
    });
    (compensationTypeCardFinalVAT as jest.Mock).mockReturnValue(5);
    (getAmountWithIcon as jest.Mock).mockReturnValue("$1000");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the component with valid data", () => {
    render(
      <ThirdpartyFooter
        languageData={{ vat: "VAT" }}
      />
    );

    expect(screen.getByText("$1000")).toBeInTheDocument();
    expect(screen.getByText("+5% VAT")).toBeInTheDocument();
    expect(getAmountWithIcon).toHaveBeenCalledWith(1000);
    expect(compensationTypeCardFinalVAT).toHaveBeenCalledWith(5);
  });

  it("should render correctly when languageData is null", () => {
    render(<ThirdpartyFooter languageData={null} />);

    expect(screen.queryByText("VAT")).not.toBeInTheDocument();
  });

});