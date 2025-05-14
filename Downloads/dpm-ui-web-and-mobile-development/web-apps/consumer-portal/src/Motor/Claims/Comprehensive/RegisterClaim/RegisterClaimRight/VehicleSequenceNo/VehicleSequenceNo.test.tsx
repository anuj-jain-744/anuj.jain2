import { render, screen } from '@testing-library/react';
import { DataContext } from "../../../../../../DataContext";
import VehicleSequenceNo from '.';

// Mock the image import
jest.mock('assets/Endorsement/png/Nissan.png', () => 'mocked-nissan.png');

// Mock DataContext values
const mockData = {
  vehicle_sequence: 'Vehicle Sequence',
  case_reference_no: 'Case Reference No.',
  owner_id_label: 'Owner ID',
};

describe('VehicleSequenceNo Component', () => {
  const mockClaimsInfo = {
    refNo: '123456789',
    ownerId: '987654321',
  };

  const mockValidationData = {
    sequenceNo: 'ABC123',
  };

  it('renders VehicleSequenceNo component with correct content', () => {
    render(
      <DataContext.Provider value={mockData}>
        <VehicleSequenceNo claimsInfo={mockClaimsInfo} validationData={mockValidationData} />
      </DataContext.Provider>
    );

    // Check the image is rendered
    const image = screen.getByAltText('veh_seq');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'mocked-nissan.png'); // Check if the mocked image is used

    // Check text from DataContext
    expect(screen.getByText(mockData.vehicle_sequence)).toBeInTheDocument();
    expect(screen.getByText(mockData.case_reference_no)).toBeInTheDocument();
    expect(screen.getByText(mockData.owner_id_label)).toBeInTheDocument();

    // Check text from props (claimsInfo and validationData)
    expect(screen.getByText(mockValidationData.sequenceNo)).toBeInTheDocument();
    expect(screen.getByText(mockClaimsInfo.refNo)).toBeInTheDocument();
    expect(screen.getByText(mockClaimsInfo.ownerId)).toBeInTheDocument();
  });
});
