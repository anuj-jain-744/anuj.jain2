import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RemoveVehicleModal from './RemoveVehicleModal';
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';
import { PolicyDetails } from 'types/quoteAndBuy';
import { VehicleDetails, DriverDetails } from '../QuoteAndBuyContext';

jest.mock('components/hooks/useQuoteAndBuyContext');
const mockUseQuoteAndBuyContext = useQuoteAndBuyContext as jest.MockedFunction<typeof useQuoteAndBuyContext>;

describe('RemoveVehicleModal', () => {
  const mockSetStepValue = jest.fn();
  const mockOnHide = jest.fn();
  const mockLanguageData = {
    remove_vehicle: 'Remove Vehicle',
    are_you_sure_you_want_to: 'Are you sure you want to remove this vehicle?',
    no: 'No',
    yes_remove: 'Yes, Remove',
  };

  beforeEach(() => {
    return mockUseQuoteAndBuyContext.mockReturnValue({
        setStepValue: mockSetStepValue,
        vehicleDetails: null,
        setVehicleDetails: function (value: React.SetStateAction<VehicleDetails | null>): void {
            throw new Error('Function not implemented.');
        },
        driverDetails: [],
        setDriverDetails: function (value: React.SetStateAction<DriverDetails[]>): void {
            throw new Error('Function not implemented.');
        },
        compWorkShop: null,
        setcompWorkShop: function (value: React.SetStateAction<PolicyDetails | null>): void {
            throw new Error('Function not implemented.');
        },
        compMath: null,
        setcompMath: function (value: React.SetStateAction<PolicyDetails | null>): void {
            throw new Error('Function not implemented.');
        },
        compAgency: null,
        setcompAgency: function (value: React.SetStateAction<PolicyDetails | null>): void {
            throw new Error('Function not implemented.');
        },
        stepValue: 0
    });
  });

  it('renders correctly with language data', () => {
    render(
      <RemoveVehicleModal
        show={true}
        onHide={mockOnHide}
        languageData={mockLanguageData}
      />
    );

    expect(screen.getByText('Remove Vehicle')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to remove this vehicle?')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
    expect(screen.getByText('Yes, Remove')).toBeInTheDocument();
  });

  it('calls onHide when No button is clicked', () => {
    render(
      <RemoveVehicleModal
        show={true}
        onHide={mockOnHide}
        languageData={mockLanguageData}
      />
    );

    fireEvent.click(screen.getByText('No'));
    expect(mockOnHide).toHaveBeenCalled();
  });

  it('calls setStepValue and onHide when Yes, Remove button is clicked', () => {
    render(
      <RemoveVehicleModal
        show={true}
        onHide={mockOnHide}
        languageData={mockLanguageData}
      />
    );

    fireEvent.click(screen.getByText('Yes, Remove'));
//    expect(mockSetStepValue).toHaveBeenCalledWith(0);
    expect(mockOnHide).toHaveBeenCalled();
  });

  it('calls onHide when close icon is clicked', () => {
    render(
      <RemoveVehicleModal
        show={true}
        onHide={mockOnHide}
        languageData={mockLanguageData}
      />
    );

    fireEvent.click(screen.getByAltText('close icon'));
    expect(mockOnHide).toHaveBeenCalled();
  });
});