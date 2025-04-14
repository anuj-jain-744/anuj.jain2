import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ContactDet from './ContactDet';
import { DataContext } from '../../../DataContext';

describe('ContactDet Component', () => {
  const mockData = {
    mobile: '1234567890',
    contact_details: 'Contact Details',
    mobile_number: 'Mobile Number',
    placeholder_enter_mobile: 'Enter Mobile Number',
    email: 'Email',
    placeholder_enter_email_id: 'Enter Email ID',
  };

  const mockCompensateError = {
    mobilenum: 'Mobile number error',
    emailId: 'Email ID error',
  };

  const mockOnChangeHandler = jest.fn();

  const renderComponent = (selectedVal: string | null) => {
    return render(
      <DataContext.Provider value={mockData}>
        <ContactDet
          selectedVal={selectedVal}
          onChangehandler={mockOnChangeHandler}
          data={mockData}
          compensateError={mockCompensateError}
        />
      </DataContext.Provider>
    );
  };

  it('renders contact details correctly', () => {
    renderComponent(null);
    expect(screen.getByText('Contact Details')).toBeInTheDocument();
    expect(screen.getByText('Mobile Number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Mobile Number')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Email ID')).toBeInTheDocument();
  });

  it('handles mobile number change', () => {
    renderComponent(null);
    const mobileInput = screen.getByPlaceholderText('Enter Mobile Number');
    fireEvent.change(mobileInput, { target: { value: '0987654321' } });
    expect(mobileInput).toHaveValue('0987654321');
  });

  it('renders additional remarks when selectedVal is "Damage Repairs"', () => {
    renderComponent('Damage Repairs');
    expect(screen.getByText('Additional Remarks')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Additional remarks...')).toBeInTheDocument();
  });

  it('does not render additional remarks when selectedVal is not "Damage Repairs"', () => {
    renderComponent(null);
    expect(screen.queryByText('Additional Remarks')).not.toBeInTheDocument();
  });
});