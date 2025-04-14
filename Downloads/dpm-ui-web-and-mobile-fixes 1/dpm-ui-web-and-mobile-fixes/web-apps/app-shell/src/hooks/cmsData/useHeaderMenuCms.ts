import { LanguageDataResponse, fetchHeaderMenuData } from '@src/api/cmsData';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

export const useHeaderMenuCms = (): UseQueryResult<LanguageDataResponse, Error> => {
    return useQuery<LanguageDataResponse, Error>({
      queryKey: ['headerMenuLanguage'],
      queryFn: fetchHeaderMenuData,
      enabled: true,
      retry: 1,
      refetchOnWindowFocus: false,
    });
  };