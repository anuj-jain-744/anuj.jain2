import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface QuoteDetail {
  effectiveDate?: string;
  expiryDate?: string;
  issueDate?: string;
  nationalID?: string;
  premium?: number;
  productCode?: string;
  quoteNo?: string;
  quoteStatus?: string;
  description?: string;
}

export interface QueryClaimsState {
  quotes: QuoteDetail[];
  loading: boolean;
  error: string;
  isAuthorized: boolean;
}

const initialState: QueryClaimsState = {
  quotes: [] as QuoteDetail[],
  loading: false,
  error: "",
  isAuthorized: false,
};

const queryQuoteSlice = createSlice({
  name: "quotes",
  initialState,
  reducers: {
    setqueryQuote(state, action: PayloadAction<QuoteDetail[]>) {
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