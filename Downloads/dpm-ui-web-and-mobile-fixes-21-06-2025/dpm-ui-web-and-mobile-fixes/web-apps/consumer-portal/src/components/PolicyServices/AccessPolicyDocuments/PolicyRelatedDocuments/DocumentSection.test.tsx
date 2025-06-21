import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DocumentSection from './DocumentSection';
import { openPdfInNewTab } from 'utils/policyDocuments';

jest.mock('utils/policyDocuments', () => ({
  openPdfInNewTab: jest.fn(),
}));

jest.mock('assets/PolicyDocuments/pdf.svg', () => 'mock-pdf-icon');

describe('DocumentSection', () => {
  const mockDocuments = [
    { id: '1', name: 'Document 1', document: 'doc1' },
    { id: '2', name: 'Document 2', document: 'doc2' },
  ];

  it('renders correctly with title and documents', () => {
    render(<DocumentSection title="Rabindra" documents={mockDocuments} />);

    expect(screen.getByText('Rabindra')).toBeInTheDocument();
    expect(screen.getByText('Document 1')).toBeInTheDocument();
    expect(screen.getByText('Document 2')).toBeInTheDocument();
    expect(screen.getAllByAltText('pdf icon')).toHaveLength(2);
  });

  it('calls handleDownload when a document is clicked', () => {
    render(<DocumentSection title="Rabindra" documents={mockDocuments} />);

    fireEvent.click(screen.getByText('Document 1'));
    expect(openPdfInNewTab).toHaveBeenCalledWith('doc1', 'Document 1');

    fireEvent.click(screen.getByText('Document 2'));
    expect(openPdfInNewTab).toHaveBeenCalledWith('doc2', 'Document 2');
  });
});