import React from 'react';
import { render, screen } from '@testing-library/react';
import { TravelPolicyProvider, TravelPolicyContext } from './PolicyContext';

describe('TravelPolicyProvider', () => {
  it('provides the correct initial context values', () => {
    render(
      <TravelPolicyProvider>
        <TravelPolicyContext.Consumer>
          {(value) => (
            <>
              <div data-testid="reviewPolicy">{JSON.stringify(value?.reviewPolicy)}</div>
              <div data-testid="refundPolicy">{JSON.stringify(value?.refundPolicy)}</div>
            </>
          )}
        </TravelPolicyContext.Consumer>
      </TravelPolicyProvider>
    );

    expect(screen.getByTestId('reviewPolicy')).toHaveTextContent('null');
    expect(screen.getByTestId('refundPolicy')).toHaveTextContent('null');
  });

  it('updates the context values correctly', () => {
    render(
      <TravelPolicyProvider>
        <TravelPolicyContext.Consumer>
          {(value) => (
            <>
              <button onClick={() => value?.setReviewPolicy({ policy: 'newReviewPolicy' })}>Set Review Policy</button>
              <button onClick={() => value?.setRefundPolicy({ policy: 'newRefundPolicy' })}>Set Refund Policy</button>
              <div data-testid="reviewPolicy">{JSON.stringify(value?.reviewPolicy)}</div>
              <div data-testid="refundPolicy">{JSON.stringify(value?.refundPolicy)}</div>
            </>
          )}
        </TravelPolicyContext.Consumer>
      </TravelPolicyProvider>
    );

    screen.getByText('Set Review Policy').click();
    screen.getByText('Set Refund Policy').click();

    expect(screen.getByTestId('reviewPolicy')).toHaveTextContent("null");
    expect(screen.getByTestId('refundPolicy')).toHaveTextContent("null");
  });
});