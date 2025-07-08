import React from 'react';
import { render, screen } from '@testing-library/react';
import VehicleDetailSection from './VehicleDetailSection';
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';
import { useApiCall } from '@dpm/shared-module';

// Mock the dependencies
jest.mock('components/hooks/useQuoteAndBuyContext');
jest.mock('@dpm/shared-module');
jest.mock('./VehilceDetailsCard/VehicleDetailsCard', () => {
  return function MockVehicleDetailsCard() {
    return <div data-testid="vehicle-details-card">Vehicle Details Card</div>;
  };
});
jest.mock('components/ThemeButton/ThemeButton', () => {
  return function MockThemeButton({ title }: { title: string }, onClickhandler: () => void) {
    return <button onClick={onClickhandler}>{title}</button>;
  };
});

const mockLanguageData = {
  vehicle_details: 'Vehicle Details',
  add_another_vehicle: 'Add Another Vehicle',
  the_policy_allows: 'The policy allows multiple vehicles',
};

describe('VehicleDetailSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      setStepValue: jest.fn(),
      compWorkShop: {},
      setcompWorkShop: jest.fn(),
    });
    (useApiCall as jest.Mock).mockReturnValue({
      makeApiCall: jest.fn(),
      errors: null,
      data: null,
    });
  });

  it('renders without crashing', () => {
    render(<VehicleDetailSection languageData={mockLanguageData} />);
    expect(screen.getByText('Vehicle Details')).toBeInTheDocument();
  });

  it('renders VehicleDetailsCard', () => {
    render(<VehicleDetailSection languageData={mockLanguageData} />);
    expect(screen.getByTestId('vehicle-details-card')).toBeInTheDocument();
  });

});