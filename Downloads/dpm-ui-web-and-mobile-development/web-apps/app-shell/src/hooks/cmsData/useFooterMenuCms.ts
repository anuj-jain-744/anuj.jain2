import { LanguageDataResponse, fetchFooterMenuLanguageData } from '@src/api/cmsData';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

export const useFooterMenuCms = (): UseQueryResult<LanguageDataResponse, Error> => {
    return useQuery<LanguageDataResponse, Error>({
      queryKey: ['footerMenuLanguage'],
      queryFn: fetchFooterMenuLanguageData,
      retry: 1,
      refetchOnWindowFocus: false,
    });
  };