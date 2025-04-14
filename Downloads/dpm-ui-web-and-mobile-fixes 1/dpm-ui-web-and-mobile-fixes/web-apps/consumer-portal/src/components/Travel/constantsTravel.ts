export const defaultAPIDate = "0000-00-00";
export const defaultAPIDateUI = "00/00/0000";
export const familtyFlowConstants = {
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
    ERROR: "Error",
    DELETE_TRAVELLER: "Delete Traveller",
    BUTTONS: {
      NO: "No",
      YES: "Yes, Delete",
      OK: "Ok"
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

export const defaultTravellerPremiumAPIProps = {
  adult: { personAge: 20, relation: "2", dateOfBirth: defaultAPIDate },
  child: { personAge: 10, relation: "3", dateOfBirth: defaultAPIDate },
  senior: { personAge: 66, relation: "2", dateOfBirth: defaultAPIDate }
};

export const covergaeTypes = {
  winterSports: "WSC",
  covid: "CV"
};
