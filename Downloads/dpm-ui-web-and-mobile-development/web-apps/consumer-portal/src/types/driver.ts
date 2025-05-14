export interface DriverProps {
    streetName: string;
    driverName: string;
    licenseYear: number;
    actuarialCity: string;
    postalCode: string;
    gender: string;
    usagePercentage: number;
    licenseType?: number | string;
    driverID: string;
    relation: number;
    noOfClaims: number;
    driverNameArabic: string;
    maritalStatusCd?: number | string;
    idIssuePlaceCode: string;
    mainDriverInd: string;
    childrenBelow16?: number;
    city: string;
    additionalNumber: string;
    educationLevel?: number | string;
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
    taxableAmount?: number;
    driver? :{
        driverNameArabic?: string;
        driverID?: string;
        driverName: string;
        relation?: number;
        premium?: number;
    }
}
