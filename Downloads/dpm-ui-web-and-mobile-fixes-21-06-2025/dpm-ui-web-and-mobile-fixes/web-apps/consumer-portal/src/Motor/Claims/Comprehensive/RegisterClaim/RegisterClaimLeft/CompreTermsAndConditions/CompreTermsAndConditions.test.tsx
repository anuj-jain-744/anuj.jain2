import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CompreTermsAndConditions from '.';

describe('CompreTermsAndConditions', () => {
    const mockChangeHandler = jest.fn();

    it('renders without crashing', () => {
        render(<CompreTermsAndConditions changeHandler={mockChangeHandler} isChecked={false} />);
        // expect(screen.getByText(/I agree to the/i)).toBeInTheDocument();
    });

    // it('calls changeHandler with "IAgree" and true when accept button is clicked', () => {
    //     render(<CompreTermsAndConditions changeHandler={mockChangeHandler} isChecked={false} />);
    //     const linkButton = screen.getByText(/terms and conditions./i);
    //     fireEvent.click(linkButton);
    //     const acceptButton = screen.getByText(/Accept/i);
    //     fireEvent.click(acceptButton);
    //     expect(mockChangeHandler).toHaveBeenCalledWith('IAgree', true);
    // });
});