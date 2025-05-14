import { useEffect, useState } from "react";
import { HandleVehicleClick, VehicleDetails } from "types/policyDetails";

const useVehicleSelection = (vehicleDetails: VehicleDetails[] | null) => {
    const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
    const [vehicleValue, setVehicleValue] = useState<VehicleDetails | null>(null);
  
    useEffect(() => {
      if (vehicleDetails && vehicleDetails.length > 0) {
        setSelectedVehicle(vehicleDetails[0].vehicleSequenceNo);
        setVehicleValue(vehicleDetails[0]);
      }
    }, [vehicleDetails]);
  
    const handleVehicleClick: HandleVehicleClick = (index) => {
      if (vehicleDetails && vehicleDetails[index]) {
        setSelectedVehicle(vehicleDetails[index].vehicleSequenceNo);
        setVehicleValue(vehicleDetails[index]);
      }
    };
  
    return { selectedVehicle, vehicleValue, handleVehicleClick };
  };

  export default useVehicleSelection;