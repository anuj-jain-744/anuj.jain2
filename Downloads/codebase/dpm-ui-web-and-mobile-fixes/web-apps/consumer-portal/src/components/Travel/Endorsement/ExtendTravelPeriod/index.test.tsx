import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ExtendTravelPeriod from './index';
import { useApiCall } from '@dpm/shared-module';
import { BrowserRouter } from 'react-router-dom';

// Mocking dependencies
jest.mock('@dpm/shared-module', () => ({
  useApiCall: jest.fn(),
}));

jest.mock('components/Calendar/fullcalender', () => ({
  FullCalender: ({ onChange }: { onChange: (date: Date) => void }) => (
    <input
      type="date"
      data-testid="calendar"
      onChange={(e) => onChange(new Date(e.target.value))}
    />
  ),
}));

jest.mock('components/ThemeDropdown/ThemeDropdown', () => ({
  __esModule: true,
  default: ({ onChangehandler, selectedValue }: any) => (
    <select
      data-testid="dropdown"
      value={selectedValue}
      onChange={(e) => onChangehandler(e)}
    >
      <option value="">Select days</option>
      <option value="7 Days">7 Days</option>
      <option value="14 Days">14 Days</option>
    </select>
  ),
}));

jest.mock('components/AlertBox', () => ({
  AlertBox: ({ title, description }: any) => (
    <div data-testid="alert-box">
      <p>{title}</p>
      <p>{description}</p>
    </div>
  ),
}));

jest.mock('claims/register/compensation/TermsAndCon', () => ({
  __esModule: true,
  default: ({ isChecked, setIsChecked }: any) => (
    <input
      type="checkbox"
      data-testid="terms-checkbox"
      checked={isChecked}
      onChange={(e) => setIsChecked(e.target.checked)}
    />
  ),
}));

describe('ExtendTravelPeriod Component', () => {
  const mockTravelData = {
    extend_travel_period: 'Extend Travel Period',
    policy_premium_text: 'Policy Premium Text',
    current_policy_end_date: 'Current Policy End Date',
    extended_policy_end_date: 'Extended Policy End Date',
  };

  const mockLanguageData = {
    terms_and_conditions: 'Terms and Conditions',
  };

  const mockApiCall = {
    makeApiCall: jest.fn(),
    isLoading: false,
    errors: null,
    data: {
      model: {
        content: [
          { codeDesc: '7 Days' },
          { codeDesc: '14 Days' },
        ],
      },
    },
  };

  beforeEach(() => {
    (useApiCall as jest.Mock).mockReturnValue(mockApiCall);
  });

  it('renders the component correctly', () => {
    render(
      <BrowserRouter>
        <ExtendTravelPeriod
          travelData={mockTravelData}
          cardData={{}}
          languageData={mockLanguageData}
        />
      </BrowserRouter>
    );
  
    // Use a more specific query to avoid ambiguity
    const header = screen.getByText('Extend Travel Period', { selector: '.header-body' });
    expect(header).toBeInTheDocument();
  
    const policyText = screen.getByText('Policy Premium Text');
    expect(policyText).toBeInTheDocument();
  });

  it('handles date selection', () => {
    render(
      <BrowserRouter>
        <ExtendTravelPeriod
          travelData={mockTravelData}
          cardData={{}}
          languageData={mockLanguageData}
        />
      </BrowserRouter>
    );

    const calendar = screen.getByTestId('calendar');
    fireEvent.change(calendar, { target: { value: '2025-07-10' } });

    expect((calendar as HTMLInputElement).value).toBe('2025-07-10');
  });

  it('handles dropdown selection and calculates end date', async () => {
    render(
      <BrowserRouter>
        <ExtendTravelPeriod
          travelData={mockTravelData}
          cardData={{}}
          languageData={mockLanguageData}
        />
      </BrowserRouter>
    );

    const dropdown = screen.getByTestId('dropdown');
    fireEvent.change(dropdown, { target: { value: '7 Days' } });

    await waitFor(() => {
      expect(screen.getByText('Extended Policy End Date')).toBeInTheDocument();
    });
  });

  it('displays alert box on API error', async () => {
    (useApiCall as jest.Mock).mockReturnValue({
      ...mockApiCall,
      errors: { name: 'Error', messages: { message_en: 'Something went wrong!' } },
    });

    render(
      <BrowserRouter>
        <ExtendTravelPeriod
          travelData={mockTravelData}
          cardData={{}}
          languageData={mockLanguageData}
        />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('alert-box')).toBeInTheDocument();
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
    });
  });

  it('handles terms and conditions checkbox', () => {
    render(
      <BrowserRouter>
        <ExtendTravelPeriod
          travelData={mockTravelData}
          cardData={{}}
          languageData={mockLanguageData}
        />
      </BrowserRouter>
    );

    const checkbox = screen.getByTestId('terms-checkbox');
    fireEvent.click(checkbox);

    expect((checkbox as HTMLInputElement).checked).toBe(true);
  });
});