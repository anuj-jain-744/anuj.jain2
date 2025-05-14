import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import PolicyAdditionalPackages from './PolicyAdditionalPackages';
import { LanguageData } from 'types/languageData';
import { useLocation } from 'react-router-dom';

jest.mock('components/ThemeButton/ThemeButton', () => {
  return function MockThemeButton({ title,onClickhandler }: any) {
    return <button onClick={onClickhandler} data-testid="additional-package-btnid">{title}</button>;
  };
});

jest.mock("react-router-dom", () => ({
...jest.requireActual("react-router-dom"),
useLocation: jest.fn()
}));

describe('PolicyAdditionalPackages', () => {
  const mockNavigateTo =jest.fn();
    const mockLanguageData: LanguageData = {
        policy_additional_packages: 'Additional Packages',
        add_details: 'Add Details',
    };
     (useLocation as jest.Mock).mockReturnValue({
          state: {
            data: {
              policyNo: "12345",
              nationalID: "987654321",
              productCode: "ABC",
            },
          },
        });

    it('renders additional packages section correctly', () => {
        render(<PolicyAdditionalPackages languageData={mockLanguageData} navigateTo={mockNavigateTo}/>);

        const additionalPackagesElements = screen.getAllByText(/Additional Packages/i);
        expect(additionalPackagesElements.length).toBe(3);

        expect(screen.getByText(/You do not have any additional packages linked to this policy/i)).toBeInTheDocument();

        expect(screen.getByText((content, element) =>
            content.startsWith('To include additional packages in the policy') &&
            element.tagName.toLowerCase() === 'div'
        )).toBeInTheDocument();

        expect(screen.getByRole('button', { name: /Add Details/i })).toBeInTheDocument();
    });
    it('handle add package button',async()=>{
        render(<PolicyAdditionalPackages languageData={mockLanguageData} navigateTo={mockNavigateTo}/>);
        const button=screen.getByTestId('additional-package-btnid');
        expect(button).toBeInTheDocument();
        fireEvent.click(button);
        expect(mockNavigateTo).toHaveBeenCalledWith('/Motor/Claim/Endorsement',{ data: {
          policyNo: "12345",
          nationalID: "987654321",
          productCode: "ABC",
        },});
    })
});