import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
        },
        {
            driverName: "TEST1",
            driverNameArabic: "2جون5 دو",
            driverID: "12324567",
            relation: 1,
            mainDriverInd: "N"
        },
        {
            driverName: "TEST5",
            driverNameArabic: "1جون4 دو",
            driverID: "123245673",
            relation: 1,
            mainDriverInd: "N"
        },
        {
            driverName: "TEST13",
            driverNameArabic: "3جون3 دو",
            driverID: "12234567",
            relation: 1,
            mainDriverInd: "N"
        }
    ]
};

const mockPolicyData1 = {
    vehicleModel: "Nissan",
    plateNo: "1234",
    manufactureYear: "2020",
    vehicleColour: 0,
    chassisNo: "ABC123",
    vehicleSequenceNo: "1",
    drivers: []
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

    // test('handles Add Driver button click', () => {
    //     fireEvent.click(screen.getByText(mockLanguageData.add_driver));
    //     expect(screen.getByTestId("driver-detail-testid")).toBeInTheDocument();
    // });

    test('handles Driver Details link click', () => {
        fireEvent.click(screen.getByText(mockLanguageData.driver_details));
    });
});

describe('ManageDrivers Component with policyData as null', () => {
    beforeEach(() => {
        render(
            <ManageDrivers
                languageData={mockLanguageData}
                policyData={null}
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
});

describe('ManageDrivers Component with session storage', () => {
    beforeEach(() => {
        sessionStorage.setItem(
            "iqmaId",
            JSON.stringify(123456)
        )
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

    test('renders Manage call driver detail and driver delete button', async () => {
        const buttonData = screen.getByTestId("driver-detail")
        expect(buttonData).toBeInTheDocument();
        fireEvent.click(buttonData);

        const buttonDelete = screen.getByTestId("driver-delete")
        expect(buttonDelete).toBeInTheDocument();
        fireEvent.click(buttonDelete);
        const closeIcon = document.querySelector('.icons-material-icons-close');
        
        await waitFor(() => {
            const closePrompt = screen.getByTestId("close-prompt")
            expect(closePrompt).toBeInTheDocument();
            fireEvent.click(closePrompt);
        });
        
        if (closeIcon) {
            fireEvent.click(closeIcon);
        } else {
            throw new Error("Close icon not found");
        }
    });
    
});

describe('ManageDrivers Component with policyData as Add driver', () => {
    beforeEach(() => {
        render(
            <ManageDrivers
                languageData={mockLanguageData}
                policyData={mockPolicyData1}
                policyNumber="POL123"
                newDriverArray={mockNewDriverArray}
                setNewDriverArray={mockSetNewDriverArray}
                addDriverData={[]}
                setAddDriverData={mockSetAddDriverData}
            />
        );
    });

    test('renders Manage call driver detail and driver delete button', async () => {

        const buttonDelete = screen.getByTestId("driver-delete")
        expect(buttonDelete).toBeInTheDocument();
        fireEvent.click(buttonDelete);

        await waitFor(async () => {
            const buttonDriverAdd = screen.getByTestId("confirm-delete")
            expect(buttonDriverAdd).toBeInTheDocument();
            fireEvent.click(buttonDriverAdd);
        });

        const buttonData = screen.getByTestId("driver-detail")
        expect(buttonData).toBeInTheDocument();
        fireEvent.click(buttonData);
        await waitFor(async () => {
            const buttonDriverAdd = screen.getByTestId("update-driver-detail")
            expect(buttonDriverAdd).toBeInTheDocument();
            fireEvent.click(buttonDriverAdd);
        });

    });
});