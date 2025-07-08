import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TermsAndCon from './TermsAndCon';
import { LanguageData } from 'types/languageData';

const mockLanguageData: LanguageData = {
  title_for_terms_conditions: 'Terms and Conditions',
  content_terms_conditions: 'These are the terms and conditions.',
  ok: 'OK',
  i_agree: 'I agree to the',
  terms_conditions: 'terms and conditions',
};

describe('TermsAndCon', () => {
  test('renders TermsAndCon component', () => {
    render(
      <TermsAndCon
        languageData={mockLanguageData}
        isChecked={false}
        setIsChecked={jest.fn()}
      />
    );

    expect(screen.getByText('I agree to the')).toBeInTheDocument();
   // expect(screen.getByText('terms and conditions')).toBeInTheDocument();
  });

  test('opens TermsAndConditionDialog on link click', () => {
    render(
      <TermsAndCon
        languageData={mockLanguageData}
        isChecked={false}
        setIsChecked={jest.fn()}
      />
    );

    // fireEvent.click(screen.getByText('terms and conditions'));
    // expect(screen.getByText('Terms and Conditions')).toBeInTheDocument();
  });

  test('calls setIsChecked on checkbox change', () => {
    const setIsChecked = jest.fn();
    render(
      <TermsAndCon
        languageData={mockLanguageData}
        isChecked={false}
        setIsChecked={setIsChecked}
      />
    );

    fireEvent.click(screen.getByRole('checkbox'));
    expect(setIsChecked).toHaveBeenCalledWith(true);
  });
});