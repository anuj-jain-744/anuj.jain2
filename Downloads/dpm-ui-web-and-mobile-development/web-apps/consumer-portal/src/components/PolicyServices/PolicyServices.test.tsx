import React from 'react';
import { render, screen } from '@testing-library/react';
import { AcceessPolicyDocuments, PolicyContainer } from './index';

describe('index.ts exports', () => {
  it('should export AcceessPolicyDocuments', () => {
    expect(AcceessPolicyDocuments).toBeDefined();
  });

  it('should export PolicyContainer', () => {
    expect(PolicyContainer).toBeDefined();
  });
});