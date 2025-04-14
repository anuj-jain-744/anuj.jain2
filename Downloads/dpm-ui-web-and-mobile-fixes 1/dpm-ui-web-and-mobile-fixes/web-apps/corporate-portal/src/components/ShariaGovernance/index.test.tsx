import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ShariaGovernance } from './index'; // Adjust the import path as necessary
import { sanitizeHtml } from '@dpm/shared-module';

// Mock the sanitizeHtml function
jest.mock('@dpm/shared-module', () => ({
  sanitizeHtml: jest.fn((html) => html),
}));

const mockProps = {
  content: '<p>Test Content</p>',
  knowMoreTitle: 'Know More',
  links: [
    { text: 'Link 1', route: '/link1' },
    { text: 'Link 2', route: '/link2' },
  ],
  sidebarDescription: 'Sidebar Description',
  websiteLink: 'https://example.com',
  sidebarImage: { url: 'https://example.com/image.jpg', alt: 'Image Alt' },
};

describe('ShariaGovernance Component', () => {
  it('renders content correctly', () => {
    render(<ShariaGovernance {...mockProps} />);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders know more title correctly', () => {
    render(<ShariaGovernance {...mockProps} />);
    expect(screen.getByText('Know More')).toBeInTheDocument();
  });

  it('renders sidebar image correctly', () => {
    render(<ShariaGovernance {...mockProps} />);
    const img = screen.getByAltText('Image Alt');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('renders links correctly', () => {
    render(<ShariaGovernance {...mockProps} />);
    mockProps.links.forEach(link => {
      expect(screen.getByText(link.text)).toBeInTheDocument();
    });
  });

  it('renders sidebar description correctly', () => {
    render(<ShariaGovernance {...mockProps} />);
    expect(screen.getByText('Sidebar Description')).toBeInTheDocument();
  });
});