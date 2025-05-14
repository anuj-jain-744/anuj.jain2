import React from 'react';
import { render } from '@testing-library/react';
import { PaySuccess } from './PaySuccess';
import { DataContext } from '../../../DataContext';

test('renders PaySuccess component', () => {
  const mockData = null;
  
  const { getByText } = render(
    <DataContext.Provider value={mockData}>
      <PaySuccess />
    </DataContext.Provider>
  );

  expect(getByText('Success')).toBeInTheDocument();
  expect(getByText('Successfully added WL-456789-23.')).toBeInTheDocument();
  expect(getByText('Sponsor ID')).toBeInTheDocument();
  expect(getByText('2127664478')).toBeInTheDocument();
  expect(getByText('Date of Birth')).toBeInTheDocument();
  expect(getByText('14/11/1988')).toBeInTheDocument();
  expect(getByText('Model Type')).toBeInTheDocument();
  expect(getByText('Nissan Patrol XE')).toBeInTheDocument();
  expect(getByText('Vehicle Sequence')).toBeInTheDocument();
  expect(getByText('8754562340')).toBeInTheDocument();
  expect(getByText('Note')).toBeInTheDocument();
  expect(getByText('To avoid request cancellation')).toBeInTheDocument();
  expect(getByText('Endorsement Schedule')).toBeInTheDocument();
  expect(getByText('Payment Receipt')).toBeInTheDocument();
  expect(getByText('Subscribe to DLI related')).toBeInTheDocument();
  expect(getByText('Regular Inspection')).toBeInTheDocument();
  expect(getByText('Roadside Assistance')).toBeInTheDocument();
  expect(getByText('Car Wash')).toBeInTheDocument();
  expect(getByText('Explore other insurance products')).toBeInTheDocument();
  expect(getByText('Back to Endorsement')).toBeInTheDocument();
});