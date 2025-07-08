import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SucessPage from './SuccessPage';
import { MemoryRouter, useLocation } from 'react-router-dom';

// Mock image import
jest.mock('assets/contactWalaa/GreenSuccess.svg', () => 'mock-success-icon.svg');

// Mock useLocation to simulate state data
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

describe('SucessPage Component', () => {
  const mockState = {
    common_lables: {
      thankyou_title: 'Thank you!',
      application_submitted: 'Your application has been submitted.',
      thankyou_description: 'We appreciate your interest.',
      thankyou_description2: 'You will hear from us soon.',
      thankyou_button_text: 'Go to Careers',
    },
  };

  beforeEach(() => {
    useLocation.mockReturnValue({ state: mockState });
  });

  it('renders all text and image correctly', () => {
    render(
      <MemoryRouter>
        <SucessPage />
      </MemoryRouter>
    );

    expect(screen.getByText(mockState.common_lables.thankyou_title)).toBeInTheDocument();
    expect(screen.getByText(mockState.common_lables.application_submitted)).toBeInTheDocument();
    expect(screen.getByText(mockState.common_lables.thankyou_description)).toBeInTheDocument();
    expect(screen.getByText(mockState.common_lables.thankyou_description2)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'mock-success-icon.svg');
    expect(screen.getByRole('button', { name: mockState.common_lables.thankyou_button_text })).toBeInTheDocument();
  });

  it('redirects to /careers when button is clicked', () => {
    delete window.location;
    window.location = { href: '' }; // mock href

    render(
      <MemoryRouter>
        <SucessPage />
      </MemoryRouter>
    );

    const button = screen.getByRole('button', { name: mockState.common_lables.thankyou_button_text });
    fireEvent.click(button);

    expect(window.location.href).toBe('/careers');
  });
});