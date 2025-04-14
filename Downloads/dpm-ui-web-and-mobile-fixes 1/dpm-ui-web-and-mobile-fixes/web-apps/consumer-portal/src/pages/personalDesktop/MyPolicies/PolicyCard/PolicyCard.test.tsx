import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import PoliciesCard from './PoliciesCard';
import * as reactRedux from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Existing mocks...
jest.mock('components/ThemeButton/ThemeButton', () => {
  return jest.fn(({ onClickhandler }) => (
    <button onClick={onClickhandler}>Mock Button</button>
  ));
});

jest.mock('./HamBurgerMenu/HamburgerMenu', () => {
  return jest.fn(({ menuItems, navigateTo }) => (
    <div data-testid="mock-hamburger-menu">
      {menuItems.map((item, index) => (
        <div 
          key={index} 
          onClick={() => {
            if (navigateTo) {
              navigateTo({ target: { textContent: item.label } });
            }
          }}
        >
          {item.label}
        </div>
      ))}
    </div>
  ));
});

// Mocking Redux hooks
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// Mocking useNavigate
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

// Mocking utility functions
jest.mock('utils/formatDate', () => ({
  formatDate: jest.fn((date) => date ? new Date(date).toLocaleDateString() : 'N/A'),
}));

describe('PoliciesCard Component', () => {
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (reactRedux.useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (reactRedux.useSelector as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        dashbaordLanguageData: { 
          languageData: { 
            my_policies: 'My Policies',
            policy_no: 'Policy No',
            policy_period: 'Policy Period',
            premium_amount: 'Premium Amount',
            add_ons: 'Add-ons',
            raise_a_claim: 'Raise a Claim',
            documents: 'Documents',
            policy_details: 'Policy Details',
            policy_history: 'Policy History',
            cancel_policy: 'Cancel Policy'
          }
        },
      })
    );

    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  const policyMock = {
    productCode: 'Motor',
    coverageName: 'Comprehensive Coverage',
    repairCondition: 'New',
    policyNo: 'POL123456',
    issueDate: '2023-01-01',
    expiryDate: '2024-01-01',
    premium: 1000,
  };

  const travelPolicyMock = {
    ...policyMock,
    productCode: 'TRVL',
  };

  const homePolicyMock = {
    ...policyMock,
    productCode: 'Home',
  };

  const renderComponent = (policy = policyMock, disabled = false, navigateTo = undefined) => {
    return render(
      <PoliciesCard 
        policy={policy} 
        navigateTo={navigateTo} 
        disabled={disabled} 
      />
    );
  };

  // Existing tests...
  test('renders PoliciesCard with correct details', () => {
    renderComponent();

    expect(screen.getByText('Comprehensive Coverage')).toBeInTheDocument();
    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByText('POL123456')).toBeInTheDocument();
    expect(screen.getByText(/Policy Period/i)).toBeInTheDocument();
    expect(screen.getByText(/Premium Amount/i)).toBeInTheDocument();
  });

  test('renders correct product logo based on product code', () => {
    // Test Motor policy logo
    const { rerender } = renderComponent();
    const motorLogo = screen.getByAltText('product-logo');
    expect(motorLogo).toBeInTheDocument();

    // Test Travel policy logo
    rerender(
      <PoliciesCard 
        policy={travelPolicyMock} 
        navigateTo={undefined} 
        disabled={false} 
      />
    );
    const travelLogo = screen.getByAltText('product-logo');
    expect(travelLogo).toBeInTheDocument();

    // Test Home policy logo
    rerender(
      <PoliciesCard 
        policy={homePolicyMock} 
        navigateTo={undefined} 
        disabled={false} 
      />
    );
    const homeLogo = screen.getByAltText('product-logo');
    expect(homeLogo).toBeInTheDocument();
  });

  test('handles mouse interactions with More icon', () => {
    renderComponent();

    // Initially, the menu should not be visible
    expect(screen.queryByTestId('mock-hamburger-menu')).not.toBeInTheDocument();

    // Click the More icon to show the menu
    const moreIcon = screen.getByAltText('More');
    fireEvent.click(moreIcon);
    
    // Now the menu should be visible
    expect(screen.getByTestId('mock-hamburger-menu')).toBeInTheDocument();

    // Simulate mouse leave
    fireEvent.mouseLeave(moreIcon);
    
  });

  test('handles footer item clicks when not disabled', () => {
    const mockNavigateTo = jest.fn();
    renderComponent(policyMock, false, mockNavigateTo);

    // Click Add-ons in footer
    const addOnsItem = screen.getByText('Add-ons');
    fireEvent.click(addOnsItem);

    // Click Raise a Claim in footer
    const raiseClaimItem = screen.getByText('Raise a Claim');
    fireEvent.click(raiseClaimItem);

    // Click Documents in footer
    const documentsItem = screen.getByText('Documents');
    fireEvent.click(documentsItem);
  });

  test('prevents footer item clicks when disabled', () => {
    const mockNavigateTo = jest.fn();
    renderComponent(policyMock, true, mockNavigateTo);

    // Click Add-ons in footer
    const addOnsItem = screen.getByText('Add-ons');
    fireEvent.click(addOnsItem);
    expect(mockNavigateTo).not.toHaveBeenCalled();

    // Click Raise a Claim in footer
    const raiseClaimItem = screen.getByText('Raise a Claim');
    fireEvent.click(raiseClaimItem);
    expect(mockNavigateTo).not.toHaveBeenCalled();
  });

  test('renders all menu items in hamburger menu', () => {
    renderComponent();

    // Click the More icon to show the menu
    const moreIcon = screen.getByAltText('More');
    fireEvent.click(moreIcon);

    // Get the menu container
    const menu = screen.getByTestId('mock-hamburger-menu');

    // Check for expected menu items
    const expectedMenuItems = [
      'Policy Details',
      'Documents',
      'Policy History',
      'Add-ons',
      'Raise a Claim',
      'Cancel Policy'
    ];

    expectedMenuItems.forEach(item => {
      expect(within(menu).getByText(item)).toBeInTheDocument();
    });
  });

  test('handles edge cases with null or undefined policy data', () => {
    const incompletePolicy = {
      productCode: null,
      coverageName: null,
      repairCondition: null,
      policyNo: null,
      issueDate: null,
      expiryDate: null,
      premium: null,
    };

    renderComponent(incompletePolicy);

    // Check for N/A placeholders
    const naElements = screen.getAllByText('N/A');
    expect(naElements.length).toBeGreaterThan(0);
  });

  test('applies correct styling for disabled state', () => {
    const { container } = renderComponent(policyMock, true);

    // Check for disabled classes
    expect(container.querySelector('.disabled')).toBeInTheDocument();
    expect(container.querySelector('.status-label-disabled')).toBeInTheDocument();
    expect(container.querySelector('.policies-card-footer-disabled')).toBeInTheDocument();
  });
});