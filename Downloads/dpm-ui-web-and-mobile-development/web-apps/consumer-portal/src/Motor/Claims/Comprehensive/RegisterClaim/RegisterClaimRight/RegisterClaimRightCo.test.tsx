import React from 'react';
import { render } from '@testing-library/react';
import RegisterClaimRight from '.';

describe('RegisterClaimRight Component', () => {
    const mockClaimsInfo = { /* mock data */ };
    const mockValidationData = { /* mock data */ };

    it('should render without crashing', () => {
        const { container } = render(
            <RegisterClaimRight
                claimsInfo={mockClaimsInfo}
                validationData={mockValidationData}
            />
        );
        expect(container).toBeInTheDocument();
    });

    it('should render VehicleSequenceNo component', () => {
        const { getByTestId } = render(
            <RegisterClaimRight
                claimsInfo={mockClaimsInfo}
                validationData={mockValidationData}
            />
        );
        expect(getByTestId('vehicle-sequence-no')).toBeInTheDocument();
    });

    it('should render ClaimRegistrationDetails component', () => {
        const { getByTestId } = render(
            <RegisterClaimRight
                claimsInfo={mockClaimsInfo}
                validationData={mockValidationData}
            />
        );
        expect(getByTestId('claim-registration-details')).toBeInTheDocument();
    });

    it('should render NoteRight component', () => {
        const { getByTestId } = render(
            <RegisterClaimRight
                claimsInfo={mockClaimsInfo}
                validationData={mockValidationData}
            />
        );
        expect(getByTestId('note-right')).toBeInTheDocument();
    });
});