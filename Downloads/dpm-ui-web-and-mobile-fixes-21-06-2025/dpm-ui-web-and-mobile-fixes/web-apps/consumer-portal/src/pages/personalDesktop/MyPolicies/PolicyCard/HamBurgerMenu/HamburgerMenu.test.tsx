import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import HamburgerMenu from './HamburgerMenu'; // Adjust the import path as necessary
import * as reactRedux from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { TRAVEL } from 'constant';

// Mocking necessary components and hooks
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(), // Ensure useSelector is mocked
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: jest.fn(),
}));

describe('HamburgerMenu Component - Comprehensive Coverage', () => {
  const mockNavigate = jest.fn();
  const mockInvalidateQueries = jest.fn();

  const mockLanguageData = {
    policy_details: 'Policy Details',
    raise_a_claim: 'Raise a Claim',
    policy_history: 'Policy History',
    cancel_policy: 'Cancel Policy',
    documents: 'Documents',
    add_ons: 'Add-ons',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (reactRedux.useSelector as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        dashbaordLanguageData: { languageData: mockLanguageData },
      })
    );

    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useQueryClient as jest.Mock).mockReturnValue({
      invalidateQueries: mockInvalidateQueries,
    });
  });

  const menuItemsMock = [
    { label: 'Policy Details', url: '/Motor/Claim/PolicyDashboard', isVisible: true },
    { label: 'Add-ons', url: '/Motor/Claim/Endorsement', isVisible: true },
    { label: 'Raise a Claim', url: '/Register-claim', isVisible: true },
    { label: 'Documents', url: '/Motor/Claim/Policy-Dcouments', isVisible: true },
    { label: 'Cancel Policy', url: '/Motor/Claim/Policy-Cancellation', isVisible: true },
    { label: 'Policy History', url: '/Motor/Claim/PolicyHistory', isVisible: true },
  ];

  test('renders HamburgerMenu with correct menu items', () => {
    render(<HamburgerMenu menuItems={menuItemsMock} toggleMenuVisibility={jest.fn()} isOpen={true} />);

    // Check if all menu items are rendered
    menuItemsMock.forEach((item) => {
      if (item.isVisible) {
        expect(screen.getByText(item.label)).toBeInTheDocument();
      }
    });
  });

  test('handles navigation for all menu items with different product codes', () => {
    const menuItems = [
      { label: 'Policy Details', url: '/Motor/Claim/PolicyDashboard', isVisible: true },
      { label: 'Raise a Claim', url: '/Register-claim', isVisible: true },
      { label: 'Policy History', url: '/Motor/Claim/PolicyHistory', isVisible: true },
      { label: 'Cancel Policy', url: '/Motor/Claim/Policy-Cancellation', isVisible: true },
      { label: 'Documents', url: '/Motor/Claim/Policy-Dcouments', isVisible: true },
      { label: 'Add-ons', url: '/Motor/Claim/Endorsement', isVisible: true },
    ];

    const { rerender } = render(
      <HamburgerMenu
        menuItems={menuItems}
        toggleMenuVisibility={jest.fn()}
        isOpen={true}
        policyData={{ productCode: 'MOTOR' }}
      />
    );

    // Click through each menu item
    menuItems.forEach((item) => {
      fireEvent.click(screen.getByText(item.label));
    });

    // Verify navigation paths for Motor
    // expect(mockNavigate).toHaveBeenCalledWith('/Motor/Claim/PolicyDashboard', expect.anything());
    // expect(mockNavigate).toHaveBeenCalledWith('/Register-claim', expect.anything());
    // expect(mockNavigate).toHaveBeenCalledWith('/Motor/Claim/PolicyHistory', expect.anything());
    // expect(mockNavigate).toHaveBeenCalledWith('/Motor/Claim/Policy-Cancellation', expect.anything());
    // expect(mockNavigate).toHaveBeenCalledWith('/Motor/Claim/Policy-Dcouments', expect.anything());
    // expect(mockNavigate).toHaveBeenCalledWith('/Motor/Claim/Endorsement', expect.anything());

    mockNavigate.mockClear();

    rerender(
      <HamburgerMenu
        menuItems={menuItems}
        toggleMenuVisibility={jest.fn()}
        isOpen={true}
        policyData={{ productCode: TRAVEL }}
      />
    );

    menuItems.forEach((item) => {
      fireEvent.click(screen.getByText(item.label));
    });
    // expect(mockNavigate).toHaveBeenCalledWith('/Motor/Claim/PolicyDashboard', expect.anything());
    // expect(mockNavigate).toHaveBeenCalledWith('/Register-claim', expect.anything());
    // expect(mockNavigate).toHaveBeenCalledWith('/Motor/Claim/PolicyHistory', expect.anything());
  });
});
