import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LanguageData, LanguageDataState } from "../../components/types/languageData";

const initialState: LanguageDataState = {
  languageData: null,
  loading: false,
  error: null,
};

const motorLanguageSlice = createSlice({
  name: "motorLanguage",
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<LanguageData>) {
      state.languageData = action.payload;
      state.loading = false;
    },
    setLanguageLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setLanguageError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;  
    },
    clearLanguageData(state) {
      state.languageData = null;
      state.error = "";
  },
}
});

export const { setLanguage, setLanguageLoading, setLanguageError } = motorLanguageSlice.actions;
export default motorLanguageSlice.reducer;