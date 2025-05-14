import React from 'react';
import { render } from '@testing-library/react';
import Status from '../Status/Status';
import { useClaimContext } from 'Motor/ClaimHooks/useClaimContext';

// Mock the useClaimContext hook
jest.mock('Motor/ClaimHooks/useClaimContext', () => ({
  useClaimContext: jest.fn(),
}));

describe('Status Component', () => {
  it('renders correctly with given props', () => {
    useClaimContext.mockReturnValue({
      trackClaimInfo: { motor_claim_no: '12345', status: 'Processing', current_status: 'Under Review' },
      trackNewData: { currentStatus: 'Status' },
    });

    const { getByText, getByAltText } = render(
      <Status claimNumber="12345" currentStatus="Under Review" />
    );

    expect(getByText('12345')).toBeInTheDocument(); // Check claim number
    expect(getByText('Processing')).toBeInTheDocument(); // Check claim status
    expect(getByText('Under Review')).toBeInTheDocument(); // Check current status
    expect(getByAltText('claimRegister icon')).toBeInTheDocument(); // Check claim register icon
    expect(getByAltText('warning icon')).toBeInTheDocument(); // Check warning icon
  });
});
