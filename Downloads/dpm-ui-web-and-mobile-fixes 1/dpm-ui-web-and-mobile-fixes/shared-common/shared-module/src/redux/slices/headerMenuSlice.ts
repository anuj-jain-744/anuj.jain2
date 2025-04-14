import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { LanguageData, LanguageDataState } from "../../components/types/languageData";

const initialState: any = {
  languageData: null,
  loading: false,
  error: null,
};

const headerMenuSlice = createSlice({
  name: "headerMenuLanguage",
  initialState,
  reducers: {
    setHeaderMenuLanguage(state, action: PayloadAction<any>) {
      state.languageData = action.payload;
      state.loading = false;
    },
    setHeaderMenuLanguageLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setHeaderMenuLanguageError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;  
    },
    clearHeaderMenuLanguageData(state) {
      state.languageData = null;
      state.error = "";
  },
}
});

export const { setHeaderMenuLanguage, setHeaderMenuLanguageLoading, setHeaderMenuLanguageError } = headerMenuSlice.actions;
export default headerMenuSlice.reducer;