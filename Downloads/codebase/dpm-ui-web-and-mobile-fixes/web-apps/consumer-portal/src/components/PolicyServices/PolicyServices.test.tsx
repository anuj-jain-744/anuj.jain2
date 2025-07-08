import { AcceessPolicyDocuments, PolicyContainer } from './index';

// Mock getAmountWithIcon
jest.mock('@app-shell/utils/common', () => ({
  getAmountWithIcon: jest.fn(amount => `SAR ${amount}`),
}));

describe('index.ts exports', () => {
  it('should export AcceessPolicyDocuments', () => {
    expect(AcceessPolicyDocuments).toBeDefined();
  });

  it('should export PolicyContainer', () => {
    expect(PolicyContainer).toBeDefined();
  });
});