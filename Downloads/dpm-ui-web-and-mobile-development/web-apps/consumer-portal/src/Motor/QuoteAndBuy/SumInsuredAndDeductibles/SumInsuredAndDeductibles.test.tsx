import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SumInsuredAndDeductibles from '.';
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';
import { useApiCall } from '@dpm/shared-module';
import useCalculatePremiumPayload from '../hooks/useCalculatePremiumPayload';

// Mock dependencies
jest.mock('components/hooks/useQuoteAndBuyContext');
jest.mock('@dpm/shared-module', () => ({
  useApiCall: jest.fn(() => ({
    makeApiCall: jest.fn(),
    data: null,
  })),
}));
jest.mock('../hooks/useCalculatePremiumPayload');
jest.mock('utils/quoteAndBuy', () => ({
  deepCopy: jest.fn((obj) => ({ ...obj })),
  updateSliderChangeCalculatePremiumPayload: jest.fn(() => ({})),
}));

const mockLanguageData = {
  sum_insured_and_deductible: 'Sum Insured And Deductibles',
  what_should_be_your_motor: 'What should be your motor’s Sum Insured and Deductibles',
  your_motor_current_market: 'Your motor’s current market value ranges between <<vehicleMinValue>> and <<vehicleMaxValue>>',
  sum_insured: 'Sum Insured',
  deductibles: 'Deductibles',
  sar: 'SAR',
  max_sum_insured_is: 'Max Sum Insured is',
  lesser_the_deductible_bett: 'Lesser the deductible, better coverage',
};

const mockContextValue = {
  setStepValue: jest.fn(),
  compWorkShop: null,
  setcompWorkShop: jest.fn(),
  compAgency: null,
  setcompAgency: jest.fn(),
  compMath: null,
  setcompMath: jest.fn(),
  setcomp3rdParty: jest.fn(),
  deductibleAmounts: [500, 1000, 1500],
  setDeductibleAmounts: jest.fn(),
  minDeductibleAmount: 500,
  setMinDeductibleAmount: jest.fn(),
  maxDeductibleAmount: 1500,
  setMaxDeductibleAmount: jest.fn(),
  workShopInitialPrice: null,
  setWorkShopInitialPrice: jest.fn(),
  setAgencyInitialPrice: jest.fn(),
  setMathInitialPrice: jest.fn(),
  sliderValueDeductibles: '500',
  setSliderValueDeductibles: jest.fn(),
  sliderValueSumInsured: '50000',
  setSliderValueSumInsured: jest.fn(),
  setWsPremiumBreakdown: jest.fn(),
  setMathPremiumBreakdown: jest.fn(),
  setAgencyPremiumBreakdown: jest.fn(),
  vehicleDetailsResponseData: {
    vehicleMinValue: 40000,
    vehicleMaxValue: 60000,
    vehicleValue: 50000,
  },
  setComprehensiveCardPrice: jest.fn(),
  availableRepairTypes: ['workShop', 'math', 'agency'],
};

