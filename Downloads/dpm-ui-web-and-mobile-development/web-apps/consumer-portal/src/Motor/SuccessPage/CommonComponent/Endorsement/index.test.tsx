import EndorsementSuccess, { EndorsementSuccessProps } from "./index";
import { render, screen } from '@testing-library/react';

jest.mock('@dpm/shared-module', () => ({
    capitalizeNameFirstLetter:  jest.fn((name) => name.charAt(0).toUpperCase() + name.slice(1)),
    getAmountText: jest.fn(() => 'SAR 1000.00'),
    getLabelOfIqmaIdNationalId: jest.fn(),
}));

describe("EndorsementSuccess Component", () => {
    const mockLanguageData = {
      choose_extra_benefits_add: "Choose Extra Benefits",
      effective_date: "Effective Date",
      amount: "Amount",
      driver_name: "Driver Name",
      relationship: "Relationship",
    };
  
    const mockEndorsementData = {
      benefitsPremiumData: [
        {
          benefitNameEn: "Roadside Assistance",
          effectiveDate: "2023-10-01",
          benefitPrice: "1000.00",
        },
      ],
      driversPremiumData: [
        {
          driver: {
            driverName: "John Doe",
            driverID: "123456789",
            relation: 1,
          },
          taxableAmount: 0,
          totalAmount: 0,
          vatAmount: 0,
        },
        {
            driver: {
              driverName: undefined,
              driverID: "1234512126789",
              relation: undefined,
            },
            taxableAmount: 0,
            totalAmount: 0,
            vatAmount: 0,
          },
      ],
    };
  
    const setup = (props: EndorsementSuccessProps) => {
      render(<EndorsementSuccess {...props} />);
    };
  
    it("renders correctly with valid endorsementData and languageData", () => {
      setup({ endorsementData: mockEndorsementData, languageData: mockLanguageData });
  
      expect(screen.getByText("Choose Extra Benefits")).toBeInTheDocument();
      expect(screen.getByText("Roadside Assistance")).toBeInTheDocument();
      expect(screen.getByText("Effective Date")).toBeInTheDocument();
      expect(screen.getByText("2023-10-01")).toBeInTheDocument();
      expect(screen.getByText("Amount")).toBeInTheDocument();
      expect(screen.getByText("SAR 1000.00")).toBeInTheDocument();
      expect(screen.getAllByText("Driver Name")).toHaveLength(2);
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("123456789")).toBeInTheDocument();
      expect(screen.getAllByText("Relationship")).toHaveLength(2);
    });
  
    it("renders benefitsPremiumData correctly", () => {
      setup({ endorsementData: mockEndorsementData, languageData: mockLanguageData });
  
      const benefitName = screen.getByText("Roadside Assistance");
      const effectiveDate = screen.getByText("2023-10-01");
      const amount = screen.getByText("SAR 1000.00");
  
      expect(benefitName).toBeInTheDocument();
      expect(effectiveDate).toBeInTheDocument();
      expect(amount).toBeInTheDocument();
    });
  
    it("renders driversPremiumData correctly", () => {
      setup({ endorsementData: mockEndorsementData, languageData: mockLanguageData });
  
      const driverName = screen.getByText("John Doe");
      const driverID = screen.getByText("123456789");
  
      expect(driverName).toBeInTheDocument();
      expect(driverID).toBeInTheDocument();
    });
  
    it("handles missing endorsementData gracefully", () => {
      setup({ endorsementData: null, languageData: mockLanguageData });
  
      expect(screen.queryByText("Choose Extra Benefits")).not.toBeInTheDocument();
      expect(screen.queryByText("Driver Name")).not.toBeInTheDocument();
    });
  
    it("handles missing languageData gracefully", () => {
      setup({ endorsementData: mockEndorsementData, languageData: null });
  
      expect(screen.queryByText("Choose Extra Benefits")).not.toBeInTheDocument();
      expect(screen.queryByText("Driver Name")).not.toBeInTheDocument();
    });
});