// CancelSuccessLeft.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CancelSuccessLeft from '.'; // Adjust the path as necessary
import { useApiCall } from '@dpm/shared-module';
import { formatDate } from 'utils/formatDate';

// Mocking the imported modules
jest.mock('@dpm/shared-module', () => ({
  useApiCall: jest.fn(),
}));

jest.mock('utils/formatDate', () => ({
  formatDate: jest.fn(),
}));

// Mock static assets (you can mock them or use empty mocks)
jest.mock('assets/SuccessPage/Line_new.svg', () => 'Line.svg');
jest.mock('assets/SuccessPage/Nissan.svg', () => 'Nissan.svg');
jest.mock('assets/SuccessPage/Download.svg', () => 'Download.svg');

describe('CancelSuccessLeft', () => {
  const mockPolicyData = {
    policyNumber: 'POLICY12345',
    vehicleDetails: {
      name: 'Nissan X-Trail',
      plateNumber: 'ABC1234',
      vehicleSequenceNo: 'V123456',
      chassisNo: 'C1234567890',
      manufactureYear: 2020,
    },
    refundValue: '500',
  };

  const mockLanguageData = {
    policy_number: 'Policy Number',
    cancellation_date: 'Cancellation Date',
    policy_status: 'Policy Status',
    refund_amount: 'Refund Amount',
    download_document: 'Download Document',
    note: 'Note',
    refund_process: 'Refund process details.',
  };

  beforeEach(() => {
    // Mock the API call response
    (useApiCall as jest.Mock).mockReturnValue({
      makeApiCall: jest.fn(),
      data: { config: [mockLanguageData] },
      error: null,
    });

    // Mock the formatDate function
    (formatDate as jest.Mock).mockReturnValue('2025-03-26');
  });

  test('renders the policy data correctly', async () => {
    render(<CancelSuccessLeft policyData={mockPolicyData} isCancelSuccess={true} />);

    // Verify that the vehicle details are rendered correctly
    expect(screen.getByText('Nissan X-Trail')).toBeInTheDocument();
    expect(screen.getByText('ABC1234')).toBeInTheDocument();

    // Verify that the policy number is rendered correctly
    expect(screen.getByText('Policy Number')).toBeInTheDocument();
    expect(screen.getByText(mockPolicyData.policyNumber)).toBeInTheDocument();

    // Verify that the cancellation date is formatted correctly
    expect(screen.getByText('Cancellation Date')).toBeInTheDocument();
    expect(screen.getByText('2025-03-26')).toBeInTheDocument();

    // Verify that the refund amount is rendered
    expect(screen.getByText('Refund Amount')).toBeInTheDocument();
    expect(screen.getByText(mockPolicyData.refundValue)).toBeInTheDocument();

    // Verify the policy status is rendered as "Cancelled" (since isCancelSuccess is true)
    expect(screen.getByText('Policy Status')).toBeInTheDocument();
    expect(screen.getByText('Cancelled')).toBeInTheDocument();

    // Check the "Download Document" link
    expect(screen.getByText('Download Document')).toBeInTheDocument();
  });

  test('handles "Active" policy status when isCancelSuccess is false', async () => {
    render(<CancelSuccessLeft policyData={mockPolicyData} isCancelSuccess={false} />);

    // Verify that the policy status is rendered as "Active"
    expect(screen.getByText('Policy Status')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  test('displays footer note and refund process', async () => {
    render(<CancelSuccessLeft policyData={mockPolicyData} isCancelSuccess={true} />);

    // Verify that the footer note and refund process are rendered correctly
    expect(screen.getByText('Note')).toBeInTheDocument();
    expect(screen.getByText('Refund process details.')).toBeInTheDocument();
  });

  test('makes API call on mount', async () => {
    render(<CancelSuccessLeft policyData={mockPolicyData} isCancelSuccess={true} />);

    // Ensure the API call was made (the makeApiCall function was called)
    expect(useApiCall).toHaveBeenCalledTimes(8);
  });
});
