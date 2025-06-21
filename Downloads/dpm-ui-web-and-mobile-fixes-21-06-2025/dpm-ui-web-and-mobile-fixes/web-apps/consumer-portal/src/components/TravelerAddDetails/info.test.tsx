import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Info from './info';

describe('Info Component', () => {
  const popUpData = "<h1>Header</h1><p>Body text</p>";

  test('renders InfoOutlinedIcon', () => {
    const { getByTestId } = render(<Info popUpData={popUpData} />);
    const icon = getByTestId('info-icon');
    expect(icon).toBeInTheDocument();
  });

  test('shows modal with correct content on icon click', () => {
    const { getByTestId, queryByTestId } = render(<Info popUpData={popUpData} />);
    const icon = getByTestId('info-icon');
    
    // Modal should not be visible initially
    expect(queryByTestId('info-head')).not.toBeInTheDocument();
    expect(queryByTestId('info-body')).not.toBeInTheDocument();

    // Simulate click event
    fireEvent.click(icon);

    // Modal should be visible after click
    const modalHeader = getByTestId('info-head');
    const modalBody = getByTestId('info-body');
    expect(modalHeader).toBeInTheDocument();
    expect(modalBody).toBeInTheDocument();

    // Check modal content
    expect(modalHeader).toHaveTextContent('Header');
    expect(modalBody).toHaveTextContent('Body text');
  });
});