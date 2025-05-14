import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PolicyFooter from './index';
import { useApiCall } from '@dpm/shared-module';

// Mock the useApiCall hook
jest.mock('@dpm/shared-module', () => ({
  useApiCall: jest.fn(),
}));

const mockData = {
  blocks: {
    Privacy: {
      data: [
        { linkName: 'Privacy Policy', menuUrl: 'https://example.com/privacy' },
        { linkName: 'Terms of Service', menuUrl: 'https://example.com/terms' },
      ],
    },
    copyright: '© 2023 Example Company',
  },
};

describe('PolicyFooter', () => {
  beforeEach(() => {
    (useApiCall as jest.Mock).mockReturnValue({
      data: mockData,
      makeApiCall: jest.fn(),
    });
  });

  test('renders footer data correctly', () => {
    render(<PolicyFooter />);

    expect(screen.getByText('© 2023 Example Company')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
  });

  test('navigates to correct URL on button click', () => {
    render(<PolicyFooter />);

    const privacyButton = screen.getByText('Privacy Policy').closest('button');
    const termsButton = screen.getByText('Terms of Service').closest('button');

    window.open = jest.fn();
    window.location.href = '';

    fireEvent.click(privacyButton!);
    expect(window.open).toHaveBeenCalledWith('https://example.com/privacy', '_blank');

    fireEvent.click(termsButton!);
    expect(window.open).toHaveBeenCalledWith('https://example.com/terms', '_blank');
  });
});