import { getRenewalData } from './getRenewalData';
import { HOME, MOTOR, MOTORCOMP, MOTOR_COMP } from 'constant';
import { familtyFlowConstants } from 'components/Travel/constantsTravel';

describe('getRenewalData', () => {

  const baseUserDetails = {
    name: "John Doe",
    ownerFullNameArabic: "جون دو",
    ownerDobG: "1990-01-01",
    ownerDobH: "1410-01-01",
    dateOfBirth: "1990-01-01",
    gender: "male",
    nationality: "American",
    nationalityCode: "US",
    email: "john@example.com",
    userId: "user123",
    mobileNumber: "1234567890"
  };

  const baseAuthDetails = {
    message: "Valid",
    isValid: true,
    referenceNo: "ref123",
    sessionSecretId: "secret456"
  };

  const baseAddressData = {
    addressData: [{ city: "Riyadh", street: "King Road" }]
  };

  it('should return correct data for HOME product', () => {
    const result = getRenewalData({
      policyNo: "POLICY123",
      prodCode: HOME,
      userDetails: baseUserDetails,
      authDetails: baseAuthDetails,
      addressData: baseAddressData
    });

    expect(result).toEqual({
      ownerDetail: {
        ownerFullNameEnglish: "John Doe",
        ownerFullNameArabic: "جون دو",
        ownerDobG: "1990-01-01",
        ownerDobH: "1410-01-01",
        gender: "male",
        nationality: "American",
        message: "Valid",
        isValid: true,
        referenceNo: "ref123",
        sessionSecretId: "secret456",
        nationalityCode: "US",
        email: "john@example.com",
      },
      ownerId: "user123",
      mobileNumber: "1234567890",
      addressData: { addresses: baseAddressData.addressData },
      policyNumber: "POLICY123"
    });
  });

  it.each([MOTOR, MOTORCOMP, MOTOR_COMP])('should return correct data for motor product %s', (prodCode) => {
    const result = getRenewalData({
      policyNo: "MOTOR123",
      prodCode,
      userDetails: baseUserDetails
    });

    expect(result).toEqual({
      ownerFullNameEnglish: "John Doe",
      ownerFullNameArabic: "جون دو",
      ownerDobG: "1990-01-01",
      ownerDobH: "1410-01-01",
      gender: "male",
      nationality: "American",
      ownerId: "user123",
      mobileNumber: "1234567890",
      policyNumber: "MOTOR123",
      isValidPolicy: true,
      isValidParam: true,
      loggedInRenew: true,
    });
  });

  it('should use fallback DOB from constants if none is provided', () => {
    const result = getRenewalData({
      policyNo: "POLICY456",
      prodCode: MOTOR,
      userDetails: {
        ...baseUserDetails,
        ownerDobG: undefined,
        dateOfBirth: undefined
      }
    });

    expect(result.ownerDobG).toBe(familtyFlowConstants.dobG);
  });

  it('should return default structure for unknown product code', () => {
    const result = getRenewalData({
      policyNo: "UNKNOWN456",
      prodCode: "UNKNOWN",
      userDetails: baseUserDetails
    });

    expect(result).toMatchObject({
      policyNumber: "UNKNOWN456",
      isValidPolicy: true,
      isValidParam: true,
      loggedInRenew: true
    });
  });
});
