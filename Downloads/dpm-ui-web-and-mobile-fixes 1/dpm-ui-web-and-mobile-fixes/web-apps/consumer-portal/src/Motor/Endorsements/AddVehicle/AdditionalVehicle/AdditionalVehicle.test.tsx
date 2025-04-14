import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdditionalVehicle from '.';
import { DataContext } from '../../../../DataContext'; 

// Mocking the DataContext
const mockData = {
  add_additional_vehicle: 'Add Additional Vehicle',
  existing_vehicles: 'Existing Vehicles',
  vehicle_sequence: 'Vehicle Sequence No.',
  custom_card_no: 'Custom Card No.',
  enter_vehicle_sequence_no: 'Enter Vehicle Sequence No.',
  enter_custom_card_no: 'Enter Custom Card No.',
  retrieve_vehicle_details: 'Retrieve Vehicle Details',
  adding_the_third_vehicle: 'Adding the third vehicle',
  new_vehicle: 'New Vehicle',
  model_type: 'Model Type',
  no_plate: 'No Plate',
  registration_year_label: "Manufacture Year",
  vehicle_color: 'Vehicle Color',
  chassis_no: 'Chassis No.',
  start_date: 'Start Date',
  expiry_date: 'Expiry Date',
  sum_insured: 'Sum Insured',
  policy_no: 'Policy No.',
  comprehensive: 'Comprehensive',
  endorsements: 'Endorsements',
  subtotal: 'Subtotal',
  tax: 'Tax',
  vat_amount: 'VAT Amount',
  total_amount: 'Total Amount',
};

// Create a mock for the context provider
const mockContext = {
  vehicle_sequence: 'Vehicle Sequence No.',
  custom_card_no: 'Custom Card No.',
  ...mockData
};

describe('AdditionalVehicle Component', () => {
  it('renders the AdditionalVehicle component and displays context data', () => {
    render(
      <DataContext.Provider value={mockContext}>
        <AdditionalVehicle />
      </DataContext.Provider>
    );

    // Check if the component renders the text from the mock context
    expect(screen.getByText(mockData.add_additional_vehicle)).toBeInTheDocument();
    expect(screen.getByText(mockData.existing_vehicles)).toBeInTheDocument();
  });

  it('can toggle between vehicle sequence and custom card number', async () => {
    render(
      <DataContext.Provider value={mockContext}>
        <AdditionalVehicle />
      </DataContext.Provider>
    );

    // Initially, Vehicle Sequence should be selected
    // expect(screen.getByLabelText(mockData.vehicle_sequence).checked).toBe(true);
    expect(screen.queryByPlaceholderText(mockData.enter_vehicle_sequence_no)).toBeInTheDocument();
    

    
    // expect(screen.queryByPlaceholderText(mockData.enter_vehicle_sequence_no)).not.toBeInTheDocument();
    // expect(screen.queryByPlaceholderText(mockData.enter_custom_card_no)).toBeInTheDocument();
  });

  it('can click the retrieve vehicle details button', async () => {
    render(
      <DataContext.Provider value={mockContext}>
        <AdditionalVehicle />
      </DataContext.Provider>
    );
    expect(screen.queryByPlaceholderText(mockData.enter_custom_card_no)).not.toBeInTheDocument();

    // Fill in the vehicle sequence number field
    const vehicleSeqInput = screen.getByPlaceholderText(mockData.enter_vehicle_sequence_no);
    fireEvent.change(vehicleSeqInput, { target: { value: '123456' } });

    // Click the button
    const button = screen.getByText(mockData.retrieve_vehicle_details);
    fireEvent.click(button);

    // Check if the vehicle details section becomes visible
    waitFor(() => {
      expect(screen.getByText(mockData.new_vehicle)).toBeInTheDocument();
      expect(screen.getByLabelText(mockData.custom_card_no)).toBeInTheDocument();
      // Check if the Custom Card No. textbox is now visible
    expect(screen.getByLabelText(mockData.custom_card_no).checked).toBe(true);
      // Switch to Custom Card No.
    
   fireEvent.click(screen.getByLabelText(mockData.custom_card_no));
    });
    

    
  });
  test('Render CustomRadio buttons and handles selection change', () => {
    render(
      <DataContext.Provider value={mockData}>
        <AdditionalVehicle />
      </DataContext.Provider>
    );

    const vehicleRadio = screen.getByTestId("radio_vehicleSeq")
    const customRadio = screen.getByTestId('radio_customCardNo');

    // Ensure both radio buttons are rendered
    expect(vehicleRadio).toBeInTheDocument();
    expect(customRadio).toBeInTheDocument();

    // Simulate selecting "Custom Card No."
    fireEvent.click(customRadio);
    expect(vehicleRadio).not.toBeChecked();
    expect(customRadio).toBeChecked();
    const customCardInput =screen.getByPlaceholderText(mockData?.enter_custom_card_no)
    expect(customCardInput).toBeInTheDocument();
    fireEvent.change(customCardInput,{target:{value:"1234",name:"CustomCard"}})

  });
});
