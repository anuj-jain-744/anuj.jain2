import {
  geteDriverRelation,
  updateCalculatePremiumPayload,
  deepCopy,
  createAddDriverDetailsMappingFields,
  mergeDriverDetails,
  getParkingType,
  getAntiTheftAlarmValue,
  getFrieExtinguisherValue,
  getEngineCapacity,
  updateSliderChangeCalculatePremiumPayload,
  driverRelationMappingValue,
  updateGenerateQuotePayload,
  vehiclePlateNumberText,
  driverEducationMappingValue,
  getDriverEducation,
  driverMaritalMappingValue,
  getMaritalStatus,
} from './quoteAndBuy'; // Replace './yourFileName' with the actual path to your file

describe('geteDriverRelation', () => {
  it('should return "Family member" for relationCode 0', () => {
    expect(geteDriverRelation(0)).toBe('Family member');
  });

  it('should return "Friend" for relationCode 1', () => {
    expect(geteDriverRelation(1)).toBe('Friend');
  });

  it('should return "Private driver" for relationCode 2', () => {
    expect(geteDriverRelation(2)).toBe('Private driver');
  });

  it('should return "None" for relationCode 3', () => {
    expect(geteDriverRelation(3)).toBe('None');
  });

  it('should return "Invalid relation code" for relationCode outside the valid range', () => {
    expect(geteDriverRelation(4)).toBe('Invalid relation code');
    expect(geteDriverRelation(-1)).toBe('Invalid relation code');
  });
});

describe('driverRelationMappingValue', () => {
  it('should return 0 for "Family member"', () => {
    expect(driverRelationMappingValue('Family member')).toBe(0);
  });

  it('should return 1 for "Friend"', () => {
    expect(driverRelationMappingValue('Friend')).toBe(1);
  });

  it('should return 2 for "Private driver"', () => {
    expect(driverRelationMappingValue('Private driver')).toBe(2);
  });

  it('should return 3 for "None"', () => {
    expect(driverRelationMappingValue('None')).toBe(3);
  });

  it('should return 3 for undefined relation', () => {
    expect(driverRelationMappingValue(undefined)).toBe(3);
  });

  it('should return 3 for any other string', () => {
    expect(driverRelationMappingValue('Other')).toBe(3);
  });
});

describe('updateCalculatePremiumPayload', () => {
  it('should update repairCondition in policyRisk if field is "repairCondition"', () => {
    const payload = { policyRisk: {} };
    const updatedPayload = updateCalculatePremiumPayload('repairCondition', 'New', payload);
    expect(updatedPayload.policyRisk.repairCondition).toBe('New');
  });

  it('should add the field to the payload if it is not "repairCondition"', () => {
    const payload = {};
    const updatedPayload = updateCalculatePremiumPayload('newField', 'newValue', payload);
    expect(updatedPayload.newField).toBe('newValue');
  });
});

describe('updateGenerateQuotePayload', () => {
  it('should set commercialRegistration to "" if field is "commercialRegistration"', () => {
    const payload = { policyCustomer: {} };
    const updatedPayload = updateGenerateQuotePayload('commercialRegistration', 'someValue', payload);
    expect(updatedPayload.policyCustomer.commercialRegistration).toBe('');
  });

  it('should update email in policyCustomer if field is "email"', () => {
    const payload = { policyCustomer: {} };
    const updatedPayload = updateGenerateQuotePayload('email', 'test@example.com', payload);
    expect(updatedPayload.policyCustomer.email).toBe('test@example.com');
  });

  it('should update primaryAddress in policyCustomer if field is "primaryAddress"', () => {
    const payload = { policyCustomer: {} };
    const updatedPayload = updateGenerateQuotePayload('primaryAddress', '123 Main St', payload);
    expect(updatedPayload.policyCustomer.primaryAddress).toBe('123 Main St');
  });

  it('should update deductibleAmount in policyRisk if field is "deductibleAmount"', () => {
    const payload = { policyRisk: {} };
    const updatedPayload = updateGenerateQuotePayload('deductibleAmount', 500, payload);
    expect(updatedPayload.policyRisk.deductibleAmount).toBe(500);
  });

  it('should update benefits in policyRisk if field is "benefits"', () => {
    const payload = { policyRisk: {} };
    const updatedPayload = updateGenerateQuotePayload('benefits', ['benefit1', 'benefit2'], payload);
    expect(updatedPayload.policyRisk.benefits).toEqual(['benefit1', 'benefit2']);
  });

  it('should add the field to the payload if it is none of the specified fields', () => {
    const payload = {};
    const updatedPayload = updateGenerateQuotePayload('newField', 'newValue', payload);
    expect(updatedPayload.newField).toBe('newValue');
  });
});

