import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ShowPhoto from './ShowPhoto';

const mockFiles = [
  { name: 'file1.png', size: 1234, base64: 'data:image/png;base64,abcd' },
  { name: 'file2.jpg', size: 5678, base64: 'data:image/jpeg;base64,efgh' },
];

const mockOnRemove = jest.fn();

describe('ShowPhoto Component', () => {
  test('renders images correctly', () => {
    render(<ShowPhoto files={mockFiles} onRemove={mockOnRemove} />);

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(mockFiles.length);
    expect(images[0]).toHaveAttribute('src',"test-file-stub");
    expect(images[1]).toHaveAttribute('src',"test-file-stub");
  });

  test('calls onRemove with correct index when delete button is clicked', () => {
    render(<ShowPhoto files={mockFiles} onRemove={mockOnRemove} />);

    const deleteButtons = screen.getAllByRole('button');
    fireEvent.click(deleteButtons[0]);
    expect(mockOnRemove).toHaveBeenCalledWith(0);

    fireEvent.click(deleteButtons[1]);
    expect(mockOnRemove).toHaveBeenCalledWith(1);
  });
});