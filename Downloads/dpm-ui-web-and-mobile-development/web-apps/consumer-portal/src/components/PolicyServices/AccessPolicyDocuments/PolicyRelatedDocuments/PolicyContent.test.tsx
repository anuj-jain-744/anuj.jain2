import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import PolicyContent from './PolicyContent'
import { useReviewPolicy } from "components/PolicyServices/PolicyDashboard/hooks/useReviewPolicy"
import usePolicyData from "components/PolicyServices/PolicyDashboard/hooks/usePolicyData"

// Mock the hooks and components
jest.mock("components/PolicyServices/PolicyDashboard/hooks/useReviewPolicy")
jest.mock("components/PolicyServices/PolicyDashboard/hooks/usePolicyData")
jest.mock("./PolicyRelatedDocuments", () => () => <div data-testid="policy-related-documents">Policy Related Documents</div>)
jest.mock("components/PolicyServices/policyCancellation/sharedComponent/PolicyCard", () => ({ policyNumber }) => <div data-testid="policy-card">Policy Card for {policyNumber}</div>)
jest.mock("Motor/DidYouKnowCard/DidYouKnowCard", () => () => <div data-testid="did-you-know-card">Did You Know Card</div>)
jest.mock("Motor/SelectPolicyCard/SelectPolicyCard", () => ({ onPolicySelect }) => (
  <select data-testid="select-policy-card" onChange={(e) => onPolicySelect(e.target.value)}>
    <option value="">Select Policy</option>
    <option value="P-123">Policy P-123</option>
    <option value="P-456">Policy P-456</option>
  </select>
))

jest.mock("components/ErrorComponent/Error", () => () => <div data-testid="error-component">Error occurred</div>)

describe('PolicyContent', () => {
  const mockLanguageData = {
    start_date: 'Start Date',
    expiry_date: 'Expiry Date',
    policy_no: 'Policy No',
    insured_declared_value_idv: 'IDV'
  }

  beforeEach(() => {
    jest.clearAllMocks()
    sessionStorage.clear()
    ;(useReviewPolicy as jest.Mock).mockReturnValue({
      makeApiCall: jest.fn(),
      isLoading: false,
      error: null,
      data: null
    })
    ;(usePolicyData as jest.Mock).mockReturnValue({
      policyDetails: {
        policyNo: 'P-123',
        coverageName: 'Full Coverage',
        startDate: '2023-01-01',
        expiryDate: '2024-01-01',
        idv: '100000'
      }
    })
  })

  it('renders SelectPolicyCard and DidYouKnowCard initially', () => {
    render(<PolicyContent languageData={mockLanguageData} />)
    expect(screen.getByTestId('select-policy-card')).toBeInTheDocument()
    expect(screen.getByTestId('did-you-know-card')).toBeInTheDocument()
  })

  it('renders PolicyCard and PolicyRelatedDocuments when a policy is selected', async () => {
    render(<PolicyContent languageData={mockLanguageData} />)
    fireEvent.change(screen.getByTestId('select-policy-card'), { target: { value: 'P-123' } })
    
    await waitFor(() => {
      expect(screen.getByTestId('policy-card')).toBeInTheDocument()
      expect(screen.getByTestId('policy-related-documents')).toBeInTheDocument()
    })
  })

  it('shows error component when there is a language error', () => {
    render(<PolicyContent languageError="Language error" />)
    expect(screen.getByTestId('error-component')).toBeInTheDocument()
  })

  it('shows error component when there is a policy error', () => {
    (useReviewPolicy as jest.Mock).mockReturnValue({
      makeApiCall: jest.fn(),
      isLoading: false,
      error: 'Policy error',
      data: null
    })
    render(<PolicyContent languageData={mockLanguageData} />)
    expect(screen.getByTestId('error-component')).toBeInTheDocument()
  })

  it('calls makeApiCall when a policy is selected', async () => {
    const mockMakeApiCall = jest.fn()
    ;(useReviewPolicy as jest.Mock).mockReturnValue({
      makeApiCall: mockMakeApiCall,
      isLoading: false,
      error: null,
      data: null
    })
    render(<PolicyContent languageData={mockLanguageData} />)
    fireEvent.change(screen.getByTestId('select-policy-card'), { target: { value: 'P-123' } })
    
    await waitFor(() => {
      expect(mockMakeApiCall).toHaveBeenCalled()
    })
  })

  it('removes selectedPolicyNumber from sessionStorage on mount', () => {
    sessionStorage.setItem('selectedPolicyNumber', 'P-123')
    render(<PolicyContent languageData={mockLanguageData} />)
    expect(sessionStorage.getItem('selectedPolicyNumber')).toBeNull()
  })

  it('sets selectedPolicyNumber in sessionStorage when a policy is selected', () => {
    render(<PolicyContent languageData={mockLanguageData} />)
    fireEvent.change(screen.getByTestId('select-policy-card'), { target: { value: 'P-123' } })
    expect(sessionStorage.getItem('selectedPolicyNumber')).toBe('P-123')
  })
})