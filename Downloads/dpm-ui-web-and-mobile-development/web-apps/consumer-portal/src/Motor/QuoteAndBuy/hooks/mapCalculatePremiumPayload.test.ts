import { mapCalculatePremiumPayload } from './mapCalculatePremiumPayload';
import { getParkingType } from 'utils/quoteAndBuy';

// Mock dependencies
jest.mock('utils/quoteAndBuy', () => ({
  getParkingType: jest.fn()
}));

describe('mapCalculatePremiumPayload', () => {
  // Setup mock data
  const mockVehicleData = {
    make: 'Toyota',
    model: 'Camry',
    vehicleMakeText: 'Toyota Text',
    vehicleModelText: 'Camry Text',
    bodyTypeID: '1',
    vehicleValue: 50000,
    vehicleCapacity: '5',
    vehicleCylinders: '4',
    vehicleOwnerName: 'John Doe',
    vehicleOwnerId: '123456',
    plateType: '2',
    plateNo: 'ABC123',
    plateNoText1: 'ABC',
    plateNoText2: '123',
    plateNoText3: '',
    manufactureYear: '2022',
    vehicleColour: 'Black',
    vehicleRegistrationCity: 'City',
    chassisNumber: 'CHAS123',
    engineCapacity: '2000',
    transmissionType: 'AUTOMATIC',
    weight: '1500',
    additionFeatures: {
      safety: {
        parking: 'Garage',
        antiTheftAlarm: 'Yes',
        antiLockBrakingSystem: true,
        automaticBrakingSystem: true
      },
      features: {
        cruiseControl: true,
        adaptiveCruiseControl: true,
        modification: false
      },
      camera: {
        rearParkingSensor: true,
        frontSensor: true,
        rearCamera: true,
        frontCamera: true,
        degreeCamera: true
      },
      commercialVehicle: {
        fireExtinguisher: true,
        vehicleAxleWeight: 2000
      }
    }
  };

  const mockDriverData = [{
    mainDriverInd: 'Y',
    nationality: 'SAU',
    driverID: 'D123',
    driverName: 'John Driver',
    driverNameArabic: 'جون درايفر',
    relation: 'Self',
    dateofBirth: '1990-01-01',
    dateofBirthH: '1410-01-01',
    gender: 'M',
    occupation: 'Engineer',
    additionalDriverDetails: {
      educationLevel: 'University',
      maritalStatusCd: 'Single',
      childrenBelow16: 0
    },
    noOfAccidents: 0,
    noOfClaims: 0,
    buildingNumber: '123',
    streetName: 'Main St',
    district: 'District',
    city: 'City',
    postalCode: '12345'
  }];

  const mockOwnerData = {
    ownerId: 'O123',
    ownerFullNameEnglish: 'John Owner',
    ownerFullNameArabic: 'جون اونر',
    gender: 'M',
    nationality: 'SAU',
    mobileNumber: '1234567890',
    ownerDobG: '1985-01-01'
  };

  const mockVehicleUserInput = {
    vehicleDefinitionType: '1',
    vehicleSequenceNo: '001',
    vehicleCustomID: 'V123'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    getParkingType.mockReturnValue('1');
  });

  it('should map vehicle data correctly', () => {
    const result = mapCalculatePremiumPayload(mockVehicleData, mockDriverData, mockOwnerData, mockVehicleUserInput);

    expect(result.schemeCode).toBe('P2');
    expect(result.policyRisk.vehicleMake).toBe('Toyota');
    expect(result.policyRisk.vehicleModel).toBe('Camry');
    expect(result.policyRisk.transmissionType).toBe(1);
    expect(result.policyRisk.vehicleAntitheftAlarm).toBe('1');
    expect(result.policyRisk.engineCapacity).toBe(2000);
  });

  it('should handle driver usage percentage correctly for single driver', () => {
    const result = mapCalculatePremiumPayload(mockVehicleData, mockDriverData, mockOwnerData, mockVehicleUserInput);
    
    expect(result.policyRisk.drivers[0].usagePercentage).toBe(1);
  });

  it('should handle multiple drivers usage percentage correctly', () => {
    const multipleDrivers = [
      { ...mockDriverData[0] },
      { ...mockDriverData[0], mainDriverInd: 'N', driverID: 'D124' }
    ];

    const result = mapCalculatePremiumPayload(mockVehicleData, multipleDrivers, mockOwnerData, mockVehicleUserInput);
    
    expect(result.policyRisk.drivers[0].usagePercentage).toBe(0.5);
    expect(result.policyRisk.drivers[1].usagePercentage).toBe(0.5);
  });

  it('should handle missing vehicle features gracefully', () => {
    const vehicleDataWithoutFeatures = {
      ...mockVehicleData,
      additionFeatures: {}
    };

    const result = mapCalculatePremiumPayload(vehicleDataWithoutFeatures, mockDriverData, mockOwnerData, mockVehicleUserInput);
    
    expect(result.policyRisk.vehicleAntitheftAlarm).toBe('0');
    expect(result.policyRisk.vehicleCruiseControl).toBe('0');
    expect(result.policyRisk.vehicleRearCamera).toBe('0');
  });

  it('should format dates correctly', () => {
    const result = mapCalculatePremiumPayload(mockVehicleData, mockDriverData, mockOwnerData, mockVehicleUserInput);
    
    expect(result.policyRisk.drivers[0].dateOfBirth).toBe('01-01-1990');
    expect(result.policyCustomer.dateOfBirth).toBe('01-01-1985');
  });

  it('should handle nullable vehicle data fields', () => {
    const vehicleDataWithNulls = {
      ...mockVehicleData,
      make: null,
      model: null,
      plateType: null
    };

    const result = mapCalculatePremiumPayload(vehicleDataWithNulls, mockDriverData, mockOwnerData, mockVehicleUserInput);
    
    expect(result.policyRisk.vehicleMake).toBe('');
    expect(result.policyRisk.vehicleModel).toBe('');
    expect(result.policyRisk.plateType).toBe('1');
  });

  it('should map owner data correctly', () => {
    const result = mapCalculatePremiumPayload(mockVehicleData, mockDriverData, mockOwnerData, mockVehicleUserInput);
    
    expect(result.policyCustomer.nationalId).toBe('O123');
    expect(result.policyCustomer.customerNameEnglish).toBe('John Owner');
    expect(result.policyCustomer.customerNameArabic).toBe('جون اونر');
    expect(result.policyCustomer.mobile).toBe('1234567890');
  });

  it('should handle transmission type conversion correctly', () => {
    const manualTransmissionData = {
      ...mockVehicleData,
      transmissionType: 'MANUAL'
    };

    const result = mapCalculatePremiumPayload(manualTransmissionData, mockDriverData, mockOwnerData, mockVehicleUserInput);
    expect(result.policyRisk.transmissionType).toBe(2);
  });
});

