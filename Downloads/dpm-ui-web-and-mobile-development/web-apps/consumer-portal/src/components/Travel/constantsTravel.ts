export const defaultAPIDate = "0000-00-00";
export const defaultAPIDateUI = "00/00/0000";
export const familtyFlowConstants = {
  maxCount: 8,
  SENIOR_CITIZEN_AGE_CHECK: 65,
  adultAge: 18,
  seniorAgeLimit: 80,
  nationality: "Saudi Arabia",
  passportNumber: " ",
  passportExpiryDate: defaultAPIDateUI,
  dateOfBirth: defaultAPIDateUI,
  dobG: "00-00-0000",
  POPUP_USED: {
    POPUP_FOR: "deleteConfirmation",
    LAST_FAMILY_MEMBER_NOT_SELF_DELETE:'deleteLastValidMember',
    ERROR: "Error",
    DELETE_TRAVELLER: "Delete Traveller",
    SENIOR_CITIZEN_AGE_VALIDATION:'seniorCitizenAgeValidation',
    SENIOR_CITIZEN_AGE_VALIDATION_HEADER: 'Senior Citizen Age Validation',
    BUTTONS: {
      NO: "No",
      YES: "Yes, Delete",
      OK: "Ok",
      CONFIRM:'Confirm'
    }
  },
  TITLES: {
    ADULT: "Adult",
    CHILD: "Child",
    SR_CITIZEN: "Senior Citizen",
    SELF: "Self",
    SENIOR: "Senior"
  },
  TYPES_CHECK: {
    ADULT: "adult",
    CHILD: "child",
    ADULT1: "adult1",
    SENIOR: "senior"
  }
};

export const RELATION = {
  SELF: 'Self',
  SPOUSE: 'Spouse',
  DAUGHTER: 'Daughter',
  SON: 'Son',
  OTHER: 'Other'
}

export const defaultTravellerPremiumAPIProps = {
  adult: { personAge: 20, relation: "2", dateOfBirth: defaultAPIDate },
  child: { personAge: 10, relation: "3", dateOfBirth: defaultAPIDate },
  senior: { personAge: 66, relation: "2", dateOfBirth: defaultAPIDate }
};

export const covergaeTypes = {
  winterSports: "WSC",
  covid: "CV"
};

export const coverageCodes = {
  WSC: "Winter Sports",
  CV: "Covid-19"
}
