import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdditionalBenefitModal from "./index";
import { useQuoteAndBuyContext } from "../hooks/useQuoteAndBuyContext";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";
import { useCalculatePremiumApi } from "hook/home/useCalculatePremiumApi";

jest.mock("../hooks/useQuoteAndBuyContext");
jest.mock("context/PHQuoteBuyContext");
jest.mock("hook/home/useCalculatePremiumApi");

const mockUseQuoteAndBuyContext = useQuoteAndBuyContext as jest.Mock;
const mockUsePHQuoteBuyContext = usePHQuoteBuyContext as jest.Mock;
const mockUseCalculatePremiumApi = useCalculatePremiumApi as jest.Mock;

describe("AdditionalBenefitModal", () => {
    beforeEach(() => {
        mockUseQuoteAndBuyContext.mockReturnValue({
            selectedBenefits: [],
            setSelectedBenefits: jest.fn(),
            repairTypeSelected: "Comprehensive",
            compWorkShop: { benefits: [] },
            homePremiumResponse: {},
            setHomePremiumResponse: jest.fn(),
            requestPayload: {},
            updateRequestPayload: jest.fn(),
        });

        mockUsePHQuoteBuyContext.mockReturnValue({
            apiErrorMessage: {},
            setApiErrorMessage: jest.fn(),
            resetApiErrorMessage: jest.fn(),
            showAlertModal: false,
            setShowAlertModal: jest.fn(),
        });

        mockUseCalculatePremiumApi.mockReturnValue({
            handleCalculatePremium: jest.fn(),
            isError: false,
            isLoadingCalculatePremium: false,
            data: null,
        });
    });

    test("renders AdditionalBenefitModal component", () => {
        render(<AdditionalBenefitModal show={true} onHide={jest.fn()} languageData={{}} />);
        expect(screen.getByText("Additional Benefits")).toBeInTheDocument();
    });

    test("handles adding a benefit", async () => {
        const setSelectedBenefits = jest.fn();
        mockUseQuoteAndBuyContext.mockReturnValueOnce({
            ...mockUseQuoteAndBuyContext(),
            selectedBenefits: [],
            setSelectedBenefits,
            compWorkShop: { benefits: [{ benefitNameEn: "Benefit 1", benefitPrice: 100, benefitCode: "B1" }] },
        });

        render(<AdditionalBenefitModal show={true} onHide={jest.fn()} languageData={{}} />);
        fireEvent.click(screen.getByText("Add"));

        await waitFor(() => {
            expect(setSelectedBenefits).toHaveBeenCalledWith(expect.arrayContaining([{ title: "Benefit 1", price: 100, code: "B1" }]));
        });
    });

    test("handles adding a benefit for home use case", async () => {
        const setSelectedBenefits = jest.fn();
        mockUseQuoteAndBuyContext.mockReturnValueOnce({
            ...mockUseQuoteAndBuyContext(),
            selectedBenefits: [],
            setSelectedBenefits,
            homePremiumResponse: {
                'walaacare': {
                    "pricingOptions": [
                        {
                            "finalAmount": 2300.0
                        }]
                }
            },
            requestPayload: {
                "policyRisk": [{
                    'policyCoverage': [
                        {
                            'covergeCode': 'cc',
                        }
                    ]
                }]
            }
        });

        render(<AdditionalBenefitModal show={true} onHide={jest.fn()} languageData={{}} />);
        fireEvent.click(screen.getByText("Add"));

        await waitFor(() => {
            expect(setSelectedBenefits).toHaveBeenCalledWith(expect.arrayContaining([{ title: "Benefit 1", price: 100, code: "B1" }]));
        });
    });

    test("handles removing a benefit", async () => {
        const setSelectedBenefits = jest.fn();
        mockUseQuoteAndBuyContext.mockReturnValueOnce({
            ...mockUseQuoteAndBuyContext(),
            selectedBenefits: [{ title: "Benefit 1", price: 100, code: "B1" }],
            setSelectedBenefits,
        });

        render(<AdditionalBenefitModal show={true} onHide={jest.fn()} languageData={{}} />);
        fireEvent.click(screen.getByAltText("delete"));

        await waitFor(() => {
            expect(setSelectedBenefits).toHaveBeenCalledWith([]);
        });
    });

    test("handles API error", async () => {
        mockUseCalculatePremiumApi.mockReturnValueOnce({
            ...mockUseCalculatePremiumApi(),
            isError: { name: "Error", messages: { message_en: "Something went wrong" } },
            isLoadingCalculatePremium: true,
        });

        render(<AdditionalBenefitModal show={true} onHide={jest.fn()} languageData={{ internal_server_error: "Internal Server Error", something_went_wrong: "Something went wrong" }} />);

        await waitFor(() => {
            expect(screen.getByText("Internal Server Error")).toBeInTheDocument();
            expect(screen.getByText("Something went wrong")).toBeInTheDocument();
        });
    });
});