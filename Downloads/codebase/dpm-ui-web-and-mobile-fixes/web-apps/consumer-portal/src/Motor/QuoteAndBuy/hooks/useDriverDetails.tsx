import { useEffect } from 'react';
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';
import { useApiCall } from '@dpm/shared-module';
import { DriverDetailsResponseData } from 'types/quoteAndBuy';

interface DriverDetails {
  driverId: string;
  dob: string;
  mainDriverInd: string;
  vehicleDefinitionType: string;
  vehicleId: string;
}

export const formatDOB = (dob: string | undefined): string | undefined => {
  if (!dob) return undefined;

  // Normalize the delimiter to "/"
  const normalizedDOB = dob.replace(/-/g, '/');
  const parts = normalizedDOB.split('/');

  if (parts.length === 3) {
    // Logic for dob like "23/07/1379" or "23-07-1379"
    const month = parts[1];
    const year = parts[2];
    return `${month}-${year}`;
  } else if (parts.length === 2) {
    // Logic for dob like "07/1379"
    const month = parts[0];
    const year = parts[1];
    return `${month}-${year}`;
  }

  return undefined;
};

const useDriverData = (driverDetails: DriverDetails) => {
  const { driverId, dob, mainDriverInd, vehicleDefinitionType, vehicleId } = driverDetails;
  const { setDriverDetailsResponseData } = useQuoteAndBuyContext();

  const { 
    makeApiCall: driverApiCall, 
    isLoading: isDriverLoading, 
    errors: driverApiErrors, 
    data: driverDetailsData 
  } = useApiCall(
    2, 
    "/Motor/QuoteAndBuy/V1/GetDriverDetails", 
    "post"
  );

  const dateOfBirth = formatDOB(dob);

  useEffect(() => {
    if(mainDriverInd  === 'Y' && !vehicleId) return;
    if (!driverId || !dob) return;

    const fetchDriverDetails = async () => {
      try {
        const payload = mainDriverInd 
          ? { driverId, dob: dateOfBirth, mainDriverInd, vehicleDefinitionType, vehicleId }
          : { driverId, dob: dateOfBirth };

        await driverApiCall(payload);
      } catch (error) {
        console.error("API Call Error:", error);
      }
    };

    const timeoutId = setTimeout(fetchDriverDetails, 600);

    return () => clearTimeout(timeoutId);
  }, [driverId, dob, driverApiCall, mainDriverInd,
     vehicleDefinitionType, vehicleId]);

  useEffect(() => {
    if (driverDetailsData) {
      setDriverDetailsResponseData((prevDrivers) => {
        const driverExists = prevDrivers.some(
          driver => driver.driverID === driverDetailsData.driverID
        );

        return driverExists 
          ? prevDrivers 
          : [...prevDrivers, driverDetailsData as DriverDetailsResponseData];
      });
    }
  }, [driverDetailsData, setDriverDetailsResponseData]);

  return { isDriverLoading, driverApiErrors };
};

export default useDriverData;