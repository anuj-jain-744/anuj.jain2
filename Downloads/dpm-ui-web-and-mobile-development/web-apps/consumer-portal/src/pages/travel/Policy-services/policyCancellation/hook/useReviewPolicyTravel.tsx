import { useCallback, useState } from "react";
import { callAPI } from "@dpm/shared-module";
import {MOTOR, MOTORCOMP, TRAVEL, HOME} from 'constant';
import { RequestBodyReviewPolicy } from "types/policyDetails";

export const useReviewPolicyTravel = ({ PolicyNo, Product }: { PolicyNo: string, Product: string }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any | null>(null);

    const makeApiCall = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setData(null);

        const { VITE_BACKEND_MOTOR_URL, VITE_BACKEND_HOME_URL } = import.meta.env;

        const requestBody: RequestBodyReviewPolicy = {
            apiSource: "Portal",
            policyNo: PolicyNo,
            endorsementNo: "",
            isLatestSnapshot: "N"
        };

        const findAndReplace = (str: string, find: string, replace: string): string => {
            return str.replace(new RegExp(find, 'g'), replace);
        };


        try {
            let backUrl = '';
            switch (Product) {
                case MOTOR:
                case MOTORCOMP:
                    backUrl = VITE_BACKEND_MOTOR_URL
                    break;
                case TRAVEL:
                    backUrl = findAndReplace(VITE_BACKEND_MOTOR_URL, 'Motor', 'Travel');
                    break;
                case HOME:
                    backUrl = VITE_BACKEND_HOME_URL;
                    break;
                default:
                    backUrl = VITE_BACKEND_MOTOR_URL;
                    break;
            }           
            const response = await callAPI('post', `${backUrl}/Dashboard/V1/ViewPolicy`, requestBody) as any;
            if (response.code === 1 && response.message === 'SUCCESS') {
                if (Product === MOTOR || Product === MOTORCOMP || Product === HOME) {
                    setData(response.data);
                } else {
                    setData(response.data.model);
                }
            } else if (response.code === 0 && response.message !== 'SUCCESS') {
                setError('An unexpected error occurred');
            }
        } catch (error) {
            console.error('Error: ', error);
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    }, [PolicyNo, Product]);

    return { makeApiCall, isLoading, error, data };
};
