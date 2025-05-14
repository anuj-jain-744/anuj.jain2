import { useQuery } from '@tanstack/react-query';
import { fetchQueryClaim, ClaimRequestBody } from 'api/dashboard/myRequests';

export const useQueryClaim = ({ idNumber, policyNo }: ClaimRequestBody) => {
  return useQuery({
    queryKey: ['queryClaim', policyNo],
    queryFn: () => fetchQueryClaim(idNumber ?? '', policyNo ?? ''),
    enabled: !!idNumber,
    refetchOnWindowFocus: false,
  });
};