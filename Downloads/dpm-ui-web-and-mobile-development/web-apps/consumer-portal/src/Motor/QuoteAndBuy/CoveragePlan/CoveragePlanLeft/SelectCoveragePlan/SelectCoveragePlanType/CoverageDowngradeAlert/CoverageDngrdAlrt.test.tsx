import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CoverageDowngradeAlert from '.';
import { LanguageData } from 'types/languageData';

describe('CoverageDowngradeAlert Component', () => {
  const mockClickHandlerRenewDowngrade = jest.fn();

  const mockLanguageData: LanguageData = {
    please_note: 'Please Note',
    you_currently_have_compreh: 'You currently have comprehensive coverage.',
    cancel: 'Cancel',
    switch_to_third_party: 'Switch to Third Party',
  };

  it('should render without crashing', () => {
    render(
      <CoverageDowngradeAlert
        languageData={mockLanguageData}
        clickHandlerRenewDowngrade={mockClickHandlerRenewDowngrade}
        isCoverageTypeDowngrading={true}
      />
    );

    expect(screen.getByText('Please Note')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Switch to Third Party')).toBeInTheDocument();
  });

  it('should call clickHandlerRenewDowngrade with "cancel" on Cancel button click', () => {
    render(
      <CoverageDowngradeAlert
        languageData={mockLanguageData}
        clickHandlerRenewDowngrade={mockClickHandlerRenewDowngrade}
        isCoverageTypeDowngrading={true}
      />
    );

    fireEvent.click(screen.getByText('Cancel'));

    expect(mockClickHandlerRenewDowngrade).toHaveBeenCalledWith('cancel');
  });

  it('should call clickHandlerRenewDowngrade with "switch" on Switch to Third Party button click', () => {
    render(
      <CoverageDowngradeAlert
        languageData={mockLanguageData}
        clickHandlerRenewDowngrade={mockClickHandlerRenewDowngrade}
        isCoverageTypeDowngrading={true}
      />
    );

    fireEvent.click(screen.getByText('Switch to Third Party'));

    expect(mockClickHandlerRenewDowngrade).toHaveBeenCalledWith('switch');
  });

  it('should not render when isCoverageTypeDowngrading is false', () => {
    render(
      <CoverageDowngradeAlert
        languageData={mockLanguageData}
        clickHandlerRenewDowngrade={mockClickHandlerRenewDowngrade}
        isCoverageTypeDowngrading={false}
      />
    );

    expect(screen.queryByText('Please Note')).not.toBeInTheDocument();
  });
});