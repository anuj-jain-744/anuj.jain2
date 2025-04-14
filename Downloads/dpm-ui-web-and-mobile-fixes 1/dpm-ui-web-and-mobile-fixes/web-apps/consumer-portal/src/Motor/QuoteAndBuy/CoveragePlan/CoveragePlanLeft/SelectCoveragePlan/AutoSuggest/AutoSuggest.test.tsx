import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AutoSuggest from ".";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { CompensationTypeKeys } from "types/coverageplan";
import { LanguageData } from "types/languageData";

jest.mock("components/hooks/useQuoteAndBuyContext");

const mockUseQuoteAndBuyContext = useQuoteAndBuyContext as jest.MockedFunction<typeof useQuoteAndBuyContext>;

const mockLanguageData: LanguageData = {
    with_additional: "With additional",
    sar: "SAR",
    you_can_get_better_coverag: "you can get better coverage",
    comprehensive: "Comprehensive",
    workshop_repair: "Workshop Repair",
    most_of_our_customers_choo: "Most of our customers choose",
    apply_recommendation: "Apply Recommendation",
};

describe("AutoSuggest Component", () => {
    beforeEach(() => {
        mockUseQuoteAndBuyContext.mockReturnValue({
            compWorkShop: 100,
            compAgency: 200,
            compMath: 300,
            comp3rdParty: { pricingOptions: [{ finalAmount: 400 }] },
        });
    });

    it("renders third party coverage plan correctly", () => {
        render(
            <AutoSuggest
                coveragePlanSelected="thirdparty"
                languageData={mockLanguageData}
                isRepairTypeChecked={false}
                onRepairTypeChecked={jest.fn()}
            />
        );

        expect(screen.getByText(/With additional SAR 400 you can get better coverage/i)).toBeInTheDocument();
        expect(screen.getByText(/Comprehensive - Workshop Repair/i)).toBeInTheDocument();
        expect(screen.getByText(/Most of our customers choose/i)).toBeInTheDocument();
        expect(screen.getByText(/Apply Recommendation/i)).toBeInTheDocument();
    });

    it("renders comprehensive coverage plan correctly", () => {
        render(
            <AutoSuggest
                coveragePlanSelected="comprehensive"
                languageData={mockLanguageData}
                isRepairTypeChecked={false}
                onRepairTypeChecked={jest.fn()}
            />
        );

        expect(screen.getByText(/Comprehensive/i)).toBeInTheDocument();
    });

    it("renders SumInsuredAndDeductibles when repair type is checked", () => {
        render(
            <AutoSuggest
                coveragePlanSelected="comprehensive"
                languageData={mockLanguageData}
                isRepairTypeChecked={true}
                onRepairTypeChecked={jest.fn()}
            />
        );

        expect(screen.getByText(/SumInsuredAndDeductibles/i)).toBeInTheDocument();
    });

    it("calls onRepairTypeChecked when RepairType is clicked", () => {
        const mockOnRepairTypeChecked = jest.fn();
        render(
            <AutoSuggest
                coveragePlanSelected="comprehensive"
                languageData={mockLanguageData}
                isRepairTypeChecked={false}
                onRepairTypeChecked={mockOnRepairTypeChecked}
            />
        );

        fireEvent.click(screen.getByText(/RepairType/i));
        expect(mockOnRepairTypeChecked).toHaveBeenCalled();
    });
});