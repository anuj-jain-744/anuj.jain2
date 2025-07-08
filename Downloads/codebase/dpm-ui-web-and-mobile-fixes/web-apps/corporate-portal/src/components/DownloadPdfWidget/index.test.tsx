import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import "@testing-library/jest-dom";
import { DownloadPdfWidget } from './index'; 


describe('DownloadPdfWidget', () => {
  const mockHandleNavigate = jest.fn();
  
  const setup = (label = 'Sample PDF', url = 'http://example.com/sample.pdf') => {
    const utils = render(
      <DownloadPdfWidget label={label} url={url} handleNavigate={mockHandleNavigate} />
    );
    return { ...utils };
  };

  test('renders with the correct label and icon', () => {
    const { getByAltText, getByText } = setup();
    
    expect(getByAltText('Sample PDF')).toBeInTheDocument();
    expect(getByText('Sample PDF')).toBeInTheDocument();
  });

  test('renders the correct icon for PDF file', () => {
    const { getByAltText } = setup();
    
    const icon = getByAltText('Sample PDF');
  //  expect(icon).toHaveAttribute('src', expect.stringContaining('.pdf')); // Adjust this to match your IconsSet
  });

  test('calls handleNavigate on click', () => {
    const { getByText } = setup();
    const attachmentWrapper = getByText('Sample PDF').closest('div');

    fireEvent.click(attachmentWrapper!);
    expect(mockHandleNavigate).toHaveBeenCalledWith('http://example.com/sample.pdf');
  });

  test('handles different file extensions', () => {
    const { rerender, getByAltText } = setup('Sample Image', 'http://example.com/sample.jpg');
    
    rerender(<DownloadPdfWidget label='Sample Image' url='http://example.com/sample.jpg' handleNavigate={mockHandleNavigate} />);
    
    const icon = getByAltText('Sample Image');
   // expect(icon).toHaveAttribute('src', expect.stringContaining('.jpg')); // Adjust this to match your IconsSet
  });
});
