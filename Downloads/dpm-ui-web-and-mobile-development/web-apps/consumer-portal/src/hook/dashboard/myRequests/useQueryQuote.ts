import { useQuery } from '@tanstack/react-query';
import { fetchQueryQuote } from 'api/dashboard/myRequests';

interface PolicyDetailsParams {
  quoteNo: string | null;
  nationalID: string | null;
}

export const useQueryQuote = ({ quoteNo, nationalID }: PolicyDetailsParams) => {
  return useQuery({
    queryKey: ['queryQuote'],
    queryFn: () => fetchQueryQuote(nationalID, quoteNo ?? ""),
    enabled: !!nationalID,
    refetchOnWindowFocus: false,
  });
};