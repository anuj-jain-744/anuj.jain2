import React from 'react';
import { render, screen } from '@testing-library/react';
import DomesticLabourCard from './index';
import { TravelData } from 'types/languageData';

describe('DomesticLabourCard', () => {
  const mockData: TravelData = {
    boost_your_domestic_image_url: 'https://example.com/image.png',
    boost_your_domestic_labour: 'Boost Your Domestic Labour',
    add_domestic_labour_insura: 'Add Domestic Labour Insurance',
    check_on_domestic_insuranc: 'Check on Domestic Insurance'
  };

  it('should render the DomesticLabourCard with data', () => {
    render(<DomesticLabourCard data={mockData} />);

    expect(screen.getByTestId('domestic-img')).toHaveAttribute('src', mockData.boost_your_domestic_image_url);
    expect(screen.getByText(mockData.boost_your_domestic_labour)).toBeInTheDocument();
    expect(screen.getByText(mockData.add_domestic_labour_insura)).toBeInTheDocument();
    expect(screen.getByText(mockData.check_on_domestic_insuranc)).toBeInTheDocument();
  });

  it('should render the DomesticLabourCard without data', () => {
    render(<DomesticLabourCard />);
    expect(screen.getByTestId('domestic-img')).not.toHaveAttribute('src', mockData.boost_your_domestic_image_url);
    expect(screen.queryByText('Boost Your Domestic Labour')).not.toBeInTheDocument();
    expect(screen.queryByText('Add Domestic Labour Insurance')).not.toBeInTheDocument();
    expect(screen.queryByText('Check on Domestic Insurance')).not.toBeInTheDocument();
  });
});