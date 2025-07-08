import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { DriverDetailsFormsData } from "types/DriverDetailsApi";
import { DriverDetailsResponseData } from "types/quoteAndBuy";

export default function useHandleDriverData() {
  const {
    setDriverDetailsResponseData,
    driverDetailsResponseData,
    setAddDriverFormData,
    addDriverFormData,
  } = useQuoteAndBuyContext();

  const handleDriverAdded = (
    driverData: DriverDetailsResponseData,
    formData?: DriverDetailsFormsData
  ) => {
    let isDriverAlreadyAdded = false;

    if (formData) {
      isDriverAlreadyAdded = driverDetailsResponseData.some(
        (driver) => driver.driverID === driverData.driverID
      );

      if (isDriverAlreadyAdded) {
        return { isDriverAlreadyAdded };
      }

      setAddDriverFormData([...addDriverFormData, formData]);
    }

    const updatedDriverData = {
      ...driverData,
      additionalDriverDetails: {
        ...driverData.additionalDriverDetails,
        driverRelationship: formData && String(formData.relation - 1),
      },
    };

    setDriverDetailsResponseData([...driverDetailsResponseData, updatedDriverData]);

    return { isDriverAlreadyAdded };
  };

  return {
    handleDriverAdded,
  };
}