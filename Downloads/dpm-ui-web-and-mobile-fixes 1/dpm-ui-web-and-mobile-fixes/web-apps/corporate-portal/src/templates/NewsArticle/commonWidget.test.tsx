import React from 'react';
import { render } from '@testing-library/react';
import { ContactWidget } from './commonWidget';
import { IconsSet } from 'utils/icons'; // Assuming IconsSet is imported
import '@testing-library/jest-dom';

// Mock IconsSet if needed for the test
jest.mock('utils/icons', () => ({
  IconsSet: {
    facebook: '/path/to/facebook-icon.png',
    twitter: '/path/to/twitter-icon.png',
  },
}));

describe('ContactWidget Component', () => {
  it('renders contact items when contactItem is provided', () => {
    const contactItem = [
      {
        label: 'Facebook',
        class: 'facebook',
        url: 'https://facebook.com',
        name: 'John Doe',
        email: 'johndoe@example.com',
      },
      {
        label: 'Twitter',
        class: 'twitter',
        url: 'https://twitter.com',
        name: 'Jane Smith',
        email: 'janesmith@example.com',
      },
    ];

    const { getByText, getByAltText } = render(<ContactWidget contactItem={contactItem} />);

    // Check if the labels are rendered
    expect(getByText('Facebook')).toBeInTheDocument();
    expect(getByText('Twitter')).toBeInTheDocument();

    // Check if the icons are rendered correctly
    expect(getByAltText('Facebook')).toHaveAttribute('src', '/path/to/facebook-icon.png');
    expect(getByAltText('Twitter')).toHaveAttribute('src', '/path/to/twitter-icon.png');

    // Check if the names and emails are rendered correctly
    expect(getByText('John Doe')).toBeInTheDocument();
    expect(getByText('johndoe@example.com')).toBeInTheDocument();

    expect(getByText('Jane Smith')).toBeInTheDocument();
    expect(getByText('janesmith@example.com')).toBeInTheDocument();

    // Check if the URLs are correct
    expect(getByText('Facebook').closest('a')).toHaveAttribute('href', 'https://facebook.com');
    expect(getByText('Twitter').closest('a')).toHaveAttribute('href', 'https://twitter.com');
  });

  it('renders nothing when contactItem is empty', () => {
    const { container } = render(<ContactWidget contactItem={[]} />);
    expect(container.firstChild).toBeNull(); // No rendering should occur
  });
});
