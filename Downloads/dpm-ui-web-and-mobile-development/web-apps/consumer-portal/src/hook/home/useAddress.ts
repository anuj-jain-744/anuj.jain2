import { fetchAddressData } from './../../api/home/address';
import { useQuery } from '@tanstack/react-query';

export const useAddress = (userId) => {
    return useQuery({
      queryKey: ['homeAdress'],
      queryFn: () => fetchAddressData(userId),
      enabled: !!userId,
      refetchOnWindowFocus: false,
    });
  };
