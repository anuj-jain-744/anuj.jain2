import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProductTooltip } from './index';

const mockHeaderItem = {
  title: 'Test Title',
  tooltip: 'This is a <b>test</b> tooltip'
};

describe('ProductTooltip', () => {
  test('renders the ProductTooltip component', () => {
    render(<ProductTooltip headerItem={mockHeaderItem} />);
    
    // Check if InfoOutlinedIcon is rendered
    expect(screen.getByTestId('InfoOutlinedIcon')).toBeInTheDocument();
  });

  test('opens modal with correct content on InfoOutlinedIcon click', () => {
    render(<ProductTooltip headerItem={mockHeaderItem} />);
    
    // Click the InfoOutlinedIcon
    fireEvent.click(screen.getByTestId('InfoOutlinedIcon'));

    // Check if modal is displayed
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Check if modal content is correct
    expect(screen.getByTestId('tooltip-title')).toHaveTextContent(mockHeaderItem.title);
    expect(screen.getByTestId('tooltip-data')).toContainHTML(mockHeaderItem.tooltip.replaceAll('\n','<br />'));
  });

  test('closes modal on close icon click', () => {
    render(<ProductTooltip headerItem={mockHeaderItem} />);
    
    // Click the InfoOutlinedIcon to open the modal
    fireEvent.click(screen.getByTestId('InfoOutlinedIcon'));
    
    // Click the close icon
    fireEvent.click(screen.getByTestId('img-role'));

  });
});
