import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useSelector } from 'react-redux';
import Card from './Card';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

const mockLanguageData = {
  walaa_offering: [
    { icon_class: 'motor', title: 'Motor Insurance', description: 'Description for Motor', flag: null, url: '' },
    { icon_class: 'home', title: 'Home Insurance', description: 'Description for Home', flag: null, url: '' },
    { icon_class: 'travel', title: 'Travel Insurance', description: 'Description for Travel', flag: null, url: '' },
    { icon_class: 'medical', title: 'Medical Insurance', description: 'Description for Medical', flag: null, url: '' },
    { icon_class: 'personal', title: 'Personal Insurance', description: 'Description for Personal', flag: null, url: '' },
  ],
  discover_more: 'Discover More',
};

describe('Card Component', () => {
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

  test('renders initial offerings', () => {
    render(<Card />);
    expect(screen.getByText('Motor Insurance')).toBeInTheDocument();
    expect(screen.getByText('Home Insurance')).toBeInTheDocument();
    expect(screen.getByText('Travel Insurance')).toBeInTheDocument();
    expect(screen.getByText('Medical Insurance')).toBeInTheDocument();
    expect(screen.queryByText('Personal Insurance')).not.toBeInTheDocument();
  });

  test('renders "Discover More" button when there are more than 4 offerings', () => {
    render(<Card />);
    expect(screen.getByText('Discover More')).toBeInTheDocument();
  });

  test('shows more offerings when "Discover More" button is clicked', () => {
    render(<Card />);
    fireEvent.click(screen.getByText('Discover More'));
    expect(screen.getByText('Personal Insurance')).toBeInTheDocument();
  });
});