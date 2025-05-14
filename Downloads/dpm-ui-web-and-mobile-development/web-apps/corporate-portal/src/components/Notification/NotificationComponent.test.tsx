import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useSelector } from 'react-redux';
import NotificationComponent from './index';
import ThemeButton from '../ThemeButton';
import { RootState } from '@dpm/shared-module';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('../ThemeButton', () => ({
  __esModule: true,
  default: jest.fn(({ handleClick, name }) => (
    <button onClick={handleClick}>{name}</button>
  )),
}));

const mockDispatch = jest.fn();
const mockNavigateTo = jest.fn();

const mockPolicyData = {
  showNotification: [
    {
      policyNo: '12345',
      insurerName: 'Insurer A',
      daysToExpiry: '10',
      productCode: 'TRVL',
    },
  ],
};

const mockLanguageData = {
  renew: 'Renew Now',
  remind_me_later: 'Remind Me Later',
  policy_renewal_reminder: 'Policy Renewal Reminder',
  your_insurance_policy_nksa: 'Your insurance policy <<POLICYNO>> will expire in <<DAYS>> days.',
};

describe('NotificationComponent', () => {
  beforeEach(() => {
    (useSelector as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        policy: mockPolicyData,
      } as RootState)
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders notification and handles button clicks', () => {
    render(
      <NotificationComponent
        onClose={jest.fn()}
        isNotification={true}
        languageData={mockLanguageData}
        navigateTo={mockNavigateTo}
      />
    );

    expect(screen.getByText('Policy Renewal Reminder')).toBeInTheDocument();
    expect(screen.getByText('Insurer A Your insurance policy 12345 will expire in 10 days.')).toBeInTheDocument();
    expect(screen.getByText('Renew Now')).toBeInTheDocument();
    expect(screen.getByText('Remind Me Later')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Renew Now'));
    expect(mockNavigateTo).not.toHaveBeenCalled(); // Since the switch case is commented out

    fireEvent.click(screen.getByText('Remind Me Later'));
    expect(sessionStorage.getItem('savedNotification')).toContain('12345');
  });

  test('does not render when isNotification is false', () => {
    render(
      <NotificationComponent
        onClose={jest.fn()}
        isNotification={false}
        languageData={mockLanguageData}
      />
    );

    expect(screen.queryByText('Policy Renewal Reminder')).not.toBeInTheDocument();
  });
});