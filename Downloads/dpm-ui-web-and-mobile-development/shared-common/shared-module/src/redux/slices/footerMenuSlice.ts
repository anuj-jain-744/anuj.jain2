import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  languageData: null,
  loading: false,
  error: null,
};

const footerMenuSlice = createSlice({
  name: "footerMenuLanguage",
  initialState,
  reducers: {
    setFooterMenuLanguage(state, action: PayloadAction<any>) {
      state.languageData = action.payload;
      state.loading = false;
    },
    setFooterMenuLanguageLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setFooterMenuLanguageError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;  
    },
    clearFooterMenuLanguageData(state) {
      state.languageData = null;
      state.error = "";
  },
}
});

export const { setFooterMenuLanguage, setFooterMenuLanguageLoading, setFooterMenuLanguageError } = footerMenuSlice.actions;
export default footerMenuSlice.reducer;