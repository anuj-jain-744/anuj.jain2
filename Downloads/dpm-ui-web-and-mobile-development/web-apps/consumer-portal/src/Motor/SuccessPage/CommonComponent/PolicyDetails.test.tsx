import React from 'react';
import { render, screen } from '@testing-library/react';
import PolicyDetails from './PolicyDetails'; // Adjust the import path accordingly
import { CURRENCY } from '../../../constant'; 
import { getAmountText } from '@dpm/shared-module';

// Mock the getAmountText function
jest.mock('@dpm/shared-module', () => ({
  getAmountText: jest.fn(),
}));

describe('PolicyDetails Component', () => {
  const mockLanguageData = {
    policy_no: 'Policy Number',
    premium_amount: 'Premium Amount',
    policy_period: 'Policy Period',
    coverage_plan: 'Coverage Plan',
    confirmed: 'Confirmed',
  };

  const mockPolicyData = {
    premiumAmount: 1000,
    coverageName: 'Full Coverage',
  };

  const mockPolicyNum = '12345';
  const mockPolicyPeriod = '1 Year';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders PolicyDetails with correct data', () => {
    // Mock the getAmountText function to return a formatted value
    getAmountText.mockReturnValue('1,000');

    render(
      <PolicyDetails
        languageData={mockLanguageData}
        policyNum={mockPolicyNum}
        policyData={mockPolicyData}
        policyPeriod={mockPolicyPeriod}
      />
    );

    // Check if the policy number is rendered correctly
    expect(screen.getByText(/Policy Number/i)).toBeInTheDocument();
    expect(screen.getByText(mockPolicyNum)).toBeInTheDocument();

    // Check if the premium amount is rendered correctly
    expect(screen.getByText(/Premium Amount/i)).toBeInTheDocument();
    expect(screen.getByText(`${CURRENCY} 1,000`)).toBeInTheDocument();

    // Check if the policy period is rendered correctly
    expect(screen.getByText(/Policy Period/i)).toBeInTheDocument();
    expect(screen.getByText(mockPolicyPeriod)).toBeInTheDocument();

    // Check if the PolicyStatus component renders with the correct confirmed status
    expect(screen.getByText(mockLanguageData.confirmed)).toBeInTheDocument();
  });

  test('should call getAmountText correctly for premium amount', () => {
    // Mock the getAmountText function
    getAmountText.mockReturnValue('1,000');

    render(
      <PolicyDetails
        languageData={mockLanguageData}
        policyNum={mockPolicyNum}
        policyData={mockPolicyData}
        policyPeriod={mockPolicyPeriod}
      />
    );

    // Verify that getAmountText was called with the correct premiumAmount
    expect(getAmountText).toHaveBeenCalledWith(mockPolicyData.premiumAmount);
  });

});
