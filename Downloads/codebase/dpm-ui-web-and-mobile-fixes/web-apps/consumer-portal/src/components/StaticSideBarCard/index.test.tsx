import React from 'react';
import { render, screen } from '@testing-library/react';
import StaticImageCard from '.';

describe('StaticImageCard component', () => {
  const mockImages = [
    { url: 'https://example.com/image1.jpg', alt: 'Image 1' },
    { url: 'https://example.com/image2.jpg', alt: 'Image 2' },
  ];

  it('renders without crashing', () => {
    render(<StaticImageCard sidebarImage={mockImages} />);
    const images = screen.getAllByRole('img');
    expect(images.length).toBe(2);
  });

  it('renders images with correct src and alt attributes', () => {
    render(<StaticImageCard sidebarImage={mockImages} />);
    expect(screen.getByAltText('Image 1')).toHaveAttribute('src', 'https://example.com/image1.jpg');
    expect(screen.getByAltText('Image 2')).toHaveAttribute('src', 'https://example.com/image2.jpg');
  });

  it('renders nothing when sidebarImage is an empty array', () => {
    const { container } = render(<StaticImageCard sidebarImage={[]} />);
    expect(container.querySelectorAll('img').length).toBe(0);
  });
});
