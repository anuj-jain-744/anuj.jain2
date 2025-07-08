import React from 'react';
import { render, screen } from '@testing-library/react';
import SeniorCitizenAlert from './index';
import { sanitizeHtml } from "@dpm/shared-module";

jest.mock('@dpm/shared-module', () => ({
  sanitizeHtml: jest.fn((html) => html),
}));

describe('SeniorCitizenAlert', () => {
  it('renders the Alert component', () => {
    render(<SeniorCitizenAlert message="<p>Test Message</p>" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders the GppMaybeOutlinedIcon component', () => {
    render(<SeniorCitizenAlert message="<p>Test Message</p>" />);
    expect(screen.getByTestId('GppMaybeOutlinedIcon')).toBeInTheDocument();
  });

  it('sanitizes and renders the message', () => {
    const message = '<p>Test Message</p>';
    render(<SeniorCitizenAlert message={message} />);
    expect(sanitizeHtml).toHaveBeenCalledWith(message);
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });
});