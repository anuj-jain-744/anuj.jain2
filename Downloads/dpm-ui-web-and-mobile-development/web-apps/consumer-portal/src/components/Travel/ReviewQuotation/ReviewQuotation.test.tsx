import { render, screen, fireEvent } from '@testing-library/react';
import ReviewQuotation from 'components/Travel/ReviewQuotation/ReviewQuotation'
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';
 

// Mocking child components to simplify the test case
jest.mock('components/QuoteCard', () => () => <div>QuoteCard</div>);
jest.mock('components/Travel/TravelDetailCard', () => () => <div>TravelDetailCard</div>);
jest.mock('components/DeclarationCard', () => () => <div>DeclarationCard</div>);
jest.mock('components/SubscribeEmail', () => () => <div>SubscribeEmail</div>);
 
jest.mock('components/BuyProductHeading', () => () => <div>BuyProductHeading</div>);
jest.mock('components/TravelerAddDetails/AddAdditionalTraveller', () => () => <div>AddAdditionalTraveller</div>);
jest.mock('components/Travel/TravelInfoCard', () => () => <div>TravelInfoCard</div>);

// Mocking the useQuoteAndBuyContext hook
jest.mock('components/hooks/useQuoteAndBuyContext', () => ({
  useQuoteAndBuyContext: jest.fn(),
}));

describe('ReviewQuotation Component', () => {
  let mockSetLeftStep: jest.Mock;
  let mockSetEmail: jest.Mock;
  let mockSetIsTermCondition: jest.Mock;

  beforeEach(() => {
    mockSetLeftStep = jest.fn();
    mockSetEmail = jest.fn();
    mockSetIsTermCondition = jest.fn();

    // Mocking the useQuoteAndBuyContext hook return values
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      email: 'test@example.com',
      setEmail: mockSetEmail,
      isTermCondition: false,
      setIsTermCondition: mockSetIsTermCondition,
    });
  });

  it('should render the component correctly', () => {
    const languageData = {
      review_and_make_payment: 'Review and Make Payment',
      traveller_details: 'Traveller Details',
      declaration_confirmation: 'I confirm the declaration',
      personarrary: ['Item 1', 'Item 2'],
    };

    render(
      <ReviewQuotation
        languageData={languageData}
        setLeftStep={mockSetLeftStep}
        leftStep={1}
        data={{}}
      />
    );

    // Check if BuyProductHeading is rendered with correct text
    expect(screen.getByText('Review and Make Payment')).toBeInTheDocument();
    expect(screen.getByText('Traveller Details')).toBeInTheDocument();

    // Check if child components are rendered
    expect(screen.getByText('QuoteCard')).toBeInTheDocument();
    expect(screen.getByText('TravelDetailCard')).toBeInTheDocument();
    expect(screen.getByText('TravelInfoCard')).toBeInTheDocument();
    expect(screen.getByText('AddAdditionalTraveller')).toBeInTheDocument();
    expect(screen.getByText('DeclarationCard')).toBeInTheDocument();
    expect(screen.getByText('SubscribeEmail')).toBeInTheDocument();
  });

  it('should handle adding adult, child, and senior citizen counts', () => {
    const languageData = { traveller_details: 'Traveller Details' };
    render(
      <ReviewQuotation
        languageData={languageData}
        setLeftStep={mockSetLeftStep}
        leftStep={1}
        data={{}}
      />
    );

    // Test that the counts are initially 0
    expect(screen.queryByText('Adult Count: 0')).toBeNull();
    expect(screen.queryByText('Child Count: 0')).toBeNull();
    expect(screen.queryByText('Senior Citizen Count: 0')).toBeNull();

    // Assuming AddAdditionalTraveller modifies the counts, simulate interaction
    fireEvent.change(screen.getByLabelText('/adult count/i'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('Child Count/i'), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText('Senior Citizen Count/i'), { target: { value: '1' } });

    // Check if the state updates correctly
    expect(screen.getByText('Adult Count: 1')).toBeInTheDocument();
    expect(screen.getByText('Child Count: 2')).toBeInTheDocument();
    expect(screen.getByText('Senior Citizen Count: 1')).toBeInTheDocument();
  });

  it('should handle email input change', () => {
    const languageData = { review_and_make_payment: 'Review and Make Payment' };
    render(
      <ReviewQuotation
        languageData={languageData}
        setLeftStep={mockSetLeftStep}
        leftStep={1}
        data={{}}
      />
    );

    // Simulate email input change
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'newemail@example.com' },
    });

    // Ensure setEmail is called with the correct value
    expect(mockSetEmail).toHaveBeenCalledWith('newemail@example.com');
  });

  it('should handle Terms and Conditions checkbox change', () => {
    const languageData = { review_and_make_payment: 'Review and Make Payment' };
    render(
      <ReviewQuotation
        languageData={languageData}
        setLeftStep={mockSetLeftStep}
        leftStep={1}
        data={{}}
      />
    );

    // Simulate checkbox click
    const checkbox = screen.getByLabelText(/I agree to the terms and conditions/i);
    fireEvent.click(checkbox);

    // Ensure setIsTermCondition is called
    expect(mockSetIsTermCondition).toHaveBeenCalledWith(true);
  });

 

  it('should show declaration section if data exists', () => {
    const languageData = {
      review_and_make_payment: 'Review and Make Payment',
      traveller_details: 'Traveller Details',
      declaration_confirmation: 'I confirm the declaration',
      personarrary: ['Item 1', 'Item 2'],
    };

    render(
      <ReviewQuotation
        languageData={languageData}
        setLeftStep={mockSetLeftStep}
        leftStep={1}
        data={{}}
      />
    );

    // Ensure declaration text is displayed
    expect(screen.getByText('I confirm the declaration')).toBeInTheDocument();
  });

  it('should not render declaration section if data is missing', () => {
    const languageData = {
      review_and_make_payment: 'Review and Make Payment',
      traveller_details: 'Traveller Details',
    };

    render(
      <ReviewQuotation
        languageData={languageData}
        setLeftStep={mockSetLeftStep}
        leftStep={1}
        data={{}}
      />
    );

    // Ensure declaration text is not displayed
    expect(screen.queryByText('I confirm the declaration')).toBeNull();
  });
});

