import { useQuery } from '@tanstack/react-query';
import { fetchPolicy } from '../../api/dashboard/policyDetails';

interface PolicyDetailsParams {
  nationalId: string | null;
  productCode: string | null;
  policyNo: string | null;
  includeEndoVersion: string | null;
}

export const usePolicyHistory = ({ nationalId, productCode, policyNo, includeEndoVersion }: PolicyDetailsParams) => {
    return useQuery({
      queryKey: ['policyHistory', policyNo, nationalId, includeEndoVersion],
      queryFn: () => fetchPolicy(nationalId, productCode, policyNo, includeEndoVersion),
      enabled: !!nationalId && !!policyNo,
      refetchOnWindowFocus: false,
      staleTime: 0, // Don't use cached data
    });
  };