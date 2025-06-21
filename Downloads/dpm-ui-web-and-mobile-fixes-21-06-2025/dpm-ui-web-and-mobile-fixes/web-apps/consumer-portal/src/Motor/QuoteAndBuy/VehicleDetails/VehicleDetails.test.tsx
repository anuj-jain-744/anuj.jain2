import React from 'react';
import { render, screen } from '@testing-library/react';
import VehicleDetails from './VehicleDetails';
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';
import useLanguageData from 'Motor/Policy-services/AccessPolicyDocuments/hooks/useLanguageData';

// Mock the dependencies
jest.mock('components/hooks/useQuoteAndBuyContext');
jest.mock('Motor/Policy-services/AccessPolicyDocuments/hooks/useLanguageData');
jest.mock('../ValidateVehicle/ValidateVehicle', () => {
  return function MockValidateVehicle() {
    return <div data-testid="validate-vehicle">Validate Vehicle</div>;
  };
});

// Mock getAmountWithIcon
jest.mock('@app-shell/utils/common', () => ({
  getAmountWithIcon: jest.fn(amount => `SAR ${amount}`),
  getCurrencySymbol: jest.fn(() => 'SAR'),
}));

jest.mock('./VehicleDetailSection', () => {
  return function MockVehicleDetailSection() {
    return <div data-testid="vehicle-detail-section">Vehicle Detail Section</div>;
  };
});
jest.mock('../CoveragePlan', () => {
  return function MockCoveragePlan() {
    return <div data-testid="coverage-plan">Coverage Plan</div>;
  };
});
jest.mock('../ReviewQuotation/ReviewQuotation', () => {
  return function MockReviewQuotation() {
    return <div data-testid="review-quotation">Review Quotation</div>;
  };
});
jest.mock('../UserCard/UserCard', () => {
  return function MockUserCard() {
    return <div data-testid="user-card">User Card</div>;
  };
});

jest.mock('components/PolicyStartDate', () => {
  return function MockPolicyStartDate() {
    return <div data-testid="policy-start-date">Policy Start Date</div>;
  };
});
jest.mock('../CoveragePlan/CoveragePlanRight/VehicleInformation', () => {
  return function MockVehicleInformation() {
    return <div data-testid="vehicle-information">Vehicle Information</div>;
  };
});
jest.mock('components/ErrorComponent/Error', () => {
  return function MockErrorPage() {
    return <div data-testid="error-page">Error Page</div>;
  };
});

describe('VehicleDetails', () => {
  const mockNavigateTo = jest.fn();
  const mockLanguageData = { someKey: 'someValue' };

  beforeEach(() => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      stepValue: 0,
      setStepValue: jest.fn(),
    });
    (useLanguageData as jest.Mock).mockReturnValue({
      languageData: mockLanguageData,
      isLoading: false,
      error: null,
    });
  });

  it('renders ValidateVehicle when stepValue is 0', () => {
    render(<VehicleDetails navigateTo={mockNavigateTo} />);
    expect(screen.getByTestId('validate-vehicle')).toBeInTheDocument();
  });

  it('renders VehicleDetailSection when stepValue is 1', () => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      stepValue: 1,
      setStepValue: jest.fn(),
    });
    render(<VehicleDetails navigateTo={mockNavigateTo} />);
    expect(screen.getByTestId('vehicle-detail-section')).toBeInTheDocument();
  });

  it('renders CoveragePlan when stepValue is 2', () => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      stepValue: 2,
      setStepValue: jest.fn(),
    });
    render(<VehicleDetails navigateTo={mockNavigateTo} />);
    expect(screen.getByTestId('coverage-plan')).toBeInTheDocument();
  });

  it('renders ReviewQuotation when stepValue is 3', () => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      stepValue: 3,
      setStepValue: jest.fn(),
    });
    render(<VehicleDetails navigateTo={mockNavigateTo} />);
    expect(screen.getByTestId('review-quotation')).toBeInTheDocument();
  });

  it('renders nothing in leftPanel when stepValue is invalid', () => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      stepValue: 999,
      setStepValue: jest.fn(),
    });
    render(<VehicleDetails navigateTo={mockNavigateTo} />);
    expect(screen.queryByTestId('validate-vehicle')).not.toBeInTheDocument();
    expect(screen.queryByTestId('vehicle-detail-section')).not.toBeInTheDocument();
    expect(screen.queryByTestId('coverage-plan')).not.toBeInTheDocument();
    expect(screen.queryByTestId('review-quotation')).not.toBeInTheDocument();
  });

  it('always renders UserCard in rightPanel', () => {
    render(<VehicleDetails navigateTo={mockNavigateTo} />);
    expect(screen.getByTestId('user-card')).toBeInTheDocument();
  });

  it('renders PolicyStartDate and VehicleInformation when stepValue is 2', () => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      stepValue: 2,
      setStepValue: jest.fn(),
    });
    render(<VehicleDetails navigateTo={mockNavigateTo} />);
    expect(screen.getByTestId('policy-start-date')).toBeInTheDocument();
    expect(screen.getByTestId('vehicle-information')).toBeInTheDocument();
  });

  it('does not render PolicyStartDate and VehicleInformation when stepValue is not 2', () => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      stepValue: 1,
      setStepValue: jest.fn(),
    });
    render(<VehicleDetails navigateTo={mockNavigateTo} />);
    expect(screen.queryByTestId('policy-start-date')).not.toBeInTheDocument();
    expect(screen.queryByTestId('vehicle-information')).not.toBeInTheDocument();
  });

  it('renders ErrorPage when there is a language error', () => {
    (useLanguageData as jest.Mock).mockReturnValue({
      languageData: null,
      isLoading: false,
      error: new Error('Language error'),
    });
    render(<VehicleDetails navigateTo={mockNavigateTo} />);
    expect(screen.getByTestId('error-page')).toBeInTheDocument();
  });

  it('passes languageData to child components', () => {
    const mockLanguageData = { someKey: 'someValue' };
    (useLanguageData as jest.Mock).mockReturnValue({
      languageData: mockLanguageData,
      isLoading: false,
      error: null,
    });
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      stepValue: 2,
      setStepValue: jest.fn(),
    });
    render(<VehicleDetails navigateTo={mockNavigateTo} />);
    expect(screen.getByTestId('coverage-plan')).toBeInTheDocument();
    expect(screen.getByTestId('user-card')).toBeInTheDocument();
    expect(screen.getByTestId('policy-start-date')).toBeInTheDocument();
    expect(screen.getByTestId('vehicle-information')).toBeInTheDocument();
  });
});

