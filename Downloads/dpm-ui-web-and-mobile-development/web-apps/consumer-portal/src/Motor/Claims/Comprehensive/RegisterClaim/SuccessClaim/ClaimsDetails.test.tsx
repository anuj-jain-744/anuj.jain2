import React from "react";
import { render, screen } from "@testing-library/react";
import ClaimsDetails from ".";
import { DataContext } from "../../../../../DataContext";

const mockDataContext = {
    police_case_reference: "Police Case Reference",
    najm_case_reference: "Najm Case Reference",
    other_case_reference: "Other Case Reference",
};

const mockValidationData = {};
const mockClaimResponse = { claimNo: "12345" };
const mockClaimsInfo = { refNo: "45" };

describe("ClaimsDetails Component", () => {
    it("renders loading state when languageData is not available", () => {
        render(
            <ClaimsDetails
                validationData={mockValidationData}
                claimResponse={mockClaimResponse}
                claimsInfo={mockClaimsInfo}
            />
        );
        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("renders Success component with correct props when languageData is available", () => {
        render(
            <DataContext.Provider value={mockDataContext}>
                <ClaimsDetails
                    validationData={mockValidationData}
                    claimResponse={mockClaimResponse}
                    claimsInfo={mockClaimsInfo}
                />
            </DataContext.Provider>
        );

        expect(screen.getByText(/Please get/i)).toBeInTheDocument();
        expect(screen.getByText(/CALL/i)).toBeInTheDocument();
        expect(screen.getByText(/Whatsapp/i)).toBeInTheDocument();
        expect(screen.getByText(/Mail/i)).toBeInTheDocument();
    });

    it("returns correct case reference label based on refNo", () => {
        render(
            <DataContext.Provider value={mockDataContext}>
                <ClaimsDetails
                    validationData={mockValidationData}
                    claimResponse={mockClaimResponse}
                    claimsInfo={mockClaimsInfo}
                />
            </DataContext.Provider>
        );

        expect(screen.getByText(/Enhance/i)).toBeInTheDocument();
    });
});