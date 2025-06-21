import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Specifications from './Specifications';
import { LanguageData } from 'types/languageData';
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';

jest.mock('components/hooks/useQuoteAndBuyContext');

const mockLanguageData: LanguageData = {
  engine: 'Engine',
  engine_size: 'Engine Size',
  transmission: 'Transmission',
};

const mockVehicleDetails = {
  engineSize: '2000 CC',
  transmission: 'Manual',
};

(useQuoteAndBuyContext as jest.Mock).mockReturnValue({
  vehicleDetails: mockVehicleDetails,
  vehicleDetailsResponseData: {
    engineCapacity: '2000 CC',
    transmissionType: 'Manual',
  }
});

describe('Specifications', () => {
  it('renders without crashing', () => {
    render(<Specifications languageData={mockLanguageData} />);
    expect(screen.getByText('Engine')).toBeInTheDocument();
  });

  it('displays engine size and transmission', () => {
    render(<Specifications languageData={mockLanguageData} />);
    expect(screen.getByText('Engine Size')).toBeInTheDocument();
    expect(screen.getAllByText('2000 CC')).toHaveLength(1);
  });

  it('displays default values when vehicle details are missing', () => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      vehicleDetails: {},
      vehicleDetailsResponseData: {
        engineCapacity: '1000 CC',
        transmissionType: 'Automatic',
      },
    });
    render(<Specifications languageData={mockLanguageData} />);
    expect(screen.getByText('Engine Size')).toBeInTheDocument();
    expect(screen.getByText('1000 CC')).toBeInTheDocument();
    expect(screen.getByText('Transmission')).toBeInTheDocument();
    expect(screen.getByText('Automatic')).toBeInTheDocument();
  });

  it('handles undefined languageData', () => {
    render(<Specifications languageData={undefined} />);
    expect(screen.queryByText('Engine')).not.toBeInTheDocument();
    expect(screen.queryByText('Engine Size')).not.toBeInTheDocument();
    expect(screen.queryByText('Transmission')).not.toBeInTheDocument();
  });

  it('handles null languageData', () => {
    render(<Specifications languageData={null} />);
    expect(screen.queryByText('Engine')).not.toBeInTheDocument();
    expect(screen.queryByText('Engine Size')).not.toBeInTheDocument();
    expect(screen.queryByText('Transmission')).not.toBeInTheDocument();
  });
});