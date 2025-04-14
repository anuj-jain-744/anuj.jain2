 import ComprehensiveBanner from "../../src/assets/Travel/wordwide.png"
 import ThirdpartyBanner from "../../src/assets/Travel/wordwideexceptusa.png";
 import { CompensationTypeKeys } from "types/coverageplan";

/// image factory function that reads the key and returns right banner for CompensationType
export const CompensationType = (name: CompensationTypeKeys) => {
  const CompensationTypeObj = {
    worldwide: ComprehensiveBanner,
    worldwide_except_usa: ThirdpartyBanner,
    europe:ThirdpartyBanner
  };
  return CompensationTypeObj[name];
};

// Card factory function that reads the key and returns right selected card for CompensationType
export const CompensationTypeCard = (name: CompensationTypeKeys) => {
  const CompensationTypeCardObj = {
    worldwide: "worldwide",
    worldwide_except_usa: "worldwide_except_usa",
    europe:"europe",
  };
  return CompensationTypeCardObj[name];
};