import { driverUsagePercentage } from './mapCalculatePremiumPayload';

describe('driverUsagePercentage', () => {
  it('should return { mainDriver: 1, additionalDriver: 0 } when totalDrivers is 1', () => {
    const result = driverUsagePercentage(1);
    expect(result).toEqual({ mainDriver: 1, additionalDriver: 0 });
  });

  it('should return { mainDriver: 0.5, additionalDriver: 0.5 } when totalDrivers is 2', () => {
    const result = driverUsagePercentage(2);
    expect(result).toEqual({ mainDriver: 0.5, additionalDriver: 0.5 });
  });

  it('should return { mainDriver: 0.5, additionalDriver: 0.25 } when totalDrivers is 3', () => {
    const result = driverUsagePercentage(3);
    expect(result).toEqual({ mainDriver: 0.5, additionalDriver: 0.25 });
  });

  it('should return { mainDriver: 0.25, additionalDriver: 0.25 } when totalDrivers is 4', () => {
    const result = driverUsagePercentage(4);
    expect(result).toEqual({ mainDriver: 0.25, additionalDriver: 0.25 });
  });

  it('should return { mainDriver: 1, additionalDriver: 0 } when totalDrivers is undefined or any other value', () => {
    const resultUndefined = driverUsagePercentage(undefined);
    expect(resultUndefined).toEqual({ mainDriver: 1, additionalDriver: 0 });

    const resultOther = driverUsagePercentage(5);
    expect(resultOther).toEqual({ mainDriver: 1, additionalDriver: 0 });
  });
});