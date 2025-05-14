import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ClaimDetails {
  claimNo: string;
  policyNo: string;
  productName: string;
  policyHolderName: string;
  policyHolderId: string;
  dateOfLoss: string;
  dateOfNotification: string;
  dateOfRegistration: string;
  sourceType: string;
  caseReportId: string;
  subClaimStatus: string;
}

interface QueryClaimsState {
  claims: ClaimDetails[];
  loading: boolean;
  error: string;
  isAuthorized: boolean;
}

const initialState: QueryClaimsState = {
  claims: [] as ClaimDetails[],
  loading: false,
  error: "",
  isAuthorized: false,
};

const queryClaimsSlice = createSlice({
  name: "claims",
  initialState,
  reducers: {
    setqueryClaims(state, action: PayloadAction<ClaimDetails[]>) {
      state.claims = action.payload;
    },
    setqueryClaimsLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setqueryClaimsError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const { setqueryClaims, setqueryClaimsLoading, setqueryClaimsError } = queryClaimsSlice.actions;
export default queryClaimsSlice.reducer;