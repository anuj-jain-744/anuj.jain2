import { RELATION, familtyFlowConstants } from "components/Travel/constantsTravel";

export const getRelation = (relation: string | undefined): string => {
    switch (relation) {
      case "1":
        return "Self";
      case "2":
        return "Spouse";
      case "4":
        return "Daughter";
      case "3":
        return "Son";
      default:
        return "Unknown";
    }
  };

 export const getFamilyMemberTypeFromRelation = (relation: string) => {
    switch (relation) {
      case RELATION.SELF:
      case RELATION.SPOUSE: return familtyFlowConstants.TITLES.ADULT
      case RELATION.SON:
      case RELATION.DAUGHTER: return familtyFlowConstants.TITLES.CHILD
      default: return familtyFlowConstants.TITLES.SR_CITIZEN
    }
  }