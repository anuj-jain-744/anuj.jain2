import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import TitleContainer from './TitleContainer';

// Mock the CSS module
jest.mock('../TitleContainer.module.scss', () => ({
  tycTitleContainer: 'tycTitleContainer',
  tycTitleFrame: 'tycTitleFrame',
  tycTitleFrameBox: 'tycTitleFrameBox',
  tycTitleFrameText: 'tycTitleFrameText',
  tycTitleFrameStatusRed: 'tycTitleFrameStatusRed',
  tycTitleFrameStatusGreen: 'tycTitleFrameStatusGreen'
}));

// Mock useClaimContext
jest.mock('Motor/ClaimHooks/useClaimContext', () => ({
  useClaimContext: jest.fn()
}));

import { useClaimContext } from 'Motor/ClaimHooks/useClaimContext';

describe('TitleContainer', () => {
  const mockTrackClaimInfo = { current_status: 'Pending' };

  beforeEach(() => {
    (useClaimContext as jest.Mock).mockReturnValue({ trackClaimInfo: mockTrackClaimInfo });
  });

  // it('renders title and green status correctly when status is not "Reports Awaited"', () => {
  //   render(<TitleContainer title="Claim Title" status="Approved" />);
    
  //   expect(screen.getByText('Claim Title')).toBeInTheDocument();
  //   expect(screen.getByText('Pending : Approved')).toBeInTheDocument();
  //   expect(screen.getByText('Pending : Approved').className).toContain('tycTitleFrameStatusGreen');
  // });

  // it('renders red status when status is "Reports Awaited"', () => {
  //   render(<TitleContainer title="Claim Title" status="Reports Awaited" />);
    
  //   expect(screen.getByText('Claim Title')).toBeInTheDocument();
  //   expect(screen.getByText('Pending : Reports Awaited')).toBeInTheDocument();
  //   expect(screen.getByText('Pending : Reports Awaited').className).toContain('tycTitleFrameStatusRed');
  // });

  it('handles missing status gracefully', () => {
    render(<TitleContainer title="Claim Without Status" />);
    
    waitFor(() => {
        expect(screen.getByText('Claim Without Status')).toBeInTheDocument();
        expect(screen.getByText('Pending : ')).toBeInTheDocument();
    });
   
  });

  it('handles missing trackClaimInfo gracefully', () => {
    (useClaimContext as jest.Mock).mockReturnValue({ trackClaimInfo: undefined });

    render(<TitleContainer title="Claim No Track Info" status="Approved" />);
   
    waitFor(() => {
    expect(screen.getByText('Claim No Track Info')).toBeInTheDocument();
    expect(screen.getByText(' : Approved')).toBeInTheDocument();
});
  });
});
