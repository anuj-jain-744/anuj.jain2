import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ClaimCard } from './index';
// import { sanitizeHtml } from '@dpm/shared-module';

 
jest.mock('@dpm/shared-module', () => ({
  sanitizeHtml: jest.fn((html) => html),
}));

const mockData = {
  cardContent: [
    {
      title: 'Claim Title 1',
      content: 'Claim content 1',
      image_url: 'path/to/image1.png',
      image_alt: 'Image 1',
    },
    {
      title: 'Claim Title 2',
      content: 'Claim content 2',
      image_url: 'path/to/image2.png',
      image_alt: 'Image 2',
    },
  ],
};

describe('ClaimCard Component', () => {
  it('renders without crashing', () => {
    render(<ClaimCard cardContent={mockData.cardContent} />);
  });

  it('displays the correct number of cards', () => {
    render(<ClaimCard cardContent={mockData.cardContent} />);
    const cards = screen.getAllByRole('img');
    expect(cards).toHaveLength(mockData.cardContent.length);
  });

  it('displays card titles and content', () => {
    render(<ClaimCard cardContent={mockData.cardContent} />);
    mockData.cardContent.forEach((card) => {
      expect(screen.getByText(card.title)).toBeInTheDocument();
      expect(screen.getByText(card.content)).toBeInTheDocument();
    });
  });

  // it('calls sanitizeHtml for card content', () => {
  //   render(<ClaimCard cardContent={mockData.cardContent} />);
  //   mockData.cardContent.forEach((card) => {
  //     // expect(sanitizeHtml).toHaveBeenCalledWith(card.content);
  //   });
  // });

  it('displays "No card content available." when cardContent is empty', () => {
    render(<ClaimCard cardContent={[]} />);
    expect(screen.getByText('No card content available.')).toBeInTheDocument();
  });
});