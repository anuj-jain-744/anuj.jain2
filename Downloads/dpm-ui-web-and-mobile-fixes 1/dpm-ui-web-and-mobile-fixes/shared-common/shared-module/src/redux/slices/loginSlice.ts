import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  data: {},
  loading: false,
  error: null,
};

const userLoginSlice = createSlice({
  name: "userLoginProfileData",
  initialState,
  reducers: {
    setUserLoginProfileData(state, action: PayloadAction<any>) {
      state.userLoginProfileData = action.payload;
      state.loading = false;
    },
    setUserLoginProfileDataLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setUserLoginProfileDataError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;  
    },
    clearProfileData(state) {
      state.languageData = null;
      state.error = "";
    },
}
});

export const { 
  setUserLoginProfileData, 
  setUserLoginProfileDataLoading, 
  setUserLoginProfileDataError, 
} = userLoginSlice.actions;
export default userLoginSlice.reducer;