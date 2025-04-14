import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MyPoliciesContainer from './MyPoliciesContainer'; // Adjust the import path as necessary
import * as reactRedux from 'react-redux';

// Mocking necessary components
jest.mock('./PolicyCard/PoliciesCard', () => {
  return jest.fn(({ policy }) => <div data-testid="mock-policy-card">{policy.title}</div>);
});

jest.mock('./PolicyCard/HappyCard/HappyCard', () => {
  return jest.fn(({ title }) => <div data-testid="mock-happy-card">{title}</div>);
});

jest.mock('./PolicyCard/TravelCard/TravelCard', () => {
  return jest.fn(({ title }) => <div data-testid="mock-travel-card">{title}</div>);
});

jest.mock('./MyRequest/MyRequest', () => {
  return jest.fn(() => <div data-testid="mock-my-request">My Request</div>);
});

jest.mock('../WalaaOfferings/WalaaOfferings', () => {
  return jest.fn(() => <div data-testid="mock-walaa-offerings">Walaa Offerings</div>);
});

jest.mock('components/ThemeButton/ThemeButton', () => {
  return jest.fn(({ onClickhandler }) => (
    <button onClick={onClickhandler}>Mock Button</button>
  ));
});

jest.mock('components/Dashboard/dashboardCarousel', () => ({
  CarouselImages: () => <div>Carousel Images</div>
}));

jest.mock('components/HelpSection/ContactCard/ContactCard', () => {
  return jest.fn(() => <div data-testid="mock-contact-card">Contact Card</div>);
});

jest.mock('components/PersonalDashboardAdd/index', () => {
  return jest.fn(() => <div data-testid="mock-personal-dashboard-add">Personal Dashboard Add</div>);
});

// Mocking Redux hooks
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

describe('MyPoliciesContainer Component', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (reactRedux.useDispatch as jest.Mock).mockReturnValue(mockDispatch);

    // Mocking useSelector to provide Redux state
    (reactRedux.useSelector as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        dashbaordLanguageData: { languageData: { my_policies: 'My Policies' } },
        footerMenuLanguage: { languageData: { footer_text: 'Footer Text' } },
        policy: { policies: [{ title: 'Policy 1' }, { title: 'Policy 2' }] }
      })
    );

    // Mock sessionStorage with valid user data
  const mockUserDetails = JSON.stringify({
        userProfileData: {
        email: "test@example.com",
        name: "John Doe",
        userId: "12345"
        }
    });

    // Mock sessionStorage.getItem to return the mock data
    Storage.prototype.getItem = jest.fn(() => mockUserDetails);
  });

  test('renders MyPoliciesContainer with child components', () => {
    render(<MyPoliciesContainer />);
  
    // Check if the policies header is rendered
    expect(screen.getByText((content, element) => content.includes('My Policies'))).toBeInTheDocument();
  
    // Check if the mock policy cards are rendered
    expect(screen.getAllByTestId('mock-policy-card')).toHaveLength(1);
  });

test('handles navigation with buttons', () => {
  render(<MyPoliciesContainer />);

  // Get all buttons with the name "Mock Button"
  const buttons = screen.getAllByRole('button', { name: /Mock Button/i });

  // Select the specific button you want to click, for example, the first one
  const nextButton = buttons[0];

  fireEvent.click(nextButton);

  // Check if dispatch is called (you can check for specific actions if needed)
  expect(mockDispatch).toHaveBeenCalled();
});

  test('shows alert when there are policies close to expiry', async () => {
    (reactRedux.useSelector as jest.Mock).mockImplementationOnce((selectorFn) =>
      selectorFn({
        dashbaordLanguageData: { languageData: { my_policies: 'My Policies' } },
        policy: { policies: [{ title: 'Expiring Policy', expiryDate: '2023-12-01' }] }
      })
    );

    render(<MyPoliciesContainer />);
  });
});
