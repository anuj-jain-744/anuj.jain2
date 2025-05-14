import React from 'react';
import { render, screen } from '@testing-library/react';
import UploadButton from './UploadButton';
import { LanguageData } from 'types/languageData';

describe('UploadButton Component', () => {
  const mockLanguage: LanguageData = {
    upload_docs: 'Upload Document',
  };

  const mockFileInputRef = React.createRef<HTMLInputElement>();
  const mockHandleFileChange = jest.fn();

  beforeEach(() => {
    render(
      <UploadButton
        language={mockLanguage}
        fileInputRef={mockFileInputRef}
        handleFileChange={mockHandleFileChange}
      />
    );
  });

  test('renders upload button with correct text', () => {
    expect(screen.getByText('Upload Document')).toBeInTheDocument();
  });

  test('renders upload icon', () => {
    expect(screen.getByAltText('Upload icon')).toBeInTheDocument();
  });

  test('sets correct file input properties', () => {
    const fileInput = screen.getByTestId('file-input');

    expect(fileInput).toHaveAttribute('type', 'file');
    expect(fileInput).toHaveAttribute('multiple');
    expect(fileInput).toHaveAttribute('accept', '.pdf,.doc,.docx,.jpeg,.jpg,.png');
});
});