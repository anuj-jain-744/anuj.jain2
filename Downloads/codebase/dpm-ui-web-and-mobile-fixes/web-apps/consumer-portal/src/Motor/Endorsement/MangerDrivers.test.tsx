import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ManageDrivers } from './ManageDrivers';
import useSaveRedisData from 'hook/common/useSaveRedisData';
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';
import * as reactRedux from 'react-redux';
import { callAPI } from "@dpm/shared-module";

jest.mock('components/hooks/useQuoteAndBuyContext');
jest.mock('hook/common/useSaveRedisData');
jest.mock('@app-shell/utils/common', () => ({
  getAmountWithIcon: jest.fn(amount => `SAR ${amount}`),
}));
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock('@dpm/shared-module', () => ({
    capitalizeNameFirstLetter:  jest.fn((name) => name.charAt(0).toUpperCase() + name.slice(1)),
    callAPI: jest.fn(),
  sanitizeHtml: jest.fn((html) => html),
  useApiCall: jest.fn(() => ({
    makeApiCall: jest.fn(),
    data: null,
    errors: null,
    isLoading: false
  }))
}));
jest.mock("utils/getPlateNumber", () => ({ getPlateNumber: jest.fn(() => "ABC-1234") }));

(useSaveRedisData as jest.Mock).mockReturnValue({
  saveRedisData: jest.fn(),
});


(useQuoteAndBuyContext as jest.Mock).mockReturnValue({
    
  });
  
const mockLanguageData = {
    enter: "Enter",
    select_vehicle_to_manage: "Select Vehicle to Manage Drivers",
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
    plateNo: "ABC-1234",
    manufactureYear: "2020",
    plateNoText1:"",
    plateNoText2:"",
    plateNoText3:"",
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
const mockResponse={motor_makes:{abc:''}}

describe('ManageDrivers Component', () => {
    beforeEach(() => {
        (reactRedux.useSelector as jest.Mock).mockImplementation(selectorFn =>
              selectorFn({
                auth: {
                  userInfo: {
                    name: 'John Doe',
                    userId: '12345',
                    mobileNumber: '0551234567',
                    ownerDobG: '1990-01-01',
                    ownerDobH: '1410-01-01',
                    gender: 'Male',
                    nationality: 'Saudi',
                    nationalityCode: 'SA',
                    email: 'john@example.com',
                    ownerFullNameArabic: 'جون دو',
                    dateOfBirth: '1990-01-01'
                  },
                  authDetails: {
                    message: 'msg',
                    isValid: true,
                    referenceNo: 'ref123',
                    sessionSecretId: 'sess123'
                  }
                },
                addressData: {
                  addressData: [{ city: 'Riyadh' }]
                },
                policy: {
                  policies: [{ id: 1 }]
                }
              })
            );
            (callAPI as jest.Mock).mockResolvedValue(mockResponse);
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
        expect(screen.getByText(mockLanguageData.select_vehicle_to_manage)).toBeInTheDocument();
    });

    test('renders vehicle details', () => {
        // expect(screen.getByText(mockPolicyData.vehicleModel)).toBeInTheDocument();
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
        expect(screen.getByText(mockLanguageData.add_additional_drivers_up)).toBeInTheDocument();
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
        expect(screen.getByText(mockLanguageData.add_additional_drivers_up)).toBeInTheDocument();
    });

    test('renders Manage call driver detail and driver delete button', async () => {
        const buttonData = screen.getByTestId("driver-detail")
        expect(buttonData).toBeInTheDocument();
        fireEvent.click(buttonData);

        const buttonDelete = screen.getByTestId("driver-delete")
        expect(buttonDelete).toBeInTheDocument();
        fireEvent.click(buttonDelete);
        
        await waitFor(() => {
            const closePrompt = screen.getByTestId("close-prompt")
            expect(closePrompt).toBeInTheDocument();
            fireEvent.click(closePrompt);
        });
        
        if (buttonDelete) {
            fireEvent.click(buttonDelete);
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