describe('updateSliderChangeCalculatePremiumPayload', () => {
  it('should update repairCondition and vehicleValue in policyRisk if field1 is "repairCondition" and field2 is "vehicleValue"', () => {
    const payload = { policyRisk: {} };
    const updatedPayload = updateSliderChangeCalculatePremiumPayload('repairCondition', 'vehicleValue', 'New', 10000, payload);
    expect(updatedPayload.policyRisk.repairCondition).toBe('New');
    expect(updatedPayload.policyRisk.vehicleValue).toBe(10000);
  });

  it('should add the fields to the payload if field1 and field2 are not "repairCondition" and "vehicleValue"', () => {
    const payload = {};
    const updatedPayload = updateSliderChangeCalculatePremiumPayload('field1', 'field2', 'value1', 'value2', payload);
    expect(updatedPayload.field1).toBe('value1');
    expect(updatedPayload.field2).toBe('value2');
  });
});

describe('deepCopy', () => {
  it('should create a deep copy of an object', () => {
    const original = { a: 1, b: { c: 2 } };
    const copy = deepCopy(original);
    expect(copy).toEqual(original);
    expect(copy).not.toBe(original);
    expect(copy.b).not.toBe(original.b);
  });
});

describe('vehiclePlateNumberText', () => {
  it('should return an empty string if plateNumber is null or undefined', () => {
    expect(vehiclePlateNumberText(null)).toBe('');
    expect(vehiclePlateNumberText(undefined)).toBe('');
  });

  it('should return the plate number if it does not contain a hyphen', () => {
    expect(vehiclePlateNumberText('ABC1234')).toBe('ABC1234');
  });

  it('should return the formatted plate number if it contains a hyphen', () => {
    expect(vehiclePlateNumberText('ABC-1234')).toBe('ABC - 1234');
  });
});

describe('driverEducationMappingValue', () => {
  it('should return 1 for "Primary"', () => {
    expect(driverEducationMappingValue('Primary')).toBe(1);
  });

  it('should return 2 for "Elementary"', () => {
    expect(driverEducationMappingValue('Elementary')).toBe(2);
  });

  it('should return 3 for "Secondary"', () => {
    expect(driverEducationMappingValue('Secondary')).toBe(3);
  });

  it('should return 4 for "Diploma"', () => {
    expect(driverEducationMappingValue('Diploma')).toBe(4);
  });

  it('should return 5 for "Bachelor"', () => {
    expect(driverEducationMappingValue('Bachelor')).toBe(5);
  });

  it('should return 6 for "Master"', () => {
    expect(driverEducationMappingValue('Master')).toBe(6);
  });

  it('should return 7 for "PhD"', () => {
    expect(driverEducationMappingValue('PhD')).toBe(7);
  });

  it('should return 8 for undefined education', () => {
    expect(driverEducationMappingValue(undefined)).toBe(8);
  });

  it('should return 8 for any other string', () => {
    expect(driverEducationMappingValue('Other')).toBe(8);
  });
});

describe('getDriverEducation', () => {
  it('should return "Primary" for educationLevel 1', () => {
    expect(getDriverEducation(1)).toBe('Primary');
  });

  it('should return "Elementary" for educationLevel 2', () => {
    expect(getDriverEducation(2)).toBe('Elementary');
  });

  it('should return "Secondary" for educationLevel 3', () => {
    expect(getDriverEducation(3)).toBe('Secondary');
  });

  it('should return "Diploma" for educationLevel 4', () => {
    expect(getDriverEducation(4)).toBe('Diploma');
  });

  it('should return "Bachelor" for educationLevel 5', () => {
    expect(getDriverEducation(5)).toBe('Bachelor');
  });

  it('should return "Master" for educationLevel 6', () => {
    expect(getDriverEducation(6)).toBe('Master');
  });

  it('should return "PhD" for educationLevel 7', () => {
    expect(getDriverEducation(7)).toBe('PhD');
  });

  it('should return "Others" for any other number', () => {
    expect(getDriverEducation(8)).toBe('Others');
    expect(getDriverEducation(0)).toBe('Others');
  });
});

