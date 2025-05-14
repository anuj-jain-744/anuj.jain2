import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QuoteCards from './index';
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";   
import { MouseEventHandler } from 'react';

// Mock the useQuoteAndBuyContext hook
jest.mock('components/hooks/useQuoteAndBuyContext');


// Mock the PackageTypeModal component
jest.mock('../QuoteCard/PackageTypeModal', () => (props: {
  onHide: MouseEventHandler<HTMLButtonElement> | undefined; title: string;
}) => {
  return (
    <div data-testid="package-type-modal">
      <button onClick={props.onHide}>Close</button>
      <div>{props.title}</div>
    </div>
  );
});

describe('QuoteCards', () => {
  const mockLanguageData = {
    comprehensive_third_party: [
      {
        key: 'comprehensive',
        title: 'Comprehensive Package',
        image: 'comprehensive.png',
        details: [
          { itemname: 'Accidental collision or overturning', id: 1 },
          { itemname: 'Fire, lightning and explosion.', id: 2 },
          { itemname: 'Theft or attempted theft.', id: 3 },
          { itemname: 'Theft or attempted theft.', id: 4 },
          { itemname: 'Theft or attempted theft.', id: 5 },

        ],
      },
    ],
    view_details: 'View Details',
    edit_plan: 'Edit Plan',
  };

  const mockSetLeftStep = jest.fn();

  beforeEach(() => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      selectedPackage: 'comprehensive',
      coverageType: 'comprehensive',
    });
  });

  test('renders QuoteCards with package data', () => {
    render(
      <QuoteCards languageData={{ ...mockLanguageData, label: '', key: '' }} setLeftStep={mockSetLeftStep} leftStep={1} />
    );

    expect(screen.getAllByText('Comprehensive Package')).toHaveLength(1);
    expect(screen.getByText('Edit Plan')).toBeInTheDocument();
    expect(screen.getByText('Accidental collision or overturning')).toBeInTheDocument();
    expect(screen.getByText('Fire, lightning and explosion.')).toBeInTheDocument();
    expect(screen.getByText('Theft or attempted theft.')).toBeInTheDocument();
    expect(screen.getByText('View Details')).toBeInTheDocument();
  });

  test('calls setLeftStep when Edit Plan button is clicked', () => {
    render(
      <QuoteCards languageData={mockLanguageData} setLeftStep={mockSetLeftStep} leftStep={1} />
    );

    const editButton = screen.getByText('Edit Plan');
    fireEvent.click(editButton);

    expect(mockSetLeftStep).toHaveBeenCalledWith(2);
  });

  test('opens and closes PackageTypeModal', async () => {
    render(
      <QuoteCards languageData={mockLanguageData} setLeftStep={mockSetLeftStep} leftStep={1} />
    );

    const viewDetailsLink = screen.getByText('View Details');
    fireEvent.click(viewDetailsLink);

    expect(screen.getByTestId('package-type-modal')).toBeInTheDocument();
    expect(screen.getAllByText('Comprehensive Package')).toHaveLength(2);

    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);

    expect(screen.queryByTestId("package-type-modal")).not.toBeInTheDocument();
 
  });
});