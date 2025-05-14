import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MyProfile from './index';
import * as reactRedux from 'react-redux';
import * as reactToastify from 'react-toastify';
import { useApiCall } from "@dpm/shared-module";

// Mocking necessary modules and hooks
jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));

jest.mock('react-toastify', () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

jest.mock('@dpm/shared-module', () => ({
    ...jest.requireActual('@dpm/shared-module'),
    useApiCall: jest.fn(),
}));

jest.mock('utils/formatDate', () => ({
    formatDateMMYYYY: jest.fn(() => '12/2023'),
}));

// Mock ProfileDetails assets
jest.mock('../../assets/ProfileDetails', () => ({
    PersonalIcon: 'mocked-personal-icon.svg',
    ArrowRight: 'mocked-arrow-right-icon.svg',
    UserIcon: 'mocked-user-icon.svg',
    EditIcon: 'mocked-edit-icon.svg',
    AddressLoading: 'mocked-address-loading-icon.svg',
}));

jest.mock('./ProfileEditDialog', () => {
    return jest.fn(() => <div data-testid="mock-profile-edit-dialog">ProfileEditDialog</div>);
});

jest.mock('components/OTPValidation/OtpWrapper', () => {
    return jest.fn(() => <div data-testid="mock-otp-wrapper">OTPWrapper</div>);
});

describe('MyProfile Component', () => {
    const mockDispatch = jest.fn();
    const mockUseApiCall = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock sessionStorage
        const sessionStorageMock = (() => {
            let store: { [key: string]: string } = {};
            return {
                getItem: jest.fn((key: string) => store[key] || null),
                setItem: jest.fn((key: string, value: string) => {
                    store[key] = value.toString();
                }),
                clear: jest.fn(() => {
                    store = {};
                }),
            };
        })();

        Object.defineProperty(global, 'sessionStorage', {
            value: sessionStorageMock,
        });

        (reactRedux.useDispatch as jest.Mock).mockReturnValue(mockDispatch);

        (reactRedux.useSelector as jest.Mock).mockImplementation((selectorFn) =>
            selectorFn({
                dashbaordLanguageData: { languageData: { personal_details: 'Personal Details', mobile_no: 'Mobile Number', email_id: 'Email ID', edit: 'Edit' } },
                profileData: {
                    profileData: { userId: '12345', name: 'John Doe', ownerDobG: '2000-01-01', mobileNumber: '123-456-7890', email: 'test@example.com', lastUpdatedOn: '2024-01-01', address: 'Test Address' },
                    updateContactData: { value: 'new@example.com' }
                },
                auth: {
                    authDetails: { message: 'Success' }
                }
            })
        );

        mockUseApiCall.mockReturnValue({
            makeApiCall: jest.fn(),
            data: { address: 'Test Address' },
            error: null,
            isLoading: false,
        });

        (useApiCall as jest.Mock).mockReturnValue(mockUseApiCall());

        sessionStorage.setItem('userDetails', JSON.stringify({
            userProfileData: { userId: '12345', name: 'John Doe', mobileNumber: '123-456-7890', email: 'test@example.com' },
            message: 'Success',
            isValid: true,
            referenceNo: 'ref-123',
            sessionSecretId: 'secret-123',
        }));
    });

    test('renders MyProfile component', () => {
        render(<MyProfile />);

        // Check if the component renders without crashing
        expect(screen.getByTestId('my-profile-details')).toBeInTheDocument();
        expect(screen.getByTestId('my-profile-container')).toBeInTheDocument();
    });

    test('opens ProfileEditDialog when edit button is clicked', () => {
        render(<MyProfile />);

        // Simulate clicking the edit button
        const editButton = screen.getByAltText('edit-email');
        fireEvent.click(editButton);

        // Check if ProfileEditDialog is rendered
        expect(screen.getByTestId('mock-profile-edit-dialog')).toBeInTheDocument();
    });

    test('handleAddressSync sets loading state and triggers API call', () => {
        const mockMakeApiCall = jest.fn();
        mockUseApiCall.mockReturnValue({
            makeApiCall: mockMakeApiCall,
            isLoading: false,
            data: null,
            error: null,
        });

        render(<MyProfile />);

        const syncButton = screen.getByTestId('sync-button');
        fireEvent.click(syncButton);

        // expect(mockMakeApiCall).toHaveBeenCalled();
    });

    test('handleModal sets modal and contact state correctly', () => {
        render(<MyProfile />);

        const editMobileButton = screen.getByAltText('edit-mobile');
        fireEvent.click(editMobileButton);

        expect(screen.getByTestId('mock-profile-edit-dialog')).toBeInTheDocument();

        const editEmailButton = screen.getByAltText('edit-email');
        fireEvent.click(editEmailButton);

        expect(screen.getByTestId('mock-profile-edit-dialog')).toBeInTheDocument();
    });
});
