// ClaimContext.test.tsx
import { render, screen, act } from '@testing-library/react';
import { useClaimContext } from './useClaimContext';
import { ClaimContext } from '../../context/TrackClaimContext';

// Mock the navigateTo function (you can mock any other function as well)
jest.mock('../../../../app-shell/src/utils', () => ({
  navigateTo: jest.fn(),
}));

// Mock ClaimContext provider for the tests
const MockClaimProvider = ({ children, value }) => {
    return (
      <ClaimContext.Provider value={value}>
        {children}
      </ClaimContext.Provider>
    );
  };

describe('ClaimContext and useClaimContext Hook', () => {
  it('throws an error when used outside of ClaimProvider', () => {
    const TestComponent = () => {
      const context = useClaimContext();
      return <div>{context.trackClaimInfo}</div>;
    };

    // Test that it throws an error when the context is used outside of the provider
    expect(() => render(<TestComponent />)).toThrow(
      'useClaimContext must be used within a ClaimProvider'
    );
  });
  it('returns context value when used inside ClaimProvider', () => {
    const mockContextValue = { claim: 'Claim #123', setClaim: jest.fn() };

    // Test if the context value is returned correctly
    const TestComponent = () => {
      const context = useClaimContext();
      return <div>{context.claim}</div>;
    };

    render(
      <MockClaimProvider value={mockContextValue}>
        <TestComponent />
      </MockClaimProvider>
    );

    // Check if the claim is rendered from context
    expect(screen.getByText('Claim #123')).toBeInTheDocument();
  });

});
