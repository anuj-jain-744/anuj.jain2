import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { OptionPromoCard } from './OptionPromoCard';

const mockOnChangehandler = jest.fn();
const mockOnClickhandler = jest.fn();

const mockProps = {
    mainHeading: 'Main Heading',
    mainContent: 'Main Content',
    subHeading: 'Sub Heading',
    inputBox: {
        placeholder: 'Enter promo code',
        onChangehandler: mockOnChangehandler,
        value: '',
        isButtonEnabled: true,
        buttonTitle: 'Apply',
        onClickhandler: mockOnClickhandler,
        errorMessage: '',
        isActive: false,
    }
};

describe('OptionPromoCard Component', () => {
    test('renders OptionPromoCard component', () => {
        render(<OptionPromoCard {...mockProps} />);
        expect(screen.getByText('Main Heading')).toBeInTheDocument();
        expect(screen.getByText('Main Content')).toBeInTheDocument();
        expect(screen.getByText('Sub Heading')).toBeInTheDocument();
    });

    test('renders ThemeTextbox and ThemeButton with correct props', () => {
        render(<OptionPromoCard {...mockProps} />);
        expect(screen.getByPlaceholderText('Enter promo code')).toBeInTheDocument();
        expect(screen.getByText('Apply')).toBeInTheDocument();
    });

    test('calls onChangehandler when input value changes', () => {
        render(<OptionPromoCard {...mockProps} />);
        const input = screen.getByPlaceholderText('Enter promo code');
        fireEvent.change(input, { target: { value: 'NEWCODE' } });
        expect(mockOnChangehandler).toHaveBeenCalled();
    });

    test('calls onClickhandler when button is clicked', () => {
        render(<OptionPromoCard {...mockProps} />);
        const button = screen.getByText('Apply');
        fireEvent.click(button);
    });

    test('applies active class when isActive is true', () => {
        render(<OptionPromoCard {...mockProps} inputBox={{ ...mockProps.inputBox, isActive: true }} />);
        const card = screen.getByText('Main Heading').closest('.option-promo-card');
        expect(card).toHaveClass('promo-card-active');
    });
});