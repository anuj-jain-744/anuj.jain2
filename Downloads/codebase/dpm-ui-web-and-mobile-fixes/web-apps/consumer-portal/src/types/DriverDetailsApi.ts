export interface DriverDetailsResponse {
  driverDetails: {
    name: string;
    age: number;
  };
}

export interface DriverDetailsRequest {
  driverId: string;
  dob: string | undefined;
  driverIDType?: number;
  nationality?: string;
  dateofBirthH?: string;
  mainDriverInd?: string;
}

export interface DriverDetailsFormsData {
  ownerId: string,
  ownerDOB: string,
  relation: number;
}