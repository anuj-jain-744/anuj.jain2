import React from 'react';
import { render, screen } from '@testing-library/react';
import VehicleDetailsSection from './VehicleDetailsSection';

jest.mock('./VehicleDetails', () => {
    return jest.fn(() => <div data-testid="vehicle-details" />);
});

describe('VehicleDetailsSection Component', () => {
    const mockLanguageData = {
        vehicle_details: 'Vehicle Details'
    };

    it('renders without crashing', () => {
        render(<VehicleDetailsSection languageData={mockLanguageData} />);
        expect(screen.getByText(/vehicle details/i)).toBeInTheDocument();
    });

});