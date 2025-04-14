import { useCallback, useState } from "react";
import {
  VITE_CONTENT_BASE_URI,
  VITE_BACKEND_BASE_URL,
  VITE_BASE_URL_MOTOR_BUY,
  VITE_BASE_URL_MOTOR_QUOTE_AND_BUY_URL,
  VITE_BASE_URL_MOTOR_ENDORSEMENT_URL,
  VITE_BASE_URL_MOTOR_QUOTEANDBUY,
  VITE_BACKEND_UTILITY_URL,
  VITE_BACKEND_TRAVEL_MASTER_DATA_URL,
  VITE_COMMON_UTILITY_V1_ENDPOINT,
  VITE_HOME_QAB_URL,
  VITE_REDIS_UTILITY,
  VITE_POLICY_CANCELLATION_BASE_URL,
  VITE_BACKEND_TRAVEL_QUOTEANDBUY,
  VITE_BASE_URL_TRAVEL_QUOTEANDBUY,
  VITE_BACKEND_MOTOR_URL,
  VITE_BASE_LOGIN_URL,
  VITE_BASE_SIGNUP_URL,
  VITE_BASE_URL_DASHBOARD_MOTOR,
  VITE_BASE_CASECREATION_URL,
  VITE_BACKEND_URL
} from "../constant";
import { callAPI } from "../service";
import { a } from "@react-spring/web";

type APIMethod = "get" | "post" | "put" | "delete";
type APIType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 21 | 22 | 23 | 24 | 25;
const SUCCESS_CODE = 1;
const SUCCESS_MESSAGE = "SUCCESS";

interface ErrorResponse {
  name: string;
  code: string;
  messages: {
    message_en: string;
    message_ar: string;
  };
}

interface ApiCallHook<TData, TPayload> {
  makeApiCall: (payload?: TPayload, isQueryParams?: boolean) => Promise<void>;
  isLoading: boolean;
  errors: ErrorResponse | null;
  data: TData | null;
  setData: (value: TData | null) => void;
  dataPremium: TData | null;
}

interface APIResponse<D = undefined> {
  code: number;
  message: string;
  data?: D;
  errors?: ErrorResponse[];
  status?: string;
}

/**
 *
 * @param apiType will be 0 or 1, 1 for MOTOR_BUY API  and 1 for CMS API
 * @param apiUrl String for API call
 * @param apiLang CMS api is called based on lang
 * @returns
 */
const getFullUrl = (apiType: APIType, apiUrl: string, apiLang: string) => {

  switch (apiType) {
    case 0:
      return VITE_BASE_URL_MOTOR_BUY + apiUrl;
    case 1:
      return `${VITE_CONTENT_BASE_URI}/${apiLang}/api/` + apiUrl;
    case 2:
      return VITE_BASE_URL_MOTOR_QUOTEANDBUY + apiUrl;
    case 3:
      return VITE_BASE_URL_MOTOR_QUOTE_AND_BUY_URL + apiUrl;
    case 4:
      return VITE_BASE_URL_MOTOR_ENDORSEMENT_URL + apiUrl;
    case 5:
      return VITE_BACKEND_UTILITY_URL + apiUrl;
    case 21:
      return VITE_BACKEND_TRAVEL_MASTER_DATA_URL + apiUrl;
    case 23:
      return VITE_BACKEND_TRAVEL_QUOTEANDBUY + apiUrl;
    case 6:
      return VITE_REDIS_UTILITY + apiUrl;
    case 7:
      return VITE_POLICY_CANCELLATION_BASE_URL + apiUrl;
    case 8:
      return VITE_BACKEND_BASE_URL + apiUrl;
    case 9:
      return VITE_COMMON_UTILITY_V1_ENDPOINT + apiUrl;
    case 10:
      return VITE_HOME_QAB_URL + apiUrl;
    case 22:
      return VITE_BASE_URL_TRAVEL_QUOTEANDBUY + apiUrl;
    case 11:
      return VITE_BACKEND_MOTOR_URL + apiUrl;
    case 12:
      return VITE_BACKEND_TRAVEL_MASTER_DATA_URL + apiUrl;
    case 13:
      return VITE_BASE_LOGIN_URL + apiUrl;
    case 14:
      return VITE_BASE_SIGNUP_URL + apiUrl;
    case 15:
      return VITE_BACKEND_TRAVEL_MASTER_DATA_URL + apiUrl;
    case 16:
      return VITE_BASE_URL_DASHBOARD_MOTOR + apiUrl;
    case 24:
      return VITE_BASE_CASECREATION_URL + apiUrl;
    case 25:
      return VITE_BACKEND_URL + apiUrl;
    default:
      return apiUrl;

  }
};

