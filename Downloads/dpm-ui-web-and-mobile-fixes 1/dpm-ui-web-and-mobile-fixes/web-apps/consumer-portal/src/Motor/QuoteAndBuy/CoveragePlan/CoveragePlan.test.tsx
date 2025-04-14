import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CoveragePlan from ".";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { LanguageData } from "types/languageData";
import { ICoveragePlanData } from "types/coverageplan";

jest.mock("components/hooks/useQuoteAndBuyContext");

const mockUseQuoteAndBuyContext = useQuoteAndBuyContext as jest.MockedFunction<typeof useQuoteAndBuyContext>;

describe("CoveragePlan Component", () => {
    const mockSetRepairTypeSelected = jest.fn();
    const mockSetCoverageType = jest.fn();

    beforeEach(() => {
        mockUseQuoteAndBuyContext.mockReturnValue({
            setRepairTypeSelected: mockSetRepairTypeSelected,
            setCoverageType: mockSetCoverageType,
        });
    });

    const languageData: LanguageData = {
        comprehensive_third_party: [
            {
                id: 1,
                name: "Comprehensive",
            },
            {
                id: 2,
                name: "Third Party",
            },
        ] as unknown as ICoveragePlanData[],
    };

    it("renders CoveragePlan component", () => {
        render(<CoveragePlan languageData={languageData} />);
        expect(screen.getByTestId("CoveragePlan-test")).toBeInTheDocument();
    });

    it("calls setCoverageType on coverage plan selection", () => {
        render(<CoveragePlan languageData={languageData} />);
        const input = screen.getByLabelText("Comprehensive") as HTMLInputElement;
        fireEvent.change(input, { target: { value: "Comprehensive" } });
        expect(mockSetCoverageType).toHaveBeenCalledWith("comprehensive");
    });

    it("calls setRepairTypeSelected with null when third party is selected", () => {
        render(<CoveragePlan languageData={languageData} />);
        const input = screen.getByLabelText("Third Party") as HTMLInputElement;
        fireEvent.change(input, { target: { value: "Third Party" } });
        expect(mockSetRepairTypeSelected).toHaveBeenCalledWith(null);
    });

    it("updates isRepairTypeChecked state on handleRepairTypeChecked call", () => {
        render(<CoveragePlan languageData={languageData} />);
        const input = screen.getByLabelText("Repair Type") as HTMLInputElement;
        fireEvent.change(input, { target: { checked: true } });
        expect(input.checked).toBe(true);
    });
});