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
  TOAST_AUTOCLOSE_TIMER,
} from "./constant";

import { useApiCall } from "./hooks/useApiCall";
import { useURLSearchParams } from "./hooks/useURLSearchParams";
import { useEncryptedUrlParams } from "./hooks/useEncryptedUrlParams";
import { formatDate } from "./utils/formatDate";

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
  claimIdValidationOnBlur,
  claimIdCaseNoValidation,
  validateBuildYear,
  validateIBAN,
  validateIbanNonSA,
  validateInput,
  formatFileSize,
  isValidInputRegex,
  isValidSubscribeEmail,
  isValidAlphanumericKey,
  isValidPassword,
  isValidEstimateAmount,
  isInvalidKey
} from "./utils/validation";
import { getAmountText } from "./utils/common";
import { formatedAmountToDisplay } from "./utils/common";

import { CommonProvider } from "./context/common/context";
import { useCommonContext } from "./context/common/useContext";

import  store  from "../redux/store";
import * as slices from "../redux/slices";
import * as constant from "./constant";
import * as types from "./types";


export {
  formatDate,
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
  useEncryptedUrlParams,
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
  TOAST_AUTOCLOSE_TIMER,
  LANGUAGE_ENGLISH,
  NOT_APPLICABLE,
  getAmountText,
  formatedAmountToDisplay,
  isValidSubscribeEmail,
  isValidAlphanumericKey,
  isValidPassword,
  isValidEstimateAmount,
  isInvalidKey
};
export * from '../redux/slices/dashboard/dashboardSlice';

export * from '../redux/slices/dashboard/policySlices';
export * from './types/policy';
export * from '../redux/slices/motorCmsSlice';
export * from './types/languageData';
export * from './api/motorCmsApi';

export * from '../redux/slices/dashboard/queryQuoteSlice';
export * from './api/profileData';
export * from '../redux/slices/profileSlice';
export * from '../redux/slices/travel/endorsement/endrosementManageTravelerSlice';