describe('SumInsuredAndDeductibles Component', () => {
  beforeEach(() => {
    useQuoteAndBuyContext.mockReturnValue(mockContextValue);
    useCalculatePremiumPayload.mockReturnValue({});
    useApiCall.mockReturnValue({
      makeApiCall: jest.fn().mockResolvedValue({ model: {} }),
      data: null,
    });
    jest.clearAllMocks();
  });

  it('renders component with correct headings and initial values', () => {
    render(<SumInsuredAndDeductibles languageData={mockLanguageData} />);
    expect(screen.getByText('Sum Insured And Deductibles')).toBeInTheDocument();
    expect(screen.getByText('Sum Insured')).toBeInTheDocument();
    expect(screen.getByText('Deductibles')).toBeInTheDocument();
    expect(screen.getByText('SAR 50000.00')).toBeInTheDocument();
    expect(screen.getByText('SAR 500.00')).toBeInTheDocument();
  });

  it('displays vehicle value range in informative content', () => {
    render(<SumInsuredAndDeductibles languageData={mockLanguageData} />);
    expect(screen.getByText(/Your motor’s current market value ranges between 40000 and 60000/)).toBeInTheDocument();
  });

  it('updates sum insured value on slider change', () => {
    render(<SumInsuredAndDeductibles languageData={mockLanguageData} />);
    const sumInsuredSlider = screen.getByLabelText('sum insured');
    fireEvent.change(sumInsuredSlider, { target: { value: '55000' } });
  });

  it('updates deductibles value on slider change', () => {
    render(<SumInsuredAndDeductibles languageData={mockLanguageData} />);
    const deductiblesSlider = screen.getByLabelText('deductibles');
    fireEvent.change(deductiblesSlider, { target: { value: '1000' } });
    expect(mockContextValue.setSliderValueDeductibles).toHaveBeenCalledWith('1000');
  });

  it('calculates linked deductible when sum insured changes', () => {
    render(<SumInsuredAndDeductibles languageData={mockLanguageData} />);
    const sumInsuredSlider = screen.getByLabelText('sum insured');
    fireEvent.change(sumInsuredSlider, { target: { value: '55000' } });
    expect(mockContextValue.setSliderValueDeductibles).toHaveBeenCalled();
  });

  it('triggers API calls when sum insured changes significantly', async () => {
    const mockApiCall = jest.fn().mockResolvedValue({ model: {} });
    useApiCall.mockReturnValue({ makeApiCall: mockApiCall, data: null });
    const { rerender } = render(<SumInsuredAndDeductibles languageData={mockLanguageData} />);
    
    const updatedContext = {
      ...mockContextValue,
      sliderValueSumInsured: '51000',
    };
    useQuoteAndBuyContext.mockReturnValue(updatedContext);
    rerender(<SumInsuredAndDeductibles languageData={mockLanguageData} />);
    
    await waitFor(() => {
      expect(mockApiCall).toHaveBeenCalledTimes(3);
    });
  });

  it('updates prices when deductibles change significantly', () => {
    const updatedContext = {
      ...mockContextValue,
      sliderValueDeductibles: '1000',
      compWorkShop: { pricingOptions: [{ deductibleAmount: 1000, finalAmount: 1000, premiumBreakdowns: [] }] },
      compMath: { pricingOptions: [{ deductibleAmount: 1000, finalAmount: 1200, premiumBreakdowns: [] }] },
      compAgency: { pricingOptions: [{ deductibleAmount: 1000, finalAmount: 1500, premiumBreakdowns: [] }] },
    };
    useQuoteAndBuyContext.mockReturnValue(updatedContext);
    render(<SumInsuredAndDeductibles languageData={mockLanguageData} />);
  });

  it('sets initial values from vehicle details on mount', () => {
    render(<SumInsuredAndDeductibles languageData={mockLanguageData} />);
    expect(mockContextValue.setSliderValueSumInsured).toHaveBeenCalledWith(50000);
    expect(mockContextValue.setSliderValueDeductibles).toHaveBeenCalledWith(500);
  });

  it('handles API response data correctly', async () => {
    const mockData = {
      model: {
        pricingOptions: [
          { deductibleAmount: 500 },
          { deductibleAmount: 1000 },
          { deductibleAmount: 1500 },
        ],
      },
    };
    useApiCall.mockReturnValue({
      makeApiCall: jest.fn().mockResolvedValue(mockData),
      data: mockData,
    });
    render(<SumInsuredAndDeductibles languageData={mockLanguageData} />);
    await waitFor(() => {
      expect(mockContextValue.setcompWorkShop).toHaveBeenCalledWith(mockData.model);
      expect(mockContextValue.setMinDeductibleAmount).toHaveBeenCalledWith(500);
      expect(mockContextValue.setMaxDeductibleAmount).toHaveBeenCalledWith(1500);
    });
  });

  it('handles empty deductible amounts gracefully', () => {
    const emptyContext = {
      ...mockContextValue,
      deductibleAmounts: [],
    };
    useQuoteAndBuyContext.mockReturnValue(emptyContext);
    render(<SumInsuredAndDeductibles languageData={mockLanguageData} />);
    expect(screen.queryByText('500')).not.toBeInTheDocument(); // Min value not shown
    expect(screen.queryByText('1500')).not.toBeInTheDocument(); // Max value not shown
  });

  it('displays max sum insured info', () => {
    render(<SumInsuredAndDeductibles languageData={mockLanguageData} />);
    expect(screen.getByText('Max Sum Insured is 60000')).toBeInTheDocument();
  });
});