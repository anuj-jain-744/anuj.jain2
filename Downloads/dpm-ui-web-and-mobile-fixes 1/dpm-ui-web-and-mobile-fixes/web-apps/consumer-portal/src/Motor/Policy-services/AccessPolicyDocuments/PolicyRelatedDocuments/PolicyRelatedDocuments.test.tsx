import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PolicyRelatedDocuments from "./PolicyRelatedDocuments";
import { usePDFData } from "../hooks/usePdfData";
import { useDocumentDownload } from "../hooks/useDocumentDownload";
import { LanguageData } from "types/languageData";

jest.mock("../hooks/usePdfData");
jest.mock("../hooks/useDocumentDownload");

const mockLanguageData: LanguageData = {
  policy_related_documents: "Policy Related Documents",
  download_all_documents: "Download All Documents",
};

describe("PolicyRelatedDocuments", () => {
  const mockDownloadDocuments = jest.fn();

  beforeEach(() => {
    (usePDFData as jest.Mock).mockReturnValue({
      pdfData: {
        policyData: [
          { id: 1, name: "Policy Document 1", document: "document1.pdf" },
        ],
        endorsementData: [
          { id: 2, name: "Endorsement Document 1", document: "document2.pdf" },
        ],
        quotationData: [
          { id: 2, name: "Quotation Document 1", document: "document3.pdf" },
        ],
      },
      isLoading: false,
      error: null,
    });

    (useDocumentDownload as jest.Mock).mockReturnValue({
      downloadDocuments: mockDownloadDocuments,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with provided language data", () => {
    render(<PolicyRelatedDocuments languageData={mockLanguageData} />);

    expect(screen.getByText("Policy Related Documents")).toBeInTheDocument();
    expect(screen.getByText("Download All Documents")).toBeInTheDocument();
  });

  it("displays loading state", () => {
    (usePDFData as jest.Mock).mockReturnValue({
      pdfData: { policyData: [], endorsementData: [] , quotationData: []},
      isLoading: true,
      error: null,
    });

    render(<PolicyRelatedDocuments languageData={mockLanguageData} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays error state", () => {
    (usePDFData as jest.Mock).mockReturnValue({
      pdfData: { policyData: [], endorsementData: [], quotationData: [] },
      isLoading: false,
      error: new Error("Failed to fetch data"),
    });

    render(<PolicyRelatedDocuments languageData={mockLanguageData} />);

    expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
  });
});
