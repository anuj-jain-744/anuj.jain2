import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import TermsAndConditionLink from './TermsAndConditionLink';
import { productIDs, MOTOR_COMP, MOTOR } from 'constant';
import { LanguageData } from 'types/languageData';

describe('TermsAndConditionLink Component', () => {
  const mockLanguageData: LanguageData = {
    terms_conditions: 'Terms and Conditions',
    endorsements_add_benefits_comprehensive: 'https://comprehensive-url.com',
    endorsements_add_benefits_third_party: 'https://third-party-url.com',
  };

  it('renders the link with correct text when languageData and productCode are provided', () => {
    render(
      <TermsAndConditionLink
        languageData={mockLanguageData}
        productCode={MOTOR_COMP}
      />
    );

    const link = screen.getByText(/Terms and Conditions/i);
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://comprehensive-url.com');
  });

  it('does not render the link if normalizedProductName is not motor', () => {
    render(
      <TermsAndConditionLink
        languageData={mockLanguageData}
        productCode="OTHER_PRODUCT"
      />
    );

    const link = screen.queryByText(/Terms and Conditions/i);
    expect(link).not.toBeInTheDocument();
  });

  it('calculates termsURL correctly for MOTOR_COMP', () => {
    render(
      <TermsAndConditionLink
        languageData={mockLanguageData}
        productCode={MOTOR_COMP}
      />
    );

    const link = screen.getByText(/Terms and Conditions/i);
    expect(link).toHaveAttribute('href', 'https://comprehensive-url.com');
  });

  it('calculates termsURL correctly for MOTOR', () => {
    render(
      <TermsAndConditionLink
        languageData={mockLanguageData}
        productCode={MOTOR}
      />
    );

    const link = screen.getByText(/Terms and Conditions/i);
    expect(link).toHaveAttribute('href', 'https://third-party-url.com');
  });

  it('renders nothing if languageData is undefined', () => {
    render(<TermsAndConditionLink languageData={undefined} productCode={MOTOR} />);

    const link = screen.queryByText(/Terms and Conditions/i);
    expect(link).not.toBeInTheDocument();
  });

  it('renders nothing if languageData is null', () => {
    render(<TermsAndConditionLink languageData={null} productCode={MOTOR} />);

    const link = screen.queryByText(/Terms and Conditions/i);
    expect(link).not.toBeInTheDocument();
  });
});