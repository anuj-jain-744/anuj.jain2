import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useSelector } from 'react-redux';
import Card from './Card';
import { MemoryRouter, useNavigate } from 'react-router-dom';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const mockLanguageData = {
  walaa_offering: [
    { icon_class: 'motor', title: 'Motor Insurance', description: 'Description for Motor', flag: null, url: '' },
    { icon_class: 'home', title: 'Home Insurance', description: 'Description for Home', flag: null, url: '' },
    { icon_class: 'travel', title: 'Travel Insurance', description: 'Description for Travel', flag: null, url: '' },
    { icon_class: 'medical', title: 'Medical Insurance', description: 'Description for Medical', flag: null, url: '' },
    { icon_class: 'domestic', title: 'Domestic Workers Insurance', description: 'Description for Domestic Workers', flag: null, url: '' },
    { icon_class: 'visitor', title: 'Visitor Visa Insurance', description: 'Description for Visitor Visa', flag: null, url: '' },
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
    render(
      <MemoryRouter>
        <Card />
      </MemoryRouter>
    );
    expect(screen.getByText('Motor Insurance')).toBeInTheDocument();
    expect(screen.getByText('Home Insurance')).toBeInTheDocument();
    expect(screen.getByText('Travel Insurance')).toBeInTheDocument();
    expect(screen.queryByText('Medical Insurance')).not.toBeInTheDocument();
    expect(screen.queryByText('Visitor Visa Insurance')).not.toBeInTheDocument();
  });

  test('renders "Discover More" button when there are more than 4 offerings', () => {
    render(
      <MemoryRouter>
        <Card />
      </MemoryRouter>
    );
    expect(screen.getByText('Discover More')).toBeInTheDocument();
  });

  test('shows more offerings when "Discover More" button is clicked', () => {
    render(
      <MemoryRouter>
        <Card />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('Discover More'));
    expect(screen.getByText('Medical Insurance')).toBeInTheDocument();
    expect(screen.getByText('Domestic Workers Insurance')).toBeInTheDocument();
    expect(screen.getByText('Visitor Visa Insurance')).toBeInTheDocument();
  });

  test('navigate to product landing page', async () => {
    const mockedNavigate = jest.fn();
    useNavigate.mockReturnValue(mockedNavigate);

    render(<Card />);

    const button = screen.getByText('Motor Insurance');
    fireEvent.click(button);

    expect(mockedNavigate).toHaveBeenCalledWith('/personal/product/motor', {"state": {"isProducts": true}});
  });
});