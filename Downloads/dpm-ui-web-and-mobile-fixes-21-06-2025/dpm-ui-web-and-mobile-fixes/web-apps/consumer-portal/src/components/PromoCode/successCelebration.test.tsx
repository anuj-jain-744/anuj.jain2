import React from 'react';
import { render, screen } from '@testing-library/react';
import SuccessCelebration from './successCelebration';

jest.mock('assets/Claims/GreenSuccess.svg', () => 'mock-success-icon-path');

const mockProps = {
    successMessage: 'Promo code applied successfully!'
};

describe('SuccessCelebration Component', () => {
    test('renders SuccessCelebration component', () => {
        render(<SuccessCelebration {...mockProps} />);
        expect(screen.getByText('Promo code applied successfully!')).toBeInTheDocument();
    });

    test('displays success icon', () => {
        render(<SuccessCelebration {...mockProps} />);
        const imgElement = screen.getByAltText('Green Success Icon');
        expect(imgElement).toBeInTheDocument();
        expect(imgElement).toHaveAttribute('src', 'mock-success-icon-path');
    });

    test('displays success message', () => {
        render(<SuccessCelebration {...mockProps} />);
        expect(screen.getByText('Promo code applied successfully!')).toBeInTheDocument();
    });
});