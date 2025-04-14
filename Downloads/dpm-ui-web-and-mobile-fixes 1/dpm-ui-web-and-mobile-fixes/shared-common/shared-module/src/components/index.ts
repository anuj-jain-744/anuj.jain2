import { callAPI, getFullUrl } from "./service";
import {
  setDefaultLanguage,
  getCurrentLanguage,
  getTranslationForKey,
  setUserLanguage,
} from "./languages";
import {
  LANGUAGE_ARABIC,
  LANGUAGE_ENGLISH,
  NOT_APPLICABLE,
  VITE_BACKEND_BASE_URL,
  VITE_CONTENT_BASE_URI,
  VITE_BACKEND_UTILITY_URL,
} from "./constant";

import { useApiCall } from "./hooks/useApiCall";
import { useURLSearchParams } from "./hooks/useURLSearchParams";

import { encryptData } from "./encryptData";
import { encryptAES } from "./encryptAES";
import { decryptAES } from "./decryptAES";
import {
  scrollToElement,
  sanitizeHtml,
  shouldShowAppDownload,
  objectToArray,
  getDefault,
  splitAndCapitalize,
  chunkArray,
  getRandomString,
  useFetchData,
  triggerClickOnChatwidget,
  generateBreadcrumbs,
  stringToBoolean,
  capitalizeNameFirstLetter,
  clearSessionStorage,
} from "./utils";

import {
  checkPhoneNumberStarts,
  isValidEmail,
  iqmaIdNationalIdValidation,
  iqmaIdNationalIdValidationOnBlur,
  getLabelOfIqmaIdNationalId,
  validateHomePoliciesCount,
  checkNationalIdFormat,
  checkInputStringMinMax,
  refNoValidation,
  refNoValidationOnBlur,
  claimIdValidation,
  claimIdValidationOnBlur,
  claimIdCaseNoValidation,
  validateBuildYear,
  validateIBAN,
  validateIbanNonSA,
  validateInput,
  formatFileSize,
  isValidInputRegex,
  isValidSubscribeEmail,
} from "./utils/validation";
import { getAmountText } from "./utils/common";

import { CommonProvider } from "./context/common/context";
import { useCommonContext } from "./context/common/useContext";

import  store  from "../redux/store";
import * as slices from "../redux/slices";
import * as constant from "./constant";
import * as types from "./types";


export {
  slices,
  constant,
  types,
  checkPhoneNumberStarts,
  iqmaIdNationalIdValidation,
  iqmaIdNationalIdValidationOnBlur,
  getLabelOfIqmaIdNationalId,
  validateHomePoliciesCount,
  refNoValidation,
  refNoValidationOnBlur,
  claimIdValidation,
  claimIdValidationOnBlur,
  claimIdCaseNoValidation,
  isValidEmail,
  checkNationalIdFormat,
  checkInputStringMinMax,
  getFullUrl,
  callAPI,
  setDefaultLanguage,
  getCurrentLanguage,
  getTranslationForKey,
  setUserLanguage,
  scrollToElement,
  sanitizeHtml,
  shouldShowAppDownload,
  objectToArray,
  getDefault,
  clearSessionStorage,
  splitAndCapitalize,
  useApiCall,
  useURLSearchParams,
  getRandomString,
  chunkArray,
  useCommonContext,
  CommonProvider,
  useFetchData,
  triggerClickOnChatwidget,
  generateBreadcrumbs,
  encryptAES,
  decryptAES,
  encryptData,
  validateIBAN,
  validateIbanNonSA,
  validateInput,
  formatFileSize,
  store,
  stringToBoolean,
  validateBuildYear,
  isValidInputRegex,
  capitalizeNameFirstLetter,
  VITE_BACKEND_BASE_URL,
  VITE_CONTENT_BASE_URI,
  VITE_BACKEND_UTILITY_URL,
  LANGUAGE_ARABIC,
  LANGUAGE_ENGLISH,
  NOT_APPLICABLE,
  getAmountText,
  isValidSubscribeEmail,
};
export * from '../redux/slices/dashboard/dashboardSlice';

export * from '../redux/slices/dashboard/policySlices';
export * from './types/policy';
export * from '../redux/slices/motorCmsSlice';
export * from './types/languageData';
export * from './api/motorCmsApi';

export * from '../redux/slices/dashboard/queryQuoteSlice';
export * from './api/profileData';
export * from '../redux/slices/profileSlice'
