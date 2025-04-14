import React from 'react';
import { render, screen } from '@testing-library/react';
import TermsAndConditions from './TermsAndConditions';
import { LanguageData } from 'types/languageData';

describe('TermsAndConditions', () => {
  const mockLanguageData: LanguageData = {
    terms_conditions: 'Terms and Conditions',
  };

  it('renders terms and conditions correctly', () => {
    render(<TermsAndConditions languageData={mockLanguageData} />);

    expect(screen.getByText(/Terms and Conditions/i)).toBeInTheDocument();

    expect(screen.getByText(/Lorem ipsum dolor sit amet/i)).toBeInTheDocument();
    expect(screen.getByText(/consectetur adipiscing elit/i)).toBeInTheDocument();
  });

  it('renders nothing if languageData is undefined', () => {
    render(<TermsAndConditions languageData={undefined} />);

    expect(screen.queryByText(/Terms and Conditions/i)).not.toBeInTheDocument();
  });
});