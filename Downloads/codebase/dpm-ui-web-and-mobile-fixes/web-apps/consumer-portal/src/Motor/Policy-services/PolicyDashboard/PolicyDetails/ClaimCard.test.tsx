import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ClaimCard from './ClaimCard';
import { TRAVEL, HOME } from 'constant';

jest.mock('assets/Dashboard/MOTOR_MyRequest.svg', () => 'MotorSmallLogo');
jest.mock('assets/Dashboard/Travel_MyRequest.svg', () => 'TravelSmallLogo');
jest.mock('assets/Dashboard/Home_MyRequest.svg', () => 'HomeSmallLogo');

describe('ClaimCard Component', () => {
  const mockNavigateTo = jest.fn();
  const mockLanguageData = {
    motor_claim_no: 'Motor Claim No',
    travel_claim_no: 'Travel Claim No',
    home_claim_no: 'Home Claim No',
    check_status: 'Check Status',
  };

  const mockPolicyInfo = {
    policyNo: 'POL123',
    endorsementNo: 'END456',
    productCode: TRAVEL,
  };

  const mockClaimInfo = {
    productName: 'Travel Insurance',
  };

  it('renders correctly with given props', () => {
    render(
      <ClaimCard
        claimNumber="CLAIM789"
        claimStatus="Pending"
        policyInfo={mockPolicyInfo}
        languageData={mockLanguageData}
        claimInfo={mockClaimInfo}
        navigateTo={mockNavigateTo}
      />
    );

    expect(screen.getByText('Travel Claim No')).toBeInTheDocument();
    expect(screen.getByText('CLAIM789')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Check Status')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('displays the correct logo based on productCode', () => {
    const { rerender } = render(
      <ClaimCard
        claimNumber="CLAIM789"
        claimStatus="Pending"
        policyInfo={{ ...mockPolicyInfo, productCode: TRAVEL }}
        languageData={mockLanguageData}
        claimInfo={mockClaimInfo}
        navigateTo={mockNavigateTo}
      />
    );
    expect(screen.getByAltText('Product Logo').getAttribute('src')).toBe('HomeSmallLogo');

    rerender(
      <ClaimCard
        claimNumber="CLAIM789"
        claimStatus="Pending"
        policyInfo={{ ...mockPolicyInfo, productCode: HOME }}
        languageData={mockLanguageData}
        claimInfo={mockClaimInfo}
        navigateTo={mockNavigateTo}
      />
    );
    expect(screen.getByAltText('Product Logo').getAttribute('src')).toBe('HomeSmallLogo');

    rerender(
      <ClaimCard
        claimNumber="CLAIM789"
        claimStatus="Pending"
        policyInfo={{ ...mockPolicyInfo, productCode: 'MOTOR' }}
        languageData={mockLanguageData}
        claimInfo={mockClaimInfo}
        navigateTo={mockNavigateTo}
      />
    );
    expect(screen.getByAltText('Product Logo').getAttribute('src')).toBe('HomeSmallLogo');
  });

  it('calls navigateTo with correct arguments on click', () => {
    render(
      <ClaimCard
        claimNumber="CLAIM789"
        claimStatus="Pending"
        policyInfo={mockPolicyInfo}
        languageData={mockLanguageData}
        claimInfo={mockClaimInfo}
        navigateTo={mockNavigateTo}
      />
    );

    fireEvent.click(screen.getByRole('button'));
    expect(mockNavigateTo).toHaveBeenCalledWith('/track-claim', {
      data: { claimNo: 'CLAIM789', lineOfBusiness: 'NonMotor' },
    });
  });

  it('calls navigateTo with correct arguments on Enter key press', () => {
    render(
      <ClaimCard
        claimNumber="CLAIM789"
        claimStatus="Pending"
        policyInfo={mockPolicyInfo}
        languageData={mockLanguageData}
        claimInfo={mockClaimInfo}
        navigateTo={mockNavigateTo}
      />
    );

    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
    expect(mockNavigateTo).toHaveBeenCalledWith('/track-claim', {
      data: { claimNo: 'CLAIM789', lineOfBusiness: 'NonMotor' },
    });
  });

  it('has accessible attributes for keyboard navigation', () => {
    render(
      <ClaimCard
        claimNumber="CLAIM789"
        claimStatus="Pending"
        policyInfo={mockPolicyInfo}
        languageData={mockLanguageData}
        claimInfo={mockClaimInfo}
        navigateTo={mockNavigateTo}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('tabIndex', '0');
    expect(button).toHaveAttribute('role', 'button');
  });
});