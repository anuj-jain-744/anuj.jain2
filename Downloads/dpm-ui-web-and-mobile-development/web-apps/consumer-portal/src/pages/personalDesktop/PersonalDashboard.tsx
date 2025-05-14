import React, { useState, useEffect } from "react";
import "./PersonalDashboard.scss";
import MyPoliciesContainter from "./MyPolicies/MyPoliciesContainer";
import DashbboardBanner from "./PolicyBuy/DashboardBanner";
import { slices } from "@dpm/shared-module";
import { useDispatch } from "react-redux";
import { usePolicyDetails } from "hook/dashboard/usePolicyDetails";
import { useQueryQuote } from "hook/dashboard/myRequests/useQueryQuote";
import { useQueryClaim } from "hook/dashboard/myRequests/useQueryClaim";
import { UserProfileData } from "types/Dashboard";

const PersonalDashboard = () => {
  const dispatch = useDispatch();
  // auth actions updated
  const [userProfileData, setuserProfileData] = useState<UserProfileData | null>(null);
  const userDetails = sessionStorage.getItem("userDetails");
  
  const { setAuth, setAuthLoading, setAuthError, clearAuthData } = slices.auth;

  useEffect(() => {
    if (userDetails && Object.keys(userDetails).length !== 0) {
      const parsedUserDetails = JSON.parse(userDetails);
      const { message, isValid, referenceNo, sessionSecretId } = parsedUserDetails;
      const userProfileDetails = parsedUserDetails.userProfileData;
      
      // Only set user profile data if it's different from current state
      if (!userProfileData || JSON.stringify(userProfileData) !== JSON.stringify(userProfileDetails)) {
        setuserProfileData(userProfileDetails);
      }
      
      dispatch(setAuth({ 
        userInfo: userProfileDetails,
        userToken: null,
        authDetails: { 
          message: message, 
          isValid: isValid,
          referenceNo: referenceNo, 
          sessionSecretId: sessionSecretId 
        } 
      }));
    }
  }, []);


  const userId = userProfileData?.userId ?? null;


  // queryQuote actions updated
  const { setqueryQuote, setqueryQuoteLoading, setqueryQuoteError } =
    slices.queryQuoteSlice;
  const {
    data: queryQuoteData,
    isLoading: queryQuoteLoading,
    error: queryQuoteError,
  } = useQueryQuote({ quoteNo: null, nationalID: userId });

  useEffect(() => {
    dispatch(setqueryQuoteLoading(queryQuoteLoading));

    if (queryQuoteData) {
      dispatch(setqueryQuote(queryQuoteData?.data?.model?.result));
    }

    if (queryQuoteError) {
      dispatch(
        setqueryQuoteError(
          (queryQuoteError as Error).message || "An error occurred"
        )
      );
    }
  }, [queryQuoteData, queryQuoteError, queryQuoteLoading]);

  // queryClaim actions updated
  const { setqueryClaims, setqueryClaimsLoading, setqueryClaimsError } =
    slices.queryClaimSlice;
  const {
    data: queryClaimData,
    isLoading: queryClaimLoading,
    error: queryClaimError,
  } = useQueryClaim({ idNumber: userId, policyNo: null });
  
  useEffect(() => {
    dispatch(setqueryClaimsLoading(queryClaimLoading));

    if (queryClaimData) {
      dispatch(setqueryClaims(queryClaimData?.data?.claimList));
    }

    if (queryClaimError) {
      dispatch(
        setqueryClaimsError(
          (queryClaimError as Error).message || "An error occurred"
        )
      );
    }
  }, [queryClaimData, queryClaimError, queryClaimLoading]);

 // myPolicy(getPolicyList) actions updated
 const { setPolicies, setPolicyLoading, setPolicyError } = slices.policySlices;
 const {
  data: policyData,
  error: policyError,
  isLoading: isPolicyLoading,
} = usePolicyDetails({policyNo: null, productCode: null, includeEndoVersion: "Y", nationalId: userId });

  useEffect(() => {
    dispatch(setPolicyLoading(isPolicyLoading));
    if (setPolicies) dispatch(setPolicies(policyData?.data?.result));
    if (setPolicyError)
      dispatch(
        setPolicyError(
          (policyError as Error)?.message || "An error occurred at getPolicyList"
        )
      );
  }, [
    policyData,
    policyError,
    isPolicyLoading,
    setPolicyLoading,
    setPolicies,
    setPolicyError,
  ]);

  return (
    <div className="personal-dashboard-bg">
      <DashbboardBanner />
      <MyPoliciesContainter />
    </div>
  );
};

export default PersonalDashboard;
