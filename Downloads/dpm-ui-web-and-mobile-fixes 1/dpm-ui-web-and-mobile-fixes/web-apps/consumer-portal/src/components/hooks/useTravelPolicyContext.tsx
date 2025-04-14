import { useContext } from "react";
import { TravelPolicyContext } from "pages/travel/Policy-services/PolicyContext";
import { CONTEXT_COMMON_ERROR } from "constant";

export const useTravelPolicyContext = () => {
  const context = useContext(TravelPolicyContext);
  if (!context) {
    throw new Error(
      CONTEXT_COMMON_ERROR
    );
  }
  return context;
};