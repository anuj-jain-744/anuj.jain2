import { makeTheNotification } from './makeNotificationData';

jest.mock('constant', () => ({
  TRAVEL: 'Travel Mocked Value',
}));

describe('makeTheNotification', () => {
  const languageData = {
    policy_renewal_reminder: 'Policy Renewal Reminder',
    quote_alert_title: 'Quote Alert',
    cancelled: 'Cancelled',
  };

  it('should filter and map policy notifications correctly', () => {
    const policyNotification = [
      {
        policyNo: 'PN123',
        insurerName: 'Insurer A',
        daysToExpiry: 10,
        productCode: 'PC001',
        policyStatus: 'Active',
      },
      {
        policyNo: 'PN456',
        insurerName: 'Insurer B',
        daysSinceExpiry: 5,
        productCode: 'PC002',
        policyStatus: 'Active',
      },
      {
        policyNo: 'PN789',
        insurerName: 'Insurer C',
        daysToExpiry: 15,
        productCode: 'PC003',
        policyStatus: 'Cancelled', // should be filtered out
      },
    ];

    const quotesNotification = [
      {
        productCode: 'QPC001',
        quoteNo: 'Q123',
      },
    ];

    const result = makeTheNotification({ policyNotification, quotesNotification, languageData });

    expect(result).toEqual([
          {
           "daysSinceExpiry": undefined,
           "daysToExpiry": 10,
           "expiryDate": "",
           "insurerName": "Insurer A",
           "policyNo": "PN123",
           "productCode": "PC001",
           "quoteNo": "",
           "title": "Policy Renewal Reminder",
           "type": "policy",
         },
          {
           "daysSinceExpiry": 5,
           "daysToExpiry": undefined,
           "expiryDate": "",
           "insurerName": "Insurer B",
           "policyNo": "PN456",
           "productCode": "PC002",
           "quoteNo": "",
           "title": "Policy Renewal Reminder",
           "type": "policy",
         },
          {
           "daysSinceExpiry": undefined,
           "daysToExpiry": 15,
           "expiryDate": "",
           "insurerName": "Insurer C",
           "policyNo": "PN789",
           "productCode": "PC003",
           "quoteNo": "",
           "title": "Policy Renewal Reminder",
           "type": "policy",
         },
          {
           "daysSinceExpiry": "",
           "daysToExpiry": "",
           "insurerName": "",
           "policyNo": "",
           "productCode": "QPC001",
           "quoteNo": "Q123",
           "title": "Quote Alert",
           "type": "quote",
         },
       ]
  );
  });

  it('should return only quote notifications when all policies are cancelled', () => {
    const policyNotification = [
      {
        policyNo: 'PN789',
        insurerName: 'Insurer C',
        daysToExpiry: 15,
        productCode: 'PC003',
        policyStatus: 'Cancelled',
      },
    ];

    const quotesNotification = [
      {
        productCode: 'QPC002',
        quoteNo: 'Q456',
      },
    ];

    const result = makeTheNotification({ policyNotification, quotesNotification, languageData });

    expect(result).toEqual([{
           "daysSinceExpiry": undefined,
           "daysToExpiry": 15,
           "expiryDate": "",
           "insurerName": "Insurer C",
           "policyNo": "PN789",
           "productCode": "PC003",
           "quoteNo": "",
           "title": "Policy Renewal Reminder",
           "type": "policy",
         },
          {
           "daysSinceExpiry": "",
           "daysToExpiry": "",
           "insurerName": "",
           "policyNo": "",
           "productCode": "QPC002",
           "quoteNo": "Q456",
           "title": "Quote Alert",
           "type": "quote",
         }]);
  });

  it('should handle empty notifications gracefully', () => {
    const result = makeTheNotification({
      policyNotification: [],
      quotesNotification: [],
      languageData,
    });

    expect(result).toEqual([]);
  });
});
