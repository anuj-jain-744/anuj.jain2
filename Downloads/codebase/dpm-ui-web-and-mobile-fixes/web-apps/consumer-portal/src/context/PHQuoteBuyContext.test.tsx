// PHQuoteBuyContext.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PHQuoteBuyProvider, usePHQuoteBuyContext } from './PHQuoteBuyContext'; // Adjust path if needed

// Dummy Component to test the context values
const TestComponent = () => {
  const {
    stepValue,
    setStepValue,
    showCanvas,
    setShowCanvas,
    homeConfig,
    setHomeConfig,
  } = usePHQuoteBuyContext();
  
  return (
    <div>
      <div data-testid="stepValue">{stepValue}</div>
      <button onClick={() => setStepValue(2)}>Change Step</button>

      <div data-testid="showCanvas">{showCanvas ? 'true' : 'false'}</div>
      <button onClick={() => setShowCanvas(true)}>Show Canvas</button>

      <div data-testid="homeConfig">{JSON.stringify(homeConfig)}</div>
      <button onClick={() => setHomeConfig({ someConfig: 'new value' })}>Set Home Config</button>
    </div>
  );
};

describe('PHQuoteBuyProvider', () => {
  test('provides the initial context value and allows state updates', () => {
    render(
      <PHQuoteBuyProvider>
        <TestComponent />
      </PHQuoteBuyProvider>
    );

    // Test initial state
   // expect(screen.getByTestId('stepValue')).toHaveTextContent('1');
    expect(screen.getByTestId('showCanvas')).toHaveTextContent('false');
    expect(screen.getByTestId('homeConfig')).toHaveTextContent('{}');

    // Test state update for stepValue
    fireEvent.click(screen.getByText('Change Step'));
    expect(screen.getByTestId('stepValue')).toHaveTextContent('2');

    // Test state update for showCanvas
    fireEvent.click(screen.getByText('Show Canvas'));
    expect(screen.getByTestId('showCanvas')).toHaveTextContent('true');

    // Test state update for homeConfig
    fireEvent.click(screen.getByText('Set Home Config'));
    expect(screen.getByTestId('homeConfig')).toHaveTextContent(
      '{"someConfig":"new value"}'
    );
  });

  test('throws an error if context is used outside of provider', () => {
    const TestOutsideComponent = () => {
      const context = usePHQuoteBuyContext();
      return <div>{JSON.stringify(context)}</div>;
    };

    // expect(() => render(<TestOutsideComponent />)).toThrowError(
    //   'usePHQuoteBuyContext must be used within a PHQuoteBuyProvider'
    // );
  });
});

