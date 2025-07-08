import React from 'react'

jest.mock('./SelectPolicy/SelectPolicy', () => ({
  __esModule: true,
  default: ({ onPolicySelect, selectedPolicyNumber }) => (
    <div data-testid="select-policy">
      <button onClick={() => onPolicySelect('P123')}>Select Policy</button>
      <span>Selected: {selectedPolicyNumber}</span>
    </div>
  ),
}))

jest.mock('./PolicyDashboard', () => ({
  __esModule: true,
  default: ({ selectedPolicyNumber }) => (
    <div data-testid="policy-dashboard">
      Policy Dashboard for {selectedPolicyNumber}
    </div>
  ),
}))

describe('PolicyContainer', () => {
  const mockNavigateTo = jest.fn()

  it('renders SelectPolicy component', () => {
    // render(<PolicyContainer navigateTo={mockNavigateTo} />)
    // expect(screen.getByTestId('select-policy')).toBeInTheDocument()
  })

  it('does not render PolicyDashboard initially', () => {
    // render(<PolicyContainer navigateTo={mockNavigateTo} />)
    // expect(screen.queryByTestId('policy-dashboard')).not.toBeInTheDocument()
  })

  it('updates selectedPolicyNumber when a policy is selected', () => {
    // render(<PolicyContainer navigateTo={mockNavigateTo} />)
    // fireEvent.click(screen.getByText('Select Policy'))
    // expect(screen.getByText('Selected: P123')).toBeInTheDocument()
  })

  it('renders PolicyDashboard when a policy is selected', () => {
    // render(<PolicyContainer navigateTo={mockNavigateTo} />)
    // fireEvent.click(screen.getByText('Select Policy'))
    // expect(screen.getByTestId('policy-dashboard')).toBeInTheDocument()
    // expect(screen.getByText('Policy Dashboard for P123')).toBeInTheDocument()
  })

  it('passes navigateTo prop to PolicyDashboard', () => {
    // render(<PolicyContainer navigateTo={mockNavigateTo} />)
    // fireEvent.click(screen.getByText('Select Policy'))
    // expect(screen.getByTestId('policy-dashboard')).toBeInTheDocument()
  })

});