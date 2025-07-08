import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Safety from './Safety';

jest.mock('components/ThemeDropdown/ThemeDropdown', () => {
  return function MockThemeDropdown({ id, value, onChangehandler, selectedValue }: any) {
    return (
      <select data-testid={id} value={selectedValue} onChange={onChangehandler}>
        {value.map((option: string) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
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

const mockLanguageData = {
  safety: 'Safety',
  parking: 'Parking',
  anti_theft_alarm: 'Anti Theft Alarm',
  anti_lock_braking_system: 'Anti Lock Braking System',
  automatic_braking_system: 'Automatic Braking System',
  yes: 'Yes',
  no: 'No',
};

const mockProps = {
  languageData: mockLanguageData,
  parkingValue: 'Street',
  setParkingValue: jest.fn(),
  antiTheftAlarmValue: 'Working',
  setAntiTheftAlarmValue: jest.fn(),
  antiLockBrakingSystemValue: '1234',
  setAntiLockBrakingSystemValue: jest.fn(),
  isAutomaticBrakingSystem: true,
  setIsAutomaticBrakingSystem: jest.fn(),
};

describe('Safety', () => {
  it('renders without crashing', () => {
    render(<Safety {...mockProps} />);
    expect(screen.getByText('Safety')).toBeInTheDocument();
  });

  it('renders all elements with correct language data', () => {
    render(<Safety {...mockProps} />);
    expect(screen.getByText('Parking')).toBeInTheDocument();
    expect(screen.getByText('Anti Theft Alarm')).toBeInTheDocument();
    expect(screen.getByText('Anti Lock Braking System')).toBeInTheDocument();
    expect(screen.getByText('Automatic Braking System')).toBeInTheDocument();
  });

  it('renders ThemeDropdown for parking with correct value', () => {
    render(<Safety {...mockProps} />);
    const dropdown = screen.getByTestId('parking-dropdown');
    expect(dropdown).toHaveValue('Street');
  });

  it('calls setParkingValue when parking dropdown value changes', () => {
    render(<Safety {...mockProps} />);
    const dropdown = screen.getByTestId('parking-dropdown');
    fireEvent.change(dropdown, { target: { value: 'Garage' } });
    expect(mockProps.setParkingValue).toHaveBeenCalledWith('Garage');
  });

  it('renders ThemeDropdown for anti-theft alarm with correct value', () => {
    render(<Safety {...mockProps} />);
    const dropdown = screen.getByTestId('anti-theft-alarm-dropdown');
    expect(dropdown).toHaveValue('Working');
  });

  it('calls setAntiTheftAlarmValue when anti-theft alarm dropdown value changes', () => {
    render(<Safety {...mockProps} />);
    const dropdown = screen.getByTestId('anti-theft-alarm-dropdown');
    fireEvent.change(dropdown, { target: { value: 'Not Working' } });
    expect(mockProps.setAntiTheftAlarmValue).toHaveBeenCalledWith('Not Working');
  });

  it('renders ThemeTextbox with correct value', () => {
    render(<Safety {...mockProps} />);
    const textbox = screen.getByTestId('theme-textbox');
    expect(textbox).toHaveValue('1234');
  });

  it('calls setAntiLockBrakingSystemValue when ThemeTextbox value changes', () => {
    render(<Safety {...mockProps} />);
    const textbox = screen.getByTestId('theme-textbox');
    fireEvent.change(textbox, { target: { value: '5678' } });
    expect(mockProps.setAntiLockBrakingSystemValue).toHaveBeenCalledWith('5678');
  });

  it('renders ToggleButton with correct initial state', () => {
    render(<Safety {...mockProps} />);
    const toggleButton = screen.getByTestId('toggle-button');
    expect(toggleButton).toHaveTextContent('Active: Yes');
  });

  it('calls setIsAutomaticBrakingSystem when ToggleButton is clicked', () => {
    render(<Safety {...mockProps} />);
    const toggleButton = screen.getByTestId('toggle-button');
    fireEvent.click(toggleButton.querySelector('button')!);
    expect(mockProps.setIsAutomaticBrakingSystem).toHaveBeenCalledWith(true);
  });
});