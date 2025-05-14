import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LanguageData, LanguageDataState } from   "../../../components/types/languageData"
const initialState: LanguageDataState = {
    languageData: null,
    loading: false,
    error: null,
};

const consumerLanguageSlice = createSlice({
    name: "consumerCmsLanguageData",
    initialState,
    reducers: {
        setConsumerLanguageData(state, action: PayloadAction<LanguageData>) {
        state.languageData = action.payload;
        state.loading = false;
        },
        setConsumerLanguageLoading(state, action: PayloadAction<boolean>) {
        state.loading = action.payload;
        },
        setConsumerLanguageError(state, action: PayloadAction<string>) {
        state.error = action.payload;
        state.loading = false;  
        },
        clearConsumerLanguageData(state) {
        state.languageData = null;
        state.error = "";
    },
    }
    });

export const { setConsumerLanguageData, setConsumerLanguageLoading, setConsumerLanguageError } = consumerLanguageSlice.actions
export default consumerLanguageSlice.reducer;