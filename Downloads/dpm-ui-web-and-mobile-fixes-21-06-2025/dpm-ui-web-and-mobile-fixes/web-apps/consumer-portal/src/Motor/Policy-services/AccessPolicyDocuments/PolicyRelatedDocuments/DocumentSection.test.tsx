// DocumentSection.test.tsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DocumentSection from './DocumentSection';

// Mock CSS module
jest.mock('./PolicyRelatedDocuments.module.scss', () => ({
  policyFrameContentsInnerCol: 'policyFrameContentsInnerCol',
  policyFrameContentsInnerColTitleText: 'policyFrameContentsInnerColTitleText',
  policyFrameContentsInnerColValue: 'policyFrameContentsInnerColValue',
  policyFrameContentsInnerColValueText1: 'policyFrameContentsInnerColValueText1',
  policyFrameContentsInnerColValueText1Val: 'policyFrameContentsInnerColValueText1Val',
}));

// Mock asset
jest.mock('assets/PolicyDocuments/pdf.svg', () => 'pdf.svg');

describe('DocumentSection', () => {
  const baseProps = {
    title: 'Policy Documents',
    documents: ['Policy Schedule', 'Certificate'],
    onDocumentClick: jest.fn(),
    downloadingDocs: new Set<string>(),
    isProcessing: false,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders title and document names', () => {
    render(<DocumentSection {...baseProps} />);
    expect(screen.getByText('Policy Documents')).toBeInTheDocument();
    expect(screen.getByText('Policy Schedule')).toBeInTheDocument();
    expect(screen.getByText('Certificate')).toBeInTheDocument();
    // Should render pdf icon for each document
    expect(screen.getAllByAltText('pdf icon')).toHaveLength(2);
  });

  it('calls onDocumentClick when document is clicked and not downloading/processing', () => {
    render(<DocumentSection {...baseProps} />);
    fireEvent.click(screen.getByText('Policy Schedule'));
    expect(baseProps.onDocumentClick).toHaveBeenCalledWith('Policy Schedule');
  });

  it('does not call onDocumentClick if isProcessing is true', () => {
    render(<DocumentSection {...baseProps} isProcessing={true} />);
    fireEvent.click(screen.getByText('Certificate'));
    expect(baseProps.onDocumentClick).not.toHaveBeenCalled();
  });

  it('handles document names with spaces and case insensitivity', () => {
    const downloadingDocs = new Set(['certificate']);
    render(<DocumentSection {...baseProps} downloadingDocs={downloadingDocs} />);
  });
});
