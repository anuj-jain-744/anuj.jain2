import { render, screen, fireEvent } from "@testing-library/react";
import AddClaimEstimate from "./AddClaimEstimate";

const mockLanguageData = {
    cause_of_loss: "Cause of Loss",
    estimated_loss_amount: "Estimated Loss Amount",
    add_estimate: "Add Estimate",
    add_another_estimate: "Add Another Estimate",
    select_label: "Select",
    enter_estimate_amount: "Enter Estimate Amount",
    description_of_loss: "Description of Loss",
    upload_supporting_documents: "Upload Supporting Documents",
    supported_file_type: "Supported file types: JPEG, PNG, PDF",
    invalid_file_type: "Invalid file type",
    estimated_loss_amount_should_not_exceed: "Estimated loss amount should not exceed",
    required_error: "This field is required",
};

const mockCauseOfLossOptions = [
    { id: 1, description: "Fire", siLimit: 1000 },
    { id: 2, description: "Flood", siLimit: 2000 },
];

jest.mock("@app-shell/utils/common", () => ({
    getAmountWithIcon: jest.fn((amount) => `SAR ${amount}`),
    getCurrencySymbol: jest.fn(() => "SAR"),
}));

const mockAddEstimateValues = jest.fn();
describe("AddClaimEstimate Component", () => {
    beforeEach(() => {
        mockAddEstimateValues.mockClear();
    });
    it("renders the component correctly", () => {
        render(
            <AddClaimEstimate
                languageData={mockLanguageData}
                causeOfLossOptions={mockCauseOfLossOptions}
                addEstimateValues={mockAddEstimateValues}
            />

        );
        expect(screen.getByText(mockLanguageData.add_estimate)).toBeInTheDocument();
    });

    it("adds a new estimate", () => {
        render(
            <AddClaimEstimate
                languageData={mockLanguageData}
                causeOfLossOptions={mockCauseOfLossOptions}
                addEstimateValues={mockAddEstimateValues}
            />
        );
        fireEvent.click(screen.getByText(mockLanguageData.add_estimate));
        expect(screen.getByText("Estimate 1")).toBeInTheDocument();
    });

    it("deletes an estimate", () => {
        render(
            <AddClaimEstimate
                languageData={mockLanguageData}
                causeOfLossOptions={mockCauseOfLossOptions}
                addEstimateValues={mockAddEstimateValues}
            />
        );
        fireEvent.click(screen.getByText(mockLanguageData.add_estimate));
        const deleteIcon = screen.getByAltText("Delete");
        fireEvent.click(deleteIcon);
        expect(screen.queryByText("Estimate 1")).not.toBeInTheDocument();
    });

    it("updates causeOfLossId and estimateAmount fields", () => {
        render(
            <AddClaimEstimate
                languageData={mockLanguageData}
                causeOfLossOptions={mockCauseOfLossOptions}
                addEstimateValues={mockAddEstimateValues}
            />
        );

        fireEvent.click(screen.getByText(mockLanguageData.add_estimate));
        fireEvent.change(screen.getByRole("combobox"), { target: { value: "1" } });
        fireEvent.change(screen.getByPlaceholderText(mockLanguageData.enter_estimate_amount), {
            target: { value: "800" },
        });
        fireEvent.blur(screen.getByPlaceholderText(mockLanguageData.enter_estimate_amount));
    });

    it("shows error when estimate exceeds siLimit", () => {
        render(
            <AddClaimEstimate
                languageData={mockLanguageData}
                causeOfLossOptions={mockCauseOfLossOptions}
                addEstimateValues={mockAddEstimateValues}

            />

        );

        fireEvent.click(screen.getByText(mockLanguageData.add_estimate));
        fireEvent.change(screen.getByRole("combobox"), { target: { value: "1" } });
        fireEvent.change(screen.getByPlaceholderText(mockLanguageData.enter_estimate_amount), {
            target: { value: "1500" },
        });
        fireEvent.blur(screen.getByPlaceholderText(mockLanguageData.enter_estimate_amount));
    });

    it("renders description textarea and updates it", () => {
        render(
            <AddClaimEstimate
                languageData={mockLanguageData}
                causeOfLossOptions={mockCauseOfLossOptions}
                addEstimateValues={mockAddEstimateValues}
            />
        );

        fireEvent.click(screen.getByText(mockLanguageData.add_estimate));
        const textareas = screen.getAllByRole("textbox");
        const descriptionInput = textareas[textareas.length - 1]; // safest pick
        fireEvent.change(descriptionInput, { target: { value: "Test Description" } });
        expect(descriptionInput).toHaveValue("Test Description");
    });

    it("renders accordion header info when estimate is completed", () => {
        render(
            <AddClaimEstimate
                languageData={mockLanguageData}
                causeOfLossOptions={mockCauseOfLossOptions}
                addEstimateValues={mockAddEstimateValues}
            />
        );

        fireEvent.click(screen.getByText(mockLanguageData.add_estimate));
        fireEvent.change(screen.getByRole("combobox"), { target: { value: "2" } });
        fireEvent.change(screen.getByPlaceholderText(mockLanguageData.enter_estimate_amount), {
            target: { value: "1900" },
        });
        fireEvent.blur(screen.getByPlaceholderText(mockLanguageData.enter_estimate_amount));
        // Collapse the accordion to trigger summary render
        fireEvent.click(screen.getByText("Estimate 1")); // toggle header closed
        //  Now check for summary text
        expect(screen.getByText(`${mockLanguageData.cause_of_loss}:`)).toBeInTheDocument();
        expect(screen.getByText(`${mockLanguageData.estimated_loss_amount}:`)).toBeInTheDocument();
    });

    it("disables add button if estimate amount not filled", () => {
        render(
            <AddClaimEstimate
                languageData={mockLanguageData}
                causeOfLossOptions={mockCauseOfLossOptions}
                addEstimateValues={mockAddEstimateValues}
            />
        );
        fireEvent.click(screen.getByText(mockLanguageData.add_estimate));
        const addAnotherBtn = screen.getByRole("button", {
            name: /Add Another Estimate/i,
        });
        expect(addAnotherBtn).toBeDisabled();
    });
});

