import { configureStore } from "@reduxjs/toolkit";
import policyReducer from "./slices/dashboard/policySlices";
import motorLanguageReducer from "./slices/motorCmsSlice";
import dashboardLanguageDataReducer from "./slices/dashboard/dashboardCms";
import dashboardReducer from "./slices/dashboard/dashboardSlice";
import queryQuoteReducer from './slices/dashboard/queryQuoteSlice';
import queryClaimReducer from './slices/dashboard/queryClaimSlice';
import headerMenuReducerr from "./slices/headerMenuSlice";
import profileDataReducer from "./slices/profileSlice";
import userLoginReducer from "./slices/loginSlice";
import authReducer from "./slices/auth/authSlice"
import policyHistoryReducer from "./slices/dashboard/policyHistorySlice";
import addressReducer from "./slices/home/addressSlice";
import footerMenuReducer from "./slices/footerMenuSlice";
import endorsementTravelersManageSliceReducer from './slices/travel/endorsement/endrosementManageTravelerSlice';
import consumerLanguageReducer from "./slices/home/consumerLanguageSlice"

const store = configureStore({
  reducer: {
    policy: policyReducer,
    motorLanguage: motorLanguageReducer,
    headerMenuLanguage: headerMenuReducerr,
    footerMenuLanguage: footerMenuReducer,
    dashbaordLanguageData: dashboardLanguageDataReducer,
    dashboardData: dashboardReducer,
    queryQuote: queryQuoteReducer,
    queryClaim: queryClaimReducer,
    profileData:profileDataReducer,
    userLoginSlice: userLoginReducer,
    auth: authReducer,
    policyHistory: policyHistoryReducer,
    addressData: addressReducer,
    endorsementManageTravelers: endorsementTravelersManageSliceReducer,
    consumerCmsLanguageData:consumerLanguageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
