import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import CompareBenefitsTravel from "./index";
import ThemeButton from "components/ThemeComponents/ThemeButton";
import { TravelData } from "types/languageData";

// Mock ThemeButton to inspect props
jest.mock("components/ThemeComponents/ThemeButton", () => ({
    __esModule: true,
    default: jest.fn(({ title }) => <button>{title}</button>),
}));

const mockThemeButton = ThemeButton as jest.Mock;

describe("CompareBenefitsTravel", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders ThemeButton with correct title when TravelData is provided", () => {
        const travelData: TravelData = {
            compare_benefits: "Compare Benefits",
        };

        render(<CompareBenefitsTravel TravelData={travelData} />);
        expect(screen.getByText("Compare Benefits")).toBeInTheDocument();
        expect(mockThemeButton).toHaveBeenCalledWith(
            expect.objectContaining({
                classes:
                    "register-claim-link-no-button text-decoration-underline link-offset-3 p-0 ps-2",
                isDisabled: false,
                title: "Compare Benefits",
                iconRight: true,
                iconName: "ArrowForwardIcon",
                variant: "link",
            }),
            {}
        );
    });

    it("renders ThemeButton with empty title when TravelData is null", () => {
        render(<CompareBenefitsTravel TravelData={null} />);
        waitFor(() => {
            expect(mockThemeButton).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: "",
                }),
                {}
            );
        });
    });

    it("renders ThemeButton with empty title when TravelData is undefined", () => {
        render(<CompareBenefitsTravel TravelData={undefined} />);
        waitFor(() => {
            expect(mockThemeButton).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: "",
                }),
                {}
            );
        });
    });
});