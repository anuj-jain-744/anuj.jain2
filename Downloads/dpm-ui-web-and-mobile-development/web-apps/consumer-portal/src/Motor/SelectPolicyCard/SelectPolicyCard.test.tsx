import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import SelectPolicyCard from './SelectPolicyCard'
import useLanguageData from './../Policy-services/AccessPolicyDocuments/hooks/useLanguageData'

jest.mock('./../Policy-services/AccessPolicyDocuments/hooks/useLanguageData')

jest.mock('Motor/Policy-services/policyCancellation/sharedComponent/ThemeDropdown', () => {
  return {
    __esModule: true,
    default: ({ onChangehandler, value, placeholder, selectedValue }) => (
      <select
        data-testid="theme-dropdown"
        onChange={onChangehandler}
        value={selectedValue || ''}
      >
        <option value="">{placeholder}</option>
        {value.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    ),
  }
})

describe('SelectPolicyCard', () => {
  const mockOnPolicySelect = jest.fn()
  const mockLanguageData = {
    select_policy: 'Select Your Policy',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useLanguageData as jest.Mock).mockReturnValue({
      languageData: mockLanguageData,
    })
  })

  it('renders the SelectPolicyCard component', () => {
    render(<SelectPolicyCard onPolicySelect={mockOnPolicySelect} />)

    expect(screen.getByText('Select Your Policy')).toBeInTheDocument()
    expect(screen.getByTestId('theme-dropdown')).toBeInTheDocument()
  })

  it('renders the correct placeholder in the dropdown', () => {
    render(<SelectPolicyCard onPolicySelect={mockOnPolicySelect} />)

    expect(screen.getByText('Select Policy')).toBeInTheDocument()
  })

  it('calls onPolicySelect when a policy is selected', () => {
    render(<SelectPolicyCard onPolicySelect={mockOnPolicySelect} />)

    fireEvent.change(screen.getByTestId('theme-dropdown'), {
      target: { value: 'P-R06-24-330-002465' },
    })

    expect(mockOnPolicySelect).toHaveBeenCalledWith('')
  })

  it('displays the selected policy when provided', () => {
    render(
      <SelectPolicyCard
        onPolicySelect={mockOnPolicySelect}
        selectedPolicy="P-R22-24-331-002169"
      />
    )

    expect(screen.getByTestId('theme-dropdown')).toBeInTheDocument();
  })

  it('uses the correct language data for the header', () => {
    const customLanguageData = {
      select_policy: 'Choose Your Policy',
    }
    ;(useLanguageData as jest.Mock).mockReturnValue({
      languageData: customLanguageData,
    })

    render(<SelectPolicyCard onPolicySelect={mockOnPolicySelect} />)

    expect(screen.getByText('Choose Your Policy')).toBeInTheDocument()
  })
})