import React from 'react';
import { render, screen } from '@testing-library/react';
import PolicyAdditionalPackages from './PolicyAdditionalPackages';
import { LanguageData } from 'types/languageData';

jest.mock('components/ThemeButton/ThemeButton', () => {
    return function MockThemeButton({ title }: any) {
        return <button>{title}</button>;
    };
});

describe('PolicyAdditionalPackages', () => {
    const mockLanguageData: LanguageData = {
        policy_additional_packages: 'Additional Packages',
        add_details: 'Add Details',
    };

    it('renders additional packages section correctly', () => {
        render(<PolicyAdditionalPackages languageData={mockLanguageData} />);

        const additionalPackagesElements = screen.getAllByText(/Additional Packages/i);
        expect(additionalPackagesElements.length).toBe(3);

        expect(screen.getByText(/You do not have any additional packages linked to this policy/i)).toBeInTheDocument();

        expect(screen.getByText((content, element) =>
            content.startsWith('To include additional packages in the policy') &&
            element.tagName.toLowerCase() === 'div'
        )).toBeInTheDocument();

        expect(screen.getByRole('button', { name: /Add Details/i })).toBeInTheDocument();
    });
});