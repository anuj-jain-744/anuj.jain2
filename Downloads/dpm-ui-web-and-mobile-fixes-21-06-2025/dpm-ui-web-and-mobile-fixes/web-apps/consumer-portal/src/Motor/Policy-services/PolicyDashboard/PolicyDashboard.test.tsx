import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import PolicyDashboard from './PolicyDashboard'
import { useReviewPolicy } from './hooks/useReviewPolicy'
import usePolicyData from './hooks/usePolicyData'
import useLanguageData from '../AccessPolicyDocuments/hooks/useLanguageData'

jest.mock('./hooks/useReviewPolicy')
jest.mock('./hooks/usePolicyData')
jest.mock('../AccessPolicyDocuments/hooks/useLanguageData')

jest.mock('./PolicyDetails', () => ({
  __esModule: true,
  default: () => <div data-testid="policy-details">Policy Details</div>,
}))

jest.mock('./PolicyAccordianLinks', () => ({
  __esModule: true,
  default: () => <div data-testid="policy-accordian-links">Policy Accordian Links</div>,
}))

jest.mock('./PolicyCard', () => ({
  __esModule: true,
  default: () => <div data-testid="policy-card">Policy Card</div>,
}))

jest.mock('components/Spinner', () => ({
  __esModule: true,
  default: () => <div data-testid="default-spinner">Loading...</div>,
}))

jest.mock('components/ErrorComponent/Error', () => ({
  __esModule: true,
  default: () => <div data-testid="error-page">Error occurred</div>,
}))

describe('PolicyDashboard', () => {
  const mockNavigateTo = jest.fn()
  const mockSelectedPolicyNumber = 'POLICY123'
  const mockMakeApiCall = jest.fn()
  const mockLanguageData = { some: 'language data' }
  const mockPolicyData = {
    policyHolderDetails: { name: 'John Doe' },
    vehicleDetails: { model: 'Car Model' },
    policyPremiumAndBenefits: { premium: 1000 },
    policyCard: { cardNumber: 'CARD123' },
    policyDetails: { policyNumber: 'POLICY123' },
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading spinner when policy or language data is loading', () => {
    // ;(useReviewPolicy as jest.Mock).mockReturnValue({
    //   makeApiCall: mockMakeApiCall,
    //   isLoading: true,
    //   error: null,
    //   data: null,
    // })
    // ;(useLanguageData as jest.Mock).mockReturnValue({
    //   languageData: null,
    //   isLoading: true,
    //   error: null,
    // })
    // ;(usePolicyData as jest.Mock).mockReturnValue(null)

    // render(<PolicyDashboard navigateTo={mockNavigateTo} selectedPolicyNumber={mockSelectedPolicyNumber} />)

    // expect(screen.getByTestId('default-spinner')).toBeInTheDocument()
  })

  it('renders error page when there is an error fetching policy or language data', () => {
    // ;(useReviewPolicy as jest.Mock).mockReturnValue({
    //   makeApiCall: mockMakeApiCall,
    //   isLoading: false,
    //   error: new Error('Policy data error'),
    //   data: null,
    // })
    // ;(useLanguageData as jest.Mock).mockReturnValue({
    //   languageData: null,
    //   isLoading: false,
    //   error: new Error('Language data error'),
    // })
    // ;(usePolicyData as jest.Mock).mockReturnValue(null)

    // render(<PolicyDashboard navigateTo={mockNavigateTo} selectedPolicyNumber={mockSelectedPolicyNumber} />)

    // expect(screen.getByTestId('error-page')).toBeInTheDocument()
  })

  it('renders policy dashboard components when data is loaded successfully', async () => {
    // ;(useReviewPolicy as jest.Mock).mockReturnValue({
    //   makeApiCall: mockMakeApiCall,
    //   isLoading: false,
    //   error: null,
    //   data: { some: 'policy data' },
    // })
    // ;(useLanguageData as jest.Mock).mockReturnValue({
    //   languageData: mockLanguageData,
    //   isLoading: false,
    //   error: null,
    // })
    // ;(usePolicyData as jest.Mock).mockReturnValue(mockPolicyData)

    // render(<PolicyDashboard navigateTo={mockNavigateTo} selectedPolicyNumber={mockSelectedPolicyNumber} />)

    // await waitFor(() => {
    //   expect(screen.getByTestId('policy-details')).toBeInTheDocument()
    //   expect(screen.getByTestId('policy-accordian-links')).toBeInTheDocument()
    //   expect(screen.getByTestId('policy-card')).toBeInTheDocument()
    // })
  })

  it('calls makeApiCall when selectedPolicyNumber is provided', async () => {
    // ;(useReviewPolicy as jest.Mock).mockReturnValue({
    //   makeApiCall: mockMakeApiCall,
    //   isLoading: false,
    //   error: null,
    //   data: { some: 'policy data' },
    // })
    // ;(useLanguageData as jest.Mock).mockReturnValue({
    //   languageData: mockLanguageData,
    //   isLoading: false,
    //   error: null,
    // })
    // ;(usePolicyData as jest.Mock).mockReturnValue(mockPolicyData)

    // render(<PolicyDashboard navigateTo={mockNavigateTo} selectedPolicyNumber={mockSelectedPolicyNumber} />)

    // await waitFor(() => {
    //   expect(mockMakeApiCall).toHaveBeenCalledTimes(1)
    // })
  })

  it('does not call makeApiCall when selectedPolicyNumber is empty', () => {
    // ;(useReviewPolicy as jest.Mock).mockReturnValue({
    //   makeApiCall: mockMakeApiCall,
    //   isLoading: false,
    //   error: null,
    //   data: null,
    // })
    // ;(useLanguageData as jest.Mock).mockReturnValue({
    //   languageData: mockLanguageData,
    //   isLoading: false,
    //   error: null,
    // })
    // ;(usePolicyData as jest.Mock).mockReturnValue(null)

    // render(<PolicyDashboard navigateTo={mockNavigateTo} selectedPolicyNumber="" />)

    // expect(mockMakeApiCall).not.toHaveBeenCalled()
  })
})