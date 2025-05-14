import React from 'react';
import { render, screen } from '@testing-library/react';
import { useSelector } from 'react-redux';
import WelcomeContainer from './WelcomeContainer';
import { RootState } from '@dpm/shared-module';
import { capitalizeNameFirstLetter } from '@dpm/shared-module';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('@dpm/shared-module', () => ({
  capitalizeNameFirstLetter: jest.fn((name) => name.charAt(0).toUpperCase() + name.slice(1)),
}));

const mockLanguageData = {
  welcome: 'Welcome',
  your_personalised_ashboard: 'Your personalised dashboard',
};

describe('WelcomeContainer Component', () => {
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

  test('renders the welcome text and subtext', () => {
    const name = 'john';

    render(<WelcomeContainer name={name} />);

    expect(screen.getByText('Welcome')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Your personalised dashboard')).toBeInTheDocument();
  });

  test('renders the Chatbot component', () => {
    render(<WelcomeContainer />);

    expect(screen.getByText('Your personalised dashboard')).toBeInTheDocument();
  });
});