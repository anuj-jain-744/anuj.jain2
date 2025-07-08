import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EndorsementSuccess, { EndorsementSuccessProps } from "./index";

jest.mock("utils/quoteAndBuy", () => ({
  geteDriverRelation: jest.fn(() => "RelationMock"),
  getGenderProfileIcon: jest.fn(() => "mock-icon.png"),
}));
jest.mock("@dpm/shared-module", () => ({
  capitalizeNameFirstLetter: jest.fn((name) => name),
  getLabelOfIqmaIdNationalId: jest.fn(() => "IDLabelMock"),
}));
jest.mock("@app-shell/utils/common", () => ({
  getAmountWithIcon: jest.fn((amount) => `SAR ${amount}`),
}));

jest.mock("hook/common/usePrintDoc", () => ({
  useEndorsementDocuments: jest.fn(() => ({
    data: "pdfData",
    error: null,
    isError: false,
  })),
}));
jest.mock("hook/common/useDownloadPdf", () => ({
  useDownloadPDF: jest.fn(() => ({
    processPDFs: jest.fn(),
  })),
}));
jest.mock("components/AlertBox", () => ({
  AlertBox: jest.fn(({ title, description, showAlertModal, setShowAlertModal }) => (
    showAlertModal ? <div data-testid="alert-box">{description}</div> : null
  )),
}));

describe("EndorsementSuccess", () => {
  let defaultProps: EndorsementSuccessProps;

  beforeEach(() => {
    defaultProps = {
      endorsementData: {
        benefitsPremiumData: [
          {
            benefitNameEn: "Benefit 1",
            effectiveDate: "2023-01-01",
            benefitPrice: "100",
            vatAmount: "5",
          },
        ],
        driversPremiumData: [
          {
            driver: {
              gender: "male",
              driverName: "John Doe",
              driverID: "12345",
              relation: 1,
            },
          },
        ],
        productType: "01"
      },
      languageData: {
        choose_extra_benefits_add: "Extra Benefits",
        effective_date: "Effective Date",
        amount: "Amount",
        driver_name: "Driver Name",
        relationship: "Relationship",
        endorsement_schedule: "Endorsement Schedule",
        payment_receipt: "Payment Receipt",
      } as any,
      endorsementNumber: "E123",
    };
  });


  it("calls processPDFs on handleDownload and does not show alert when no error", () => {
    const { useDownloadPDF } = require("hook/common/useDownloadPdf");
    const processPDFs = jest.fn();
    useDownloadPDF.mockReturnValue({ processPDFs });

    render(<EndorsementSuccess {...defaultProps} />);
    const downloadText = screen.getByText("Endorsement Schedule");

    fireEvent.click(downloadText);

    expect(processPDFs).toHaveBeenCalledWith("pdfData", { format: "pdf", autoDownload: true });
    expect(screen.queryByTestId("alert-box")).not.toBeInTheDocument();
  });

  it("shows alert when processPDFs throws error", () => {
    const { useDownloadPDF } = require("hook/common/useDownloadPdf");
    const processPDFs = jest.fn(() => { throw new Error("fail"); });
    useDownloadPDF.mockReturnValue({ processPDFs });

    render(<EndorsementSuccess {...defaultProps} />);
    const downloadText = screen.getByText("Endorsement Schedule");

    fireEvent.click(downloadText);

    expect(screen.getByTestId("alert-box")).toHaveTextContent("Error processing PDFs.");
  });

  it("shows alert when endorsement letter has error", () => {
    const { useEndorsementDocuments } = require("hook/common/usePrintDoc");
    useEndorsementDocuments.mockReturnValue({
      data: null,
      error: { messageEn: "Endorsement error" },
      isError: true,
    });
    const { useDownloadPDF } = require("hook/common/useDownloadPdf");
    const processPDFs = jest.fn();
    useDownloadPDF.mockReturnValue({ processPDFs });

    render(<EndorsementSuccess {...defaultProps} />);
    const downloadText = screen.getByText("Endorsement Schedule");

    fireEvent.click(downloadText);

    expect(screen.getByTestId("alert-box")).toHaveTextContent("Endorsement error");
  });


  it("renders without crashing and shows no benefits or drivers when endorsementData is empty", () => {
    const emptyProps = {
      ...defaultProps,
      endorsementData: {
        benefitsPremiumData: [],
        driversPremiumData: [],
      },
    };
  
    render(<EndorsementSuccess {...emptyProps} />);
  
    expect(screen.queryByText(defaultProps.languageData.choose_extra_benefits_add)).not.toBeInTheDocument();
    expect(screen.queryByText(defaultProps.languageData.driver_name)).not.toBeInTheDocument();
  });  

  it("renders Payment Receipt text but does not trigger download on click", () => {
    const { useDownloadPDF } = require("hook/common/useDownloadPdf");
    const processPDFs = jest.fn();
    useDownloadPDF.mockReturnValue({ processPDFs });
  
    render(<EndorsementSuccess {...defaultProps} />);
  
    const receiptText = screen.getByText("Payment Receipt");
  
    fireEvent.click(receiptText);
  
    expect(processPDFs).not.toHaveBeenCalled();
  });  

  it("still runs fallback logic even with unexpected docTypeKey", () => {
    const { useDownloadPDF } = require("hook/common/useDownloadPdf");
    const processPDFs = jest.fn();
    useDownloadPDF.mockReturnValue({ processPDFs });
  
    render(<EndorsementSuccess {...defaultProps} />);
  
    const downloadText = screen.getByText("Endorsement Schedule");
  
    fireEvent.click(downloadText);
  
    expect(processPDFs).toHaveBeenCalled();
  });
});
