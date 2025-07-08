import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PolicyCardSuccess from "./PolicyCardSuccess";
import { LanguageData } from "types/languageData";
import { PolicyCardSuccessProps } from "./PolicyCardSuccess";

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
  jest.mock("../Motor/PolicyDetail", () => ({
    PolicyDetail: jest.fn(() => (
      <div data-testid="policy-details">{"Benefit Label"}</div>
    )),
  }));
  jest.mock('../Motor/MotorSuccessUtils', () => ({
    getEndorsementDataForPolicyDetails: jest.fn(() => [
      { label: 'Benefit Label', value: 'Benefit 1' },
    ]),
    makeDataBuyMotor: jest.fn(() => [
      { label: 'Policy Label', value: 'Driver Value' },
    ]),
  }));

// Mock assets
jest.mock("assets/SuccessPage/Download.svg", () => "download.svg");
jest.mock("assets/SuccessPage/Share.svg", () => "share.svg");
jest.mock("assets/PolicyCard/Car.svg", () => "car.svg");


// Mock style module
jest.mock("./style.module.scss", () => new Proxy({}, { get: (_, prop) => prop }));

// Mock getAmountWithIcon
jest.mock('@app-shell/utils/common', () => ({
    getAmountWithIcon: jest.fn(amount => `SAR ${amount}`),
  }));

describe("PolicyCardSuccess", () => {
  const languageData: LanguageData = {
    policy_No_Label: "Policy Number",
    policy_documents: "Download Policy",
    endorsement_document: "Endorsement Document",
    share: "Share"
    // add other keys used in the component
  };

  const defaultProps: PolicyCardSuccessProps = {
    endorsementData: null,
    languageData,
    coverageName: "Comprehensive",
    isEndosementPolicy: false,
    handleDownloadPolicy: jest.fn(),
    policyPeriod: "2024-2025",
    plateNumber: "1234",
    headerLabel: "Policy Number",
    headerValue: "Policy Value",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders policy number and coverage name", () => {
    render(<PolicyCardSuccess {...defaultProps} headerValue="POL123456" />);

    expect(screen.getByText("Policy Number")).toBeInTheDocument();
    expect(screen.getByText("POL123456")).toBeInTheDocument();
    expect(screen.getByText("Comprehensive")).toBeInTheDocument();
  });

  test("calls handleDownloadPolicy when clicked (without endorsementData.policyNo)", () => {
    render(<PolicyCardSuccess {...defaultProps} />);

    const downloadButton = screen.getByText(languageData.policy_documents);
    fireEvent.click(downloadButton);

    expect(defaultProps.handleDownloadPolicy).toHaveBeenCalled();
  });

  test("calls processPDFs when endorsementData.policyNo exists", () => {
    const { useDownloadPDF } = require("hook/common/useDownloadPdf");
    const processPDFs = jest.fn();
    useDownloadPDF.mockReturnValue({ processPDFs });

    const propsWithPolicyNo = {
        ...defaultProps,
        endorsementData: {
          benefitsPremiumData: [
              {
                  "benefitCategory": "Chargeable",
                  "benefitCode": "MPAD",
                  "benefitId": "115968091",
                  "benefitNameAr": "الحوادث الشخصية -  السائق",
                  "benefitNameEn": "Personal Accident - Driver Cover",
                  "benefitPrice": 50,
                  "effectiveDate": "03/07/2025",
                  "expiryDate": "2026-07-02T23:59:59.000+00:00",
                  "vatAmount": 7.5,
                  "mostPurchased": 1,
                  "isSelected": true
              },
          ],
          totalAmount: { totalAmount: 1000 },
          selectBenefit: { benefit: true },
          selectManagerDriver: { manage: false },
          policyNo: "EN1234",
        },
        isEndosementPolicy: true,
        endorsementNumber: "END123",
      };
  
      render(<PolicyCardSuccess {...propsWithPolicyNo} />);
      const downloadButton = screen.getByText(languageData.endorsement_document);
      fireEvent.click(downloadButton);

    expect(processPDFs).toHaveBeenCalledWith("pdfData", { format: "pdf", autoDownload: true });
    expect(screen.queryByTestId("alert-box")).not.toBeInTheDocument();
    
  });

  test("displays error alert if PDF processing fails", () => {
    const { useDownloadPDF } = require("hook/common/useDownloadPdf");
    const processPDFsMock = jest.fn(() => {
      throw new Error("Download error");
    });
    useDownloadPDF.mockReturnValue({ processPDFsMock });

    const propsWithPolicyNo = {
        ...defaultProps,
        endorsementData: {
          benefitsPremiumData: [
              {
                  "benefitCategory": "Chargeable",
                  "benefitCode": "MPAD",
                  "benefitId": "115968091",
                  "benefitNameAr": "الحوادث الشخصية -  السائق",
                  "benefitNameEn": "Personal Accident - Driver Cover",
                  "benefitPrice": 50,
                  "effectiveDate": "03/07/2025",
                  "expiryDate": "2026-07-02T23:59:59.000+00:00",
                  "vatAmount": 7.5,
                  "mostPurchased": 1,
                  "isSelected": true
              },
          ],
          totalAmount: { totalAmount: 1000 },
          selectBenefit: { benefit: true },
          selectManagerDriver: { manage: false },
          policyNo: "EN1234",
        },
        isEndosementPolicy: true,
        endorsementNumber: "END123",
      };

    render(<PolicyCardSuccess {...propsWithPolicyNo} />);

    const downloadButton = screen.getByText(languageData.endorsement_document);
    fireEvent.click(downloadButton);

    expect(screen.getByText("Error processing PDFs.")).toBeInTheDocument();
  });
});
