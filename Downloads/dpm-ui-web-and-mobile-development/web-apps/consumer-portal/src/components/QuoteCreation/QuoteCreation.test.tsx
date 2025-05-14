import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QuoteCreation from './index';
import { useApiCall } from '@dpm/shared-module';
import useZipFiles from 'Motor/Policy-services/AccessPolicyDocuments/hooks/useZipFiles';

// Mock the useApiCall hook
jest.mock('@dpm/shared-module', () => ({
  useApiCall: jest.fn(),
}));

// Mock the useZipFiles hook
jest.mock('Motor/Policy-services/AccessPolicyDocuments/hooks/useZipFiles', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('QuoteCreation Component', () => {
  const mockCmsCall = jest.fn();
  const mockPdfDownload = jest.fn();
  const mockCreateZip = jest.fn();

  beforeEach(() => {
    (useApiCall as jest.Mock).mockReturnValue({
      makeApiCall: mockCmsCall,
      data: { config: { field_quotation_no: 'Quotation No' } },
    });

    (useApiCall as jest.Mock).mockReturnValueOnce({
      makeApiCall: mockPdfDownload,
      data: [{ fileName: 'test', model: 'base64string' }],
      errors: null,
    });

    (useZipFiles as jest.Mock).mockReturnValue({
      createZip: mockCreateZip,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders QuoteCreation component and handles download', async () => {
    render(<QuoteCreation quotationNum="12345" isPaymentPage={true} />);

    // Check if the quotation number is rendered
    expect(screen.getByText('Quotation No:')).toBeInTheDocument();
    expect(screen.getByText('12345')).toBeInTheDocument();

    // Simulate click on the quotation number to trigger download
    fireEvent.click(screen.getByText('12345'));

    // Wait for the API call to be made
    await waitFor(() => expect(mockPdfDownload).toHaveBeenCalled());
  });

  test('shows alert box on API error', async () => {
    (useApiCall as jest.Mock).mockReturnValueOnce({
      makeApiCall: mockPdfDownload,
      data: null,
      errors: { message: 'Error' },
    });

    render(<QuoteCreation quotationNum="12345" isPaymentPage={true} isQuote={false} />);

    // Simulate click on the quotation number to trigger download
    fireEvent.click(screen.getByText('12345'));

    // Wait for the API call to be made
    await waitFor(() => expect(mockPdfDownload).toHaveBeenCalled());

    // Check if the alert box is shown
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('An error occurred while fetching the data')).toBeInTheDocument();
  });

  test('shows alert box on API error with payment false', async () => {
    (useApiCall as jest.Mock).mockReturnValueOnce({
      makeApiCall: mockPdfDownload,
      data: null,
      errors: { message: 'Error' },
    });

    render(<QuoteCreation quotationNum="12345" isPaymentPage={false} isQuote={false} />);

    // Check if the alert box is shown
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('An error occurred while fetching the data')).toBeInTheDocument();
  });
});