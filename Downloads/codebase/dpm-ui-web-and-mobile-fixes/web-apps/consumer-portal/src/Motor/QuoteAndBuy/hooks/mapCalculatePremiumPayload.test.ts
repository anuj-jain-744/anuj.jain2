import { mapCalculatePremiumPayload, DEFAULT_SCHEME_CODE, driverUsagePercentage } from './mapCalculatePremiumPayload';
import { VehicleDetailsResponseData, DriverDetailsResponseData, OwnerDetailsResponseData, VehicleDetails } from 'types/quoteAndBuy';
import { Country } from '../QuoteAndBuyContext';

describe('mapCalculatePremiumPayload', () => {
  const mockVehicleData: VehicleDetailsResponseData = {
    vehicleMakeText: 'Toyota',
    make: 'Toyota',
    vehicleModelText: 'Corolla',
    model: 'Corolla',
    bodyTypeID: 1,
    vehicleValue: 20000,
    vehicleCapacity: '1500',
    vehicleCylinders: '4',
    vehicleOwnerName: 'John Doe',
    vehicleOwnerId: '12345',
    plateType: '1',
    plateNo: 'ABC123',
    manufactureYear: '2020',
    vehicleColour: 'Red',
    chassisNumber: 'CH123456',
    vehicleRegistrationExpiryDateH: '1444-12-01',
    engineCapacity: '2000',
    transmissionType: 'Automatic',
    additionFeatures: {
      safety: {
        parking: 'Garage',
        antiTheftAlarm: 'Yes',
        antiLockBrakingSystem: true,
        automaticBrakingSystem: false,
      },
      features: {
        cruiseControl: true,
        adaptiveCruiseControl: false,
        modification: false,
      },
      camera: {
        rearParkingSensor: true,
        frontSensor: false,
        rearCamera: true,
        frontCamera: false,
        degreeCamera: false,
      },
      commercialVehicle: {
        fireExtinguisher: true,
        vehicleAxleWeight: 5000,
      },
    },
    weight: '1500',
  };

  const mockDriverData: DriverDetailsResponseData[] = [
    {
      mainDriverInd: 'Y',
      nationality: 'SA',
      driverIDType: 1,
      driverID: 'D12345',
      driverName: 'John Smith',
      driverNameArabic: 'جون سميث',
      dateofBirth: '1990-01-01',
      dateofBirthH: '1410-05-01',
      gender: 'Male',
      occupation: 'Engineer',
      additionalDriverDetails: {
        driverRelationship: 'Spouse',
        educationLevel: 'Bachelor',
        maritalStatusCd: 'Married',
        childrenBelow16: 2,
      },
      workCompanyName: 'Tech Corp',
      homeAddress: '123 Main St',
      licenseType: 1,
      licenseYear: 2010,
      ncdFreeYears: '5',
      ncdReferenceNo: 'REF123',
      noOfAccidents: 0,
      noOfClaims: 1,
      healthConditions: '',
      trafficViolations: '',
      najmCaseDetails: [],
      validDrivingLicenses: [],
    },
  ];

  const mockOwnerData: OwnerDetailsResponseData = {
    ownerId: 'O12345',
    ownerFullNameEnglish: 'Jane Doe',
    ownerFullNameArabic: 'جين دو',
    gender: 'Female',
    nationality: 'SA',
    mobileNumber: '0501234567',
    ownerDobG: '1985-05-15',
  };

  const mockVehicleUserInput: VehicleDetails = {
    vehicleDefinitionType: 'Sedan',
    vehicleSequenceNo: 'V123',
    vehicleCustomID: 'C123',
  };

  const mockCountryData: Country[] = [
    { codeId: 'SA', codeDesc: 'Saudi Arabia' },
    { codeId: 'US', codeDesc: 'United States' },
  ];

  it('should map payload with default scheme code', () => {
    const result = mapCalculatePremiumPayload(
      mockVehicleData,
      mockDriverData,
      mockOwnerData,
      mockVehicleUserInput,
      mockCountryData
    );

    expect(result.policyBasic.schemeCode).toBe(DEFAULT_SCHEME_CODE);
    expect(result.policyRisk.vehicleMakeText).toBe(mockVehicleData.vehicleMakeText);
    expect(result.policyRisk.drivers.length).toBe(1);
    expect(result.policyCustomer.customerNameEnglish).toBe('Jane Doe');
  });

  it('should map payload with custom scheme code', () => {
    const customSchemeCode = { schemeCode: 'P3', schemeName: 'Custom Scheme', virtualBranch: 'Branch1' };
    const result = mapCalculatePremiumPayload(
      mockVehicleData,
      mockDriverData,
      mockOwnerData,
      mockVehicleUserInput,
      mockCountryData,
      customSchemeCode
    );

    expect(result.policyBasic.schemeCode).toBe('P3');
  });

  it('should calculate driver usage percentage correctly', () => {
    const singleDriver = driverUsagePercentage(1);
    expect(singleDriver).toEqual({ mainDriver: 1, additionalDriver: 0 });

    const twoDrivers = driverUsagePercentage(2);
    expect(twoDrivers).toEqual({ mainDriver: 0.5, additionalDriver: 0.5 });
  });

  it('should handle missing optional fields gracefully', () => {
    const incompleteVehicleData = { ...mockVehicleData, vehicleMakeText: undefined };
    const result = mapCalculatePremiumPayload(
      incompleteVehicleData,
      mockDriverData,
      mockOwnerData,
      mockVehicleUserInput,
      mockCountryData
    );

    expect(result.policyRisk.vehicleMakeText).toBe(undefined);
  });
});