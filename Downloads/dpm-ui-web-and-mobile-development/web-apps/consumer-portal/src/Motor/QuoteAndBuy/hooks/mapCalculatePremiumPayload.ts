import { PromoCodeScheme } from 'types/promoCodeType';
import { VehicleDetailsResponseData, DriverDetailsResponseData, OwnerDetailsResponseData, VehicleDetails } from 'types/quoteAndBuy';
import { driverRelationMappingValue, getParkingType } from 'utils/quoteAndBuy';
import { Country } from '../QuoteAndBuyContext';
import { capitalizeNameFirstLetter } from '@dpm/shared-module';

export const DEFAULT_SCHEME_CODE = "P2";

export const mapCalculatePremiumPayload = (
  vehicleData: VehicleDetailsResponseData,
  driverData: DriverDetailsResponseData[],
  ownerData: OwnerDetailsResponseData,
  vehicleUserInput: VehicleDetails,
  countryData: Country[],
  schemeCode?: PromoCodeScheme,
) => {
  const getCountryNameById = (codeId: string): string | null=> {
    const country = countryData?.find((country: Country) => country.codeId === codeId);
    return country ? country.codeDesc : null;
  }


  const totalDrivers = driverData.length;

  return {
    schemeCode: schemeCode?.schemeCode ?? DEFAULT_SCHEME_CODE,
    policyRisk: {
      vehicleDefinitionType: vehicleUserInput.vehicleDefinitionType,
      vehicleSequenceNo: vehicleUserInput.vehicleSequenceNo,
      vehicleCustomID: vehicleUserInput.vehicleCustomID,
      vehicleMake: vehicleData.vehicleMakeText ? "" : vehicleData.make,
      vehicleMakeText: vehicleData.vehicleMakeText,
      vehicleModel: vehicleData.vehicleModelText ? "" : vehicleData.model,
      vehicleModelText: vehicleData.vehicleModelText ?? "",
      vehicleBodyType: vehicleData.bodyTypeID?.toString() ?? "0",
      vehicleValue: vehicleData.vehicleValue,
      deductibleReferenceNo: "", // Not found in existing api response
      deductibleAmount: 0.0, // Default value
      vehicleCapacity: parseInt(vehicleData.vehicleCapacity) ?? 0,
      vehicleCylinders: parseInt(vehicleData.vehicleCylinders) ?? 0,
      vehicleRegion: "", // Not found in existing api response
      vehicleOwnerName: vehicleData.vehicleOwnerName,
      vehicleOwnerId: vehicleData.vehicleOwnerId,
      plateType: vehicleData.plateType ?? "1",
      plateNo: vehicleData.plateNo ?? "",
      plateNoText1: vehicleData.plateNoText1 ?? "",
      plateNoText2: vehicleData.plateNoText2 ?? "",
      plateNoText3: vehicleData.plateNoText3 ?? "",
      manufactureYear: parseInt(vehicleData.manufactureYear),
      vehicleColour: vehicleData.vehicleColour,
      vehicleRegistrationCity: "", // vehicleData.vehicleRegistrationCity ??  DEFAULT VALUE, AS DIKESH SUGGESTION UPDATED WITH EMPTY STRING BECAUSE CUSTOMCARD FLOW NOT WORKING AND IT NOT MANDATORY FIELD
      chassisNo: vehicleData.chassisNumber ?? "",
      vehicleRegistrationExpiryDateH: vehicleData.vehicleRegistrationExpiryDateH ?? "",
      depreciationRatePercentage: 0.0, // Default value
      vehicleMileage: 0, // Default value
      expectedMileage: 1, // Default value
      engineCapacity: parseInt(vehicleData.engineCapacity) ?? 0,
      transmissionType: String(vehicleData?.transmissionType).toLocaleUpperCase() === 'MANUAL' ? 2 : 1, // 1: Automatic, 2: Manual but from api getting different values
      vehicleParkingType: getParkingType(vehicleData?.additionFeatures?.safety?.parking),
      vehicleAntitheftAlarm: vehicleData.additionFeatures?.safety?.antiTheftAlarm === 'Yes' ? "1" : "0",
      fireExtinguisher: vehicleData.additionFeatures?.commercialVehicle?.fireExtinguisher ? "1" : "0",
      antiLockBrakingSystem: vehicleData.additionFeatures?.safety?.antiLockBrakingSystem ? "1" : "0",
      vehicleAutoBraking: vehicleData.additionFeatures?.safety?.automaticBrakingSystem ? "1" : "0",
      vehicleABS: vehicleData.additionFeatures?.safety?.antiLockBrakingSystem ? "1" : "0",
      vehicleCruiseControl: vehicleData.additionFeatures?.features?.cruiseControl ? "1" : "0",
      vehicleAdaptiveCruiseControl: vehicleData.additionFeatures?.features?.adaptiveCruiseControl ? "1" : "0",
      vehicleRearSensors: vehicleData.additionFeatures?.camera?.rearParkingSensor ? "1" : "0",
      vehicleFrontSensors: vehicleData.additionFeatures?.camera?.frontSensor ? "1" : "0",
      vehicleRearCamera: vehicleData.additionFeatures?.camera?.rearCamera ? "1" : "0",
      vehicleFrontCamera: vehicleData.additionFeatures?.camera?.frontCamera ? "1" : "0",
      vehicle360Camera: vehicleData.additionFeatures?.camera?.degreeCamera ? "1" : "0",
      vehicleUsage: 1, // Default value
      axleWeight: vehicleData.additionFeatures?.commercialVehicle?.vehicleAxleWeight?.toString() ?? "0",
      weight: parseInt(vehicleData.weight),
      vehicleModification: vehicleData.additionFeatures?.features?.modification ? "1" : "0",
      remarks: "-", // Default value
      vehicleDriveCity: "", // Not found in existing api response
      repairCondition: 2, // Default value
      vehicleOwnerTransfer: 0, // Default value
      hasTrailer: 0, // Default value
      yakeenRetrieveFlag: "Y", // Default value

      // Drivers
      drivers: driverData.map((driver, index) => ({
        mainDriverInd: driver.mainDriverInd || (index === 0 ? "Y" : "N"),
        usagePercentage: driver.mainDriverInd === 'Y'
          ? driverUsagePercentage(totalDrivers).mainDriver
          : driverUsagePercentage(totalDrivers).additionalDriver,
        nationality: getCountryNameById(driver.nationality), // NEED TO REMOVE THIS WHILE COMMIT driver.nationality ??
        driverIDType: driver.driverIDType ?? 2,
        driverID: driver.driverID,
        driverName: driver.driverName,
        driverNameArabic: driver.driverNameArabic,
        relation: driver?.additionalDriverDetails?.driverRelationship ?
          driverRelationMappingValue(driver?.additionalDriverDetails?.driverRelationship) : "",
        dateOfBirth: driver.dateofBirth?.split('-').reverse().join('-'),
        dateOfBirthH: driver.dateofBirthH,
        gender: driver.gender,
        occupation: driver.occupation,
        educationLevel: driver.additionalDriverDetails?.educationLevel,
        maritalStatusCd: driver.additionalDriverDetails?.maritalStatusCd,
        childrenBelow16: driver.additionalDriverDetails?.childrenBelow16,
        workCompanyName: driver.workCompanyName ?? "",
        workCityCode: driver.workCityCode ?? "",
        homeCityCode: driver.homeCityCode ?? "",
        homeAddress: driver.homeAddress,
        licenseType: driver.licenseType ?? 0,
        licenseYear: driver.licenseYear ?? 0,
        licenseExpiryDateH: driver.licenseExpiryDateH ?? "",
        idIssuePlaceCode: driver.idIssuePlaceCode,
        ncdFreeYears: driver.ncdFreeYears ? parseInt(driver.ncdFreeYears) : 1, // Default value NEED UPDATE FROM EBOE TEAM
        ncdReference: driver.ncdReferenceNo ?? "DUMMY", // Default value NEED UPDATE FROM EBOE TEAM
        noOfAccidents: driver.noOfAccidents,
        noOfClaims: driver.noOfClaims,
        unitNo: driver.unitNo ?? "",
        buildingNumber: driver.buildingNumber,
        streetName: driver.streetName,
        district: driver.district,
        city: driver.city,
        additionalNumber: driver.additionalNumber,
        postalCode: driver.postalCode,
        healthConditions: driver.healthConditions ?? "",
        trafficViolations: driver.trafficViolations ?? "",
        najmCaseDetails: driver.najmCaseDetails ?? [],
        validDrivingLicenses: driver.validDrivingLicenses ?? []
      }))
    },
    policyCustomer: {
      nationalId: ownerData.ownerId ?? "",
      customerNameEnglish: capitalizeNameFirstLetter(ownerData.ownerFullNameEnglish),
      customerNameArabic: ownerData.ownerFullNameArabic,
      gender: ownerData.gender,
      nationality: ownerData.nationality,
      mobile: ownerData.mobileNumber ?? "",
      dateOfBirth: ownerData.ownerDobG?.split('-').reverse().join('-')

    }
  };
};

export const driverUsagePercentage = (totalDrivers: number | undefined): { mainDriver: number; additionalDriver: number } => {
  switch (totalDrivers) {
    case 1:
      return { mainDriver: 1, additionalDriver: 0 };
    case 2:
      return { mainDriver: 0.5, additionalDriver: 0.5 };
    case 3:
      return { mainDriver: 0.5, additionalDriver: 0.25 };
    case 4:
      return { mainDriver: 0.25, additionalDriver: 0.25 };
    default:
      return { mainDriver: 1, additionalDriver: 0 };
  }
};
