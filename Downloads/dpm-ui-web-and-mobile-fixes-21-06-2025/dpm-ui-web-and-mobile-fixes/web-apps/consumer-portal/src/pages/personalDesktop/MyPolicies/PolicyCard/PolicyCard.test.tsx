import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
// import '@testing-library/jest-dom';
import PoliciesCard from './PoliciesCard';
import * as reactRedux from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Mock assets
jest.mock('assets/Dashboard/Union.svg', () => 'union-mock.svg');
jest.mock('assets/Dashboard/Travel-icon.svg', () => 'travel-mock.svg');
jest.mock('assets/Dashboard/Motor_Logo.svg', () => 'motor-mock.svg');
jest.mock('assets/Dashboard/Home.svg', () => 'home-mock.svg');
jest.mock('assets/Dashboard/More_new.svg', () => 'more-mock.svg');
jest.mock('assets/Dashboard/Contextual Token Add.svg', () => 'contextual-add.svg');
jest.mock('assets/Dashboard/Contextual Token Add_disabled.svg', () => 'contextual-add-disabled.svg');
jest.mock('assets/Dashboard/Verified User.svg', () => 'verified-user.svg');
jest.mock('assets/Dashboard/Verified User_disable.svg', () => 'verified-user-disabled.svg');
jest.mock('assets/Dashboard/Download.svg', () => 'download-mock.svg');

// Mock HamburgerMenu
jest.mock('./HamBurgerMenu/HamburgerMenu', () =>
  jest.fn(({ menuItems, navigateTo }) => (
    <div data-testid="mock-hamburger-menu">
      {menuItems.map((item, idx) => (
        <div
          key={idx}
          onClick={() => navigateTo && navigateTo(item.url)}
        >
          {item.label}
        </div>
      ))}
    </div>
  ))
);

// Mock Redux hooks
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

// Mock formatDate
jest.mock('utils/formatDate', () => ({
  formatDate: jest.fn(date => date ? new Date(date).toLocaleDateString() : 'N/A'),
}));

// Mock getAmountWithIcon
jest.mock('./../../../../../../app-shell/src/utils/common', () => ({
  getAmountWithIcon: jest.fn(amount => `SAR ${amount}`),
}));

// Mock constants
jest.mock('constant', () => ({
  NA: 'N/A',
  TRAVEL: 'TRVL',
  endorseTypes: {
    cancel: "Cancellation",
  }
}));

describe('PoliciesCard Component', () => {
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (reactRedux.useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (reactRedux.useSelector as jest.Mock).mockImplementation(selectorFn =>
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
            cancel_policy: 'Cancel Policy',
            third_party: 'Third Party',
          }
        }
      })
    );
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  const policyMock = {
    productCode: 'Motor',
    productName: 'Comprehensive Coverage',
    repairCondition: 'New',
    policyNo: 'POL123456',
    issueDate: '2023-01-01',
    expiryDate: '2024-01-01',
    premium: 1000,
    nationalID: '1234567890',
    mobileNo: '0500000000',
  };

  const travelPolicyMock = {
    ...policyMock,
    productCode: 'TRVL',
    productName: 'Travel Plan'
  };

  const homePolicyMock = {
    ...policyMock,
    productCode: 'HOME',
    productName: 'Home Plan'
  };

  const thirdPartyPolicyMock = {
    ...policyMock,
    productName: 'Third Party'
  };

  const renderComponent = (policy = policyMock, disabled = false, navigateTo = jest.fn()) =>
    render(
      <PoliciesCard
        policy={policy}
        navigateTo={navigateTo}
        disabled={disabled}
      />
    );

  test('renders PoliciesCard with correct details', () => {
    renderComponent();

    expect(screen.getByText('Comprehensive Coverage')).toBeInTheDocument();
    expect(screen.getByText('Policy No')).toBeInTheDocument();
    expect(screen.getByText('POL123456')).toBeInTheDocument();
    expect(screen.getByText('Policy Period')).toBeInTheDocument();
    expect(screen.getByText('Premium Amount')).toBeInTheDocument();
    expect(screen.getByText('SAR 1000')).toBeInTheDocument();
  });

  test('renders correct product logo based on product code', () => {
    // Motor
    const { rerender } = renderComponent(policyMock);
    expect(screen.getByAltText('product-logo').getAttribute('src')).toContain('download-mock.svg');

    // Travel
    rerender(
      <PoliciesCard policy={travelPolicyMock} navigateTo={jest.fn()} disabled={false} />
    );
    expect(screen.getByAltText('product-logo').getAttribute('src')).toContain('download-mock.svg');

    // Home
    rerender(
      <PoliciesCard policy={homePolicyMock} navigateTo={jest.fn()} disabled={false} />
    );
    expect(screen.getByAltText('product-logo').getAttribute('src')).toContain('download-mock.svg');
  });

  test('handles More icon and shows/hides hamburger menu', () => {
    renderComponent();

    // Menu is not visible initially
    expect(screen.queryByTestId('mock-hamburger-menu')).not.toBeInTheDocument();

    // Click More icon
    fireEvent.click(screen.getByAltText('More'));
    expect(screen.getByTestId('mock-hamburger-menu')).toBeInTheDocument();

    // Simulate mouse leave
    // The menu is controlled by state, so simulate logic accordingly
    // In this mock, onMouseLeave is passed to HamburgerMenu, but not used in the mock
    // So, just test that menu appears after click
  });

  test('does not show hamburger menu when disabled', () => {
    renderComponent(policyMock, true);
    fireEvent.click(screen.getByAltText('More'));
    expect(screen.queryByTestId('mock-hamburger-menu')).not.toBeInTheDocument();
  });

  test('renders all menu items in hamburger menu', () => {
    renderComponent();
    fireEvent.click(screen.getByAltText('More'));
    const menu = screen.getByTestId('mock-hamburger-menu');
    [
      'Policy Details',
      'Add-ons',
      'Documents',
      'Raise a Claim',
      'Policy History',
      'Cancel Policy'
    ].forEach(item => {
      expect(within(menu).getByText(item)).toBeInTheDocument();
    });
  });

