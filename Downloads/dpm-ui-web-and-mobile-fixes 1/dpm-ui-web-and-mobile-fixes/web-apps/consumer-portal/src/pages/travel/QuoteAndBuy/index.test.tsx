import React from 'react';
import { render, screen } from '@testing-library/react';
import "@testing-library/dom";
import TravelInsurance from '.';
import { useLocation } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), 
  useLocation: jest.fn(),
}));

describe('QuoteAndBuy', () => { 
    test('renders the product name', () => { 
        render(<TravelInsurance />);
        const quoteBuy = screen.getByTestId("quote-buy");
        expect(quoteBuy).toBeInTheDocument();       
    });
});