import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import VehicleDetailsModal from './VehicleDetailsModal';
import { LanguageData } from 'types/languageData';
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';
import useSaveRedisData from "hook/common/useSaveRedisData";

jest.mock('components/hooks/useQuoteAndBuyContext');
jest.mock('hook/common/useSaveRedisData');

const mockLanguageData: LanguageData = {
  vehicle_details: 'Vehicle Details',
  cancel: 'Cancel',
  update: 'Update',
};

const mockVehicleDetails = {
  features: {
    adaptiveCruiseControl: true,
    cruiseControl: true,
    modification: false,
  },
  camera: {
    rearCamera: true,
    frontSensor: true,
    frontCamera: false,
    rearParkingSensor: false,
    degreeCamera: false,
  },
  safety: {
    parking: 'Yes',
    antiTheftAlarm: 'Yes',
    antiLockBrakingSystem: 'Yes',
    automaticBrakingSystem: false,
  },
  commercialVehicle: {
    vehicleAxleWeight: 2000,
    fireExtinguisher: true,
  },
  vehicleSequenceNo: '12345',
  plateNumber: 'ABC123',
  registrationYear: 2020,
  chassisNo: 'XYZ678',
  majorColor: 'Red',
  engineSize: '2000 CC',
  transmission: 'Manual',
};

(useQuoteAndBuyContext as jest.Mock).mockReturnValue({
  vehicleDetails: mockVehicleDetails,
  setVehicleDetails: jest.fn(),
});

(useSaveRedisData as jest.Mock).mockReturnValue({
  saveRedisData: jest.fn(),
});

describe('VehicleDetailsModal', () => {
  it('renders without crashing', () => {
    render(<VehicleDetailsModal show={true} onHide={jest.fn()} languageData={mockLanguageData} />);
    expect(screen.getByText('Vehicle Details')).toBeInTheDocument();
  });

  it('calls onHide when close icon is clicked', () => {
    const onHide = jest.fn();
    render(<VehicleDetailsModal show={true} onHide={onHide} languageData={mockLanguageData} />);
    fireEvent.click(screen.getByAltText('close icon'));
    expect(onHide).toHaveBeenCalled();
  });

  it('displays the correct language data', () => {
    render(<VehicleDetailsModal show={true} onHide={jest.fn()} languageData={mockLanguageData} />);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Update')).toBeInTheDocument();
  });

  it('handles the expand section correctly', () => {
    render(<VehicleDetailsModal show={true} onHide={jest.fn()} languageData={mockLanguageData} />);
    fireEvent.click(screen.getByText('Vehicle Details'));
    expect(screen.getByText('Vehicle Details')).toBeInTheDocument();
  });

  it('calls handleSubmitFiles when update button is clicked', () => {
    const setVehicleDetails = jest.fn();
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      vehicleDetails: mockVehicleDetails,
      setVehicleDetails,
    });

    render(<VehicleDetailsModal show={true} onHide={jest.fn()} languageData={mockLanguageData} />);
    fireEvent.click(screen.getByText('Update'));
    expect(setVehicleDetails).toHaveBeenCalled();
  });

  it('handles undefined languageData', () => {
    render(<VehicleDetailsModal show={true} onHide={jest.fn()} languageData={undefined} />);
    expect(screen.queryByText('Vehicle Details')).not.toBeInTheDocument();
  });

  it('handles null languageData', () => {
    render(<VehicleDetailsModal show={true} onHide={jest.fn()} languageData={null} />);
    expect(screen.queryByText('Vehicle Details')).not.toBeInTheDocument();
  });
});