import React from 'react';
import { render, screen } from '@testing-library/react';
import { useSelector } from 'react-redux';
import WalaaOfferings from './WalaaOfferings';
import { MemoryRouter, useNavigate } from 'react-router-dom';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const mockLanguageData = {
  walaa_offerings: 'Walaa Offerings',
  insurance_made_easy_just_for_you: 'Insurance made easy just for you',
};

describe('WalaaOfferings Component', () => {
  beforeEach(() => {
    (useSelector as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        dashbaordLanguageData: {
          languageData: mockLanguageData,
        },
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the title and description', () => {
    render(
      <MemoryRouter>
        <WalaaOfferings />
      </MemoryRouter>
    );
    expect(screen.getByText('Walaa Offerings')).toBeInTheDocument();
    expect(screen.getByText('Insurance made easy just for you')).toBeInTheDocument();
  });
});