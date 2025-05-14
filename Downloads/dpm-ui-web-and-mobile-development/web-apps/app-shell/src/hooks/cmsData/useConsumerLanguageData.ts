import { useQuery } from '@tanstack/react-query';
import { fetchConsumerLanguageData, ResponseProps } from '../../api/cmsData';

export const useConsumerLanguageData = () => {
    return useQuery<ResponseProps, Error>({
      queryKey: ['consumerCmsLanguageData'],
      queryFn: fetchConsumerLanguageData,
      enabled: true,
      retry: 1,
      refetchOnWindowFocus: false,
    });
  };