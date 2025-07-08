import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  addressData: null,
  loading: false,
  error: null,
};

const addressSlice = createSlice({
    name: "addressData",
    initialState,
    reducers: {
        setAddressData(state, action: PayloadAction<any>) {
        state.addressData = action.payload;
        state.loading = false;
        },
        setAddressDataLoading(state, action: PayloadAction<boolean>) {
        state.loading = action.payload;
        },
        setAddressDataError(state, action: PayloadAction<string>) {
        state.error = action.payload;
        state.loading = false;  
        },
        clearAddressData(state) {
        state.addressData = null;
        state.error = "";
    },
    }
    });

export const { setAddressData, setAddressDataLoading, setAddressDataError } = addressSlice.actions;
export default addressSlice.reducer;