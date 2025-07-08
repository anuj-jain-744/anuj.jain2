import { renderHook } from '@testing-library/react-hooks';
import usePolicyData from './usePolicyData';
import { PolicyDataProps } from 'types/viewQuote';

describe('usePolicyData', () => {
  const mockData: PolicyDataProps = {
    policyCustomer: [
      {
        customerNameEnglish: 'John Doe',
        customerNameArabic: 'دو جون', // Update this value
        dateOfBirth: '1990-01-01',
        nationalId: '123456789',
        gender: 'Male',
        primaryAddress: {
          streetName: 'Main St',
          city: 'Riyadh',
          country: 'Saudi Arabia',
          postCode: '12345'
        },
        nationality: 'Saudi',
        mobile: '0501234567'
      }
    ],
    policyBasic: {
      policyNumber: 'POL123456',
      effectiveDate: '2021-01-01',
      expiryDate: '2022-01-01'
    },
    policyLob: [
      {
        familyIndividual: 'Individual',
        typeOfCoverage: 'Comprehensive',
        policyRisk: [
          {
            travellerNameEnglish: 'John Doe',
            drivers: [
              {
                licenseType: 'Full'
              }
            ]
          }
        ]
      }
    ]
  };

  it('should return null values when data is null', () => {
    const { result } = renderHook(() => usePolicyData(null));
    expect(result.current.policyDetails).toBeNull();
    expect(result.current.policyHolderDetails).toBeNull();
    expect(result.current.policyCard).toBeNull();
  });

  it('should return correct policy data when data is provided', () => {
    const { result } = renderHook(() => usePolicyData(mockData));
    expect(result.current.policyDetails).toEqual({
      policyNo: 'POL123456',
      startDate: '2021-01-01',
      expiryDate: '2022-01-01',
      travelExpiryDate: "",
      travelStartDate: "",
      travelType: 'Individual',
      coverageName: 'Comprehensive',
      travelerName: 'John Doe'
    });
    // expect(result.current.policyHolderDetails).toEqual({
    //   customerNameEnglish: 'John Doe',
    //   customerNameArabic: 'جون دو', // Update the expected value
    //   dateOfBirth: '1990-01-01',
    //   idNumer: '123456789',
    //   gender: 'Male',
    //   licenseType: 'Full',
    //   address: {
    //     streetName: 'Main St',
    //     city: 'Riyadh',
    //     country: 'Saudi Arabia',
    //     postCode: '12345'
    //   }
    // });
    expect(result.current.policyCard).toEqual({
      customerNameEnglish: 'John Doe',
      customerNameArabic: 'دو جون',
      nationalId: '123456789',
      dateOfBirth: '1990-01-01',
      nationality: 'Saudi',
      mobileNo: '0501234567',
      address: {
        streetName: 'Main St',
        city: 'Riyadh',
        country: 'Saudi Arabia',
        postCode: '12345'
      }
    });
  });
});