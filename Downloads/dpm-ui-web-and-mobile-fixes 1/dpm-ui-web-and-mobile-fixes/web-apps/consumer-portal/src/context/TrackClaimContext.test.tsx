import React from 'react';
import { render, screen } from '@testing-library/react';
import { ClaimProvider, ClaimContext } from './TrackClaimContext';
import { useNavigate } from 'react-router-dom';
import { navigateTo } from "../../../app-shell/src/utils";

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

// Mock the navigateTo function
jest.mock("../../../app-shell/src/utils", () => ({
  navigateTo: jest.fn(),
}));

describe('ClaimProvider', () => {
  const mockNavigate = jest.fn();
  const initialTrackClaimInfo = { claimId: '123' };
  const initialContactData = { email: 'test@example.com' };
  const trackClaimData = { status: 'pending' };

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it('should provide the correct context values', () => {
    render(
      <ClaimProvider initialTrackClaimInfo={initialTrackClaimInfo} initialContactData={initialContactData} trackClaimData={trackClaimData}>
        <ClaimContext.Consumer>
          {(value) => (
            <>
              <div data-testid="trackClaimInfo">{JSON.stringify(value?.trackClaimInfo)}</div>
              <div data-testid="contactData">{JSON.stringify(value?.contactData)}</div>
              <div data-testid="trackNewData">{JSON.stringify(value?.trackNewData)}</div>
            </>
          )}
        </ClaimContext.Consumer>
      </ClaimProvider>
    );

    expect(screen.getByTestId('trackClaimInfo').textContent).toBe(JSON.stringify(initialTrackClaimInfo));
    expect(screen.getByTestId('contactData').textContent).toBe(JSON.stringify(initialContactData));
    expect(screen.getByTestId('trackNewData').textContent).toBe(JSON.stringify(trackClaimData));
  });

  it('should handle navigation correctly', () => {
    render(
      <ClaimProvider initialTrackClaimInfo={initialTrackClaimInfo} initialContactData={initialContactData} trackClaimData={trackClaimData}>
        <ClaimContext.Consumer>
          {(value) => (
            <button onClick={() => value?.handleNavigate('/test-url')}>Navigate</button>
          )}
        </ClaimContext.Consumer>
      </ClaimProvider>
    );

    screen.getByText('Navigate').click();
    expect(navigateTo).toHaveBeenCalledWith('/test-url', mockNavigate);
  });
});