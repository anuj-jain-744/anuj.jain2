import  { constant, types, callAPI } from '@dpm/shared-module';

  
interface PolicyRequestBody {
    nationalID: string | null;
    productCode?: string | null;
    policyNo?: string | null;
    includeEndoVersion?: string | null;
}

export const fetchPolicy = async (nationalId: string | null, 
    productCode?: string | null, policyNo?: string | null, includeEndoVersion?: string | null) => {
    const { VITE_BACKEND_MOTOR_URL } = constant;
    
    const requestBody: PolicyRequestBody = {
        nationalID: nationalId,
        productCode: productCode,
        policyNo: policyNo,
        includeEndoVersion: includeEndoVersion
    };
    try {
        const response = await callAPI('post', `${VITE_BACKEND_MOTOR_URL}/Dashboard/V1/GetPolicyList`, requestBody);
        return response;
    } catch (error) {
        console.error('Failed to fetch policy:', error);
        throw error;
    }
};