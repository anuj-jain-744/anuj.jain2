import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CommercialVehicle from './CommercialVehicle';

jest.mock('../ToggleButton/ToggleButton', () => {
  return function MockToggleButton({ isActive, leftLabel, rightLabel, onChange }: any) {
    return (
      <div data-testid="toggle-button">
        <button onClick={() => onChange(true)}>{leftLabel}</button>
        <button onClick={() => onChange(false)}>{rightLabel}</button>
        <span>Active: {isActive ? 'Yes' : 'No'}</span>
      </div>
    );
  };
});

jest.mock('components/ThemeTextbox/ThemeTextbox', () => {
  return function MockThemeTextbox({ value, onChangehandler }: any) {
    return (
      <input
        data-testid="theme-textbox"
        value={value}
        onChange={onChangehandler}
      />
    );
  };
});

const mockLanguageData = {
  commercial_vehicle: 'Commercial Vehicle',
  vehicle_axle_weight: 'Vehicle Axle Weight',
  fire_extinguisher: 'Fire Extinguisher',
  yes: 'Yes',
  no: 'No',
};

const mockProps = {
  languageData: mockLanguageData,
  vehicleAxleWeight: '2000',
  setVehicleAxleWeight: jest.fn(),
  isFireExtinguisher: true,
  setIsFireExtinguisher: jest.fn(),
};

describe('CommercialVehicle', () => {
  it('renders without crashing', () => {
    render(<CommercialVehicle {...mockProps} />);
    expect(screen.getByText('Commercial Vehicle')).toBeInTheDocument();
  });

  it('renders all elements with correct language data', () => {
    render(<CommercialVehicle {...mockProps} />);
    expect(screen.getByText('Vehicle Axle Weight')).toBeInTheDocument();
    expect(screen.getByText('Fire Extinguisher')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('renders ThemeTextbox with correct value', () => {
    render(<CommercialVehicle {...mockProps} />);
    const textbox = screen.getByTestId('theme-textbox');
    expect(textbox).toHaveValue('2000');
  });

  it('calls setVehicleAxleWeight when ThemeTextbox value changes', () => {
    render(<CommercialVehicle {...mockProps} />);
    const textbox = screen.getByTestId('theme-textbox');
    fireEvent.change(textbox, { target: { value: '2500' } });
    expect(mockProps.setVehicleAxleWeight).toHaveBeenCalledWith('2500');
  });

  it('renders ToggleButton with correct initial state', () => {
    render(<CommercialVehicle {...mockProps} />);
    const toggleButton = screen.getByTestId('toggle-button');
    expect(toggleButton).toHaveTextContent('Active: Yes');
  });

  it('calls setIsFireExtinguisher when ToggleButton is clicked', () => {
    render(<CommercialVehicle {...mockProps} />);
    const toggleButton = screen.getByTestId('toggle-button');
    fireEvent.click(toggleButton.querySelector('button')!);
    expect(mockProps.setIsFireExtinguisher).toHaveBeenCalledWith(true);
  });
});