import React from 'react';
import { render, screen } from '@testing-library/react';
import VehicleDetailsSection from './VehicleDetailsSection';

jest.mock('./VehicleDetails', () => {
    return jest.fn(() => <div data-testid="vehicle-details" />);
});


describe('VehicleDetailsSection Component', () => {
    const mockLanguageData = {
        vehicle_details: 'Vehicle Details'
    };
    const mockVehicleData=[
        {
            "registrationPlateNo": "8707",
            "registrationPlateText": "T - ط",
            "vehicleMakeText": "Hyundai",
            "vehicleModelText": "النترا",
            "chassisNo": "KMHD841F8HU106605",
            "typeOfChassis": "Not available",
            "vehicleSequenceNo": "716706510",
            "yearOfManufacture": 2017,
            "vehicleColor": "Gray",
            "transmission": "xyz",
            "serialNo": "Not available",
            "registrationPlateText1": "T - ط",
            "registrationPlateText2": "V - ى",
            "registrationPlateText3": "J - ح",
            "repairCondition": "Workshop Repair"
        }
    ]

    it('renders without crashing', () => {
        render(<VehicleDetailsSection languageData={mockLanguageData} vehicleValue={mockVehicleData}/>);
        expect(screen.getByText(/vehicle details/i)).toBeInTheDocument();
    });

});