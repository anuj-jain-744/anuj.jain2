import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  languageData: null,
  languageSidebarData: null,
  loading: false,
  error: null,
};

const headerMenuSlice = createSlice({
  name: "headerMenuLanguage",
  initialState,
  reducers: {
    setHeaderMenuLanguage(state, action: PayloadAction<any>) {
      state.languageData = action.payload?.menus;
      state.languageSidebarData = action.payload?.['sidebar-menu']
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
      state.languageSidebarData = null;
      state.error = "";
  },
}
});

export const { setHeaderMenuLanguage, setHeaderMenuLanguageLoading, setHeaderMenuLanguageError } = headerMenuSlice.actions;
export default headerMenuSlice.reducer;