describe('driverMaritalMappingValue', () => {
  it('should return 1 for "Married"', () => {
    expect(driverMaritalMappingValue('Married')).toBe(1);
  });

  it('should return 2 for "Single"', () => {
    expect(driverMaritalMappingValue('Single')).toBe(2);
  });

  it('should return 3 for "Divorced"', () => {
    expect(driverMaritalMappingValue('Divorced')).toBe(3);
  });

  it('should return 4 for "Widowed"', () => {
    expect(driverMaritalMappingValue('Widowed')).toBe(4);
  });

  it('should return 5 for undefined maritalStatus', () => {
    expect(driverMaritalMappingValue(undefined)).toBe(5);
  });

  it('should return 5 for any other string', () => {
    expect(driverMaritalMappingValue('Other')).toBe(5);
  });
});

describe('getMaritalStatus', () => {
  it('should return "Married" for status 1', () => {
    expect(getMaritalStatus(1)).toBe('Married');
  });

  it('should return "Single" for status 2', () => {
    expect(getMaritalStatus(2)).toBe('Single');
  });

  it('should return "Divorced" for status 3', () => {
    expect(getMaritalStatus(3)).toBe('Divorced');
  });

  it('should return "Widowed" for status 4', () => {
    expect(getMaritalStatus(4)).toBe('Widowed');
  });

  it('should return "Others" for any other number', () => {
    expect(getMaritalStatus(5)).toBe('Others');
    expect(getMaritalStatus(0)).toBe('Others');
  });
});

describe('createAddDriverDetailsMappingFields', () => {
  it('should return the default values', () => {
    const driver = {};
    const driverDetailsLength = 1;
    const result = createAddDriverDetailsMappingFields(driver, driverDetailsLength);
    expect(result.mainDriverInd).toBe("N");
    expect(result.usagePercentage).toBe(0.5);
    expect(result.nationality).toBe("Saudi Arabia");
    expect(result.driverIDType).toBe(2);
    expect(result.driverID).toBe("1080072984");
    expect(result.driverName).toBe("OMAR ABDULMOHSEN AHMED ALNAIM");
    expect(result.driverNameArabic).toBe("عمر عبدالمحسن بن احمد النعيم");
    expect(result.relation).toBe(3);
    expect(result.dateOfBirth).toBe("1994-01-04");
    expect(result.dateOfBirthH).toBe("22-07-1414");
    expect(result.gender).toBe("M");
    expect(result.occupation).toBe(" ");
    expect(result.educationLevel).toBe(8);
    expect(result.maritalStatusCd).toBe(5);
    expect(result.childrenBelow16).toBe(0);
    expect(result.workCompanyName).toBe(null);
    expect(result.workCityCode).toBe("");
    expect(result.homeCityCode).toBe("");
    expect(result.homeAddress).toBe("");
    expect(result.licenseType).toBe(1);
    expect(result.licenseYear).toBe(5);
    expect(result.licenseExpiryDateH).toBe(null);
    expect(result.idIssuePlaceCode).toBe("الخبر");
    expect(result.ncdReference).toBe("NCD23052462833");
    expect(result.noOfAccidents).toBe(0);
    expect(result.noOfClaims).toBe(0);
    expect(result.unitNo).toBe("");
    expect(result.buildingNumber).toBe("2180");
    expect(result.streetName).toBe("28جـ");
    expect(result.district).toBe("حي الراكة الشمالية");
    expect(result.city).toBe("الدمام");
    expect(result.additionalNumber).toBe("8822");
    expect(result.postalCode).toBe("34225");
    expect(result.healthConditions).toBe("");
    expect(result.trafficViolations).toBe("");
    expect(result.najmCaseDetails).toEqual([]);
    expect(result.validDrivingLicenses).toEqual([]);
  });
});

describe('mergeDriverDetails', () => {
  it('should merge driver details correctly', () => {
    const driverInput = [
      { driverID: '1', driverName: 'John' },
      { driverID: '2', driverName: 'Jane' },
    ];
    const driverResponse = [
      { driverID: '1', licenseYear: 10 },
      { driverID: '3', licenseYear: 5 },
    ];
    const driverDetailsLength = 2;
    const result = mergeDriverDetails(driverInput, driverResponse, driverDetailsLength);

    expect(result.length).toBe(2);
    expect(result[0].driverName).toBe('John');
    expect(result[0].licenseYear).toBe(10);
    expect(result[1].driverName).toBe("OMAR ABDULMOHSEN AHMED ALNAIM");
  });
});

