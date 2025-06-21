import { DriverDetailsResponseData, OwnerDetailsResponseData, VehicleDetailsResponseData } from "./quoteAndBuy";

 interface CombinedVehicleDetailsResponseData extends VehicleDetailsResponseData, DriverDetailsResponseData {
    drivers: DriverDetailsResponseData[];
}

export interface CalculatePremiumPayload {
    schemeCode: string;
    policyRisk: CombinedVehicleDetailsResponseData;
    policyCustomer: OwnerDetailsResponseData;
}