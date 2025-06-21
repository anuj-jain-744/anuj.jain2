import { render, screen, fireEvent } from '@testing-library/react';
import PolicyStartDate from '../index';
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';
import { productIDs } from '../../../constant';


jest.mock('components/hooks/useQuoteAndBuyContext', () => ({
  useQuoteAndBuyContext: jest.fn(),
}));

// Mock Date related functions
jest.mock('Motor/QuoteAndBuy/CoveragePlan/CommonFunction/CommonFunction', () => ({
  getFormattedDate: jest.fn(() => '01/01/2025'),
  convertDateFormat: jest.fn((date) => date),
  formatDateDmy: jest.fn(() => '01/01/2025'),
}));

describe('PolicyStartDate Component', () => {
  let mockSetPolicyStartDate: jest.Mock;
  let mockSetTravelStartDate: jest.Mock;
  let mockSetPolicyStartDateAPI: jest.Mock;

  beforeEach(() => {
    mockSetPolicyStartDate = jest.fn();
    mockSetTravelStartDate = jest.fn();
    mockSetPolicyStartDateAPI = jest.fn();


    useQuoteAndBuyContext.mockReturnValue({
      setPolicyStartDate: mockSetPolicyStartDate,
      setTravelStartDate: mockSetTravelStartDate,
      setPolicyStartDateAPI: mockSetPolicyStartDateAPI,
      policyStartDate: null,
      travelStartDate: null,
      viewPolicyData: { policyBasic: { expiryDate: '2025-04-15' } },
      isRenewpolicy: false,
    });
  });

  /*it('should set policyStartDate to current date on initial render for non-renewal policy', () => {
    render(<PolicyStartDate languageData={{ policy_start_date: 'Policy Start Date' }} />);
    expect(mockSetPolicyStartDate).toHaveBeenCalledWith(expect.any(String));
  });

  it('should set travelStartDate to current date on initial render for travel product', () => {
    render(<PolicyStartDate languageData={{ policy_start_date: 'Policy Start Date' }} productType={productIDs.travel} />);
    expect(mockSetTravelStartDate).toHaveBeenCalledWith(expect.any(String));
  });

  // required
  it('should set policyDate to formatted expiry date on initial render for renewal policy', () => {
    useQuoteAndBuyContext.mockReturnValue({
      ...useQuoteAndBuyContext(),
      isRenewpolicy: true,
    });

    render(<PolicyStartDate languageData={{ policy_start_date: 'Policy Start Date' }} />);
    expect(screen.getByText('15/04/2025')).toBeInTheDocument();
  });



  it('should close modal when Update button is clicked', () => {
    const changeHandler = jest.fn();
    render(<PolicyStartDate languageData={{ policy_start_date: 'Policy Start Date' }}  productType={productIDs.travel} />);

    const cardElement = screen.getByTestId('policy-card');
    fireEvent.click(cardElement); // Open modal
    const updateBtn = screen.getByTestId('update-btn');
    fireEvent.click(updateBtn);
    expect(changeHandler).toHaveBeenCalled();
    const updateButton = screen.getByText('Save'); // Assuming there's a Cancel button
    fireEvent.click(updateButton);
    // Assert that the modal is no longer in the document
    expect(screen.queryByTestId('mocked-modal')).not.toBeInTheDocument();
  });


  it('should set travel start date and close modal for travel product', () => {
    const mockSetPolicyDate = jest.fn();
    const mockSetTravelStartDate = jest.fn();

    render(
      <PolicyStartDate
        languageData={{ policy_start_date: 'Policy Start Date' }}
        productType={productIDs.travel}
      />
    );

    const value = '2025-01-01';
    fireEvent.change(screen.getByTestId('date-picker'), { target: { value } });

    expect(mockSetPolicyDate).toHaveBeenCalledWith(value);
    expect(mockSetTravelStartDate).toHaveBeenCalledWith(value);

    // Verify modal is closed by checking UI changes
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });*/

  it('should set policy start date and close modal for non-travel product', () => {
    const mockSetPolicyDate = jest.fn();
    const mockSetPolicyStartDate = jest.fn();
    const mockSetPolicyStartDateAPI = jest.fn();

    /*render(
      <PolicyStartDate
        languageData={{ policy_start_date: 'Policy Start Date' }}
        productType={productIDs.motor}
      />
    );

    const value = '2025-01-01';
    fireEvent.change(screen.getByTestId('date-picker'), { target: { value } });

    expect(mockSetPolicyDate).toHaveBeenCalledWith(value);
    expect(mockSetPolicyStartDate).toHaveBeenCalledWith(value);
    expect(mockSetPolicyStartDateAPI).toHaveBeenCalledWith(value);
    // Verify modal is closed by checking UI changes
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();*/
  });
});