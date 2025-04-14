import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditTraveller from 'components/Travel/EditTraveller';
import '@testing-library/jest-dom';

// Mock the image import
jest.mock('assets/QuoteAndBuy/edit_square.svg', () => 'mocked-svg-path');

const mockData = {
  edit_traveller_details: 'Edit Traveller Details',
  cancel: 'Cancel',
  submit: 'Submit',
  traveller_name: 'Name',
  traveller_passport_no: 'Passport No',
  traveller_dob: 'Date of Birth',
  traveller_relation: 'Relation',
  traveller_passport_no_placeholder: 'Enter Passport Number',
  traveller_passport_exp_date_placeholder: 'Enter Expiry Date',
  traveller_dob_placeholder: 'Enter Date of Birth',
  relations: ['Spouse', 'Child', 'Parent'],
  benfit_sports: 'Winter Sports',
  benfit_covid: 'Covid-19',
  benfit_title: 'Benefits',
  remove_button: 'Remove',
  add_button: 'Add',
};

const mockTravelItemValues = [
  {
    adultName: 'John Doe',
    adultPassport: 'A1234567',
    adultPassportExp: '2025-12-31',
    adultDob: '1990-01-01',
    adultRelation: 'Spouse',
    additionalDetails: [],
  },
];

describe('EditTraveller Component', () => {
  test('renders EditTraveller component and opens modal', () => {
    render(
      <EditTraveller
        noOfAdults={1}
        data={mockData}
        travelItemValues={mockTravelItemValues}
      />
    );

    // Check if the Edit Traveller button is rendered
    const editButton = screen.getByRole('button', { name: /edit traveller/i });
    expect(editButton).toBeInTheDocument();

    // Open the modal
    fireEvent.click(editButton);
    expect(screen.getByText(mockData.edit_traveller_details)).toBeInTheDocument();
  });

  test('renders correct input fields for traveler data', () => {
    render(
      <EditTraveller
        noOfAdults={1}
        data={mockData}
        travelItemValues={mockTravelItemValues}
      />
    );

    // Open the modal
    fireEvent.click(screen.getByRole('button', { name: /edit traveller/i }));

    // Check if the form fields are rendered
    expect(screen.getByPlaceholderText('Enter Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(mockData.traveller_passport_no_placeholder)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(mockData.traveller_passport_exp_date_placeholder)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(mockData.traveller_dob_placeholder)).toBeInTheDocument();
  });

  test('handles input change for traveler data', async () => {
    render(
      <EditTraveller
        noOfAdults={1}
        data={mockData}
        travelItemValues={mockTravelItemValues}
      />
    );

    // Open the modal
    fireEvent.click(screen.getByRole('button', { name: /edit traveller/i }));

    const nameInput = screen.getByPlaceholderText('Enter Name');
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });

    await waitFor(() => expect(nameInput.value).toBe('Jane Doe'));
  });

 
 
  test('handles benefit toggle for winter sports', async () => {
    render(
      <EditTraveller
        noOfAdults={1}
        data={mockData}
        travelItemValues={mockTravelItemValues}
      />
    ); 
    fireEvent.click(screen.getByRole('button', { name: /edit traveller/i })); 
    const winterBenefitButton = screen.getByText(mockData.benfit_sports);
    console.log(winterBenefitButton); 
    expect(winterBenefitButton).toBeInTheDocument(); 
    fireEvent.click(winterBenefitButton); 
    
     // Check if the element with the class '.benfit-one-select' is in the document
    await waitFor(() => {
      const benefitSelectElement = winterBenefitButton.closest('.benfit-one-select');
      expect(benefitSelectElement).toBeInTheDocument();
    });
    
  });


  test('handles cancel button click and closes modal', async () => {
    render(
      <EditTraveller
        noOfAdults={1}
        data={mockData}
        travelItemValues={mockTravelItemValues}
      />
    );

    // Open the modal
    fireEvent.click(screen.getByRole('button', { name: /edit traveller/i }));

    // Click on the Cancel button
    const cancelButton = screen.getByText(mockData.cancel);
    fireEvent.click(cancelButton);

    // Check that modal is closed
    expect(screen.queryByText(mockData.edit_traveller_details)).not.toBeInTheDocument();
  });

  test('handles form submission and closes modal', async () => {
    render(
      <EditTraveller
        noOfAdults={1}
        data={mockData}
        travelItemValues={mockTravelItemValues}
      />
    );

    // Open the modal
    fireEvent.click(screen.getByRole('button', { name: /edit traveller/i }));

    // Click on the Submit button
    const submitButton = screen.getByText(mockData.submit);
    fireEvent.click(submitButton);

    // Check if modal is closed (submitted)
    expect(screen.queryByText(mockData.edit_traveller_details)).not.toBeInTheDocument();
  });
});
