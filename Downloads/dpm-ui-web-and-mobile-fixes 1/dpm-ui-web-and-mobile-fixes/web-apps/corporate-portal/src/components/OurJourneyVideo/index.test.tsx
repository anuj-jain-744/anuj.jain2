import React from 'react';
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { OurJourney } from './index';

describe('OurJourney Component', () => {
  const content = '<p>Our Journey Content</p>';
  const video_url = 'https://www.youtube.com/embed/PZLEPsl_Hl4?si=mRr4lnkfxLDrTH8U';

  it('renders without crashing', () => {
    const { container } = render(<OurJourney content={content} video_url={video_url} />);
    expect(container).toBeInTheDocument();
  });

  it('renders the HTML content correctly', () => {
    const { getByText } = render(<OurJourney content={content} video_url={video_url} />);
    expect(getByText('Our Journey Content')).toBeInTheDocument();
  });

  it('renders the iframe with correct src', () => {
    const { container } = render(<OurJourney content={content} video_url={video_url} />);
    const iframe = container.querySelector('iframe');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', video_url);
  });
});
