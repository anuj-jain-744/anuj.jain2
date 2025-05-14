import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SelectCoveragePlan from ".";
import { LanguageData } from "types/languageData";
import { ICoveragePlanData } from "types/coverageplan";
import SampleData from "../../Mockdata/data.json"
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";

jest.mock("components/hooks/useQuoteAndBuyContext");

(useQuoteAndBuyContext as jest.Mock).mockReturnValue({
    repairTypeSelected: true,
    deductibleAmounts: [],
    setRepairTypeSelected: jest.fn(),
    setSliderValueSumInsured: jest.fn(),
    setSliderValueDeductibles: jest.fn(),
});

const mockLanguageData: LanguageData = {
    select_coverage_plan: "Select Coverage Plan",
};

const mockCoveragePlanData: ICoveragePlanData[] = SampleData;

const mockOnChange = jest.fn();
const mockOnRepairTypeChecked = jest.fn();

describe("SelectCoveragePlan", () => {
    it("renders without crashing", () => {
        render(
            <SelectCoveragePlan
                languageData={mockLanguageData}
                coveragePlanData={mockCoveragePlanData}
                onChange={mockOnChange}
                coveragePlanSelected={null}
                isRepairTypeChecked={false}
                onRepairTypeChecked={mockOnRepairTypeChecked}
            />
        );
        expect(screen.getByText("Select Coverage Plan")).toBeInTheDocument();
    });

    it("calls onChange when a coverage plan is selected", () => {
        render(
            <SelectCoveragePlan
                languageData={mockLanguageData}
                coveragePlanData={mockCoveragePlanData}
                onChange={mockOnChange}
                coveragePlanSelected={null}
                isRepairTypeChecked={false}
                onRepairTypeChecked={mockOnRepairTypeChecked}
            />
        );
        const input = screen.getByLabelText("Plan A");
        fireEvent.change(input, { target: { value: "Plan A" } });
        expect(mockOnChange).toHaveBeenCalled();
    });

    it("calls onRepairTypeChecked when the repair type checkbox is clicked", () => {
        render(
            <SelectCoveragePlan
                languageData={mockLanguageData}
                coveragePlanData={mockCoveragePlanData}
                onChange={mockOnChange}
                coveragePlanSelected={"comprehensive"}
                isRepairTypeChecked={true}
                onRepairTypeChecked={mockOnRepairTypeChecked}
            />
        );
        const checkbox = screen.getByLabelText("Repair Type");
        fireEvent.click(checkbox);
        expect(mockOnRepairTypeChecked).toHaveBeenCalled();
    });

    it("displays the selected coverage plan", () => {
        render(
            <SelectCoveragePlan
                languageData={mockLanguageData}
                coveragePlanData={mockCoveragePlanData}
                onChange={mockOnChange}
                coveragePlanSelected="comprehensive"
                isRepairTypeChecked={false}
                onRepairTypeChecked={mockOnRepairTypeChecked}
            />
        );
        expect(screen.getByText("Comprehensive")).toBeInTheDocument();
    });
});