import { render, screen } from "@testing-library/react";
import HomeCoverageDeductibleCard from "./index";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";

jest.mock("components/hooks/useQuoteAndBuyContext");
const mockUseQuoteAndBuyContext = useQuoteAndBuyContext as jest.Mock;

describe("HomeCoverageDeductibleCard Component", () => {
  beforeEach(() => {
    mockUseQuoteAndBuyContext.mockReturnValue({
      coverageType: 'testcontents',
      repairTypeSelected: 'test one',
    });
  });

  const languageData = {"testcontents": [{"benefits": ['sum', 'content'],"testone":["50","test data"]}]};

  test("renders HomeCoverageDeductibleCard component", () => {
    render(<HomeCoverageDeductibleCard languageData={languageData} />);
    expect(screen.getByText("test data")).toBeInTheDocument();
  });
});