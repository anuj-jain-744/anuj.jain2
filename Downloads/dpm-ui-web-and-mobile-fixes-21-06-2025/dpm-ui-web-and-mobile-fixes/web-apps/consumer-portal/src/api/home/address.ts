import { callAPI, constant } from '@dpm/shared-module';


const { VITE_BACKEND_COMMON_UTILITY_URL } = constant;


export const fetchAddressData = async (userId): Promise<any> => {
  try {
    const response = await callAPI(
      'get', 
      `${VITE_BACKEND_COMMON_UTILITY_URL}/Common/Utility/V1/GetNationalAddress/${userId}`
    );
    return response;
  } catch (error) {
    console.error('Failed to fetch Dashboard language:', error);
    throw error;
  }
};