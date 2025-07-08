import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Login } from './index';
import { useCommonContext, useApiCall, useFetchData } from '@dpm/shared-module';

jest.mock('@dpm/shared-module', () => ({
  useCommonContext: jest.fn(),
  useApiCall: jest.fn(),
  useFetchData: jest.fn(),
}));

jest.mock('../../constant', () => ({
  VITE_CONTENT_BASE_URI: 'http://34.166.69.105/walaa/web/',
  cmsAPIRoute: {login: "login"}
}));

jest.mock('components/Loader', () => ({
  LoaderOverlay: jest.fn(() => <div>Loading...</div>),
}));

jest.mock('./LoginForm', () => ({
  LoginForm: jest.fn(() => <div data-testid="login-form">LoginForm Component</div>),
}));

jest.mock('components/OTPComponent/OtpWrapper', () => ({
  OTPWrapper: jest.fn(() => <div data-testid="otp-wrapper">OTPWrapper Component</div>),
}));

jest.mock('../KnowMoreWidget', () => ({
  KnowMoreWidget: jest.fn(() => <div>KnowMoreWidget Component</div>),
}));

jest.mock('./Error', () => ({
  Error: jest.fn(() => <div data-testid="error">Error Component</div>),
}));

jest.mock('./ChangeMobileNumber', () => ({
  ChangeMobileNumber: jest.fn(() => <div data-testid="change-mobile-number">ChangeMobileNumber Component</div>),
}));

jest.mock('./Success', () => ({
  Success: jest.fn(() => <div data-testid="success">Success Component</div>),
}));

jest.mock('./ForgotPasswordAndSignUp', () => ({
  ForgotPasswordAndSignUp: jest.fn(() => <div data-testid="forgot-password-signup">ForgotPasswordAndSignUp Component</div>),
}));

jest.mock('./SetPassword', () => ({
  SetPassword: jest.fn(() => <div data-testid="set-password">SetPassword Component</div>),
}));

const mockShowLoginModalStatus = jest.fn();
const mockNavigateTo = jest.fn();
const mockSetCurrentStepValue = jest.fn();

const renderComponent = (showModalStatus = true) => {
  render(
    <Login
      showModalStatus={showModalStatus}
      ShowLoginModalStatus={mockShowLoginModalStatus}
      navigateTo={mockNavigateTo}
      setCurrentStepValue={mockSetCurrentStepValue}
    />
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    (useCommonContext as jest.Mock).mockReturnValue({ currentLanguage: 'en' });
    (useApiCall as jest.Mock).mockReturnValue({
      makeApiCall: jest.fn(),
      data: { config: [{ title: 'Login' }] },
      errors: null,
    });
    (useFetchData as jest.Mock).mockResolvedValue({
      data: { config: [{ title: 'Login' }] },
      errors: null,
    });
    
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the Login component and displays LoaderOverlay when loading', () => {
    renderComponent();

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders the Login component and displays the LoginForm component when currentStepValue is 0', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('login-form')).toBeInTheDocument();
    });
  });

  test('changes currentStepValue and renders the correct component', async() => {
    renderComponent();

    await waitFor(() => {
      // Simulate the action that triggers the state change
      fireEvent.click(screen.getByTestId('login-form'));
      mockSetCurrentStepValue(1);
      // Verify that setCurrentStepValue was called with the correct value
      expect(mockSetCurrentStepValue).toHaveBeenCalledWith(1);
    });    
  });
});