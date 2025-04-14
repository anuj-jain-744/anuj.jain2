import { useQuery } from '@tanstack/react-query';
import { fetchPolicy } from 'api/dashboard/policyDetails';

interface PolicyDetailsParams {
  nationalId: string | null;
  policyNo: string | null;
  productCode: string | null;
  includeEndoVersion: string | null;
}

export const usePolicyDetails = ({ nationalId, policyNo, productCode, includeEndoVersion }: PolicyDetailsParams) => {
  return useQuery({
    queryKey: ['policy', nationalId],
    queryFn: () => fetchPolicy(nationalId, null, null, includeEndoVersion),
    enabled: !!nationalId,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
};