describe('getParkingType', () => {
  it('should return 1 for "Street"', () => {
    expect(getParkingType('Street')).toBe(1);
  });

  it('should return 2 for "HomeLane"', () => {
    expect(getParkingType('HomeLane')).toBe(2);
  });

  it('should return 3 for "Garage"', () => {
    expect(getParkingType('Garage')).toBe(3);
  });

  it('should return 1 for any other string', () => {
    expect(getParkingType('Other')).toBe(1);
    expect(getParkingType(undefined)).toBe(1);
  });
});

describe('getAntiTheftAlarmValue', () => {
  it('should return "1" for "Working"', () => {
    expect(getAntiTheftAlarmValue('Working')).toBe("1");
  });

  it('should return "0" for "Not Working"', () => {
    expect(getAntiTheftAlarmValue('Not Working')).toBe("0");
  });

  it('should return "0" for any other string', () => {
    expect(getAntiTheftAlarmValue('Other')).toBe("0");
    expect(getAntiTheftAlarmValue(undefined)).toBe("0");
  });
});

describe('getFrieExtinguisherValue', () => {
  it('should return "1" for true', () => {
    expect(getFrieExtinguisherValue(true)).toBe("1");
  });

  it('should return "0" for false', () => {
    expect(getFrieExtinguisherValue(false)).toBe("0");
  });

  it('should return "0" for undefined', () => {
    expect(getFrieExtinguisherValue(undefined)).toBe("0");
  });
});

describe('getEngineCapacity', () => {
  it('should return the engine capacity as a number if engineCapacity is provided', () => {
    expect(getEngineCapacity('1.6 L')).toBe(1.6);
    expect(getEngineCapacity('2.0 L')).toBe(2.0);
  });

  it('should return 0 if engineCapacity is undefined', () => {
    expect(getEngineCapacity(undefined)).toBe(0);
  });

  it('should return 0 if engineCapacity is an empty string', () => {
    expect(getEngineCapacity('')).toBe(0);
  });

  it('should return 0 if engineCapacity does not contain a number', () => {
    expect(getEngineCapacity('Invalid')).toBe(NaN);
  });
});

import { getRepairType, getRegistrationNumber, formatDate, truncateName } from './quoteAndBuy';

describe('getRepairType', () => {
  it('should return an empty string when repairCondition is 0', () => {
    expect(getRepairType(0)).toBe("");
  });

  it('should return "Agency" when repairCondition is 1', () => {
    expect(getRepairType(1)).toBe("Agency");
  });

  it('should return "Workshop" when repairCondition is 2', () => {
    expect(getRepairType(2)).toBe("Workshop");
  });

  it('should return "Mathot" when repairCondition is 3', () => {
    expect(getRepairType(3)).toBe("Mathot");
  });

  it('should return undefined for invalid repairCondition', () => {
    expect(getRepairType(4)).toBeUndefined();
  });
});

describe('getRegistrationNumber', () => {
  it('should return formatted registration number with valid inputs', () => {
    expect(getRegistrationNumber("123", "ABC", "DEF", "GHI")).toBe("123-ABCDEFGHI");
  });

  it('should handle empty strings correctly', () => {
    expect(getRegistrationNumber("", "", "", "")).toBe("-"); 
  });

  it('should handle undefined values correctly', () => {
    expect(getRegistrationNumber("123", undefined, undefined, undefined)).toBe("123---");
  });
});

describe('formatDate', () => {
  it('should return formatted date string for valid date', () => {
    expect(formatDate("2023-10-10")).toBe("10 Oct 2023");
  });

  it('should return an empty string for undefined date', () => {
    expect(formatDate(undefined)).toBe("");
  });

  it('should return "Invalid Date" for invalid date string', () => {
    expect(formatDate("invalid-date")).toBe("Invalid Date");
  });

  it('should return an empty string when name is undefined', () => {
    expect(truncateName(undefined, 12)).toBe("");
  });

  it('should return the name as is when it is shorter than maxLength', () => {
    expect(truncateName("John", 12)).toBe("John");
  });

  it('should return the name as is when it is exactly maxLength', () => {
    expect(truncateName("JohnDoe12345", 12)).toBe("JohnDoe12345");
  });

  it('should truncate the name and add ellipsis when it is longer than maxLength', () => {
    expect(truncateName("JohnDoe123456789", 12)).toBe("JohnDoe12345...");
  });
});
