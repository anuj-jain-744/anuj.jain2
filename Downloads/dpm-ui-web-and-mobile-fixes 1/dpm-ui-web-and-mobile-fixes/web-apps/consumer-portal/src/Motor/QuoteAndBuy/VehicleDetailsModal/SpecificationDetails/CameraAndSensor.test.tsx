import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CameraAndSensor from './CameraAndSensor';

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
  cameras_sensors: 'Cameras & Sensors',
  rear_parking_sensors: 'Rear Parking Sensors',
  front_sensors: 'Front Sensors',
  front_camera: 'Front Camera',
  rear_camera: 'Rear Camera',
  degree_camera: '360 Degree Camera',
  yes: 'Yes',
  no: 'No',
};

const mockProps = {
  languageData: mockLanguageData,
  rearParkingSensor: false,
  setRearParkingSensor: jest.fn(),
  frontSensor: true,
  setFrontSensor: jest.fn(),
  frontCamera: false,
  setFrontCamera: jest.fn(),
  rearCamera: true,
  setRearCamera: jest.fn(),
  degreeCamera: false,
  setDegreeCamera: jest.fn(),
};

describe('CameraAndSensor', () => {
  it('renders without crashing', () => {
    render(<CameraAndSensor {...mockProps} />);
    expect(screen.getByText('Cameras & Sensors')).toBeInTheDocument();
  });

  it('renders all sensor and camera options', () => {
    render(<CameraAndSensor {...mockProps} />);
    expect(screen.getByText('Rear Parking Sensors')).toBeInTheDocument();
    expect(screen.getByText('Front Sensors')).toBeInTheDocument();
    expect(screen.getByText('Front Camera')).toBeInTheDocument();
    expect(screen.getByText('Rear Camera')).toBeInTheDocument();
    expect(screen.getByText('360 Degree Camera')).toBeInTheDocument();
  });

  it('renders ToggleButton for each option', () => {
    render(<CameraAndSensor {...mockProps} />);
    const toggleButtons = screen.getAllByTestId('toggle-button');
    expect(toggleButtons).toHaveLength(5);
  });

  it('displays correct initial states for each option', () => {
    render(<CameraAndSensor {...mockProps} />);
    const toggleButtons = screen.getAllByTestId('toggle-button');
    expect(toggleButtons[0]).toHaveTextContent('Active: No');
    expect(toggleButtons[1]).toHaveTextContent('Active: Yes');
    expect(toggleButtons[2]).toHaveTextContent('Active: No');
    expect(toggleButtons[3]).toHaveTextContent('Active: Yes'); 
    expect(toggleButtons[4]).toHaveTextContent('Active: No');
  });

  it('calls setRearParkingSensor when rear parking sensor toggle is clicked', () => {
    render(<CameraAndSensor {...mockProps} />);
    const toggleButtons = screen.getAllByTestId('toggle-button');
    fireEvent.click(toggleButtons[0].querySelector('button')!);
    expect(mockProps.setRearParkingSensor).toHaveBeenCalledWith(true);
  });

  it('calls setFrontSensor when front sensor toggle is clicked', () => {
    render(<CameraAndSensor {...mockProps} />);
    const toggleButtons = screen.getAllByTestId('toggle-button');
    fireEvent.click(toggleButtons[1].querySelector('button')!);
    expect(mockProps.setFrontSensor).toHaveBeenCalledWith(true);
  });

  it('calls setFrontCamera when front camera toggle is clicked', () => {
    render(<CameraAndSensor {...mockProps} />);
    const toggleButtons = screen.getAllByTestId('toggle-button');
    fireEvent.click(toggleButtons[2].querySelector('button')!);
    expect(mockProps.setFrontCamera).toHaveBeenCalledWith(true);
  });

  it('calls setRearCamera when rear camera toggle is clicked', () => {
    render(<CameraAndSensor {...mockProps} />);
    const toggleButtons = screen.getAllByTestId('toggle-button');
    fireEvent.click(toggleButtons[3].querySelector('button')!);
    expect(mockProps.setRearCamera).toHaveBeenCalledWith(true);
  });

  it('calls setDegreeCamera when 360 degree camera toggle is clicked', () => {
    render(<CameraAndSensor {...mockProps} />);
    const toggleButtons = screen.getAllByTestId('toggle-button');
    fireEvent.click(toggleButtons[4].querySelector('button')!);
    expect(mockProps.setDegreeCamera).toHaveBeenCalledWith(true);
  });
});