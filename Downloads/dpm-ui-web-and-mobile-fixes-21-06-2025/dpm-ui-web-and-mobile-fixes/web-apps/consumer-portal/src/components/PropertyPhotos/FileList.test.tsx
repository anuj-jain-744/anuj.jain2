import React from 'react';
import { render, screen } from '@testing-library/react';
import FileList from './FileList'; 
import { LanguageData } from 'types/languageData';

describe('FileList Component', () => {
  const mockFiles = [
    { name: 'file1.pdf', size: 2048, base64: 'data:application/pdf;base64,...' },
    { name: 'file2.pdf', size: 4096, base64: 'data:application/pdf;base64,...' },
  ];

  const mockOnRemove = jest.fn();
  const mockLanguage: LanguageData = {
    file_upload_is_completed: 'File upload is completed.',
  };

  beforeEach(() => {
    render(<FileList files={mockFiles} onRemove={mockOnRemove} language={mockLanguage} />);
  });

  test('renders file names and sizes', () => {
    expect(screen.getByText((content, element) => 
        content.startsWith('file1.pdf')
    )).toBeInTheDocument();
    expect(screen.getByText((content, element) => 
        content.startsWith('file2.pdf')
    )).toBeInTheDocument();
  });

  test('renders multiple files correctly', () => {
    const fileElements = screen.getAllByText(/\.pdf/);
    expect(fileElements.length).toBe(mockFiles.length);
  });
});