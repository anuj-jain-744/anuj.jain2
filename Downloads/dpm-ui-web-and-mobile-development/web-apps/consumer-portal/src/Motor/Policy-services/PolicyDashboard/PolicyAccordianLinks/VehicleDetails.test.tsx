import React from 'react';
import { render, screen } from '@testing-library/react';
import VehicleDetails from './VehicleDetails';

// Mocking the assets used in the component
jest.mock('assets/PolicyDetails/carIconNissan.svg', () => 'carIconNissan');
jest.mock('assets/PolicyDetails/carIconMercedes.svg', () => 'carIconBenz');
jest.mock('assets/PolicyDetails/verticleLine.svg', () => 'verticalLine');

describe('VehicleDetails Component', () => {
    const defaultProps = {
        carModel: 'Nissan',
        numberPlate: 'ABC1234',
        vehicleSequenceNo: 'SEQ001',
        chassisNo: 'CHASSIS001',
        typeOfChassis: 'Sedan',
        yearOfManufacture: '2020',
        serialNo: 'SERIAL001',
        vehicleColor: 'Red',
        transmission: 'Automatic'
    };

    it('renders without crashing', () => {
        render(<VehicleDetails {...defaultProps} />);
        expect(screen.getByText(/nissan/i)).toBeInTheDocument();
    });


    it('renders ViewField components with correct labels and values', () => {
        render(<VehicleDetails {...defaultProps} />);
    
        expect(screen.getByText(/vehicle sequence no./i)).toBeInTheDocument();
        expect(screen.getByText(/seq001/i)).toBeInTheDocument();

        expect(screen.getByText(/chassis no./i)).toBeInTheDocument();
        expect(screen.getByText(/chassis001/i)).toBeInTheDocument();

        expect(screen.getByText(/type of chassis/i)).toBeInTheDocument();
        expect(screen.getByText(/sedan/i)).toBeInTheDocument();

        expect(screen.getByText(/year of manufacture/i)).toBeInTheDocument();
        expect(screen.getByText(/2020/i)).toBeInTheDocument();

        expect(screen.getByText(/serial no./i)).toBeInTheDocument();
        expect(screen.getByText(/serial001/i)).toBeInTheDocument();
    });

    it('renders Benz icon when car model is Benz', () => {
        render(<VehicleDetails {...{ ...defaultProps, carModel: 'Benz' }} />);
        
        const benzIcon = screen.getByAltText('car icon');
        expect(benzIcon).toHaveAttribute('src', 'verticalLine');
    });

    it('renders Nissan icon when car model is Nissan', () => {
        render(<VehicleDetails {...defaultProps} />);
        
        const nissanIcon = screen.getByAltText('car icon');
        expect(nissanIcon).toHaveAttribute('src', 'verticalLine');
    });
});