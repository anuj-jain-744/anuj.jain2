import { updateCalculatePremiumPayload, updateGenerateQuotePayload, updateSliderChangeCalculatePremiumPayload, deepCopy } from './quoteAndBuyTravel';

describe('quoteAndBuyTravel functions', () => {
  let payload: any;

  beforeEach(() => {
    payload = {
      policyLob: [{
        policyRisk: [{
          repairCondition: '',
          vehicleValue: '',
          deductibleAmount: ''
        }]
      }],
      policyCustomer: [{
        commercialRegistration: '',
        email: '',
        primaryAddress: ''
      }]
    };
  });

  test('updateCalculatePremiumPayload should update repairCondition', () => {
    const result = updateCalculatePremiumPayload('repairCondition', 'newCondition', payload);
    expect(result.policyLob[0].policyRisk[0].repairCondition).toBe('newCondition');
  });

  test('updateCalculatePremiumPayload should update other fields', () => {
    const result = updateCalculatePremiumPayload('someField', 'someValue', payload);
    expect(result.someField).toBe('someValue');
  });

  test('updateGenerateQuotePayload should update commercialRegistration', () => {
    const result = updateGenerateQuotePayload('commercialRegistration', 'newRegistration', payload);
    expect(result.policyCustomer[0].commercialRegistration).toBe('');
  });

  test('updateGenerateQuotePayload should update email', () => {
    const result = updateGenerateQuotePayload('email', 'newEmail', payload);
    expect(result.policyCustomer[0].email).toBe('newEmail');
  });

  test('updateGenerateQuotePayload should update primaryAddress', () => {
    const result = updateGenerateQuotePayload('primaryAddress', 'newAddress', payload);
    expect(result.policyCustomer[0].primaryAddress).toBe('newAddress');
  });

  test('updateGenerateQuotePayload should update deductibleAmount', () => {
    const result = updateGenerateQuotePayload('deductibleAmount', 'newAmount', payload);
    expect(result.policyLob[0].policyRisk[0].deductibleAmount).toBe('newAmount');
  });

  test('updateSliderChangeCalculatePremiumPayload should update repairCondition and vehicleValue', () => {
    const result = updateSliderChangeCalculatePremiumPayload('repairCondition', 'vehicleValue', 'newCondition', 'newValue', payload);
    expect(result.policyLob[0].policyRisk[0].repairCondition).toBe('newCondition');
    expect(result.policyLob[0].policyRisk[0].vehicleValue).toBe('newValue');
  });

  test('deepCopy should create a deep copy of an object', () => {
    const obj = { a: 1, b: { c: 2 } };
    const copy = deepCopy(obj);
    expect(copy).toEqual(obj);
    expect(copy).not.toBe(obj);
  });
});