import { useQuery } from '@tanstack/react-query';
import { fetchDashbaordLanguageData, LanguageDataResponse } from '../../api/cmsData';

export const useDashboardLanguageData = () => {
    return useQuery<LanguageDataResponse, Error>({
      queryKey: ['dashboardLanguageData'],
      queryFn: fetchDashbaordLanguageData,
      enabled: true,
      retry: 1,
      refetchOnWindowFocus: false,
    });
  };