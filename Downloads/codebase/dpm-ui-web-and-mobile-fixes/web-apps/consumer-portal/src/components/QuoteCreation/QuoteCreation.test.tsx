import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QuoteCreation from './index';
import { useApiCall } from '@dpm/shared-module';
import { useQuotationDocuments } from 'hook/common/usePrintDoc';
import { useDownloadPDF } from 'hook/common/useDownloadPdf';

// Mock the hooks
jest.mock('@dpm/shared-module', () => ({
  useApiCall: jest.fn(),
}));

jest.mock('hook/common/usePrintDoc', () => ({
  useQuotationDocuments: jest.fn(),
}));

jest.mock('hook/common/useDownloadPdf', () => ({
  useDownloadPDF: jest.fn(),
}));

describe('QuoteCreation Component', () => {
  const mockCmsCall = jest.fn();
  const mockProcessPDFs = jest.fn();

  beforeEach(() => {
    // Mock useApiCall for payment config
    (useApiCall as jest.Mock).mockReturnValue({
      makeApiCall: mockCmsCall,
      data: { config: { field_quotation_no: 'Quotation No', endoRequestReferenceNo: 'Reference No' } },
    });

    // Mock useQuotationDocuments to return docs without error
    (useQuotationDocuments as jest.Mock).mockReturnValue({
      data: [{ fileName: 'test.pdf', model: 'base64string' }],
      error: null,
      isError: false,
    });

    // Mock useDownloadPDF hook
    (useDownloadPDF as jest.Mock).mockReturnValue({
      processPDFs: mockProcessPDFs,
    });

    jest.clearAllMocks();
  });

  test('renders QuoteCreation and triggers PDF download', async () => {
    render(<QuoteCreation quotationNum="12345" isPaymentPage={true} isQuote={true} />);

    // Check quotation number label and number rendered
    expect(screen.getByText(/Quotation No:/)).toBeInTheDocument();
    expect(screen.getByText('12345')).toBeInTheDocument();

    // Click to trigger download
    fireEvent.click(screen.getByText('12345'));

    await waitFor(() => {
      expect(mockProcessPDFs).toHaveBeenCalledWith(
        [{ fileName: 'test.pdf', model: 'base64string' }],
        { format: 'pdf', autoDownload: true }
      );
    });
  });

  test('shows alert box if processPDFs throws error', async () => {
    mockProcessPDFs.mockImplementation(() => {
      throw new Error('PDF processing failed');
    });

    render(<QuoteCreation quotationNum="12345" isPaymentPage={true} isQuote={true} />);

    fireEvent.click(screen.getByText('12345'));

    // The alert modal should appear with the error message
    await waitFor(() => {
      expect(screen.getByText('Payment')).toBeInTheDocument(); // AlertBox title
      expect(screen.getByText('Error processing PDFs.')).toBeInTheDocument();
    });
  });

  test('shows alert box if quotation documents API returns error', async () => {
    (useQuotationDocuments as jest.Mock).mockReturnValue({
      data: null,
      error: { messageEn: 'Failed to load documents' },
      isError: true,
    });

    render(<QuoteCreation quotationNum="12345" isPaymentPage={true} isQuote={true} />);

    fireEvent.click(screen.getByText('12345'));

    await waitFor(() => {
      expect(screen.getByText('Payment')).toBeInTheDocument();
      expect(screen.getByText('Failed to load documents')).toBeInTheDocument();
    });
  });

  test('renders reference number instead of quotation number when isQuote is false', () => {
    render(<QuoteCreation quotationNum="54321" isPaymentPage={true} isQuote={false} />);

    expect(screen.getByText(/Reference No:/)).toBeInTheDocument();
    expect(screen.getByText('54321')).toBeInTheDocument();
  });

  test('does not render payment section when isPaymentPage is false', () => {
    render(<QuoteCreation quotationNum="12345" isPaymentPage={false} isQuote={true} />);

    expect(screen.queryByText(/Quotation No:/)).not.toBeInTheDocument();
    expect(screen.queryByText('12345')).not.toBeInTheDocument();
  });
});
