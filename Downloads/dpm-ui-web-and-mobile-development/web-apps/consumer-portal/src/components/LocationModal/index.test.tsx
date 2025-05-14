import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LocationModal from './index';

jest.mock("./map", () => ({
    __esModule: true,
    MapComponent: () => <div>Mocked MapComponent</div>
  }));

describe('LocationModal', () => {
  const defaultProps = {
    title: 'Test Title',
    lat: '123',
    long: '456',
    showPopup: true,
    setShowPopup: jest.fn(),
  };

  it('renders correctly with given props', () => {
    render(<LocationModal {...defaultProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Mocked MapComponent')).toBeInTheDocument();
  });

  it('displays the modal title correctly', () => {
    render(<LocationModal {...defaultProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('passes correct props to MapComponent', () => {
    render(<LocationModal {...defaultProps} />);
    expect(screen.getByText('Mocked MapComponent')).toBeInTheDocument();
  });

  it('hides the modal when setShowPopup is called', () => {
    render(<LocationModal {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(defaultProps.setShowPopup).toHaveBeenCalled();
  });
});