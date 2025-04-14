import React from 'react'
import { render, screen } from '@testing-library/react'
import PolicyDetailsPage from '.'
import { PolicyDetails } from 'types/policyDetails'
import { LanguageData } from 'types/languageData'

jest.mock('utils/policyDetails', () => ({
  getRemainingDays: jest.fn(() => 30),
}))

jest.mock('utils/formatDate', () => ({
  formatDate: jest.fn((date) => `Formatted ${date}`),
  convertToDateString: jest.fn((date) => `Converted ${date}`),
}))

jest.mock('assets/PolicyDetails/product.svg', () => 'product-icon.svg')
jest.mock('assets/PolicyDetails/vector.svg', () => 'vector-icon.svg')

jest.mock('./QuickLinks', () => ({
  QuickLinks: () => <div data-testid="quick-links">Quick Links</div>,
}))

jest.mock('./RenewalBanner', () => ({
  __esModule: true,
  default: () => <div data-testid="renewal-banner">Renewal Banner</div>,
}))

describe('PolicyDetailsPage', () => {
  const mockPolicyDetails: PolicyDetails = {
    policyNo: 'POL123456',
    startDate: '2023-01-01',
    expiryDate: '2024-01-01',
    idv: '500000',
    coverageName: 'Comprehensive Coverage',
  }

  const mockLanguageData: LanguageData = {
    policy_details: 'Policy Details',
    policy_no: 'Policy Number',
    start_date: 'Start Date',
    expiry_date: 'Expiry Date',
    insured_declared_value_idv: 'IDV',
  }

  const mockNavigateTo = jest.fn()

  it('renders policy details correctly', () => {
    render(
      <PolicyDetailsPage
        policyDetails={mockPolicyDetails}
        languageData={mockLanguageData}
        navigateTo={mockNavigateTo}
      />
    )

    expect(screen.getByText('Policy Details')).toBeInTheDocument()

    expect(screen.getByText('POL123456')).toBeInTheDocument()

    expect(screen.getByText('Comprehensive Coverage')).toBeInTheDocument()

    expect(screen.getByText('Formatted 2023-01-01')).toBeInTheDocument()
    expect(screen.getByText('Formatted 2024-01-01')).toBeInTheDocument()

    expect(screen.getByText('SAR 500,000.00')).toBeInTheDocument()

    expect(screen.getByTestId('quick-links')).toBeInTheDocument()
    expect(screen.getByTestId('renewal-banner')).toBeInTheDocument()
  })

  it('renders "Not available" for missing IDV', () => {
    const policyDetailsWithoutIDV = { ...mockPolicyDetails, idv: "" }
    render(
      <PolicyDetailsPage
        policyDetails={policyDetailsWithoutIDV}
        languageData={mockLanguageData}
        navigateTo={mockNavigateTo}
      />
    )

    expect(screen.getByText('Not available')).toBeInTheDocument()
  });

  it('handles undefined languageData', () => {
    render(
      <PolicyDetailsPage
        policyDetails={mockPolicyDetails}
        languageData={undefined}
        navigateTo={mockNavigateTo}
      />
    )

    expect(screen.getByText('POL123456')).toBeInTheDocument()
  })
})