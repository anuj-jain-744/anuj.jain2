import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PrintDocData {
  endorsement: { fileName: string; model: string } | null;
  policy: { fileName: string; model: string } | null;
  quotation: { fileName: string; model: string } | null;
  claim: { fileName: string; model: string } | null;
}

interface PrintDocError {
  endorsementError: string | null;
  policyError: string | null;
  quotationError: string | null;
  claimError: string | null;
}

export interface PrintDocState {
  printDocData: PrintDocData;
  loading: boolean;
  error: PrintDocError;
}

const initialState: PrintDocState = {
  printDocData: {
    endorsement: null,
    policy: null,
    quotation: null,
    claim: null,
  },
  loading: false,
  error: {
    endorsementError: null,
    policyError: null,
    quotationError: null,
    claimError: null,
  },
};

const printDocSlice = createSlice({
  name: "printDocData",
  initialState,
  reducers: {
    setPrintDocData(state, action: PayloadAction<Partial<PrintDocData>>) {
      Object.assign(state.printDocData, action.payload);
      state.loading = false;
    },
    setPrintDocDataLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setPrintDocDataError(state, action: PayloadAction<Partial<PrintDocError>>) {
      Object.assign(state.error, action.payload);
      state.loading = false;
    },
    clearPrintDocData(state) {
      state.printDocData = {
        endorsement: null,
        policy: null,
        quotation: null,
        claim: null,
      };
      state.error = {
        endorsementError: null,
        policyError: null,
        quotationError: null,
        claimError: null,
      };
    },
  },
});

export const { 
  setPrintDocData, 
  setPrintDocDataLoading, 
  setPrintDocDataError, 
  clearPrintDocData 
} = printDocSlice.actions;

export default printDocSlice.reducer;