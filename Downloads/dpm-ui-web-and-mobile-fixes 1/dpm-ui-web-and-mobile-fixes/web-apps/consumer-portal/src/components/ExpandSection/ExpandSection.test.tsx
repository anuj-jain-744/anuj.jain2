import React from 'react';
import { render, screen } from '@testing-library/react';
import ExpandSection from './ExpandSection';
import { LanguageData } from 'types/languageData';

describe('ExpandSection', () => {
  const mockLanguageData: LanguageData = {
    show_more: 'Show More',
  };

  it('renders without crashing', () => {
    render(<ExpandSection languageData={mockLanguageData} />);
    expect(screen.getAllByAltText('vector line')).toHaveLength(2);
  });

  it('displays the show more text', () => {
    render(<ExpandSection languageData={mockLanguageData} />);
    expect(screen.getByText('Show More')).toBeInTheDocument();
  });

  it('handles undefined languageData', () => {
    render(<ExpandSection languageData={undefined} />);
    expect(screen.queryByText('Show More')).not.toBeInTheDocument();
  });

  it('handles null languageData', () => {
    render(<ExpandSection languageData={null} />);
    expect(screen.queryByText('Show More')).not.toBeInTheDocument();
  });
});