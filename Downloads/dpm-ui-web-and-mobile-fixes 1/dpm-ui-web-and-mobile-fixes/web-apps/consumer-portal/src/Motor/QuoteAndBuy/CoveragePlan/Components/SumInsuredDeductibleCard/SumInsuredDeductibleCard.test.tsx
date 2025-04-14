import React from "react";
import { render, screen } from "@testing-library/react";
import SumInsuredDeductibleCard from "./index";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import data from "./../../../SumInsuredAndDeductibles/SumInsuredAndDeductibles.json";

jest.mock("components/hooks/useQuoteAndBuyContext");
const mockUseQuoteAndBuyContext = useQuoteAndBuyContext as jest.Mock;

describe("SumInsuredDeductibleCard Component", () => {
  beforeEach(() => {
    mockUseQuoteAndBuyContext.mockReturnValue({
      sliderValueDeductibles: 5000,
      sliderValueSumInsured: 20000,
    });
  });

  test("renders SumInsuredDeductibleCard component", () => {
    render(<SumInsuredDeductibleCard />);
    expect(screen.getByText(data.sum_insured)).toBeInTheDocument();
    expect(screen.getByText(data.deductible)).toBeInTheDocument();
  });

  test("displays correct sum insured value", () => {
    render(<SumInsuredDeductibleCard />);
    expect(screen.getByText(`${data.sar} 20000`)).toBeInTheDocument();
  });

  test("displays correct deductible value", () => {
    render(<SumInsuredDeductibleCard />);
    expect(screen.getByText(`${data.sar} 5000`)).toBeInTheDocument();
  });
});