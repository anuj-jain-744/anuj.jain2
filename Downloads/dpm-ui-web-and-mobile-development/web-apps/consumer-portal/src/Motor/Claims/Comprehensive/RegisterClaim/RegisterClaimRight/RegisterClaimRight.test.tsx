import { render, screen } from '@testing-library/react';
import RegisterClaimRight from '.'; // Path to your RegisterClaimRight component
import VehicleSequenceNo from './VehicleSequenceNo';
import ClaimRegistrationDetails from './ClaimRegistrationDetails';
import NoteRight from './NoteRight';

// Mock child components
jest.mock('./VehicleSequenceNo', () => jest.fn(() => <div>VehicleSequenceNo Component</div>));
jest.mock('./ClaimRegistrationDetails', () => jest.fn(() => <div>ClaimRegistrationDetails Component</div>));
jest.mock('./NoteRight', () => jest.fn(() => <div>NoteRight Component</div>));

describe('RegisterClaimRight Component', () => {
  it('renders without crashing', () => {
    const mockClaimsInfo = { id: 1, claimNumber: '12345' };
    const mockValidationData = { status: 'valid' };

    // Render the RegisterClaimRight component with mock data
    render(<RegisterClaimRight claimsInfo={mockClaimsInfo} validationData={mockValidationData} />);

    // Check if the child components are rendered
    expect(screen.getByText('VehicleSequenceNo Component')).toBeInTheDocument();
    expect(screen.getByText('ClaimRegistrationDetails Component')).toBeInTheDocument();
    expect(screen.getByText('NoteRight Component')).toBeInTheDocument();
  });

  it('passes props to child components correctly', () => {
    const mockClaimsInfo = { id: 1, claimNumber: '12345' };
    const mockValidationData = { status: 'valid' };

    render(<RegisterClaimRight claimsInfo={mockClaimsInfo} validationData={mockValidationData} />);

    // Check if child components are rendered with the right text/content
    expect(screen.getByText('VehicleSequenceNo Component')).toBeInTheDocument();
    expect(screen.getByText('ClaimRegistrationDetails Component')).toBeInTheDocument();
    expect(screen.getByText('NoteRight Component')).toBeInTheDocument();
  });
});
