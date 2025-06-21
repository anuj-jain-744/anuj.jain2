import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";

export const useCheckDuplicateDriver = () => {
    const { driverDetailsResponseData } = useQuoteAndBuyContext();

    const checkIfDriverExists = (driverId: string) => {
        return driverDetailsResponseData?.some(
            (driver) => driver.driverID?.toString() === driverId?.toString()
        );
    };

    return { checkIfDriverExists };
};