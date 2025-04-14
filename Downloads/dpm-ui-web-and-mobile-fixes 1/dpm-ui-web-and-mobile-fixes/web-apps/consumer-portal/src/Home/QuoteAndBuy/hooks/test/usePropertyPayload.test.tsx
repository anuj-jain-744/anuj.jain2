import { renderHook } from '@testing-library/react-hooks';
import usePropertyPayload from '../usePropertyPayload';
import calculatePremiumPayload from '../calculatePremiumPayload.json';
import { apiFormatDate, convertYear } from 'utils/formatDate';
import { HOME_SCHEME_CODE } from 'constant';

describe('usePropertyPayload', () => {
  const { result } = renderHook(() => usePropertyPayload());

  const formAddressSelection = {
    propertyNo: "1",
    propertyBuildYear: "2000",
    propertyFloor: "2",
    propertyType: { activeIndex: "0" }
  };

  const userInfo = {
    addressData: {
      addresses: [
        { shortAddress: "Short Address", streetENG: "Street ENG", longitude: "50.0", latitude: "50.0" }
      ]
    },
    ownerId: "1234567890",
    ownerDetail: {
      gender: "Male",
      nationality: "Saudi",
      ownerDobG: "1990-01-01"
    }
  };

  const showPropertyMap = {
    longitude: "60.0",
    latitude: "60.0"
  };

  const languageData = {
    defaultCoverageCode: "Coverage Code",
    insurance_covering_contents: "Insurance Covering Contents"
  };

  const policyStartDate = "2023-01-01";

  it('init should return calculatePremiumPayload', () => {
    expect(result.current.init()).toEqual(calculatePremiumPayload);
  });

  it('updateFormAddressSelection should return correct payload', () => {
    const expectedPayload = {
      policyCoverage: [{ coverageCode: "Coverage Code" }],
      yearOfConstruction: 2000,
      noOfFloors: 2,
      buildingAge: convertYear("2000"),
      cityDistrict: 'Riyadh',
      areaLocalityEn: "Short Address",
      streetNameEn: "Street ENG",
      longitude: "60.0",
      latitude: "60.0"
    };
    expect(result.current.updateFormAddressSelection(formAddressSelection, userInfo, showPropertyMap, languageData)).toEqual(expectedPayload);
  });

  it('updateCustomerAddressSelection should return correct payload', () => {
    const expectedPayload = {
      nationalId: "1234567890",
      gender: "Male",
      nationality: "Saudi",
      dateOfBirth: apiFormatDate("1990-01-01")
    };
    expect(result.current.updateCustomerAddressSelection(userInfo)).toEqual(expectedPayload);
  });

  it('userAddressFormSelection should return correct payload', () => {
    const payload = { policyRisk: [{}] };
    const expectedPayload = {
      ...payload,
      policyCustomer: {
        nationalId: "1234567890",
        gender: "Male",
        nationality: "Saudi",
        dateOfBirth: apiFormatDate("1990-01-01")
      },
      policyRisk: [{
        ...payload.policyRisk[0],
        policyCoverage: [{ coverageCode: "Coverage Code" }],
        yearOfConstruction: 2000,
        noOfFloors: 2,
        buildingAge: convertYear("2000"),
        cityDistrict: 'Riyadh',
        areaLocalityEn: "Short Address",
        streetNameEn: "Street ENG",
        longitude: "60.0",
        latitude: "60.0"
      }],
      ownerOrTenant: 1,
      riskDescription: "Insurance Covering Contents",
      schemeCode: HOME_SCHEME_CODE,
      effectiveDate: apiFormatDate(policyStartDate, '/')
    };
    expect(result.current.userAddressFormSelection(payload, formAddressSelection, userInfo, showPropertyMap, languageData, policyStartDate)).toEqual(expectedPayload);
  });

  it('updateDeclarationItems should return correct payload', () => {
    const payload = { policyRisk: [{}] };
    const declartion = { key1: "1", key2: "2" };
    const declare = [{ key: "key1", value: false }, { key: "key2", value: true }];
    const expectedPayload = {
      ...payload,
      policyRisk: [{
        ...payload.policyRisk[0],
        key1: 1
      }]
    };
    expect(result.current.updateDeclarationItems(payload, declartion, declare)).toEqual(expectedPayload);
  });
});