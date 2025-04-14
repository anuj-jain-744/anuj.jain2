import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RepairType, {RepairTypeInfo} from '.';
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';

jest.mock('context/PHQuoteBuyContext', () => ({
  usePHQuoteBuyContext: jest.fn(() => ({
    selectedContetBenefits: [],
    setSelectedContetBenefits: jest.fn(),
  })),
}));

// Mock the context hook
jest.mock('components/hooks/useQuoteAndBuyContext');

const mockLanguageData = {
  repair_type: 'Repair Type',
  coverage_type: 'Coverage Type',
  isLatest: false
};

const defaultMockContextValue = {
  setRepairTypeSelected: jest.fn(),
  repairTypeSelected: null,
  compWorkShop: 1000,
  compAgency: 1500,
  compMath: 1200,
  comp3rdParty: null,
  workShopInitialPrice: 1000,
  setWorkShopInitialPrice: jest.fn(),
  mathInitialPrice: 1200,
  setMathInitialPrice: jest.fn(),
  agencyInitialPrice: 1500,
  setAgencyInitialPrice: jest.fn(),
  setComprehensiveCardPrice: jest.fn(),
  sliderValueDeductibles: 500,
  homePremiumResponse: {},
  availableRepairTypes: [],
  setAvailableRepairTypes: jest.fn()
};

// Mock imported components and utilities
jest.mock('../ViewBenefitModal', () => ({ show, onHide, ...props }) => 
  show ? <div data-testid="view-benefit-modal" {...props} /> : null
);
jest.mock('../utils/calculatePremium', () => ({
  calculatePremium: jest.fn(() => ({
    compWorkShopFinalPrice: 1000,
    compAgencyFinalPrice: 1500,
    compMathFinalPrice: 1200,
    minFinalPrice: 1000
  }))
}));
jest.mock('Home/QuoteAndBuy/utils/calculatePremium', () => ({
  calculatePremium: jest.fn(() => ({ minFinalPrice: 1000 }))
}));
jest.mock('../CoveragePlan/CoveragePlanLeft/SelectCoveragePlan/CompareBenefitsAllCoverages', () => 
  () => <div data-testid="compare-benefits" />
);

describe('RepairType Component', () => {
  beforeEach(() => {
    useQuoteAndBuyContext.mockReturnValue(defaultMockContextValue);
    jest.clearAllMocks();
  });

  it('renders repair type card with correct title', () => {
    render(<RepairType languageData={mockLanguageData} coveragePlanSelected="comprehensive" />);
    expect(screen.getByAltText('Tooltip_Logo')).toBeInTheDocument();
  });


  it('opens info modal when tooltip is clicked', async () => {
    render(<RepairType languageData={mockLanguageData} coveragePlanSelected="comprehensive" />);
    fireEvent.click(screen.getByAltText('Tooltip_Logo'));
    await waitFor(() => {
      expect(screen.getByText('Repair Type')).toBeInTheDocument();
    });
  });

  it('updates available repair types based on premium data', () => {
    render(<RepairType languageData={mockLanguageData} coveragePlanSelected="comprehensive" />);
    expect(defaultMockContextValue.setAvailableRepairTypes).toHaveBeenCalledWith(
      expect.arrayContaining(['agency', 'math', 'workShop'])
    );
  });


  it('resets repair type when selected option is no longer available', () => {
    const modifiedContext = {
      ...defaultMockContextValue,
      repairTypeSelected: 'Workshop Repair',
      compWorkShop: null,
      availableRepairTypes: ['math', 'agency']
    };
    useQuoteAndBuyContext.mockReturnValue(modifiedContext);
    render(<RepairType languageData={mockLanguageData} coveragePlanSelected="comprehensive" />);
    expect(modifiedContext.setRepairTypeSelected).toHaveBeenCalledWith('Mawthoq Repair');
  });

  it('handles empty premium data gracefully', () => {
    const emptyContext = {
      ...defaultMockContextValue,
      compWorkShop: null,
      compAgency: null,
      compMath: null,
      comp3rdParty: null
    };
    useQuoteAndBuyContext.mockReturnValue(emptyContext);
    render(<RepairType languageData={mockLanguageData} coveragePlanSelected="comprehensive" />);
  });

  it('does not show tooltip when isLatest is true', () => {
    const latestLanguageData = { ...mockLanguageData, isLatest: true };
    render(<RepairType languageData={latestLanguageData} coveragePlanSelected="comprehensive" />);
    expect(screen.queryByAltText('Tooltip_Logo')).not.toBeInTheDocument();
  });

  it('handles invalid coverage plan type', () => {
    render(<RepairType languageData={mockLanguageData} coveragePlanSelected="invalid" />);
    expect(screen.queryByText('Workshop Repair')).not.toBeInTheDocument();
  });

  it('updates prices when sliderValueDeductibles changes', () => {
    const { rerender } = render(
      <RepairType languageData={mockLanguageData} coveragePlanSelected="comprehensive" />
    );
    const updatedContext = {
      ...defaultMockContextValue,
      sliderValueDeductibles: 1000
    };
    useQuoteAndBuyContext.mockReturnValue(updatedContext);
    rerender(<RepairType languageData={mockLanguageData} coveragePlanSelected="comprehensive" />);
    expect(defaultMockContextValue.setWorkShopInitialPrice).toHaveBeenCalled();
  });
});
it('should reset payload and clear selectedContetBenefits when changing repair type', () => {
  const updateRequestPayload = jest.fn();
  const setSelectedContetBenefits = jest.fn();
  useQuoteAndBuyContext.mockReturnValue({
    ...defaultMockContextValue,
    setRepairTypeSelected: jest.fn(),
    repairTypeSelected: null,
    requestPayload: { dummy: 'payload' },
    updateRequestPayload,
  });
  jest.spyOn(require('context/PHQuoteBuyContext'), 'usePHQuoteBuyContext').mockReturnValue({
    selectedContetBenefits: ['dummyBenefit'],
    setSelectedContetBenefits,
  });
  render(<RepairType languageData={mockLanguageData} coveragePlanSelected="comprehensive" />);
  fireEvent.click(screen.getByText(/Workshop Repair/i));
  expect(setSelectedContetBenefits).toHaveBeenCalledWith([]);
  expect(updateRequestPayload).toHaveBeenCalled();
});

