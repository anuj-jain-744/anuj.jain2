import { useApiCall } from "@dpm/shared-module";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { JAVA_API_ROUTES } from 'constant';

type ValueType = unknown;

function isValidJSON(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export default function useSaveRedisData() {
  const { redisKey, journeyData, setJourneyData } = useQuoteAndBuyContext();
  const { makeApiCall } = useApiCall(6, JAVA_API_ROUTES?.redisSetValue, "post");

  const saveRedisData = (
    key: string,
    value: ValueType,
    currentStep: number
  ) => {
    const journeyRedisData: { [key: string]: ValueType[] } = isValidJSON(journeyData) ? JSON.parse(journeyData) : {};

    let data: { [key: string]: ValueType } = { ...journeyRedisData, currentStep };
    if (key === "driverDetails") {
      data = { ...data, [key]: value };
    } else if (key === "multiValue" && typeof value === "object") {
      data = { ...data, ...value };
    } else if (key !== "") {
      data = { ...data, [key]: value };
    }
    setJourneyData(key === "empty" ? "" : JSON.stringify(data));
    makeApiCall({ key: redisKey, value: key === "empty" ? null : JSON.stringify(data) }, false);
  };

  return {
    saveRedisData,
  };
}