import React from 'react';
import { render, screen } from '@testing-library/react';
import CoveragePlanLeft from './index';
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';
import { IComprehensive, IThirdParty, BuildingContents, Contents } from '../ConstantValue/ConstantValue';

jest.mock('components/hooks/useQuoteAndBuyContext');
jest.mock('./SelectCoveragePlan', () => () => <div>SelectCoveragePlan</div>);
jest.mock('Motor/QuoteAndBuy/ContentBenefits', () => () => <div>ContentBenefits</div>);
jest.mock('Motor/QuoteAndBuy/PropertyPhotos', () => () => <div>PropertyPhotos</div>);
jest.mock('Motor/QuoteAndBuy/AdditionalBenefits', () => () => <div>AdditionalBenefits</div>);

describe('CoveragePlanLeft', () => {
  const defaultProps = {
    languageData: { someKey: 'someValue' },
    coveragePlanData: [],
    onChange: jest.fn(),
    coveragePlanSelected: null,
    isCoverageTypeDowngrading: false,
    clickHandlerRenewDowngrade: jest.fn(),
    onRepairTypeChecked: jest.fn(),
  };

  const renderComponent = (props = {}) => {
    return render(<CoveragePlanLeft {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({ repairTypeSelected: false });
  });

  it('renders the component with default props', () => {
    renderComponent();
    expect(screen.getByText('SelectCoveragePlan')).toBeInTheDocument();
  });

  it('renders AdditionalBenefits when coveragePlanSelected is IComprehensive and repairTypeSelected is true', () => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({ repairTypeSelected: true });
    renderComponent({ coveragePlanSelected: IComprehensive });
    expect(screen.getByText('AdditionalBenefits')).toBeInTheDocument();
  });

  it('renders AdditionalBenefits when coveragePlanSelected is IThirdParty', () => {
    renderComponent({ coveragePlanSelected: IThirdParty });
    expect(screen.getByText('AdditionalBenefits')).toBeInTheDocument();
  });

  it('renders ContentBenefits and PropertyPhotos when coveragePlanSelected is BuildingContents and repairTypeSelected is true', () => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({ repairTypeSelected: true });
    renderComponent({ coveragePlanSelected: BuildingContents });
    expect(screen.getByText('ContentBenefits')).toBeInTheDocument();
    expect(screen.getByText('PropertyPhotos')).toBeInTheDocument();
  });

  it('renders ContentBenefits and PropertyPhotos when coveragePlanSelected is Contents and repairTypeSelected is true', () => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({ repairTypeSelected: true });
    renderComponent({ coveragePlanSelected: Contents });
    expect(screen.getByText('ContentBenefits')).toBeInTheDocument();
    expect(screen.getByText('PropertyPhotos')).toBeInTheDocument();
  });

  it('does not render AdditionalBenefits, ContentBenefits, or PropertyPhotos when repairTypeSelected is false', () => {
    renderComponent({ coveragePlanSelected: IComprehensive });
    expect(screen.queryByText('AdditionalBenefits')).not.toBeInTheDocument();
    expect(screen.queryByText('ContentBenefits')).not.toBeInTheDocument();
    expect(screen.queryByText('PropertyPhotos')).not.toBeInTheDocument();
  });
});