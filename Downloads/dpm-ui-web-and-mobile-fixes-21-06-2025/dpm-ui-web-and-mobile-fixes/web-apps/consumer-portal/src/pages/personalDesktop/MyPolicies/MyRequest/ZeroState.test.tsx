import React from 'react';
import { render, screen } from '@testing-library/react';
import ZeroState from './ZeroState';

describe('ZeroState Component', () => {
  it('renders the video and default text when languageData is not provided', () => {
    render(<ZeroState languageData={{ noRequestFound: undefined }} />);

    // Check if the video is rendered
    const videoElement = screen.getByTestId('zero-state-video');
    expect(videoElement).toBeInTheDocument();

    // Check if the default text is displayed
    expect(screen.getByText('No request found')).toBeInTheDocument();
  });

  it('renders the video and custom text from languageData', () => {
    const mockLanguageData = { noRequestFound: 'No requests available' };
    render(<ZeroState languageData={mockLanguageData} />);

    // Check if the video is rendered
    const videoElement = screen.getByTestId('zero-state-video');
    expect(videoElement).toBeInTheDocument();

    // Check if the custom text is displayed
    expect(screen.getByText('No requests available')).toBeInTheDocument();
  });
});