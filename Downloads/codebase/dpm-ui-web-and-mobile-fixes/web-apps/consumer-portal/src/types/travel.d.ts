declare namespace Travel {
  interface TravelPeriod {
    codeId: string;
    codeDesc: string;
  }
  interface TravelPeriodOption extends Partial<TravelPeriod> {
    label: string;
    value: string;
  }
  interface Traveler {
    uiId: string;
    travellerNameEnglish: string;
    travellerNameArabic: string;
    passportNumber: string;
    passportExpiryDate: string;
    dateOfBirth: string;
    relation: string;
    personAge: number;
    nationalIqamaId: string;
    nationality: string;
    gender: string;
    policyCoverage: Array<{ coverageCode: string }>;
    type: "Self" | "Child" | "Adult" | "Senior Citizen";
  }

  interface CauseOfLoss {
    code: string;
    coverage_code: string;
    label: string;
    subValues: Array<string>;
    sub_values: Array<string>;
    value: string;
  }

  interface InputFileType {
    id: string;
    label: string;
    name: string;
    file: File | null;
    base64: string;
    error: string;
  }

  interface ClaimEstimation {
    amount: number;
    cause: Partial<CauseOfLoss>;
    codeId: string;
    desc: string;
    files: Array<InputFileType>;
    id: string;
    names: Array<{ id: number; name: StringifyOptions; checked: boolean }>;
    amountError: string;
  }

  type ClaimEstimations = Array<ClaimEstimation>;

  interface DocFileAPIData {
    docFile: string;
    fileName: string;
  }

  type DocFilesAPIData = Array<DocFileAPIData>;

  interface IBANDetails {
    mobile: string | number;
    emaiId: string;
    iBAN: string;
    bankName: string;
    iBANFiles: DocFilesAPIData;
  }

  interface ClaimCoverage {
    coverageCode: string;
    coverageName: string;
    deductible: number;
    initialReserve: number;
    isSelect: string;
    siLimit: number;
  }
   
  type ClaimCoverageValues = Array<ClaimCoverage>;
}
