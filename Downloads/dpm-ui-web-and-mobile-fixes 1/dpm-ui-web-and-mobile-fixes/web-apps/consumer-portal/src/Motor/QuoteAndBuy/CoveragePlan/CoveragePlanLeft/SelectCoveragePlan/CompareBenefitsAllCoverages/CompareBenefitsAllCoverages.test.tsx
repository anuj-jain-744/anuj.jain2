import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CompareBenefitsAllCoverages from '.';
import { LanguageData } from 'types/languageData';

describe('CompareBenefitsAllCoverages', () => {
    const languageData: LanguageData = {
        compare_benefits_for_all: 'Compare Benefits for All',
    };

    it('renders the ThemeButton with correct text', () => {
        render(<CompareBenefitsAllCoverages languageData={languageData} />);
        const button = screen.getByText('Compare Benefits for All');
        expect(button).toBeInTheDocument();
    });

    it('shows CompareBenefits component when button is clicked', () => {
        render(<CompareBenefitsAllCoverages languageData={languageData} />);
        const button = screen.getByText('Compare Benefits for All');
        fireEvent.click(button);
        const compareBenefits = screen.getByText('Compare Benefits for All');
        expect(compareBenefits).toBeInTheDocument();
    });
});