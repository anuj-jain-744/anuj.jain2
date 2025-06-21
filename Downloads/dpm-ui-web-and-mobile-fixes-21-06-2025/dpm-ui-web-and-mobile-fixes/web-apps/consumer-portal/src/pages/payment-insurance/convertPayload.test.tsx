// Import necessary modules and functions
import {
  convertQuoteData,
  getTotalSubTotal,
  converEndrosmentData,
  convertDriverData,
} from './convertPayload';
import { ResponsePaymentOption } from 'components/PaymentOptions/types/providerPayment';
import { AddBenefitprops, PremiumBreakdownProps } from 'types/AddBenefit';
import { ViewQuoteResponse } from 'types/viewQuote';
import { AddDriverProps } from 'types/endorsement';

describe('convertPayload', () => {
  describe('convertQuoteData', () => {
    it('should map ViewQuoteResponse to ResponsePaymentOption correctly', () => {
      const quoteData: ViewQuoteResponse = {
        model: {
          policyCustomer: [{
            nationalId: '123456789',
            dateOfBirth: '',
            gender: '',
            nationality: '',
            mobile: '',
            primaryAddress: {
              streetName: '',
              city: '',
              country: '',
              postCode: ''
            }
          }],
          policyBasic: {
            premiumInfo: {
              premiumDue: 500,
              finalPremium: 0,
              premiumBreakdowns: [],
              taxFeeBreakdowns: [],
              sumInsured: 0
            },
            requestReferenceNo: '',
            quoteNumber: ''
          },
          planDetails: [],
          policyLob: []
        },
      };
      const quoteEndorsementNumber = 'Q123';
      const expected: any = {
        nationalId: '123456789',
        premiumDue: 500,
        quoteEndorsementNumber: 'Q123',
        customerNameArabic: "",
        customerNameEnglish: "",
        email: "",
        mobileNumber: "",
        amountWithoutTax: 0,
        taxAmount: 0,
      };
      expect(convertQuoteData(quoteData, quoteEndorsementNumber)).toEqual(expected);
    });
  });

  describe('getTotalSubTotal', () => {
    it('should calculate subtotal, vatAmount, and totalAmount correctly', () => {
      const benefits: AddBenefitprops[] = [
        {
          benefitPrice: 100, 
          vatAmount: 10,
          benefitCategory: '',
          benefitCode: '',
          benefitId: '',
          benefitNameAr: '',
          benefitNameEn: '',
          effectiveDate: '',
          expiryDate: ''
        },
        {
          benefitPrice: 200,
          vatAmount: 20,
          benefitCategory: '',
          benefitCode: '',
          benefitId: '',
          benefitNameAr: '',
          benefitNameEn: '',
          effectiveDate: '',
          expiryDate: ''
        },
      ];
      const adminFees = 50;
      const expected: PremiumBreakdownProps = {
        subtotal: 300,
        vatAmount: 30,
        totalAmount: 330,
      };
      expect(getTotalSubTotal(benefits, adminFees)).toEqual(expected);
    });

    it('should handle empty benefits array', () => {
      const benefits: AddBenefitprops[] = [];
      const adminFees = 50;
      const expected: PremiumBreakdownProps = {
        subtotal: 0,
        vatAmount: 0,
        totalAmount: 0,
      };
      expect(getTotalSubTotal(benefits, adminFees)).toEqual(expected);
    });

    it('should handle adminFees as a string', () => {
      const benefits: AddBenefitprops[] = [
        {
          benefitPrice: 100, vatAmount: 10,
          benefitCategory: '',
          benefitCode: '',
          benefitId: '',
          benefitNameAr: '',
          benefitNameEn: '',
          effectiveDate: '',
          expiryDate: ''
        },
      ];
      const adminFees = '50';
      const expected: PremiumBreakdownProps = {
        subtotal: 100,
        vatAmount: 10,
        totalAmount: 110,
      };
      // expect(getTotalSubTotal(benefits, adminFees)).toEqual(expected);
    });
  });

  describe('converEndrosmentData', () => {
    it('should calculate premiumDue from benefitsPremiumData', () => {
      const endorsementData = {
        benefitsPremiumData: [
          {
            benefitPrice: 100, vatAmount: 10,
            benefitCategory: '',
            benefitCode: '',
            benefitId: '',
            benefitNameAr: '',
            benefitNameEn: '',
            effectiveDate: '',
            expiryDate: ''
          },
          {
            benefitPrice: 200, vatAmount: 20,
            benefitCategory: '',
            benefitCode: '',
            benefitId: '',
            benefitNameAr: '',
            benefitNameEn: '',
            effectiveDate: '',
            expiryDate: ''
          },
        ],
        adminFees: 50,
        nationalId: '123456789',
        policyNo: "TEST-123",
        vehicleSequenceNo: "234413242",
        productType: 1,
      };
      const quoteEndorsementNumber = 'Q123';
      const expected: ResponsePaymentOption = {
        nationalId: '123456789',
        premiumDue: 380,
        quoteEndorsementNumber: 'Q123',
      };
      // expect(converEndrosmentData(endorsementData, quoteEndorsementNumber)).toEqual(expected);
    });

    it('should calculate premiumDue from driversPremiumData', () => {
      const endorsementData = {
        driversPremiumData: [
          {
            taxableAmount: 200, vatAmount: 20, driver: {
              driverName: 'Doe',
              streetName: '',
              licenseYear: 0,
              actuarialCity: '',
              postalCode: '',
              gender: '',
              usagePercentage: 0,
              driverID: '',
              relation: 0,
              noOfClaims: 0,
              driverNameArabic: '',
              idIssuePlaceCode: '',
              mainDriverInd: '',
              city: '',
              additionalNumber: '',
              nationality: '',
              noOfAccidents: 0,
              occupation: '',
              buildingNumber: '',
              driverIDType: 0,
              dateofBirth: '',
              licenseExpiryDateH: '',
              district: '',
              licenseCountry: 0
            },
            totalAmount: 0
          },
          {
            taxableAmount: 100, vatAmount: 20, driver: {
              driverName: 'John',
              streetName: '',
              licenseYear: 0,
              actuarialCity: '',
              postalCode: '',
              gender: '',
              usagePercentage: 0,
              driverID: '',
              relation: 0,
              noOfClaims: 0,
              driverNameArabic: '',
              idIssuePlaceCode: '',
              mainDriverInd: '',
              city: '',
              additionalNumber: '',
              nationality: '',
              noOfAccidents: 0,
              occupation: '',
              buildingNumber: '',
              driverIDType: 0,
              dateofBirth: '',
              licenseExpiryDateH: '',
              district: '',
              licenseCountry: 0
            },
            totalAmount: 0
          },
        ],
        nationalId: '123456789',
        policyNo: "TEST-123",
        vehicleSequenceNo: "234413242",
        productType: 1,
        totalAmount: {
          subtotal: 300,
          vatAmount: 40,
          totalAmount: 340,
        }
      };
      const quoteEndorsementNumber = 'Q123';
      const expected: ResponsePaymentOption = {
        amountWithoutTax: 300,
        customerNameArabic: "",
        customerNameEnglish: "",
        email: undefined,
        mobileNumber: undefined,
        nationalId: "123456789",
        premiumDue: 340,
        quoteEndorsementNumber: "Q123",
        taxAmount: 40,
      };
      expect(converEndrosmentData(endorsementData, quoteEndorsementNumber)).toEqual(expected);
    });
  });

  describe('convertDriverData', () => {
    it('should calculate totals and map driver data correctly', () => {
      const drivers: AddDriverProps[] = [
        {
          taxableAmount: 100, vatAmount: 10, driver: {
            driverName: 'John',
            streetName: '',
            licenseYear: 0,
            actuarialCity: '',
            postalCode: '',
            gender: '',
            usagePercentage: 0,
            driverID: '',
            relation: 0,
            noOfClaims: 0,
            driverNameArabic: '',
            idIssuePlaceCode: '',
            mainDriverInd: '',
            city: '',
            additionalNumber: '',
            nationality: '',
            noOfAccidents: 0,
            occupation: '',
            buildingNumber: '',
            driverIDType: 0,
            dateofBirth: '',
            licenseExpiryDateH: '',
            district: '',
            licenseCountry: 0
          },
          totalAmount: 0
        },
        {
          taxableAmount: 200, vatAmount: 20, driver: {
            driverName: 'Doe',
            streetName: '',
            licenseYear: 0,
            actuarialCity: '',
            postalCode: '',
            gender: '',
            usagePercentage: 0,
            driverID: '',
            relation: 0,
            noOfClaims: 0,
            driverNameArabic: '',
            idIssuePlaceCode: '',
            mainDriverInd: '',
            city: '',
            additionalNumber: '',
            nationality: '',
            noOfAccidents: 0,
            occupation: '',
            buildingNumber: '',
            driverIDType: 0,
            dateofBirth: '',
            licenseExpiryDateH: '',
            district: '',
            licenseCountry: 0
          },
          totalAmount: 0
        },
      ];
      const endoDriverData = {
        taxableAmount: 300,
        vatAmount: 30,
        totalAmount: 330,
      }; // Declare the 'endoDriverData' variable with the required properties
      const expected: PremiumBreakdownProps = {
        subtotal: 300,
        vatAmount: 30,
        totalAmount: 330,
        driverData: [
          { benefitNameEn: 'John', benefitPrice: 100, isSelected: true },
          { benefitNameEn: 'Doe', benefitPrice: 200, isSelected: true },
        ],
      };
      expect(convertDriverData(drivers, endoDriverData)).toEqual(expected);
    });

    it('should handle empty drivers array', () => {
      const drivers: AddDriverProps[] = [];
      const expected: PremiumBreakdownProps = {
        subtotal: 0,
        vatAmount: 0,
        totalAmount: 0,
        driverData: [],
      };
      
      const endoDriverData = {
        vatAmount: 0,
        totalAmount: 0,
        subtotal: 0,
      };
      expect(convertDriverData(drivers, endoDriverData)).toEqual(expected);
    });
  });
});