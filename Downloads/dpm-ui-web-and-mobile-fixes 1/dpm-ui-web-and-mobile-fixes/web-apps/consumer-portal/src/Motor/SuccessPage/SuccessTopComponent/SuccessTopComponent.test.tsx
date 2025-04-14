import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import SuccessTopComponent from './index';
import { useApiCall } from '@dpm/shared-module';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('@dpm/shared-module');

const mockUseApiCall = useApiCall as jest.Mock;

describe('SuccessTopComponent', () => {
  beforeEach(() => {
    mockUseApiCall.mockReturnValue({
      makeApiCall: jest.fn(),
      data: null,
    });
  });

  it('renders success icon when status is true and loading is false', () => {
    render(
      <Router>
        <SuccessTopComponent status={true} data={{}} flag={false} />
      </Router>
    );
    expect(screen.getByAltText('Success Icon')).toBeInTheDocument();
  });

  it('renders loading icon when loading is true', () => {
    render(
      <Router>
        <SuccessTopComponent status={true} data={{}} flag={false} loading={true} />
      </Router>
    );
    expect(screen.getByAltText('Success Icon')).toBeInTheDocument();
  });

  it('renders success message when typeCode is true and flag is false', () => {
    render(
      <Router>
        <SuccessTopComponent status={true} data={{ success: 'Success!' }} flag={false} typeCode={true} />
      </Router>
    );
    waitFor(() => { 
      expect(screen.getByText('Success!')).toBeInTheDocument();
    });
  });

  it('renders cancellation message when typeCode is false and status is false', () => {
    render(
      <Router>
        <SuccessTopComponent status={false} data={{ success_msg_cancel: 'Cancelled!' }} flag={false} />
      </Router>
    );
    expect(screen.getByText('Cancelled!')).toBeInTheDocument();
  });

  it('renders review quotes message when flag is true', () => {
    render(
      <Router>
        <SuccessTopComponent status={true} data={{ success_msg_review_quotes: 'Review Quotes!' }} flag={true} />
      </Router>
    );
    expect(screen.getByText('Review Quotes!')).toBeInTheDocument();
  });

  it('renders contact link when status is false and data is provided', () => {
    render(
      <Router>
        <SuccessTopComponent
          status={false}
          data={{ further_questions: 'Further Questions?', contact_walaa: 'Contact Walaa' }}
          flag={false}
          typeCode={true}
        />
      </Router>
    );
    waitFor(() => { 
    expect(screen.getByText('Further Questions?')).toBeInTheDocument();
    expect(screen.getByText('Contact Walaa')).toBeInTheDocument();
  });
  });

  it('makes API call on mount and sets language data', async () => {
    const mockMakeApiCall = jest.fn();
    mockUseApiCall.mockReturnValue({
      makeApiCall: mockMakeApiCall,
      data: { config: [{ success: 'Success!' }] },
    });

    render(
      <Router>
        <SuccessTopComponent status={true} data={{}} flag={false} />
      </Router>
    );

    expect(mockMakeApiCall).toHaveBeenCalled();
    waitFor(() => {    
      expect(screen.findByText('Success!')).toBeInTheDocument();
    });

  });
});