import { useCallback, useState } from "react";
import { callAPI } from "@dpm/shared-module";

export const useMasterData = (tableName: string) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [masterData, setMasterData] = useState<any | null>(null);

    const makeMasterApiCall = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setMasterData(null);

        const { VITE_BACKEND_MASTER_DATA_URL } = import.meta.env;

        try {
            const response = await callAPI('get', `${VITE_BACKEND_MASTER_DATA_URL}/MasterData/V1/${tableName}`);
            if (response?.status === "OK"){
                setMasterData(response);
            }
            else
                setError(response?.errorCode);
        } catch (error) {
            console.error('Error: ', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {makeMasterApiCall, isLoading, error, masterData};
}