import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VehicleDetailsCard from './VehicleDetailsCard';
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';
import { getPlateNumber } from 'utils/getPlateNumber';
import { getModelIcon } from 'utils/getModelIcon';
import { NOT_APPLICABLE } from '@dpm/shared-module';

jest.mock('components/hooks/useQuoteAndBuyContext');
jest.mock('utils/getPlateNumber');
jest.mock('utils/getModelIcon');

describe('VehicleDetailsCard', () => {
  const mockContext = {
    vehicleDetails: { vehicleSequenceNo: '123', vehicleCustomID: '456' },
    vehicleDetailsResponseData: {
      make: 'Nissan',
      manufactureYear: '2020',
      vehicleColour: 'Red',
      chassisNumber: 'ABC123',
    },
    makeModelResponse: [],
  };

  const languageData = {
    number_plate: 'Number Plate',
    vehicle_sequence: 'Vehicle Sequence',
    registration_year_label: 'Registration Year',
    colour: 'Colour',
    chassis_no: 'Chassis Number',
    review_vehicle_details: 'Review Vehicle Details',
  };

  beforeEach(() => {
    useQuoteAndBuyContext.mockReturnValue(mockContext);
    getPlateNumber.mockReturnValue('XYZ123');
    getModelIcon.mockReturnValue('nissan.svg');
  });

  it('renders correctly', () => {
    render(<VehicleDetailsCard languageData={languageData} />);

    expect(screen.getByText('Nissan')).toBeInTheDocument();
    expect(screen.getByText('XYZ123')).toBeInTheDocument();
    expect(screen.getByText('2020')).toBeInTheDocument();
    expect(screen.getByText('Red')).toBeInTheDocument();
    expect(screen.getByText('ABC123')).toBeInTheDocument();
  });

  it('opens and closes the vehicle details modal', () => {
    render(<VehicleDetailsCard languageData={languageData} />);

    fireEvent.click(screen.getByText('Review Vehicle Details'));
    expect(screen.getByText('Vehicle Details Modal Content')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByText('Vehicle Details Modal Content')).not.toBeInTheDocument();
  });

  it('opens and closes the remove vehicle modal', () => {
    render(<VehicleDetailsCard languageData={languageData} />);

    fireEvent.click(screen.getByAltText('delete icon'));
    waitFor(() => { 
      expect(screen.getByText('Remove Vehicle Modal Content')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Close'));
      expect(screen.queryByText('Remove Vehicle Modal Content')).not.toBeInTheDocument();
    });
  });
});