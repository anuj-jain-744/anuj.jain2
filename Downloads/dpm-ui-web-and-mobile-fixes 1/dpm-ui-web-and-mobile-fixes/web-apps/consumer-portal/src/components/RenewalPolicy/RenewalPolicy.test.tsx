import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import RenewalPolicy from "./index";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";


jest.mock("components/hooks/useQuoteAndBuyContext", () => ({
  useQuoteAndBuyContext: jest.fn(),
}));

jest.mock("context/PHQuoteBuyContext", () => ({
  usePHQuoteBuyContext: jest.fn(),
}));


describe("RenewalPolicy Component", () => {
  beforeEach(() => {
      (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
        repairTypeSelected: "test one",
        policyStartDate: "03/03/2025",
        coverageType: "testcontents",
      });
      (usePHQuoteBuyContext as jest.Mock).mockReturnValue({
        homePolicyRenewal: {"policyNumber": "123", "expiryDate": "2025/03/03"},
      });
    });
  const languageData = {"testcontents": [{"benefits": ['sum', 'content'],"testone":["50","test data"]}]};
  it('renders a renewal policy', ()=>{
    render(<RenewalPolicy languageData={languageData} />);
    expect(screen.getByText("test data")).toBeInTheDocument();
  })
 });