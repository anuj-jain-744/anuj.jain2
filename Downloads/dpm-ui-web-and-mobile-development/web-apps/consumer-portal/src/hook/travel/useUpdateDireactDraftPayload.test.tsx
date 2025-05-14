import { renderHook } from '@testing-library/react-hooks';
import useUpdateDirectDraftRequestPayload from './useUpdateDireactDraftPayload';
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';
import { mapDirectDraftPayload } from './mapDirectDraftPayload';
import { CalculatePremiumApiPayload } from 'hook/travel/CalculatePremiumApiPayload';

// Mock the useQuoteAndBuyContext hook
jest.mock('components/hooks/useQuoteAndBuyContext', () => ({
  useQuoteAndBuyContext: jest.fn(),
}));

// Mock the mapDirectDraftPayload function
jest.mock('./mapDirectDraftPayload', () => ({
  mapDirectDraftPayload: jest.fn(),
}));

describe('useUpdateDirectDraftRequestPayload', () => {
  const mockUseQuoteAndBuyContext = useQuoteAndBuyContext as jest.Mock;
  const mockMapDirectDraftPayload = mapDirectDraftPayload as jest.Mock;

  beforeEach(() => {
    mockUseQuoteAndBuyContext.mockReturnValue({
      selectedPeriod: '30 days',
      travelStartDate: '2023-11-01',
      travellerType: 'self',
      ownerDetailsResponseData: {
        ownerDobG: '1988-11-01',
        ownerDobH: '1409-05-01',
        ownerFullNameEnglish: 'John Doe',
        ownerFullNameArabic: 'جون دو',
        gender: 'male',
        nationality: 'US',
        ownerId: '123456789',
        mobileNumber: '1234567890'
      }
    });

    mockMapDirectDraftPayload.mockReturnValue({
      policyEffectiveDate: '2023-11-01',
      travelDuration: '30',
      familyIndividual: 2,
      typeOfCoverage: '1',
      plan: '1',
      pep: '1',
      ratingType: 'General Tariff',
      policyRisk: [
        {
          dateOfBirth: '01-11-1988',
          dateOfBirthH: '01-05-1409',
          relation: '5',
          travellerNameEnglish: 'John Doe',
          travellerNameArabic: 'جون دو',
          personAge: '35',
          gender: 'male',
          nationality: 'US',
          passportNumber: '111111',
          passportExpiryDate: '2025-12-01',
          policyCoverage: []
        }
      ],
      policyCustomer: {
        nationalId: '123456789',
        age: 35,
        gender: 'male',
        customerNameEnglish: 'John Doe',
        customerNameArabic: 'جون دو',
        nationality: 'US',
        dateOfBirth: '01-11-1988',
        email: 'yunlei.chang@ebaotech.com',
        mobile: '1234567890'
      }
    });
  });

  it('should return the correct request payload', () => {
    const { result } = renderHook(() => useUpdateDirectDraftRequestPayload());

    expect(result.current).toEqual({
      policyEffectiveDate: '2023-11-01',
      travelDuration: '30',
      familyIndividual: 2,
      typeOfCoverage: '1',
      plan: '1',
      pep: '1',
      ratingType: 'General Tariff',
      policyRisk: [
        {
          dateOfBirth: '01-11-1988',
          dateOfBirthH: '01-05-1409',
          relation: '5',
          travellerNameEnglish: 'John Doe',
          travellerNameArabic: 'جون دو',
          personAge: '35',
          gender: 'male',
          nationality: 'US',
          passportNumber: '111111',
          passportExpiryDate: '2025-12-01',
          policyCoverage: []
        }
      ],
      policyCustomer: {
        nationalId: '123456789',
        age: 35,
        gender: 'male',
        customerNameEnglish: 'John Doe',
        customerNameArabic: 'جون دو',
        nationality: 'US',
        dateOfBirth: '01-11-1988',
        email: 'yunlei.chang@ebaotech.com',
        mobile: '1234567890'
      }
    });
  });

  it('should return null if any required context value is missing', () => {
    mockUseQuoteAndBuyContext.mockReturnValueOnce({
      selectedPeriod: null,
      travelStartDate: '2023-11-01',
      travellerType: 'self',
      ownerDetailsResponseData: {
        ownerDobG: '1988-11-01',
        ownerDobH: '1409-05-01',
        ownerFullNameEnglish: 'John Doe',
        ownerFullNameArabic: 'جون دو',
        gender: 'male',
        nationality: 'US',
        ownerId: '123456789',
        mobileNumber: '1234567890'
      }
    });

    const { result } = renderHook(() => useUpdateDirectDraftRequestPayload());

    expect(result.current).toBeNull();
  });
});