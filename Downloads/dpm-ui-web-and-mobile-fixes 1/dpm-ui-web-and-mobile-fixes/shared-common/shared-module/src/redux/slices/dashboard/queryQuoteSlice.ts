import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  quotes: null,
  loading: false,
  error: "",
  isAuthorized: false,
};

const queryQuoteSlice = createSlice({
  name: "quotes",
  initialState,
  reducers: {
    setqueryQuote(state, action: PayloadAction<any>) {
      state.quotes = action.payload;
    },
    setqueryQuoteLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setqueryQuoteError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const { setqueryQuote, setqueryQuoteLoading, setqueryQuoteError } = queryQuoteSlice.actions;
export default queryQuoteSlice.reducer;