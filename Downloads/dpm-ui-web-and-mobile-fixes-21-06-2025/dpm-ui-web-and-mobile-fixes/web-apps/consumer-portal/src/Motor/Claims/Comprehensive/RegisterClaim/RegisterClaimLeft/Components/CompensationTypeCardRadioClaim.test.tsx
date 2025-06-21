import React from 'react';
import { render, screen } from '@testing-library/react';
import CompensationTypeCardRadio from './CompensationTypeCardRadio';

describe('CompensationTypeCardRadio Component', () => {
    const mockChangeHandler = jest.fn();

    const defaultProps = {
        cardimgname: 'BankTransfer',
        radiobuttonname: 'Bank Transfer',
        radioname: 'Bank Transfer',
        isradioSelected: false,
        changeHandler: mockChangeHandler,
    };

    it('should apply the correct class when isradioSelected is true', () => {
        render(<CompensationTypeCardRadio {...defaultProps} isradioSelected={true} />);
        
        const card = screen.getByRole('img').closest('.card-active');
        expect(card).toBeInTheDocument();
    });

    it('should apply the correct class when isradioSelected is false', () => {
        render(<CompensationTypeCardRadio {...defaultProps} isradioSelected={false} />);
        
        const card = screen.getByRole('img').closest('.card-inactive');
        expect(card).toBeInTheDocument();
    });    
});