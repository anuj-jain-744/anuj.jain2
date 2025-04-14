import React from 'react';
import { render } from '@testing-library/react';
import PolicyCard from '../PolicyCard';

describe('PolicyCard', () => {
  it('renders correctly with given props', () => {
    const props = {
      policyNumber: '123456',
      startDate: '2023-01-01',
      expiryDate: '2023-12-31',
      policyNo: 'POL123',
      coverageName: 'Travel Insurance',
      policyPeriod: 'Annual',
      travelTypeLabel: 'Travel Type',
      travelType: 'Business'
    };

    const { getByText, getByAltText } = render(<PolicyCard {...props} />);

    expect(getByText('POL123')).toBeInTheDocument();
    expect(getByText('123456')).toBeInTheDocument();
    expect(getByText('Travel Insurance')).toBeInTheDocument();
    expect(getByText('Annual')).toBeInTheDocument();
    expect(getByText('2023-01-01 - 2023-12-31')).toBeInTheDocument();
    expect(getByText('Travel Type')).toBeInTheDocument();
    expect(getByText('Business')).toBeInTheDocument();
    expect(getByAltText('Flight Logo')).toBeInTheDocument();
  });
});