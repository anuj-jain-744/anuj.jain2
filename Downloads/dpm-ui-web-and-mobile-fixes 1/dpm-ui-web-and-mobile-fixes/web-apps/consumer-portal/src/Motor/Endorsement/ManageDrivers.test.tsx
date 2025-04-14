
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ManageDrivers } from './ManageDrivers';
import useSaveRedisData from 'hook/common/useSaveRedisData';
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';

jest.mock('components/hooks/useQuoteAndBuyContext');
jest.mock('hook/common/useSaveRedisData');

(useSaveRedisData as jest.Mock).mockReturnValue({
  saveRedisData: jest.fn(),
});


(useQuoteAndBuyContext as jest.Mock).mockReturnValue({
    
  });
  
const mockLanguageData = {
    enter: "Enter",
    manage_drivers: "Manage Drivers",
    vehicle_sequence: "Vehicle Sequence",
    model_type: "Model Type",
    no_plate: "Number Plate",
    registration_year_label: "Manufacture Year",
    colour: "Colour",
    chassis_no: "Chassis Number",
    add_additional_drivers_up: "Add Additional Drivers",
    add_driver: "Add Driver",
    owner_id: "Owner ID",
    relationship: "Relationship",
    premium: "Premium",
    sar: "SAR",
    driver_details: "Driver Details",
    additional_drivers: "Additional Drivers",
    active: "Active"
};

const mockPolicyData = {
    vehicleModel: "Nissan",
    plateNo: "1234",
    manufactureYear: "2020",
    vehicleColour: 0,
    chassisNo: "ABC123",
    vehicleSequenceNo: "1",
    drivers: [
        {
            driverName: "John Doe",
            driverNameArabic: "جون دو",
            driverID: "123456",
            relation: 1,
            mainDriverInd: "Y"
        }
    ]
};

const mockNewDriverArray = [
    {
        driverName: "Jane Doe",
        driverNameArabic: "جين دو",
        driverID: "654321",
        relation: 2,
        premium: 100
    }
];

const mockSetNewDriverArray = jest.fn();
const mockSetAddDriverData = jest.fn();

describe('ManageDrivers Component', () => {
    beforeEach(() => {
        render(
            <ManageDrivers
                languageData={mockLanguageData}
                policyData={mockPolicyData}
                policyNumber="POL123"
                newDriverArray={mockNewDriverArray}
                setNewDriverArray={mockSetNewDriverArray}
                addDriverData={[]}
                setAddDriverData={mockSetAddDriverData}
            />
        );
    });

    test('renders Manage Drivers header', () => {
        expect(screen.getByText(mockLanguageData.manage_drivers)).toBeInTheDocument();
    });

    test('renders vehicle details', () => {
        expect(screen.getByText(mockPolicyData.vehicleModel)).toBeInTheDocument();
        expect(screen.getByText(mockPolicyData.plateNo)).toBeInTheDocument();
        expect(screen.getByText(mockPolicyData.manufactureYear)).toBeInTheDocument();
        expect(screen.getByText("Black")).toBeInTheDocument();
        expect(screen.getByText(mockPolicyData.chassisNo)).toBeInTheDocument();
    });

    test('renders driver details', () => {
        expect(screen.getByText(mockPolicyData.drivers[0].driverName)).toBeInTheDocument();
        expect(screen.getByText(mockPolicyData.drivers[0].driverNameArabic)).toBeInTheDocument();
        expect(screen.getByText(mockPolicyData.drivers[0].driverID)).toBeInTheDocument();
    });

    test('renders additional driver details', () => {
        expect(screen.getByText(mockNewDriverArray[0].driverName)).toBeInTheDocument();
        expect(screen.getByText(mockNewDriverArray[0].driverNameArabic)).toBeInTheDocument();
        expect(screen.getByText(mockNewDriverArray[0].driverID)).toBeInTheDocument();
        expect(screen.getByText(`${mockLanguageData.sar} ${mockNewDriverArray[0].premium}`)).toBeInTheDocument();
    });

    test('handles Add Driver button click', () => {
        fireEvent.click(screen.getByText(mockLanguageData.add_driver));
        expect(screen.getByTestId("driver-detail-testid")).toBeInTheDocument();
    });

    test('handles Driver Details link click', () => {
        fireEvent.click(screen.getByText(mockLanguageData.driver_details));
    });
});