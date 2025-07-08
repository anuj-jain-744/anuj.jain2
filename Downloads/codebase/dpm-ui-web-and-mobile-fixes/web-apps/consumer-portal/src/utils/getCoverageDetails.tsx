import { TRAVEL_COVERAGE_TYPE, coveragePlanTypeIdMap, coverageTypeIdMap } from "constant";


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

export const getCoveragePlanName = (
  coverageCodeReceived: string,
  planval: string
) => {
  let coverageValue = "";
  switch (coverageCodeReceived) {
    case coverageTypeIdMap.worldwide: {
      if (planval === coveragePlanTypeIdMap.type1) {
        coverageValue = TRAVEL_COVERAGE_TYPE.type_one;
      } else if (planval === coveragePlanTypeIdMap.type2) {
        coverageValue = TRAVEL_COVERAGE_TYPE.type_two;
      } else {
        coverageValue = TRAVEL_COVERAGE_TYPE.type_seven;
      }

      break;
    }
    case coverageTypeIdMap.worldwide1: {
      if (planval === coveragePlanTypeIdMap.type1) {
        coverageValue = TRAVEL_COVERAGE_TYPE.type_three;
      } else {
        coverageValue = TRAVEL_COVERAGE_TYPE.type_four;
      }

      break;
    }
    case coverageTypeIdMap.europe: {
      if (planval === coveragePlanTypeIdMap.type5) {
        coverageValue = TRAVEL_COVERAGE_TYPE.type_six;
      } else {
        coverageValue = TRAVEL_COVERAGE_TYPE.type_five;
      }

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
