import React from 'react';
import { render, screen } from '@testing-library/react';
import PolicyPremiumBenefits from './PolicyPremiumAndBenefitsSection';
import { LanguageData } from 'types/languageData';

// Mock getAmountWithIcon
jest.mock('@app-shell/utils/common', () => ({
    getAmountWithIcon: jest.fn(amount => `SAR ${amount}`),
}));

describe('PolicyPremiumBenefits', () => {
    const mockLanguageData: LanguageData = {
        policy_premium_benifits: 'Policy Premium Benefits',
        sum_insured: 'Sum Insured',
        premium_amount: 'Premium Amount',
        treatment_non_ministry: 'Treatment Costs (Non-Ministry)',
        treatment_costs_of_physica: 'Material Costs',
        expenses: 'Expenses',
    };

    it('renders policy premium benefits correctly', () => {
        render(
            <PolicyPremiumBenefits
                sumInsured="10000"
                premiumAmount="500"
                languageData={mockLanguageData}
            />
        );

        expect(screen.getByText(/Policy Premium Benefits/i)).toBeInTheDocument();

        expect(screen.getByText(/Premium Amount/i)).toBeInTheDocument();
        expect(screen.getByText(/SAR 500/i)).toBeInTheDocument();

        const treatmentCostElements = screen.getAllByText(/Treatment Costs \(Non-Ministry\)/i);
        expect(treatmentCostElements.length).toBeGreaterThan(0);

        expect(screen.getByText(/Material Costs/i)).toBeInTheDocument();
        const treatmentCostValue = screen.getAllByText(/SAR 10,000.00/i);
        expect(treatmentCostValue.length).toBeGreaterThan(0);

        expect(screen.getByText(/Expenses/i)).toBeInTheDocument();
    });

    it('renders nothing if languageData is undefined', () => {
        render(<PolicyPremiumBenefits sumInsured="10000" premiumAmount="500" languageData={undefined} />);

        expect(screen.queryByText(/Policy Premium Benefits/i)).not.toBeInTheDocument();

        expect(screen.queryByText(/Sum Insured/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Premium Amount/i)).not.toBeInTheDocument();
    });
});