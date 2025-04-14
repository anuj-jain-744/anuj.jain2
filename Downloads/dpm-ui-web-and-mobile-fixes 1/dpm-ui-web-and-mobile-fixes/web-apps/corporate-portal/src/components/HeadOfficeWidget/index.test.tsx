import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HeadOfficeWidget } from './index';

const mockData = {
  head_office_label: 'Head Office',
  callus_label: 'Call Us',
  phone: '123-456-7890',
  email_label: 'Email Us',
  email: 'info@example.com',
  working_hours_label: 'Working Hours',
  working_hours_single: 'Mon-Fri 9am-6pm',
  working_hours: 'Mon-Fri 9am-6pm<br>Sat 10am-4pm',
  workschedule_label: 'Working Days',
  working_days: 'Mon-Fri',
  address_label: 'Address',
  address: '123 Main St, City, Country'
};

describe('HeadOfficeWidget', () => {
  test('renders HeadOfficeWidget with data', () => {
    render(<HeadOfficeWidget data={mockData} />);
    
    // Check if all labels and content are rendered correctly
    expect(screen.getByTestId('head-label')).toHaveTextContent(mockData.head_office_label);
    expect(screen.getByTestId('phone')).toHaveTextContent(mockData.phone);
    expect(screen.getByTestId('email')).toHaveTextContent(mockData.email);
    expect(screen.getByTestId('working')).toHaveTextContent(mockData.working_hours_single);
    expect(screen.getByTestId('working-days')).toHaveTextContent(mockData.working_days);
    expect(screen.getByTestId('address')).toHaveTextContent(mockData.address);
  });

});
