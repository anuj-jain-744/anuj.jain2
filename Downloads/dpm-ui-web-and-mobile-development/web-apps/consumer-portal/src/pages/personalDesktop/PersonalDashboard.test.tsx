import React from 'react';
import { render, screen } from '@testing-library/react';
import PersonalDashboard from './PersonalDashboard';
import { useDispatch } from 'react-redux';
import { useQueryQuote } from 'hook/dashboard/myRequests/useQueryQuote';
import { usePolicyDetails } from 'hook/dashboard/usePolicyDetails';
import { useQueryClaim } from 'hook/dashboard/myRequests/useQueryClaim';

// Mock child components
jest.mock('./MyPolicies/MyPoliciesContainer', () =>
  jest.fn(() => <div data-testid="mock-my-policies-container">My Policies</div>)
);
jest.mock('./PolicyBuy/DashboardBanner', () =>
  jest.fn(() => <div data-testid="mock-dashboard-banner">Dashboard Banner</div>)
);

// Mock hooks
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
jest.mock('hook/dashboard/myRequests/useQueryClaim', () => ({
  useQueryClaim: jest.fn(),
}));

// Mock slices and actions
const mockSetAuth = jest.fn();
const mockSetAuthLoading = jest.fn();
const mockSetAuthError = jest.fn();
const mockClearAuthData = jest.fn();
const mockSetqueryQuote = jest.fn();
const mockSetqueryQuoteLoading = jest.fn();
const mockSetqueryQuoteError = jest.fn();
const mockSetqueryClaims = jest.fn();
const mockSetqueryClaimsLoading = jest.fn();
const mockSetqueryClaimsError = jest.fn();
const mockSetPolicies = jest.fn();
const mockSetPolicyLoading = jest.fn();
const mockSetPolicyError = jest.fn();

jest.mock('@dpm/shared-module', () => ({
  slices: {
    auth: {
      setAuth: (...args) => mockSetAuth(...args),
      setAuthLoading: (...args) => mockSetAuthLoading(...args),
      setAuthError: (...args) => mockSetAuthError(...args),
      clearAuthData: (...args) => mockClearAuthData(...args),
    },
    queryQuoteSlice: {
      setqueryQuote: (...args) => mockSetqueryQuote(...args),
      setqueryQuoteLoading: (...args) => mockSetqueryQuoteLoading(...args),
      setqueryQuoteError: (...args) => mockSetqueryQuoteError(...args),
    },
    queryClaimSlice: {
      setqueryClaims: (...args) => mockSetqueryClaims(...args),
      setqueryClaimsLoading: (...args) => mockSetqueryClaimsLoading(...args),
      setqueryClaimsError: (...args) => mockSetqueryClaimsError(...args),
    },
    policySlices: {
      setPolicies: (...args) => mockSetPolicies(...args),
      setPolicyLoading: (...args) => mockSetPolicyLoading(...args),
      setPolicyError: (...args) => mockSetPolicyError(...args),
    },
  },
}));

describe('PersonalDashboard Component', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);

    (useQueryQuote as jest.Mock).mockReturnValue({
      data: { data: { model: { result: [] } } },
      isLoading: false,
      error: null,
    });

    (useQueryClaim as jest.Mock).mockReturnValue({
      data: { data: { claimList: [] } },
      isLoading: false,
      error: null,
    });

    (usePolicyDetails as jest.Mock).mockReturnValue({
      data: { data: { result: [] } },
      isLoading: false,
      error: null,
    });

    // Mock sessionStorage user details
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

  it('renders PersonalDashboard with child components', () => {
    render(<PersonalDashboard />);
    expect(screen.getByTestId('mock-dashboard-banner')).toBeInTheDocument();
    expect(screen.getByTestId('mock-my-policies-container')).toBeInTheDocument();
  });

  it('dispatches all expected actions on mount and effect', () => {
    render(<PersonalDashboard />);

    // Check that dispatch was called the expected number of times
    expect(mockDispatch).toHaveBeenCalledTimes(8);

    // Auth
    expect(mockSetAuth).toHaveBeenCalledWith(expect.objectContaining({
      userInfo: expect.objectContaining({ userId: '12345' }),
      authDetails: expect.any(Object),
    }));

    // QueryQuote
    expect(mockSetqueryQuoteLoading).toHaveBeenCalledWith(false);
    expect(mockSetqueryQuote).toHaveBeenCalledWith([]);
    expect(mockSetqueryQuoteError).not.toHaveBeenCalled();

    // QueryClaim
    expect(mockSetqueryClaimsLoading).toHaveBeenCalledWith(false);
    expect(mockSetqueryClaims).toHaveBeenCalledWith([]);
    expect(mockSetqueryClaimsError).not.toHaveBeenCalled();

    // Policy
    expect(mockSetPolicyLoading).toHaveBeenCalledWith(false);
    expect(mockSetPolicies).toHaveBeenCalledWith([]);
  });

  it('handles error states in hooks', () => {
    (useQueryQuote as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: { message: 'Quote error' },
    });
    (useQueryClaim as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: { message: 'Claim error' },
    });
    (usePolicyDetails as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: { message: 'Policy error' },
    });

    render(<PersonalDashboard />);

    expect(mockSetqueryQuoteError).toHaveBeenCalledWith('Quote error');
    expect(mockSetqueryClaimsError).toHaveBeenCalledWith('Claim error');
    expect(mockSetPolicyError).toHaveBeenCalledWith('Policy error');
  });

  it('handles loading states in hooks', () => {
    (useQueryQuote as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });
    (useQueryClaim as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });
    (usePolicyDetails as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(<PersonalDashboard />);

    expect(mockSetqueryQuoteLoading).toHaveBeenCalledWith(true);
    expect(mockSetqueryClaimsLoading).toHaveBeenCalledWith(true);
    expect(mockSetPolicyLoading).toHaveBeenCalledWith(true);
  });

  it('does not crash if userDetails is missing in sessionStorage', () => {
    sessionStorage.removeItem('userDetails');
    expect(() => render(<PersonalDashboard />)).not.toThrow();
    expect(screen.getByTestId('mock-dashboard-banner')).toBeInTheDocument();
    expect(screen.getByTestId('mock-my-policies-container')).toBeInTheDocument();
  });
});
