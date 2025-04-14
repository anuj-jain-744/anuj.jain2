import React from 'react';
import { render, screen } from '@testing-library/react';
import PolicyStatus from './PolicyStatus'; // Adjust the import path accordingly

describe('PolicyStatus Component', () => {
  test('renders with the passed confirmed value', () => {
    const confirmedText = 'Policy Confirmed';

    render(<PolicyStatus confirmed={confirmedText} />);

    // Check if the text passed as confirmed is rendered correctly
    expect(screen.getByText(confirmedText)).toBeInTheDocument();
  });


  test('renders default value "Confirmed" when confirmed prop is undefined', () => {
    render(<PolicyStatus confirmed={undefined} />);  // Passing undefined

    // Check if the default value 'Confirmed' is displayed when confirmed is undefined
    expect(screen.getByText('Confirmed')).toBeInTheDocument();
  });
});
