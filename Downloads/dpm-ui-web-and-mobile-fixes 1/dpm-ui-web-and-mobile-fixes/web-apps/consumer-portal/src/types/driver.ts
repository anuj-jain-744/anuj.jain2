export interface DriverProps {
    streetName: string;
    driverName: string;
    licenseYear: number;
    actuarialCity: string;
    postalCode: string;
    gender: string;
    usagePercentage: number;
    licenseType: number;
    driverID: string;
    relation: number;
    noOfClaims: number;
    driverNameArabic: string;
    maritalStatusCd: number;
    idIssuePlaceCode: string;
    mainDriverInd: string;
    childrenBelow16: number;
    city: string;
    additionalNumber: string;
    educationLevel: number;
    nationality: string;
    noOfAccidents: number;
    occupation: string;
    buildingNumber: string;
    driverIDType: number;
    dateofBirth: string;
    licenseExpiryDateH: string;
    district: string;
    licenseCountry: number;
    healthConditions?: string;
    trafficViolations?: string;
    driver? :{
        driverName: string;
    }
}
