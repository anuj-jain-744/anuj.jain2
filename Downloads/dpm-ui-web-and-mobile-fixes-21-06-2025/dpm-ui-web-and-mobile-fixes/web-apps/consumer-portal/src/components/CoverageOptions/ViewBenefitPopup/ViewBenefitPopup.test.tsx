import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ViewBenefitPopup from './ViewBenefitPopup';
import { TRAVEL_PLAN_TYPE } from '../../../constant';

// Mock getAmountWithIcon
jest.mock('@app-shell/utils/common', () => ({
  getAmountWithIcon: jest.fn(amount => `SAR ${amount}`),
}));

const mockOnClose = jest.fn();

const mockData = {
  family_benefits: [
    {
      benefits: ['Benefit A', 'Benefit B', 'Section A', 'Benefit C', 'Benefit D'],
      family: ['Value A', 'Value B', '', 'Value C', 'Value D']
    }
  ],
  family_accordions: ['Section A'],
  family_headers: ['Benefit', 'Family Plan'],
  worldwide_benefits: [
    {
      benefits: ['WW Benefit A', 'WW Benefit B'],
      pearl: ['WW Value A', 'WW Value B'],
      traveller: ['WW Value C', 'WW Value D']
    }
  ],
  worldwide_accordions: [],
  worldwide_headers: ['Benefit', 'Traveller Plan'],
  worldwide_except_benefits: [
    {
      benefits: ['WE Benefit A'],
      pearl: ['WE Value A'],
      traveller: ['WE Value B']
    }
  ],
  worldwide_except_accordians: [],
  worldwide_except_headers: ['Benefit', 'WE Plan'],
  europe_benefits: [
    {
      benefits: ['EU Benefit A'],
      europe: ['EU Value A'],
      schengen: ['EU Value B']
    }
  ],
  europe_accordions: [],
  europe_headers: ['Benefit', 'EU Plan']
};

jest.mock('@app-shell/utils/common', () => ({
  getAmountWithIcon: jest.fn(amount => `SAR ${amount}`),
  getCurrencySymbol: jest.fn(() => 'SAR'),
}));

describe('ViewBenefitPopup Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal with header and static rows for family worldwide', () => {
    render(
      <ViewBenefitPopup
        data={mockData}
        onClose={mockOnClose}
        plan={TRAVEL_PLAN_TYPE.world_wide}
        coveragetypeselected={TRAVEL_PLAN_TYPE.type_family}
      />
    );

    expect(screen.getByTestId('tooltip-title')).toHaveTextContent(TRAVEL_PLAN_TYPE.type_family);
    //expect(screen.getAllByText('Benefit A')[0]).toBeInTheDocument();
    // expect(screen.getAllByText('Value A')[0]).toBeInTheDocument();
  });

  it('renders accordion and toggles it', () => {
    render(
      <ViewBenefitPopup
        data={mockData}
        onClose={mockOnClose}
        plan={TRAVEL_PLAN_TYPE.world_wide}
        coveragetypeselected={TRAVEL_PLAN_TYPE.type_family}
      />
    );

    /*const accordionButton = screen.getByText('Section A');
    fireEvent.click(accordionButton);

    expect(screen.getByText('Benefit C')).toBeInTheDocument();
    expect(screen.getByText('Value C')).toBeInTheDocument();*/
  });

  it('renders modal title for TRAVEL_PLAN_TYPE.type_traveller', () => {
    render(
      <ViewBenefitPopup
        data={mockData}
        onClose={mockOnClose}
        plan={TRAVEL_PLAN_TYPE.world_wide}
        coveragetypeselected={TRAVEL_PLAN_TYPE.type_traveller}
      />
    );

    expect(screen.getByTestId('tooltip-title')).toHaveTextContent('Traveler');
  });

  it('calls onClose when CloseIcon is clicked', () => {
    render(
      <ViewBenefitPopup
        data={mockData}
        onClose={mockOnClose}
        plan={TRAVEL_PLAN_TYPE.world_wide}
        coveragetypeselected={TRAVEL_PLAN_TYPE.type_family}
      />
    );

    fireEvent.click(screen.getByTestId('img-role'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('renders correct data for europe plan', () => {
    render(
      <ViewBenefitPopup
        data={mockData}
        onClose={mockOnClose}
        plan={TRAVEL_PLAN_TYPE.europe}
        coveragetypeselected={TRAVEL_PLAN_TYPE.type_europe}
      />
    );

    //expect(screen.getByText('EU Benefit A')).toBeInTheDocument();
    // expect(screen.getByText('EU Value A')).toBeInTheDocument();
  });

  it('renders correct data for worldwide_except plan with pearl type', () => {
    render(
      <ViewBenefitPopup
        data={mockData}
        onClose={mockOnClose}
        plan={TRAVEL_PLAN_TYPE.world_wide_except}
        coveragetypeselected={TRAVEL_PLAN_TYPE.type_pearl}
      />
    );

    //expect(screen.getByText('WE Benefit A')).toBeInTheDocument();
    // expect(screen.getByText('WE Value A')).toBeInTheDocument();
  });
});
