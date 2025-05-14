import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import TermsAndConditions from './TermsAndConditions';
import { LanguageData } from 'types/languageData';

describe('TermsAndConditions', () => {
  const mockLanguageData: LanguageData = {
    terms_conditions: 'Terms and Conditions',
  };

  it('renders terms and conditions correctly', async() => {
    const mockHandleModal=jest.fn();
    render(<TermsAndConditions languageData={mockLanguageData}/>);

    const h4=screen.getByTestId('term-con-id');
    expect(h4).toBeInTheDocument();
    fireEvent.click(h4);
    waitFor(()=> expect(mockHandleModal).toHaveBeenCalled())
;
    

  });

  it('renders nothing if languageData is undefined', () => {
    render(<TermsAndConditions languageData={undefined} />);

    expect(screen.queryByText(/Terms and Conditions/i)).not.toBeInTheDocument();
  });
});