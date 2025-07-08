import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NotificationComponent from './index';
import { Provider } from 'react-redux';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import configureStore from 'redux-mock-store';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: jest.fn(),
  };
});


jest.mock('@consumer-portal/utils/fileUtil', () => ({
  getProductCode: jest.fn(() => 'MOCKCODE')
}));
jest.mock('utils/makeNotificationData', () => ({
  makeTheNotification: jest.fn(() => [
    {
      "type": "policy",
      "title": "Policy Renewal Reminder",
      "policyNo": "P123",
      "insurerName": "TestInsurer",
      "daysToExpiry": 5,
      "productCode": "RMTPL",
      "quoteNo": "Q-25-331-0007611",
      "policyStatus": 'Active'
  },
  {
    "type": "quote",
    "title": "Payment Due Alert",
    "policyNo": "",
    "insurerName": "",
    "daysToExpiry": "",
    "daysSinceExpiry": "",
    "productCode": "HOME",
    "quoteNo": "Q123"
}
  ])
}));
jest.mock('@consumer-portal/constant', () => ({
  PaymentUrl: "/mock-payment-url/"
}));
jest.mock('constant', () => ({
  TRAVEL : "TRVL",
  MOTOR : "RMTPL",
  MOTOR_COMP : "RMCOM",
  HOME : "HOME",
  TRAVELER: "Traveler",
  MOTORCOMP : "RMCOM",
}));

const mockStore = configureStore([]);
const mockNavigate = jest.fn();
(useNavigate as jest.Mock).mockReturnValue(mockNavigate);

const defaultLanguageData = {
  renew: 'Renew',
  remind_me_later: 'Remind me later',
  policy_renewal_reminder: 'Policy Renewal Reminder',
  quote_alert_title: 'Payment Due Alert',
  your_insurance_policy_nksa: 'Your policy <<POLICYNO>> will expire in <<DAYS_TEXT>> days.',
  expired_policy_msg: 'Your policy expired <<DAYS_TEXT>> days ago.',
  quotation_notification_message: 'You have a new quote <Quote No>',
  make_payment: 'Make Payment',
  cancelled: 'Cancelled'
};

const setup = (store: any, isNotification = true) => {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <NotificationComponent
          languageData={defaultLanguageData}
          setShowNotification={jest.fn()}
        />
      </MemoryRouter>
    </Provider>
  );
};

describe('NotificationComponent', () => {
  let store;

  beforeEach(() => {
    sessionStorage.clear();
    store = mockStore({
      policy: {
        showNotification: [
          {
            policyNo: 'P123',
            insurerName: 'TestInsurer',
            daysToExpiry: 5,
            productCode: 'RMTPL',
            policyStatus: 'Active'
          }
        ]
      },
      queryQuote: {
        quotes: [
          {
            quoteNo: 'Q123',
            productCode: 'HOME',
          }
        ],
        isLoading: false,
        error: null
      },
      auth: {
        userInfo: {
          name: 'John Doe',
          userId: 'user123',
          mobileNumber: '1234567890'
        },
        authDetails: {
          message: 'message',
          isValid: true,
          referenceNo: 'ref123',
          sessionSecretId: 'sess123'
        }
      },
      addressData: {
        addressData: [{ city: 'Riyadh' }]
      }
    });
  });


  it('should render policy and quote notifications', () => {
    setup(store);
    expect(screen.getByText('Policy Renewal Reminder')).toBeInTheDocument();
    expect(screen.getByText('Payment Due Alert')).toBeInTheDocument();
    expect(screen.getByText('Renew')).toBeInTheDocument();
    expect(screen.getByText('Remind me later')).toBeInTheDocument();
    expect(screen.getByText('Make Payment')).toBeInTheDocument();
  });

  it('should call navigate on Renew click', () => {
    setup(store);
    const renewBtn = screen.getByText('Renew');
    fireEvent.click(renewBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/Motor/QuoteAndBuy', expect.anything());
  });

  it('should remove policy on Remind me later click and update sessionStorage', () => {
    setup(store);
    const remindBtn = screen.getByText('Remind me later');
    fireEvent.click(remindBtn);
    const saved = JSON.parse(sessionStorage.getItem('savedNotification') || '[]');
    expect(saved).toContain('P123');
  });

  it('should navigate to payment on Make Payment click', () => {
    setup(store);
    const payBtn = screen.getByText('Make Payment');
    fireEvent.click(payBtn);
    expect(mockNavigate).toHaveBeenCalledWith("/mock-payment-url/UTEyM19NT0NLQ09ERQ==");
  });
});
