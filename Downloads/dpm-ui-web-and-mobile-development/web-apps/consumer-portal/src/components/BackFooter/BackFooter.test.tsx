import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BackFooter from './BackFooter';
import { LanguageData } from 'types/languageData';

describe('BackFooter', () => {
  const mockSetSelectedPolicyNumber = jest.fn();
  const mockNavigateTo = jest.fn();
  const mockHandleSelectCoverage = jest.fn();
  const mockHandleBackClick = jest.fn();
  const mockHandleLinkClick = jest.fn();
  const languageData: LanguageData = {
    back: 'Back',
    select_coverage: 'Select Coverage',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders BackFooter component', () => {
    render(<BackFooter />);
    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  it('calls setSelectedPolicyNumber when back button is clicked and selectedPolicyNumber is defined', () => {
    render(
      <BackFooter
        selectedPolicyNumber="12345"
        setSelectedPolicyNumber={mockSetSelectedPolicyNumber}
      />
    );
    fireEvent.click(screen.getByText('Back'));
    expect(mockSetSelectedPolicyNumber).toHaveBeenCalledWith(undefined);
  });

  it('calls navigateTo when back button is clicked and selectedPolicyNumber is undefined', () => {
    render(
      <BackFooter
        navigateTo={mockNavigateTo}
      />
    );
    fireEvent.click(screen.getByText('Back'));
    expect(mockNavigateTo).toHaveBeenCalledWith('/Motor/Claim/PolicyDashboard');
  });

  it('calls handleBackClick when back button is clicked and handleBackClick is provided', () => {
    render(
      <BackFooter
        handleBackClick={mockHandleBackClick}
      />
    );
    fireEvent.click(screen.getByText('Back'));
    expect(mockHandleBackClick).toHaveBeenCalled();
  });

  it('renders select coverage button when isQuoteAndBuy is true', () => {
    render(
      <BackFooter
        isQuoteAndBuy={true}
        languageData={languageData}
      />
    );
    expect(screen.getByText('Select Coverage')).toBeInTheDocument();
  });

  it('calls handleSelectCoverage when select coverage button is clicked and handleLinkClick is not provided', () => {
    render(
      <BackFooter
        isQuoteAndBuy={true}
        handleSelectCoverage={mockHandleSelectCoverage}
        languageData={languageData}
      />
    );
    fireEvent.click(screen.getByText('Select Coverage'));
    expect(mockHandleSelectCoverage).toHaveBeenCalled();
  });

  it('calls handleLinkClick when select coverage button is clicked and handleLinkClick is provided', () => {
    render(
      <BackFooter
        isQuoteAndBuy={true}
        handleLinkClick={mockHandleLinkClick}
        languageData={languageData}
      />
    );
    fireEvent.click(screen.getByText('Select Coverage'));
    expect(mockHandleLinkClick).toHaveBeenCalled();
  });

  it('disables select coverage button when disableLinkButton is true', () => {
    render(
      <BackFooter
        isQuoteAndBuy={true}
        disableLinkButton={true}
        languageData={languageData}
      />
    );
    expect(screen.getByText('Select Coverage')).toBeDisabled();
  });

  it('shows loading text when isQuoteLoading is true', () => {
    render(
      <BackFooter
        isQuoteAndBuy={true}
        isQuoteLoading={true}
        languageData={languageData}
      />
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});