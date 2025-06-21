import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChoosePlan from './index';
import { TravelData } from 'types/languageData';

const mockChoosePlanData: TravelData = {
  choose_your_plan_heading: 'Choose Your Plan',
  choose_your_plan_description: 'Select the best plan that suits your needs.',
  coverage_type: 'Comprehensive',
  travel_coverage_plan: [],
  did_you_know_text: 'Did you know?',
  did_you_know_description: 'Travel insurance covers unexpected events.'
};
describe('ChoosePlan Component', () => {
  test('renders ChoosePlan component with correct data', () => {
    const { getByText, getByAltText } = render(<ChoosePlan choosePlanData={mockChoosePlanData} />);

    // Check if the heading is rendered correctly
    expect(getByText('Choose Your Plan')).toBeInTheDocument();

    // Check if the description is rendered correctly
    expect(getByText('Select the best plan that suits your needs.')).toBeInTheDocument();

    // Check if the image is rendered correctly
    const image = screen.getByTestId('choose-plan-img');
    expect(image).toBeInTheDocument();
  })
});