/**
 *
 * @param response
 * @param setData
 * @param setDataPremium
 * @param setError
 * @param apiType
 */
const getResponse = (
  response: APIResponse<undefined>,
  setData: { (value: APIResponse<undefined>): void; },
  setDataPremium: { (value: APIResponse<undefined>): void; },
  setError: { (value: ErrorResponse | null): void; },
  apiType: number
) => {
  switch (apiType) {
    case 0:
    case 2:
    case 3:
    case 4:
    case 5:
    case 8:
    case 23:
    case 9:
    case 10:
    case 11:
    case 13:
    case 14:
    case 15:
    case 25:
      if (response && response?.code == SUCCESS_CODE && response?.message && response?.message.toUpperCase() === SUCCESS_MESSAGE) {
        if (response.data) {
          setData(response.data);
          setDataPremium(response.data);
        }
      } else if (response && response.errors && response.errors.length > 0) {
        setError(response.errors[0]);
      }
      break;
    case 1:
    case 7:
    case 12:
    case 21:
    case 6:
      if (response) {
        setData(response);
      } else {
        setError(response);
      }
      break;
    case 22:
    case 24:
      if (response && response?.code == SUCCESS_CODE && response?.message && response?.message.toUpperCase() === SUCCESS_MESSAGE) {
        setData(response);
      } else if (response && response.errors && response.errors.length > 0) {
        setError(response.errors[0]);
      }
      break;
    case 16:
      if (response && response?.code == SUCCESS_CODE) {
        if (response.data) {
          setData(response.data);
          setDataPremium(response.data);
        }
      } else if (response && response.errors && response.errors.length > 0) {
        setError(response.errors[0]);
      }
      break;
    default:
      break;
  }
};

/**
 *
 * @param apiType will be 0 or 1 0 for JAVA API  and 1 for CMS API
 * @param payload Request body to send in post put API
 * @param apiRoute String for API call
 * @param apiMethod APIMethod
 * @param apiLang CMS api is called based on lang
 * @returns
 */
export function useApiCall<TData, TPayload>(
  apiType: APIType,
  apiRoute: string,
  apiMethod: APIMethod,
  apiLang: string = "en",
  authorization: boolean = false
): ApiCallHook<TData, TPayload> {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setError] = useState<ErrorResponse | null>(null);
  const [data, setData] = useState<TData | null>(null);
  const [dataPremium, setDataPremium] = useState<TData | null>(null);

  let encoded = "";
  if (authorization) {
    const { VITE_CONTENT_SAG_USERNAME, VITE_CONTENT_SAG_PASSWORD } = import.meta.env;
    // const username = VITE_CONTENT_SAG_USERNAME;
    // const password = VITE_CONTENT_SAG_PASSWORD;
    const username = "WalaaSMSCRMuser";
    const password = "Walaa@2023$$";

    if (!username || !password) {
      const authError: ErrorResponse = {
        name: "API credentials Error",
        code: "401",
        messages: {
          message_en: "API credentials are not set",
          message_ar: "API credentials are not set",
        },
      };
      setError(authError);
      setIsLoading(false);
      // return; 

    }

    // Encode the username and password for Basic Auth
    encoded = btoa(`${username}:${password}`);
  }

  const makeApiCall = useCallback(
    async (payload?: TPayload, isQueryParams: boolean = false) => {
      setIsLoading(true);
      setError(null);
      setData(null);
      setDataPremium(null);
      let parrams = null;
      try {
        let fullUrl = getFullUrl(apiType, apiRoute, apiLang);
        if (isQueryParams) {
          parrams = new URLSearchParams(payload as { [key: string]: string }).toString();
          fullUrl = `${fullUrl}?${parrams}`;
          payload = undefined;
        }
        const response: APIResponse = await callAPI(
          apiMethod,
          fullUrl,
          payload ?? undefined,
          {
            'Authorization': `Basic ${encoded}`,
            'Content-Type': 'application/json'
          }

        );
        getResponse(response, setData, setDataPremium, setError, apiType);
      } catch (error) {
        console.error("Error: ", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [apiLang, apiMethod, apiType, apiRoute]
  );

  return { makeApiCall, isLoading, errors, data, setData, dataPremium };

}