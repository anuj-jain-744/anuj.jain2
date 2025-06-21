import { useContext } from "react";
import { TravelRegisterClaimContext } from "pages/travel/Policy-services/PolicyContext";
import { CONTEXT_COMMON_ERROR } from "constant";

export const useTraveRegisterClaimContext = () => {
  const context = useContext(TravelRegisterClaimContext);
  if (!context) {
    throw new Error(
      CONTEXT_COMMON_ERROR
    );
  }
  return context;
};