it('renders gracefully with no available repair options', () => {
  useQuoteAndBuyContext.mockReturnValue({
    ...defaultMockContextValue,
    availableRepairTypes: [],
    compWorkShop: null,
    compAgency: null,
    compMath: null,
  });
  render(<RepairType languageData={mockLanguageData} coveragePlanSelected="comprehensive" />);
  expect(screen.queryByText('Workshop Repair')).not.toBeInTheDocument();
});

it('shows ViewBenefitModal with correct price', () => {
  render(<RepairType languageData={mockLanguageData} coveragePlanSelected="comprehensive" />);
  const viewBenefits = screen.getAllByText('View Benefits')[0];
  fireEvent.click(viewBenefits);
  const modal = screen.getByTestId('view-benefit-modal');
  expect(modal).toBeInTheDocument();
  expect(modal).toHaveAttribute('repairType', 'Workshop Repair');
});

it('calculates price using homePremiumResponse for non-core repair types', () => {
  const updatedContext = {
    ...defaultMockContextValue,
    homePremiumResponse: {
      walaacaregold: { value: 100 }
    }
  };
  useQuoteAndBuyContext.mockReturnValue(updatedContext);
  render(<RepairType languageData={mockLanguageData} coveragePlanSelected="buildingcontents" />);
  expect(screen.getByText('Walaa Care Gold')).toBeInTheDocument();
});

it('does not render ViewBenefitModal when selectedRepairType is null', () => {
  useQuoteAndBuyContext.mockReturnValue({
    ...defaultMockContextValue,
    repairTypeSelected: null,
  });
  render(<RepairType languageData={mockLanguageData} coveragePlanSelected="comprehensive" />);
  expect(screen.queryByTestId('view-benefit-modal')).not.toBeInTheDocument();
});

it('matches snapshot', () => {
  const { container } = render(<RepairType languageData={mockLanguageData} coveragePlanSelected="comprehensive" />);
  expect(container).toMatchSnapshot();
});

it('does not render ViewBenefitModal if selectedRepairType is invalid', () => {
  useQuoteAndBuyContext.mockReturnValue({
    ...defaultMockContextValue,
    repairTypeSelected: 'Invalid Repair',
  });
  render(<RepairType languageData={mockLanguageData} coveragePlanSelected="comprehensive" />);
  expect(screen.queryByTestId('view-benefit-modal')).not.toBeInTheDocument();
});

it('renders CompareBenefitsAllCoverages when product is not motor', () => {
  useQuoteAndBuyContext.mockReturnValue({
    ...defaultMockContextValue,
    productName: 'home',
  });
  render(<RepairType languageData={mockLanguageData} coveragePlanSelected="comprehensive" />);
  expect(screen.getByTestId('compare-benefits')).toBeInTheDocument();
});

it('renders contents repair options correctly', () => {
  const contextWithContents = {
    ...defaultMockContextValue,
    homePremiumResponse: {
      walaacare: { value: 100 },
      walaacareplus: { value: 200 }
    }
  };
  useQuoteAndBuyContext.mockReturnValue(contextWithContents);
  render(<RepairType languageData={mockLanguageData} coveragePlanSelected="contents" />);
  expect(screen.getByText(/Walaa Care/i)).toBeInTheDocument();
  expect(screen.getByText(/Walaa Care \+/i)).toBeInTheDocument();
});

it('renders RepairTypeInfo inside modal when tooltip is clicked', async () => {
  render(<RepairType languageData={mockLanguageData} coveragePlanSelected="comprehensive" />);
  fireEvent.click(screen.getByAltText('Tooltip_Logo'));
  await waitFor(() => {
    expect(screen.getByText(/Workshop Repair/i)).toBeInTheDocument();
    expect(screen.getByText(/Agency Repair/i)).toBeInTheDocument();
  });
});

it('falls back to first available option if selected repair type is not found', () => {
  const fallbackContext = {
    ...defaultMockContextValue,
    repairTypeSelected: 'Invalid Option',
    availableRepairTypes: ['workShop', 'agency'],
    setRepairTypeSelected: jest.fn()
  };
  useQuoteAndBuyContext.mockReturnValue(fallbackContext);
  render(<RepairType languageData={mockLanguageData} coveragePlanSelected="comprehensive" />);
  expect(fallbackContext.setRepairTypeSelected).toHaveBeenCalledWith('Workshop Repair');
});

it('handles comp3rdParty repair type in non-comprehensive plans', () => {
  const updatedContext = {
    ...defaultMockContextValue,
    comp3rdParty: 900,
    repairTypeSelected: null,
    setRepairTypeSelected: jest.fn(),
  };
  useQuoteAndBuyContext.mockReturnValue(updatedContext);
  render(<RepairType languageData={mockLanguageData} coveragePlanSelected="thirdparty" />);
  expect(screen.getByText(/Repair Type/i)).toBeInTheDocument();
});

describe('RepairTypeInfo Component', () => {
  it('renders repair type info correctly', () => {
    render(<RepairTypeInfo title="Test Title" description="Test Description" />);
    expect(screen.getByText('Test Title')).toHaveClass('walaa-medium-500');
    expect(screen.getByText('Test Description')).toHaveClass('walaa-regular-400');
  });
});