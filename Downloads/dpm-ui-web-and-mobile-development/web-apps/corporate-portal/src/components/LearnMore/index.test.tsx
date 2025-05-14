import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LearnMore } from './index'; // Adjust the import path as necessary
import { sanitizeHtml } from '@dpm/shared-module';

// Mock the sanitizeHtml function
jest.mock('@dpm/shared-module', () => ({
  sanitizeHtml: jest.fn((html) => html),
}));

const mockProps = {
  content: '<p>Test Content</p>',
  relatedLinksTitle: 'Related Links',
  links: [
    { text: 'Link 1', route: '/link1' },
    { text: 'Link 2', route: '/link2' },
  ],

};

describe('Learn More Component', () => {
  it('renders content correctly', () => {
    render(<LearnMore {...mockProps} />);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders Related Links correctly', () => {
    render(<LearnMore {...mockProps} />);
    expect(screen.getByText('Related Links')).toBeInTheDocument();
  });

  it('renders links correctly', () => {
    render(<LearnMore {...mockProps} />);
    mockProps.links.forEach(link => {
      expect(screen.getByText(link.text)).toBeInTheDocument();
    });
  });

});