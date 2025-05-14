import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ClaimDetails from '.';
import { DataContext } from '../../../../../../DataContext';
import { toast } from 'react-toastify';

jest.mock('react-toastify', () => ({
    toast: {
        error: jest.fn(),
        warning: jest.fn(),
    },
}));

const mockDataContext = {
    liability_details: 'Liability Details',
    estimated_amount: 'Estimated Amount',
    your_qualified_of_estimate: 'Your Qualified Estimate',
    liability: 'Liability',
    do_you_agree: 'Do you agree?',
    yes: 'Yes',
    no: 'No',
    select: 'Select',
    city: 'City',
    select_workshop_max_3: 'Select up to 3 workshops',
    field_limit_breached_clearing_to: 'Field limit breached',
    not_valid_amount_estimated: 'Not a valid amount, should be less than',
    workshop_repair: 'Workshop Repair',
};

const mockProps = {
    isBankTransferSelected: false,
    isDamageRepairSelected: false,
    liabilitySelected: 1,
    changeHandler: jest.fn(),
    changeHandlerFiles: jest.fn(),
    isMandatoryFileUploaded: jest.fn(),
    updateHandler: jest.fn(),
    updateHandlerWorkshop: jest.fn(),
    validationData: {},
    type: 'comprehensiveOD',
    isOthersCase: 0,
    isEstimatedAmountData: null,
};

describe('ClaimDetails Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders ClaimDetails component', () => {
        render(
            <DataContext.Provider value={mockDataContext}>
                <ClaimDetails {...mockProps} />
            </DataContext.Provider>
        );

        expect(screen.getByText('Liability Details')).toBeInTheDocument();
    });

    test('handles toggle button change', () => {
        render(
            <DataContext.Provider value={mockDataContext}>
                <ClaimDetails {...mockProps} />
            </DataContext.Provider>
        );

        const yesButton = screen.getByText('Yes');
        fireEvent.click(yesButton);

        expect(mockProps.changeHandler).toHaveBeenCalled();
    });
});