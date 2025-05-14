import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TravelerAddDetails from './index';

// Mock dependencies
jest.mock('./info', () => () => <div>Info Component</div>);
jest.mock('../../../../corporate-portal/src/components/Calendar/fullcalender', () => ({
  FullCalender: ({ onChange }: { onChange: (date: Date) => void }) => (
    <input
      type="date"
      data-testid="full-calender"
      onChange={(e) => onChange(new Date(e.target.value))}
    />
  ),
}));
jest.mock('../TravelerFamily', () => ({
  TravelerAdult: () => <div>TravelerAdult Component</div>,
  TravelerChild: () => <div>TravelerChild Component</div>,
  TravelerSenior: () => <div>TravelerSenior Component</div>,
}));
jest.mock('./AddAdditionalTraveller', () => () => <div>AddAdditionalTraveller Component</div>);

describe('TravelerAddDetails Component', () => {
  const mockData = {
    add_traveller_page_title: 'Add Traveler',
    add_traveller_page_desc: 'Enter traveler details below',
    traveller_name: 'Name',
    traveller_name_placeholder: 'Enter your name',
    traveller_passport_no: 'Passport Number',
    traveller_passport_no_placeholder: 'Enter passport number',
    traveller_passport_exp_date: 'Passport Expiry Date',
    traveller_passport_exp_date_placeholder: 'DD/MM/YYYY',
    traveller_dob: 'Date of Birth',
    traveller_relation: 'Relation',
    benfit_title: 'Benefits',
    benfit_sports: 'Winter Sports',
    benfit_covid: 'Covid Coverage',
    add_button: 'Add',
    remove_button: 'Remove',
    incomplete: 'Incomplete',
  };

  it('renders the component with the provided data', () => {
    render(<TravelerAddDetails data={mockData} />);

    expect(screen.getByTestId('travelerHead')).toHaveTextContent('Add Traveler');
    expect(screen.getByText('Enter traveler details below')).toBeInTheDocument();
  });

  it('handles form input changes', () => {
    render(<TravelerAddDetails data={mockData} />);

    const nameInput = screen.getByPlaceholderText('Enter your name');
    const passportInput = screen.getByPlaceholderText('Enter passport number');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(passportInput, { target: { value: 'A12345678' } });

    expect(nameInput.value).toBe('John Doe');
    expect(passportInput.value).toBe('A12345678');
  });

  it('toggles the winter benefit', () => {
    render(<TravelerAddDetails data={mockData} />);

    const winterBenefitButton = screen.getByTestId('winterBenfit');
    fireEvent.click(winterBenefitButton);

    expect(winterBenefitButton).toHaveTextContent('Remove');
  });

  it('toggles the covid benefit', () => {
    render(<TravelerAddDetails data={mockData} />);

    const covidBenefitButton = screen.getByTestId('covidBenfit');
    fireEvent.click(covidBenefitButton);

    expect(covidBenefitButton).toHaveTextContent('Remove');
  });

  it('validates form submission', () => {
    render(<TravelerAddDetails data={mockData} />);

    const nameInput = screen.getByPlaceholderText('Enter your name');
    const passportInput = screen.getByPlaceholderText('Enter passport number');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(passportInput, { target: { value: 'A12345678' } });

  });

  it('handles date input', () => {
    render(<TravelerAddDetails data={mockData} />);

    const dateInput = screen.getByTestId('full-calender');
    fireEvent.change(dateInput, { target: { value: '2025-01-01' } });

    expect(dateInput.value).toBe('2025-01-01');
  });

  it('renders conditional traveler footer', () => {
    render(<TravelerAddDetails data={mockData} />);

    expect(screen.queryByText('AddAdditionalTraveller Component')).not.toBeInTheDocument();
  });
});
