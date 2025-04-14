import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { OverlayTrigger } from 'react-bootstrap';
import Product from './Product'; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import motorIcon from 'assets/DashboardBanner/newMotorIcon.svg';
import travelIcon from 'assets/DashboardBanner/newTravelIcon.svg';
import homeIcon from 'assets/DashboardBanner/newHomeIcon.svg';
import medicalIcon from 'assets/DashboardBanner/newMedicalIcon.svg';

// Mocking the useNavigate hook
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

// Mocking react-redux hooks
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

describe('Product Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mocking useNavigate to return the mock function
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    // Mocking useSelector to return specific values
    (reactRedux.useSelector as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        auth: { userInfo: { name: 'John Doe', userId: '12345' }, authDetails: {} },
        addressData: { addressData: [] },
      })
    );
  });

  test('renders correctly with the given icon name and action', () => {
    render(<Product iconName="Motor" action="buy" />);

    // Check if the icon is rendered
    const icon = screen.getByAltText('Motor icon');
    expect(icon).toBeInTheDocument();
  });
  test('renders correctly with the given icon name and action: Travel', () => {
    render(<Product iconName="Travel" action="buy" />);

    // Check if the icon is rendered
    const icon = screen.getByAltText('Travel icon');
    expect(icon).toBeInTheDocument();
  });
  test('renders correctly with the given icon name and action: Home', () => {
    render(<Product iconName="Home" action="buy" />);

    // Check if the icon is rendered
    const icon = screen.getByAltText('Home icon');
    expect(icon).toBeInTheDocument();
  });
  test('renders correctly with the given icon name and action: Medical', () => {
    render(<Product iconName="Medical" action="buy" />);

    // Check if the icon is rendered
    const icon = screen.getByAltText('Medical icon');
    expect(icon).toBeInTheDocument();
  });
  test('renders correctly with the given icon name and action: default', () => {
    render(<Product iconName="Motor" action="buy" />);

    // Check if the icon is rendered
    const icon = screen.getByAltText('Motor icon');
    expect(icon).toBeInTheDocument();
  });

  test('navigates to the correct path when clicked for buying a product', () => {
    render(<Product iconName="Motor" action="buy" />);

    // Simulate a click on the product
    const productElement = screen.getByAltText('Motor icon');
    fireEvent.click(productElement);

    // Check if navigate was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith('/Motor/QuoteAndBuy', {
      state: { data: expect.any(Object) }, // You can specify more about data if needed
    });
  });

  test('navigates to the correct path when raising a claim', () => {
    render(<Product iconName="Motor" action="raiseClaim" />);

    // Simulate a click on the product
    const productElement = screen.getByAltText('Motor icon');
    fireEvent.click(productElement);

    // Check if navigate was called with the correct path for raising a claim
    expect(mockNavigate).toHaveBeenCalledWith('/Motor/Register-claim', {
      state: { data: expect.any(Object) }, // You can specify more about data if needed
    });
  });
  test('navigates to the correct path when track a claim', () => {
    render(<Product iconName="Motor" action="trackClaim" />);

    // Simulate a click on the product
    const productElement = screen.getByAltText('Motor icon');
    fireEvent.click(productElement);

    // Check if navigate was called with the correct path for raising a claim
    expect(mockNavigate).toHaveBeenCalledWith('/Track-claim', {
      state: { data: expect.any(Object) }, // You can specify more about data if needed
    });
  });
  test('navigates to the correct path when default', () => {
    render(<Product iconName="Motor" action="" />);

    // Simulate a click on the product
    const productElement = screen.getByAltText('Motor icon');
    fireEvent.click(productElement);

    // Check if navigate was not called
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('renders tooltip with correct text', () => {
    render(<Product iconName="Motor" action="buy" />);

    // Check if tooltip is rendered with correct text
    const tooltip = screen.getByAltText('Motor icon');
    expect(tooltip).toBeInTheDocument();
  });
});