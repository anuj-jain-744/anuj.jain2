import { callAPI } from '../service';
import { LanguageData } from '../types/languageData';
import { VITE_BASE_LOGIN_URL } from '../constant';


export const fetchUserProfileData = async (userId: string, mobileNumber: string) => {
    const requestBody: any = {
        nationalID: userId,
        mobileNo: mobileNumber
    };
    try {
        const response = await callAPI<{data: LanguageData[]}>(
            'post', 
            `${VITE_BASE_LOGIN_URL}/GetUserProfile`,
            requestBody
        );
        return response.data;
    } catch (error) {
        console.error('Failed to Profile Data:', error);
        throw error;
    }
};