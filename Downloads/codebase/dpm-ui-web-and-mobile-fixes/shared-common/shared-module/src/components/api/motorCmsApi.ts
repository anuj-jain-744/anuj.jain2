import { useQuery } from '@tanstack/react-query';
import { callAPI } from '../service';
import { LanguageData } from '../types/languageData';
import { VITE_CONTENT_BASE_URI } from '../constant';

// Remove the hook and create a separate fetcher function
export const fetchMotorLanguage = async (): Promise<LanguageData> => {
  try {
    const response = await callAPI<{config: LanguageData[]}>(
      'get', 
      `${VITE_CONTENT_BASE_URI}/en/api/consumerportal-config`
    );
    return response.config[0];
  } catch (error) {
    console.error('Failed to fetch motor language:', error);
    throw error;
  }
};

// Optional: If you still want a hook, make it a separate function
export const useMotorLanguageQuery = () => {
  return useQuery<LanguageData, Error>({
    queryKey: ['motorLanguage'],
    queryFn: fetchMotorLanguage,
    enabled: true,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};