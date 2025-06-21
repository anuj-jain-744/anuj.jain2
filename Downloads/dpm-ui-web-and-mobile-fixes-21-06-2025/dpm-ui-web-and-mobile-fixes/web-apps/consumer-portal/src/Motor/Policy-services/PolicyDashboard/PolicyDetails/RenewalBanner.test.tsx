import React from 'react';
import { render, screen } from '@testing-library/react';
import RenewalBanner from './RenewalBanner';
import { LanguageData } from 'types/languageData';

describe('RenewalBanner Component', () => {
  const mockMessage = 'Your policy is set to expire soon.';
  const mockLanguageData: LanguageData = {
    renew: 'Renew Now',
  };

  it('should render the renewal message', () => {
    render(<RenewalBanner message={mockMessage} languageData={mockLanguageData} />);
    expect(screen.getByText(mockMessage)).toBeInTheDocument();
  });

  it('should render the ThemeButton with correct props', () => {
    render(<RenewalBanner message={mockMessage} languageData={mockLanguageData} />);
    const button = screen.getByRole('button', { name: /renew now/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('walaa-medium-500');
  });

  it('should render the report icon', () => {
    render(<RenewalBanner message={mockMessage} languageData={mockLanguageData} />);
    const icon = screen.getByAltText('report icon');
    expect(icon).toBeInTheDocument();
  });
});