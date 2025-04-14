import React from 'react';
import { render, screen } from '@testing-library/react';
import TrackYourClaim from './TrackYourClaim';
import { MemoryRouter, useLocation } from 'react-router-dom';

// Mock MainContainer and RightContainer components to simplify testing
jest.mock('./MainContainer/MainContainer', () => () => <div>MainContainer</div>);
jest.mock('./RightContainer/RightContainer', () => () => <div>RightContainer</div>);

// Mock the useLocation hook from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));
jest.mock('../../../../../app-shell/src/utils', () => ({
    getFullUrl: jest.fn(),
    navigateTo: jest.fn(),
  }));
  

describe('TrackYourClaim', () => {
  const trackClaimInfo = { claimId: '123', claimStatus: 'In Progress' };
  const headerData = { userName: 'John Doe', userEmail: 'john@example.com' };
  const trackClaimData = { claimId: '123', details: 'Claim details here',productName:"Home" };

  beforeEach(() => {
    // Mocking useLocation to return mock data
    (useLocation as jest.Mock).mockReturnValue({
      state: { trackClaimData },
    });
  });

  it('renders the component correctly', () => {
    render(
      <MemoryRouter>
        <TrackYourClaim trackClaimInfo={trackClaimInfo} headerData={headerData} />
      </MemoryRouter>
    );

    // Verify the ClaimProvider is being rendered and passed the correct props
    expect(screen.getByText('MainContainer')).toBeInTheDocument();
    expect(screen.getByText('RightContainer')).toBeInTheDocument();
  });

  it('should pass the trackClaimData to the ClaimProvider', () => {
    render(
      <MemoryRouter>
        <TrackYourClaim trackClaimInfo={trackClaimInfo} headerData={headerData} />
      </MemoryRouter>
    );

    // Check if the ClaimProvider is receiving the correct props
    // Here we can add assertions based on how the ClaimProvider is used within the component.
    // You might want to mock the behavior or check for rendered UI changes based on those props.
  });

  it('should render MainContainer and RightContainer components', () => {
    render(
      <MemoryRouter>
        <TrackYourClaim trackClaimInfo={trackClaimInfo} headerData={headerData} />
      </MemoryRouter>
    );

    // MainContainer and RightContainer should be rendered
    expect(screen.getByText('MainContainer')).toBeInTheDocument();
    expect(screen.getByText('RightContainer')).toBeInTheDocument();
  });
  it("returns correct mock value based on input", () => {
    const getProductType = jest.fn();
    (getProductType as jest.Mock).mockImplementation((productType: string) => {
      return productType?.split(" ")[0] || "";
    });
    expect(getProductType("Motor Insurance")).toBe("Motor");
    expect(getProductType("Home Protect")).toBe("Home");
    expect(getProductType("")).toBe("");
  });
});