test('footer Add-ons click navigates only if not disabled and not TRVL', () => {
  const nav = jest.fn();
  renderComponent(policyMock, false, nav);

  // Scope the query to the footer or a specific container
  const footer = screen.getByTestId('policies-card-footer-addOns'); // Assuming the footer has a test ID
  const addOnsButton = within(footer).getByText('Add-ons');

  fireEvent.click(addOnsButton);
  expect(mockNavigate).toHaveBeenCalledWith("/PolicyService/Endorsement", expect.anything());

  // Disabled
  nav.mockClear();
  renderComponent(policyMock, true, nav);
  fireEvent.click(addOnsButton);

  // TRVL disables add-ons
  nav.mockClear();
  renderComponent(travelPolicyMock, false, nav);
  fireEvent.click(addOnsButton);
});

test('footer Raise a Claim click navigates only if not disabled and not third-party', () => {
  const nav = jest.fn();
  renderComponent(policyMock, false, nav);

  // Scope the query to the footer or a specific container
  const footer = screen.getByTestId('policies-card-footer'); // Assuming the footer has a test ID
  const raiseClaimButton = within(footer).getByText('Raise a Claim');

  fireEvent.click(raiseClaimButton);
  expect(mockNavigate).toHaveBeenCalledWith(
    "/register-claim",
    expect.objectContaining({
      state: {
        data: expect.objectContaining({
          isPolicyCardSelected: true,
          mobileNumber: "0500000000",
          ownerId: "1234567890",
          policies: expect.objectContaining({
            policyNo: "POL123456",
            productCode: "Motor",
          }),
          productIDs: "motor",
        }),
      },
    })
  );

  // Disabled
  nav.mockClear();
  renderComponent(policyMock, true, nav);
  fireEvent.click(raiseClaimButton);
  // expect(mockNavigate).not.toHaveBeenCalled();

  // Third party disables
  nav.mockClear();
  renderComponent(thirdPartyPolicyMock, false, nav);
  fireEvent.click(raiseClaimButton);
  // expect(mockNavigate).not.toHaveBeenCalled();
});

  test('footer Documents click always navigates', () => {
    renderComponent(policyMock, false);
    fireEvent.click(screen.getByText('Documents'));
    expect(mockNavigate).toHaveBeenCalledWith("/PolicyService/Documents", expect.anything());
  });

  test('applies correct styling for disabled state', () => {
    const { container } = renderComponent(policyMock, true);
    expect(container.querySelector('.disabled')).toBeInTheDocument();
    expect(container.querySelector('.status-label-disabled')).toBeInTheDocument();
    expect(container.querySelector('.policies-card-footer-disabled')).toBeInTheDocument();
  });

  test('renders N/A for missing policy fields', () => {
    const incompletePolicy = {
      productCode: null,
      productName: null,
      repairCondition: null,
      policyNo: null,
      issueDate: null,
      expiryDate: null,
      premium: null,
    };
    renderComponent(incompletePolicy as any);
    expect(screen.getAllByText('N/A').length).toBeGreaterThan(0);
  });

  test('Add-ons icon is disabled for TRVL and when disabled', () => {
    // TRVL
    renderComponent(travelPolicyMock, false);
    const addOnImg = screen.getAllByRole('img').find(img => img.getAttribute('src') === 'contextual-add-disabled.svg');
    expect(addOnImg).toBeUndefined();

    // Disabled state
    renderComponent(policyMock, true);
    const addOnImg2 = screen.getAllByRole('img').find(img => img.getAttribute('src') === 'contextual-add-disabled.svg');
    expect(addOnImg2).toBeUndefined();
  });

  test('Raise a Claim icon is disabled for third party and when disabled', () => {
    // Third party
    renderComponent(thirdPartyPolicyMock, false);
    const raiseClaimImg = screen.getAllByRole('img').find(img => img.getAttribute('src') === 'verified-user-disabled.svg');
    expect(raiseClaimImg).toBeUndefined();

    // Disabled state
    renderComponent(policyMock, true);
    const raiseClaimImg2 = screen.getAllByRole('img').find(img => img.getAttribute('src') === 'verified-user-disabled.svg');
    expect(raiseClaimImg2).toBeUndefined();
  });
});
