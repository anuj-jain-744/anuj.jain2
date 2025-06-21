import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Features from './Features';

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
  features: 'Features',
  adaptive_cruise_control: 'Adaptive Cruise Control',
  cruise_control: 'Cruise Control',
  modifications: 'Modifications',
  yes: 'Yes',
  no: 'No',
};

const mockProps = {
  languageData: mockLanguageData,
  isAdaptiveCruise: true,
  setIsAdaptiveCruise: jest.fn(),
  isCruiseControl: false,
  setIsCruiseControl: jest.fn(),
  isModified: true,
  setIsModified: jest.fn(),
};

describe('Features', () => {
  it('renders without crashing', () => {
    render(<Features {...mockProps} />);
    expect(screen.getByText('Features')).toBeInTheDocument();
  });

  it('renders all feature options with correct language data', () => {
    render(<Features {...mockProps} />);
    expect(screen.getByText('Adaptive Cruise Control')).toBeInTheDocument();
    expect(screen.getByText('Cruise Control')).toBeInTheDocument();
    expect(screen.getByText('Modifications')).toBeInTheDocument();
  });

  it('renders ToggleButton for each feature option', () => {
    render(<Features {...mockProps} />);
    const toggleButtons = screen.getAllByTestId('toggle-button');
    expect(toggleButtons).toHaveLength(3);
  });

  it('displays correct initial states for each feature option', () => {
    render(<Features {...mockProps} />);
    const toggleButtons = screen.getAllByTestId('toggle-button');
    expect(toggleButtons[0]).toHaveTextContent('Active: Yes');
    expect(toggleButtons[1]).toHaveTextContent('Active: No');
    expect(toggleButtons[2]).toHaveTextContent('Active: Yes');
  });

  it('calls setIsAdaptiveCruise when adaptive cruise control toggle is clicked', () => {
    render(<Features {...mockProps} />);
    const toggleButtons = screen.getAllByTestId('toggle-button');
    fireEvent.click(toggleButtons[0].querySelector('button')!);
    expect(mockProps.setIsAdaptiveCruise).toHaveBeenCalledWith(true);
  });

  it('calls setIsCruiseControl when cruise control toggle is clicked', () => {
    render(<Features {...mockProps} />);
    const toggleButtons = screen.getAllByTestId('toggle-button');
    fireEvent.click(toggleButtons[1].querySelector('button')!);
    expect(mockProps.setIsCruiseControl).toHaveBeenCalledWith(true);
  });

  it('calls setIsModified when modifications toggle is clicked', () => {
    render(<Features {...mockProps} />);
    const toggleButtons = screen.getAllByTestId('toggle-button');
    fireEvent.click(toggleButtons[2].querySelector('button')!);
    expect(mockProps.setIsModified).toHaveBeenCalledWith(true);
  });
});