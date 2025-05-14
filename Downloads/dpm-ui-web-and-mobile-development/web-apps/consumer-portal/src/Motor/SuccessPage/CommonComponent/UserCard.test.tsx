import React from 'react';
import { render, screen } from '@testing-library/react';
import UserCard from './UserCard';
import { LanguageData } from 'types/languageData';
import { SuccessPagePolicyData } from 'types/quoteAndBuy';
import { truncateName } from 'utils/quoteAndBuy'; // Make sure this utility is imported properly
import { getLabelOfIqmaIdNationalId } from '@dpm/shared-module'; // Ensure this is correctly imported

// Mock functions to isolate tests
jest.mock('utils/quoteAndBuy', () => ({
  truncateName: jest.fn(),
}));

jest.mock('@dpm/shared-module', () => ({
  getLabelOfIqmaIdNationalId: jest.fn(),
}));

describe('UserCard Component', () => {
  const mockLanguageData: LanguageData = {
    mobile_number: 'Mobile Number',
    nationalityId: 'Nationality ID',
    iqama_no: 'Iqama No',
    national_id: 'National ID',
    field_corporate_id: 'Corporate ID',
  };

  const mockPolicyData: SuccessPagePolicyData = {
    customerNameEnglish: 'John Doe Very Long Name',
    customerNameArabic: 'جون دو',
    nationalityId: '123456789',
    mobileNo: '9876543210',
  };

  beforeEach(() => {
    // Reset mocks before each test
    (truncateName as jest.Mock).mockClear();
    (getLabelOfIqmaIdNationalId as jest.Mock).mockClear();
  });

  test('renders UserCard with correct information', () => {
    // Mock the function for truncation
    (truncateName as jest.Mock).mockReturnValue('John Doe');

    render(<UserCard policyData={mockPolicyData} languageData={mockLanguageData} />);

    // Check if the English name is rendered and truncated correctly
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    
    // Check if the Arabic name is rendered
    expect(screen.getByText('جون دو')).toBeInTheDocument();

    // Check if nationality ID and mobile number are rendered correctly
    expect(screen.getByText('123456789')).toBeInTheDocument();
    expect(screen.getByText('9876543210')).toBeInTheDocument();
  });

  test('truncates name if it exceeds the character limit', () => {
    // Mock the function for truncation
    (truncateName as jest.Mock).mockReturnValue('John Doe');

    render(<UserCard policyData={mockPolicyData} languageData={mockLanguageData} />);

    // Check if the name is truncated correctly
    expect(truncateName).toHaveBeenCalledWith(mockPolicyData.customerNameEnglish, 12);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  test('renders UserInfo for Nationality ID with correct label and value', () => {
    (getLabelOfIqmaIdNationalId as jest.Mock).mockReturnValue('National ID');
    
    render(<UserCard policyData={mockPolicyData} languageData={mockLanguageData} />);

    // Check if the Nationality ID label is rendered correctly
    expect(screen.getByText('National ID')).toBeInTheDocument();
    expect(screen.getByText('123456789')).toBeInTheDocument();
  });

  test('renders UserInfo for Mobile Number with correct label and value', () => {
    render(<UserCard policyData={mockPolicyData} languageData={mockLanguageData} />);

    // Check if the Mobile Number label is rendered correctly
    expect(screen.getByText('Mobile Number')).toBeInTheDocument();
    expect(screen.getByText('9876543210')).toBeInTheDocument();
  });

  test('handles undefined or missing policyData', () => {
    render(<UserCard policyData={undefined} languageData={mockLanguageData} />);

    // Check if the component does not break and renders nothing when policyData is undefined
    expect(screen.queryByText('John Doe Very Long Name')).not.toBeInTheDocument();
    expect(screen.queryByText('9876543210')).not.toBeInTheDocument();
  });
});
