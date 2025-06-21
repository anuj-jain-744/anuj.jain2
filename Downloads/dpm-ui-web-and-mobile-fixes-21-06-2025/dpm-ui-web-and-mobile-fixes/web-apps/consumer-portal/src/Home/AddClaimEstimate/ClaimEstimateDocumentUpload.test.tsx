import { render, screen, fireEvent } from "@testing-library/react";
import ClaimEstimateDocumentUpload from "./ClaimEstimateDocumentUpload";

const mockLanguageData = {
    police_report: "Police Report",
    stolen_item_list: "Stolen Item List",
    purchase_invoice: "Purchase Invoice",
    invalid_file_type: "Invalid file type",
};

const createMockFile = (name: string, type: string, sizeMB = 1) =>
    new File(["a".repeat(sizeMB * 1024 * 1024)], name, { type });

describe("ClaimEstimateDocumentUpload Component", () => {
    const mockHandleFileChange = jest.fn();
    const mockHandleRemoveFile = jest.fn();

    const baseEstimate = {
        policeReport: null,
        stolenItemList: null,
        purchaseInvoice: null,
        visibleDocs: ["policeReport", "stolenItemList", "purchaseInvoice"],
    };

    it("renders all document upload rows", () => {
        render(
            <ClaimEstimateDocumentUpload
                index={0}
                estimate={baseEstimate}
                handleFileChange={mockHandleFileChange}
                handleRemoveFile={mockHandleRemoveFile}
                fileError=""
                languageData={mockLanguageData}
            />
        );

        expect(screen.getByText("Police Report")).toBeInTheDocument();
        expect(screen.getByText("Stolen Item List")).toBeInTheDocument();
        expect(screen.getByText("Purchase Invoice")).toBeInTheDocument();
    });

    it("calls handleFileChange when a valid file is uploaded", () => {
        render(
            <ClaimEstimateDocumentUpload
                index={0}
                estimate={baseEstimate}
                handleFileChange={mockHandleFileChange}
                handleRemoveFile={mockHandleRemoveFile}
                fileError=""
                languageData={mockLanguageData}
            />
        );

        const fileInputs = screen.getAllByTestId("file-input");
        const file = createMockFile("test.pdf", "application/pdf", 1);
        fireEvent.change(fileInputs[0], {
            target: { files: [file] },
        });
        expect(mockHandleFileChange).toHaveBeenCalledWith(0, "policeReport", expect.any(File));
    });

    it("shows alert for invalid file type", () => {
        window.alert = jest.fn(); // mock alert

        render(
            <ClaimEstimateDocumentUpload
                index={0}
                estimate={baseEstimate}
                handleFileChange={mockHandleFileChange}
                handleRemoveFile={mockHandleRemoveFile}
                fileError=""
                languageData={mockLanguageData}
            />
        );

        const fileInputs = screen.getAllByTestId("file-input");
        const file = createMockFile("invalid.txt", "text/plain");
        fireEvent.change(fileInputs[0], {
            target: { files: [file] },
        });
        expect(window.alert).toHaveBeenCalledWith(mockLanguageData.invalid_file_type);
    });

    it("calls handleRemoveFile when remove icon is clicked", () => {
        const uploadedEstimate = {
            ...baseEstimate,
            policeReport: createMockFile("uploaded.pdf", "application/pdf"),
        };

        render(
            <ClaimEstimateDocumentUpload
                index={0}
                estimate={uploadedEstimate}
                handleFileChange={mockHandleFileChange}
                handleRemoveFile={mockHandleRemoveFile}
                fileError=""
                languageData={mockLanguageData}
            />
        );

        const removeIcon = screen.getByAltText("Remove");
        fireEvent.click(removeIcon);
        expect(mockHandleRemoveFile).toHaveBeenCalledWith(0, "policeReport");
    });

    it("displays file error if present", () => {
        render(
            <ClaimEstimateDocumentUpload
                index={0}
                estimate={baseEstimate}
                handleFileChange={mockHandleFileChange}
                handleRemoveFile={mockHandleRemoveFile}
                fileError="This is a file error"
                languageData={mockLanguageData}
            />
        );
        expect(screen.queryByText("This is a file error")).toBeInTheDocument();
    });
});

