import { AcceessPolicyDocuments, PolicyContainer } from './index';

describe('index.ts module exports', () => {
  it('should export PolicyContainer', () => {
    expect(PolicyContainer).toBeDefined();
  });

  it('should export AcceessPolicyDocuments', () => {
    expect(AcceessPolicyDocuments).toBeDefined();
  });
});