import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
  isAxiosError,
} from "axios";

import { VITE_CONTENT_BASE_URI } from "../constant";
// Create an instance of axios with default configuration
const api: AxiosInstance = axios.create({
  baseURL: `${VITE_CONTENT_BASE_URI}`,
});

// Add a request interceptor to modify the headers before the request is sent
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // If headers are not defined, initialize it as an empty object
    config.headers = config.headers || {};
    // Return the modified config
    return config;
  },
  (error: AxiosError) => {
    // Log the error and reject the promise
    console.error("Request failed:", error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle the response data
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return the response data directly
    return response.data;
  },
  (error: AxiosError) => {
    // Log the error based on its type
    if (error.response) {
      console.error("Request failed with status:", error.response.status);
    } else if (error.request) {
      console.error("Request failed:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    // Reject the promise with the error
    return Promise.reject(error);
  }
);

/**
 * Makes a generic API call.
 *
 * @param method - The HTTP method to use for the request. Default is "post".
 * @param url - The URL to fetch data from.
 * @param headers - Optional headers to include in the request.
 * @param data - Optional data to send with the request.
 * @returns A Promise that resolves to the fetched data.
 * @throws An error if the data fetching fails.
 */


export function getFullUrl(
  baseUrl: string,
  lang: string,
  route: string
): string {
  return `${baseUrl}/${lang}/api/${route}`;
}

export const callAPI = async <T, D=undefined>(
  method: "get" | "post" | "put" | "delete" = "post",
  url: string = VITE_CONTENT_BASE_URI,
  data?: D,
  headers?: Record<string, string>
): Promise<T> => {
  // Log the method, url, headers, and data for debugging purposes
  // console.log(method, url, headers, data);

  try {
    // Create a config object with the headers and data
    const config: AxiosRequestConfig = {
      headers,
      data,
    };
    // Send the request and wait for the response
    const response = await api[method](url, data, config) as T;
    // Return the response
    return response;
  } catch (error) {
    if(isAxiosError(error)) {
    // Log the error and throw it to be caught by the caller
      console.error("API Request Error:", error.message);
      throw new Error("Failed to fetch data");
    } else {
      console.error("Unexpected Error:", error);
      throw new Error("Unexpected Error occurred");
    }
  }
};
