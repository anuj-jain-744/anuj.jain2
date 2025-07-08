import React from 'react';
import { render, screen } from '@testing-library/react';
import PolicyStatus from './PolicyStatus';

describe('PolicyStatus Component', () => {
  it('renders correctly with the provided confirmed prop', () => {
    render(<PolicyStatus confirmed="Active" />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders the default value when confirmed prop is undefined', () => {
    render(<PolicyStatus confirmed={undefined} />);
    expect(screen.getByText('Confirmed')).toBeInTheDocument();
  });

  it('renders the custom value passed via confirmed prop', () => {
    render(<PolicyStatus confirmed="Pending" />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('has accessible attributes for the rendered elements', () => {
    render(<PolicyStatus confirmed="Accessible Test" />);
    const label = screen.getByText('Accessible Test');
    expect(label).toBeTruthy();
    expect(label).toHaveClass('walaa-medium-500 policy-status-text-label');
  });
});