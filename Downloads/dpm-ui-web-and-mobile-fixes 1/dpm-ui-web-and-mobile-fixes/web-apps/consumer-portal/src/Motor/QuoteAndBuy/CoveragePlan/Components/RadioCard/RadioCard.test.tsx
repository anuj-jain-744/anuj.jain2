import { render, screen, fireEvent } from '@testing-library/react';
import RadioCard from './index';
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';

// Mock the context hook and imported components
interface DetailsData {
  length: number;
}

jest.mock('components/hooks/useQuoteAndBuyContext');
jest.mock('../ListItemIcon', () => ({ title }: { title: string }) => <span data-testid="list-item-icon">{title}</span>);
jest.mock('./ViewDetails', () => ({ DetailsData, label }: { DetailsData: DetailsData, label: string }) => (
  <div data-testid="view-details" aria-label={label}>
    {DetailsData.length} items
  </div>
));
jest.mock('./RadioCardFooter', () => ({ label, languageData }: { label: string, languageData: any }) => (
  <div data-testid="radio-card-footer">{label} - {languageData?.footerText || 'Footer'}</div>
));

const mockLanguageData = {
  footerText: 'Test Footer',
};

const mockContextValue = {
  setSelectedBenefits: jest.fn(),
  repairTypeSelected: 'Workshop Repair',
  setRepairTypeSelected: jest.fn(),
  coverageType: null,
  availableRepairTypes: ['workShop', 'math', 'agency'],
};

const defaultProps = {
  radiokey: 'comprehensive',
  languageData: mockLanguageData,
  cardlistitems: [
    { id: 1, itemname: 'Item 1' },
    { id: 2, itemname: 'Item 2' },
    { id: 3, itemname: 'Very long item name that exceeds 41 characters limit' },
  ],
  label: 'Comprehensive Coverage',
  checked: false,
  onChange: jest.fn(),
  imageLink: 'test-image.jpg',
  disabled: false,
};

describe('RadioCard Component', () => {
  beforeEach(() => {
    useQuoteAndBuyContext.mockReturnValue(mockContextValue);
    jest.clearAllMocks();
  });

  it('renders card with correct label and image', () => {
    render(<RadioCard {...defaultProps} />);
    expect(screen.getByText('Comprehensive Coverage')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '' })).toHaveAttribute('src', 'test-image.jpg');
  });

  it('renders placeholder when no image is provided', () => {
    render(<RadioCard {...defaultProps} imageLink="" />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByTestId('placeholder')).toBeInTheDocument();
  });

  it('applies correct classes when checked', () => {
    render(<RadioCard {...defaultProps} checked={true} />);
    const card = screen.getByTestId('radiocard-test');
    expect(card).toHaveClass('card-checked');
    expect(card).toHaveClass('radio-card');
    expect(screen.getByTestId('radio-card-footer')).toHaveClass('footer-card-checked');
  });

  it('applies disabled class when disabled', () => {
    render(<RadioCard {...defaultProps} disabled={true} />);
    const card = screen.getByTestId('radiocard-test');
    expect(card).toHaveClass('card-disabled');
  });

  it('handles click event and calls onChange when not disabled', () => {
    render(<RadioCard {...defaultProps} />);
    const card = screen.getByTestId('radiocard-test');
    fireEvent.click(card);
    expect(defaultProps.onChange).toHaveBeenCalledWith('Comprehensive Coverage');
    expect(mockContextValue.setSelectedBenefits).toHaveBeenCalledWith([]);
  });

  it('does not call onChange when disabled', () => {
    render(<RadioCard {...defaultProps} disabled={true} />);
    const card = screen.getByTestId('radiocard-test');
    fireEvent.click(card);
    expect(defaultProps.onChange).not.toHaveBeenCalled();
    expect(mockContextValue.setSelectedBenefits).not.toHaveBeenCalled();
  });

  it('renders limited list items with icons', () => {
    render(<RadioCard {...defaultProps} />);
    const listItemIcons = screen.getAllByTestId('list-item-icon');
    expect(listItemIcons).toHaveLength(2); // Only items with id <= 2 should have icons
    expect(listItemIcons[0]).toHaveTextContent('Item 1');
    expect(listItemIcons[1]).toHaveTextContent('Item 2');
  });

  it('applies different styling for long item names', () => {
    render(<RadioCard {...defaultProps} />);
    const listItems = screen.getAllByText(/Item/);
    const longItem = screen.getByText('Very long item name that exceeds 41 characters limit');
    expect(listItems[0].parentElement).toHaveClass('align-items-center');
    expect(longItem.parentElement).not.toHaveClass('align-items-center');
  });

  it('renders ViewDetails with correct props', () => {
    render(<RadioCard {...defaultProps} />);
    const viewDetails = screen.getByTestId('view-details');
    expect(viewDetails).toHaveTextContent('3 items');
    expect(viewDetails).toHaveAttribute('aria-label', 'Comprehensive Coverage');
  });

  it('renders RadioCardFooter with correct props', () => {
    render(<RadioCard {...defaultProps} />);
    const footer = screen.getByTestId('radio-card-footer');
    expect(footer).toHaveTextContent('comprehensive - Test Footer');
  });

  it('updates repairTypeSelected in context on change', () => {
    render(<RadioCard {...defaultProps} />);
    expect(mockContextValue.setRepairTypeSelected).toHaveBeenCalledWith('Workshop Repair');
  });

  it('handles empty cardlistitems gracefully', () => {
    render(<RadioCard {...defaultProps} cardlistitems={[]} />);
    expect(screen.queryByTestId('list-item-icon')).not.toBeInTheDocument();
    expect(screen.getByTestId('view-details')).toHaveTextContent('0 items');
  });

  it('uses default footer text when languageData is null', () => {
    render(<RadioCard {...defaultProps} languageData={null} />);
    expect(screen.getByTestId('radio-card-footer')).toHaveTextContent('comprehensive - Footer');
  });
});