import React from 'react';
import { render, screen  } from '@testing-library/react';
import '@testing-library/jest-dom';
import DefaultSpinner from '.';

describe('DefaultSpinner Component', () => {
    it('renders Spinner with correct animation', () => {
        render(<DefaultSpinner />);
        const spinner = screen.getByTestId('loading-spinner');
        expect(spinner).toBeInTheDocument();

        expect(spinner).toHaveClass('spinner-border');
    });
});