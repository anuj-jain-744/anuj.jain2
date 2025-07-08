import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock assets and hooks
jest.mock('assets/PolicyDocuments/download.svg', () => 'download.svg');
jest.mock('hook/common/useDocumentDownload', () => ({
  useDocumentDownload: jest.fn()
}));

// Mock accessPolicyDocumentTable BEFORE importing the component
jest.mock('constant', () => ({
  accessPolicyDocumentTable: {
    policy: ['doc1.pdf'],
    quotation: ['quote1.pdf'],
    claims: ['claim1.pdf']
  }
}));

// Mock DocumentSection to render buttons for each document
jest.mock('./DocumentSection', () => (props) => (
  <div>
    {props.documents.map((docName) => (
      <button
        key={docName}
        data-testid={`document-${docName}`}
        onClick={() => props.onDocumentClick(docName)}
      >
        {docName}
      </button>
    ))}
  </div>
));

import PolicyRelatedDocuments from './PolicyRelatedDocuments';

const mockUseDocumentDownload = require('hook/common/useDocumentDownload').useDocumentDownload;

const languageData = {
  policy_related_documents: 'Policy Related Documents',
  loading: 'Loading...',
  download_all_documents: 'Download All Documents'
};

const defaultProps = {
  languageData,
  policyNumber: 'PN123',
  quoteNumber: 'Q123',
  endorsementNo: 'E123',
  claimNumber: 'C123',
  subClaimNumber: 'SC123'
};

describe('PolicyRelatedDocuments Component', () => {
  beforeEach(() => {
    mockUseDocumentDownload.mockReturnValue({
      downloadingDocs: [],
      isDownloadDisabled: false,
      handleDocumentClick: jest.fn(),
      handleDownloadAll: jest.fn(),
      isProcessing: false,
      hasDocuments: true
    });
  });

  it('renders the component with sections and documents', () => {
    render(<PolicyRelatedDocuments {...defaultProps} />);
    expect(screen.getByText(languageData.policy_related_documents)).toBeInTheDocument();
    expect(screen.getByText(languageData.download_all_documents)).toBeInTheDocument();
    // Check that a document button is rendered
    expect(screen.getByTestId('document-doc1.pdf')).toBeInTheDocument();
  });

  it('disables download all button when isDownloadDisabled is true', () => {
    mockUseDocumentDownload.mockReturnValueOnce({
      downloadingDocs: [],
      isDownloadDisabled: true,
      handleDocumentClick: jest.fn(),
      handleDownloadAll: jest.fn(),
      isProcessing: false,
      hasDocuments: true
    });

    render(<PolicyRelatedDocuments {...defaultProps} />);

    // Use a more flexible matcher to locate the element
    const downloadAllButton = screen.queryByText((content, element) => {
      return element?.textContent === languageData.download_all_documents;
    });

    expect(downloadAllButton).toBeNull();
  });

  it('calls handleDownloadAll when download all button is clicked and not disabled', () => {
    const handleDownloadAllMock = jest.fn();
    mockUseDocumentDownload.mockReturnValueOnce({
      downloadingDocs: [],
      isDownloadDisabled: false,
      handleDocumentClick: jest.fn(),
      handleDownloadAll: handleDownloadAllMock,
      isProcessing: false,
      hasDocuments: true
    });
    render(<PolicyRelatedDocuments {...defaultProps} />);
    const downloadAllButton = screen.getByText(languageData.download_all_documents);
    fireEvent.click(downloadAllButton);
    expect(handleDownloadAllMock).toHaveBeenCalled();
  });

  it('calls handleDocumentClick when a document is clicked', () => {
    const handleDocumentClickMock = jest.fn();
    mockUseDocumentDownload.mockReturnValueOnce({
      downloadingDocs: [],
      isDownloadDisabled: false,
      handleDocumentClick: handleDocumentClickMock,
      handleDownloadAll: jest.fn(),
      isProcessing: false,
      hasDocuments: true
    });

    render(<PolicyRelatedDocuments {...defaultProps} />);
    const docButton = screen.getByTestId('document-doc1.pdf');
    fireEvent.click(docButton);
    expect(handleDocumentClickMock).toHaveBeenCalledWith('policy', 'doc1.pdf');
  });
});
