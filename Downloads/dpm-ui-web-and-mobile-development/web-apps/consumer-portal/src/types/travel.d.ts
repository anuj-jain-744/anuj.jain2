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

  interface ClaimEstimation {
    amount: number;
    cause: Partial<CauseOfLoss>;
    codeId: string;
    desc: string;
    files: Array<File>;
    id: string;
    names: Array<{ id: string; name: StringifyOptions; checked: boolean }>;
  }

  type ClaimEstimations = Array<ClaimEstimation>;
}
