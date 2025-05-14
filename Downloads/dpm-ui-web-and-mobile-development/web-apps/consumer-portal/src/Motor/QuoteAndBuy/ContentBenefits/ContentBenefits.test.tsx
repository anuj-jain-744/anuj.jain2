import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { usePHQuoteBuyContext } from 'context/PHQuoteBuyContext';
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';
import ContentBenefitsModal from './index';

jest.mock('context/PHQuoteBuyContext', () => ({
  usePHQuoteBuyContext: jest.fn(),
}));

jest.mock('components/hooks/useQuoteAndBuyContext', () => ({
  useQuoteAndBuyContext: jest.fn(),
}));

describe('ContentBenefitsModal Component', () => {
  const mockPHQuoteBuyContext = {
    selectedContetBenefits: [],
    setSelectedContetBenefits: jest.fn(),
    apiErrorMessage: {},
    setApiErrorMessage: jest.fn(),
    showAlertModal: false,
    setShowAlertModal: jest.fn(),
    resetApiErrorMessage: jest.fn(),
  };

  const mockQuoteAndBuyContext = {
    repairTypeSelected: 'Standard',
  };

  const languageData = {
    content_benefits_title: 'Content Benefits',
    enter_category: 'Enter Category',
    enter_value: 'Enter Value',
    add_content: 'Add Content',
    add_more_benefits: 'Add More Benefits',
    field_category: 'Category',
    value_is_sar: 'Value (SAR)',
    delete: 'Delete',
    category_is_required: 'Category is required',
    value_is_required: 'Value is required',
    invalid_value: 'Invalid value',
    declartion_limit: {
      standard: { min: 100, max: 1000, errormessage1: 'Exceeds max limit', errormessage2: 'Below min limit' },
    },
  };

  beforeEach(() => {
    usePHQuoteBuyContext.mockReturnValue(mockPHQuoteBuyContext);
    useQuoteAndBuyContext.mockReturnValue(mockQuoteAndBuyContext);
  });

  test('renders component with title', () => {
    render(<ContentBenefitsModal languageData={languageData} />);
    expect(screen.getByText(/Content Benefits/i)).toBeInTheDocument();
  });

  test('adds a new field on button click', () => {
    render(<ContentBenefitsModal languageData={languageData} />);
    const addButton = screen.getByText(/Add Content/i);
    fireEvent.click(addButton);
    expect(mockPHQuoteBuyContext.setSelectedContetBenefits).toHaveBeenCalled();
  });

  test('validates empty category field', () => {
    const selectedContetBenefits = [{ category: '', value: '', errors: {} }];
    usePHQuoteBuyContext.mockReturnValue({ ...mockPHQuoteBuyContext, selectedContetBenefits });
    
    render(<ContentBenefitsModal languageData={languageData} />);
    
    const categoryInput = screen.getByPlaceholderText(/Enter Category/i);
    fireEvent.blur(categoryInput);
    expect(mockPHQuoteBuyContext.setSelectedContetBenefits).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          errors: expect.objectContaining({ category: 'Category is required' }),
        }),
      ])
    );
  });

  test('validates empty value field', () => {
    const selectedContetBenefits = [{ category: 'Electronics', value: '', errors: {} }];
    usePHQuoteBuyContext.mockReturnValue({ ...mockPHQuoteBuyContext, selectedContetBenefits });
    
    render(<ContentBenefitsModal languageData={languageData} />);
    
    const valueInput = screen.getByPlaceholderText(/Enter Value/i);
    fireEvent.blur(valueInput);
    expect(mockPHQuoteBuyContext.setSelectedContetBenefits).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          errors: expect.objectContaining({ value: 'Value is required' }),
        }),
      ])
    );
  });

  test('removes a field on delete button click', () => {
    const selectedContetBenefits = [{ category: 'Electronics', value: '500', errors: {} }];
    usePHQuoteBuyContext.mockReturnValue({ ...mockPHQuoteBuyContext, selectedContetBenefits });
    
    render(<ContentBenefitsModal languageData={languageData} />);
    
    const deleteButton = screen.getByAltText(/Delete/i);
    fireEvent.click(deleteButton);
    expect(mockPHQuoteBuyContext.setSelectedContetBenefits).toHaveBeenCalled();
  });
});
