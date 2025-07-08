import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  data: {},
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profileData",
  initialState,
  reducers: {
    setProfileData(state, action: PayloadAction<any>) {
      state.profileData = action.payload;
      state.loading = false;
    },
    setProfileDataLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setProfileDataError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;  
    },
    clearProfileData(state) {
      state.languageData = null;
      state.error = "";
    },
    setUpdateContactData(state, action: PayloadAction<any>) {
      state.updateContactData = action.payload;
      state.loading = false;
    },
}
});

export const { 
  setProfileData, 
  setProfileDataLoading, 
  setProfileDataError, 
  setUpdateContactData

} = profileSlice.actions;
export default profileSlice.reducer;