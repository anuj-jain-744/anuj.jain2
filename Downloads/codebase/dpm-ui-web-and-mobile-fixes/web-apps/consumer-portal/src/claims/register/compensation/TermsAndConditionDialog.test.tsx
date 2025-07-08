import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TermsAndConditionDialog from './TermsAndConditionDialog';

const mockLanguageData = {
  title_for_terms_conditions: "Terms and Conditions",
  content_terms_conditions: "<p>These are the terms and conditions.</p>",
  ok: "OK"
};

describe('TermsAndConditionDialog', () => {
  test('renders correctly with given props', () => {
    render(
      <TermsAndConditionDialog
        showDialog={true}
        setShowDialog={jest.fn()}
        languageData={mockLanguageData}
      />
    );

    expect(screen.getByText("Terms and Conditions")).toBeInTheDocument();
    expect(screen.getByText("OK")).toBeInTheDocument();
    expect(screen.getByText("These are the terms and conditions.")).toBeInTheDocument();
  });

  test('calls setShowDialog when close button is clicked', () => {
    const handleClose = jest.fn();
    render(
      <TermsAndConditionDialog
        showDialog={true}
        setShowDialog={handleClose}
        languageData={mockLanguageData}
      />
    );

    fireEvent.click(screen.getByText("OK"));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});