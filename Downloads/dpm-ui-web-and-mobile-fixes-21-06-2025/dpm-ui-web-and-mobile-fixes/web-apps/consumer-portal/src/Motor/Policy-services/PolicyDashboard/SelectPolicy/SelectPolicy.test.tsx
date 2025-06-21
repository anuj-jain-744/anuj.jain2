import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import SelectPolicy from './SelectPolicy'
import useLanguageData from 'Motor/Policy-services/AccessPolicyDocuments/hooks/useLanguageData'
import { useApiCall } from '@dpm/shared-module'

jest.mock('@dpm/shared-module');

const mockPolicies = {
  result: [
    { policyNo: '123', isNotificationEnable: true, endorsementNo: null },
    { policyNo: '456', isNotificationEnable: false, endorsementNo: "E-001" },
    { policyNo: '456', isNotificationEnable: false, endorsementNo: null },

  ],
}

const mockMakeApiCall = jest.fn();
const mockSetAllPolicy = jest.fn();
// Mock the useLanguageData hook
jest.mock('Motor/Policy-services/AccessPolicyDocuments/hooks/useLanguageData')

// Mock the imported components and assets
jest.mock('components/Spinner', () => ({
  __esModule: true,
  default: () => <div data-testid="default-spinner">Loading...</div>,
}))

jest.mock('components/ErrorComponent/Error', () => ({
  __esModule: true,
  default: () => <div data-testid="error-page">Error occurred</div>,
}))

jest.mock('./SelectYourPolicy', () => ({
  __esModule: true,
  default: ({ policyNumber, isSelected, onSelect }: {policyNumber: number, isSelected: boolean, onSelect: (val: number) => void}) => (
    <div data-testid={`policy-${policyNumber}`} onClick={() => onSelect(policyNumber)}>
      {policyNumber} {isSelected ? '(Selected)' : ''}
    </div>
  ),
}))

jest.mock('assets/PolicySelection/info.svg', () => 'info-icon.svg')
jest.mock('assets/PolicySelection/infoTooltip.svg', () => 'info-tooltip-icon.svg')
jest.mock('assets/PolicySelection/vectors.svg', () => 'vector-icon.svg')

describe('SelectPolicy', () => {
  const mockOnPolicySelect = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders error page when there is a language error', () => {
    (useLanguageData as jest.Mock).mockReturnValue({
      languageData: null,
      isLoading: false,
      error: new Error('Language data error'),
    });

    (useApiCall as jest.Mock).mockReturnValue({
      makeApiCall: mockMakeApiCall,
      data: mockPolicies,
    });
    render(<SelectPolicy setAllPolicy={mockSetAllPolicy} onPolicySelect={mockOnPolicySelect} selectedPolicyNumber="" />)

    expect(screen.getByTestId('error-page')).toBeInTheDocument()
  });

  it('renders without crashing', () => {
    (useLanguageData as jest.Mock).mockReturnValue({
      languageData: { active: "active", here_are_the_motor_policy: 'Here are the motor policies', select_policy: 'Select Policy' },
      isLoading: false,
      error: null,
    });
    (useApiCall as jest.Mock).mockReturnValue({
      makeApiCall: mockMakeApiCall,
      data: mockPolicies,
    });
    render(<SelectPolicy setAllPolicy={mockSetAllPolicy} onPolicySelect={mockOnPolicySelect} selectedPolicyNumber="" />)

    expect(screen.getByText('Select Policy')).toBeInTheDocument()
  });

  it('renders policies correctly when data is available', () => {
    (useLanguageData as jest.Mock).mockReturnValue({
      languageData: { here_are_the_motor_policy: 'Here are the motor policies', select_policy: 'Select Policy' },
      isLoading: false,
      error: null,
    });

    (useApiCall as jest.Mock).mockReturnValue({
      makeApiCall: mockMakeApiCall,
      data: mockPolicies,
    });

    render(<SelectPolicy setAllPolicy={mockSetAllPolicy} onPolicySelect={mockOnPolicySelect} selectedPolicyNumber="" />)
    const getElement =screen.getByTestId('policy-123');

    expect(getElement).toBeInTheDocument();
    if(getElement)  
      fireEvent.click(getElement);
    
    expect(screen.queryByTestId('policy-456')).toBeInTheDocument()
  });

  it('renders policies correctly when data is available with selected policy no', () => {
    (useLanguageData as jest.Mock).mockReturnValue({
      languageData: { here_are_the_motor_policy: 'Here are the motor policies', select_policy: 'Select Policy' },
      isLoading: false,
      error: null,
    });

    (useApiCall as jest.Mock).mockReturnValue({
      makeApiCall: mockMakeApiCall,
      data: mockPolicies,
    });

    render(
      <SelectPolicy 
        onPolicySelect={mockOnPolicySelect}
        selectedPolicyNumber="123" 
        setAllPolicy={mockSetAllPolicy}
      />
    )
    const getElement =screen.getByTestId('policy-123');

    expect(getElement).toBeInTheDocument();
    if(getElement)  
      fireEvent.click(getElement);
    
    expect(screen.queryByTestId('policy-456')).toBeInTheDocument()
  });
})