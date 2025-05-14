import { TRAVEL_COVERAGE_TYPE } from "constant";

export const getCoverageDetails = (coverageCodeReceived: string) => {
  let coverageValue = "";
  switch (coverageCodeReceived) {
    case "1": {
      coverageValue = TRAVEL_COVERAGE_TYPE.type_one;
      break;
    }
    case "2": {
      coverageValue = TRAVEL_COVERAGE_TYPE.type_two;
      break;
    }
    case "3": {
      coverageValue = TRAVEL_COVERAGE_TYPE.type_three;
      break;
    }
    case "4": {
      coverageValue = TRAVEL_COVERAGE_TYPE.type_four;
      break;
    }
    case "5": {
      coverageValue = TRAVEL_COVERAGE_TYPE.type_five;
      break;
    }
    case "6": {
      coverageValue = TRAVEL_COVERAGE_TYPE.type_six;
      break;
    }
    case "7": {
      coverageValue = TRAVEL_COVERAGE_TYPE.type_seven;
      break;
    }
  }
  return coverageValue;
};

export const getNoOfTravellers = (policyDataReceived: any) => {
  let num = 0;
  if (policyDataReceived !== undefined && policyDataReceived.length > 0 && policyDataReceived !== null) {
    num = policyDataReceived[0].policyRisk?.length;
  }
  return num;
};
