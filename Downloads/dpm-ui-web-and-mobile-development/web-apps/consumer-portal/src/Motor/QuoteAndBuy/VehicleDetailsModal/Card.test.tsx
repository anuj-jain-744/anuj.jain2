import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from './Card';
import { LanguageData } from 'types/languageData';
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';

jest.mock('components/hooks/useQuoteAndBuyContext');

const mockLanguageData: LanguageData = {
  number_plate: 'Number Plate',
  registration_year_label: 'Registration Year',
  vehicle_sequence: 'Vehicle Sequence',
  chassis_no: 'Chassis No',
};

const mockVehicleDetails = {
  plateNumber: '1234',
  plateText1: 'ABC',
  vehicleModel: 'Nissan Altima',
  registrationYear: 2020,
  vehicleSequenceNo: '5678',
  chassisNumber: 'XYZ123456789',
};

(useQuoteAndBuyContext as jest.Mock).mockReturnValue({
  vehicleDetails: mockVehicleDetails,
  vehicleDetailsResponseData: {
    chassisNumber: 'XYZ123456789',
  }
});

describe('Card', () => {
  it('renders without crashing', () => {
    render(<Card languageData={mockLanguageData} />);
    expect(screen.getByAltText('product icon')).toBeInTheDocument();
  });

  it('displays number plate', () => {
    render(<Card languageData={mockLanguageData} />);
    expect(screen.getByText('Number Plate')).toBeInTheDocument();
    // expect(screen.getAllByText('1234ABC')).toHaveLength(2);
  });

  it('displays registration year', () => {
    render(<Card languageData={mockLanguageData} />);
    expect(screen.getByText('Registration Year')).toBeInTheDocument();
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('displays vehicle sequence number', () => {
    render(<Card languageData={mockLanguageData} />);
    expect(screen.getByText('Vehicle Sequence')).toBeInTheDocument();
    expect(screen.getByText('5678')).toBeInTheDocument();
  });

  it('displays chassis number', () => {
    render(<Card languageData={mockLanguageData} />);
    const elements = screen.getAllByText((content, element) => {
      return element?.textContent?.includes('Chassis No');
    });
    expect(elements.length).toBeGreaterThan(0);
    expect(elements[0]).toBeInTheDocument();
    expect(screen.getByText('XYZ123456789')).toBeInTheDocument();
  });
});