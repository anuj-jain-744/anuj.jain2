import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PersonalDashboard from './PersonalDashboard'; // Adjust the import path as necessary
import { useDispatch } from 'react-redux';
import { useQueryQuote } from 'hook/dashboard/myRequests/useQueryQuote';
import { usePolicyDetails } from 'hook/dashboard/usePolicyDetails';
import * as reactRedux from 'react-redux';

// Mocking child components
jest.mock('./MyPolicies/MyPoliciesContainer', () => {
  return jest.fn(() => <div data-testid="mock-my-policies-container">My Policies</div>);
});

jest.mock('./PolicyBuy/DashboardBanner', () => {
  return jest.fn(() => <div data-testid="mock-dashboard-banner">Dashboard Banner</div>);
});

// Mocking hooks
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('hook/dashboard/myRequests/useQueryQuote', () => ({
  useQueryQuote: jest.fn(),
}));

jest.mock('hook/dashboard/usePolicyDetails', () => ({
  usePolicyDetails: jest.fn(),
}));

describe('PersonalDashboard Component', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mocking useDispatch to return the mock function
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);

    // Mocking the return values for useQueryQuote and usePolicyDetails
    (useQueryQuote as jest.Mock).mockReturnValue({
      data: { data: { model: { result: [] } } },
      isLoading: false,
      error: null,
    });

    (usePolicyDetails as jest.Mock).mockReturnValue({
      data: { data: { result: [] } },
      isLoading: false,
      error: null,
    });

    // Mocking user details in sessionStorage
    const userDetails = JSON.stringify({
      userProfileData: {
        userId: '12345',
        name: 'John Doe',
      },
      message: 'Success',
      isValid: true,
      referenceNo: 'ref-123',
      sessionSecretId: 'secret-123',
    });
    
    sessionStorage.setItem('userDetails', userDetails);
  });

  test('renders PersonalDashboard with child components', () => {
    render(<PersonalDashboard />);

    expect(screen.getByTestId('mock-dashboard-banner')).toBeInTheDocument();

    expect(screen.getByTestId('mock-my-policies-container')).toBeInTheDocument();
  });

  test('dispatches actions on mount', () => {
    render(<PersonalDashboard />);

    expect(mockDispatch).toHaveBeenCalledTimes(6);

  });
});
