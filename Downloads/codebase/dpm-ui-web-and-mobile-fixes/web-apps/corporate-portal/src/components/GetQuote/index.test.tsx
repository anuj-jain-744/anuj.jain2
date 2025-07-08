// __tests__/GetQuote.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GetQuote, getFormattedIconName } from './index';

// Mock GetForm
jest.mock('./GetForm', () => ({ show, setShow, buttonText }: any) => (
  <div data-testid="get-form">{show ? `Form Opened: ${buttonText}` : 'Form Closed'}</div>
));

jest.mock("../../constant", () => ({
  productIcon: {
    icon1: 'mockIcon1',
    icon2: 'mockIcon2',
    propCasualty: 'propCasualty',
    prodIconPropCasualty: 'prodIconPropCasualty',
    propInsur: 'propInsur',
    prodIconacciLiability: 'prodIconacciLiability',
    acciLiability: 'acciLiability',
    marinInsu: 'marinInsu',
    prodIconMarAviation: 'prodIconMarAviation',
    aviInsu: 'aviInsu',
    prodIconAviInsu: 'prodIconAviInsu',
    protSaving: 'protSaving',
    prodIconProtSaving: 'prodIconProtSaving',
    specInsur: 'specInsur',
    prodIconSpecInsur: 'prodIconSpecInsur',
    engInsur: 'engInsur',
    prodIconEngInsur: 'prodIconEngInsur',
  }
}));

// Mock dynamic import
jest.mock('../../../src/assets/Header/activeIcons/activeTestIcon.svg', () => ({
  default: 'test-icon-path.svg',
}));

jest.mock('../../../src/assets/Header/activeIcons/activeSomeIconIcon.svg', () => ({
  default: 'some-icon.svg',
}));

// Mock console.error to suppress expected dynamic import error logs in test
console.error = jest.fn();

describe('GetQuote component', () => {
  const mockProps = {
    carIcon: 'car.svg',
    arrowIcon: 'arrow.svg',
    verifiedIcon: 'verified.svg',
    introText: 'Get your quote now!',
    disclaimerText: 'Terms and conditions apply.',
    buttonLabel: 'Request a Quote',
    products: 'product-name',
    configdata: 'test', // Will trigger dynamic import
    fieldsData: [
      {
        field_name: 'full_name',
        field_title: 'Full Name',
        field_type: 'textfield',
        field_required: true,
        field_placeholder: 'Enter name',
        field_validation: { required: { message: 'Required' } },
      },
    ],
    successMessage: 'Thank you for submitting!',
  };

  it('renders all content and opens form on click', async () => {
    render(<GetQuote {...mockProps} />);

    expect(screen.getByText('Get your quote now!')).toBeInTheDocument();
    expect(screen.getByText('Request a Quote')).toBeInTheDocument();
    expect(screen.getByText('Terms and conditions apply.')).toBeInTheDocument();

    // Image should eventually appear after dynamic import
    await waitFor(() => {
      expect(screen.getByAltText('test icon')).toHaveAttribute('src', '[object Object]');
    });

    // Check form is initially closed
    expect(screen.getByTestId('get-form')).toHaveTextContent('Form Closed');

    // Click to open form
    fireEvent.click(screen.getByText('Request a Quote'));

    await waitFor(() => {
      expect(screen.getByTestId('get-form')).toHaveTextContent('Form Opened: Request a Quote');
    });
  });

  it('opens form on Enter key press', async () => {
    render(<GetQuote {...mockProps} />);

    const quoteButton = screen.getByRole('button');
    fireEvent.keyDown(quoteButton, { key: 'Enter' });

    await waitFor(() => {
      expect(screen.getByTestId('get-form')).toHaveTextContent('Form Opened: Request a Quote');
    });
  });
});

describe('getFormattedIconName utility', () => {
  const { productIcon } = require('../../constant');
  it('returns correct formatted icon name for known products', () => {
    const iconMap = {
      [productIcon.propCasualty]: productIcon.prodIconPropCasualty,
      [productIcon.propInsur]: productIcon.prodIconPropCasualty,
      [productIcon.acciLiability]: productIcon.prodIconacciLiability,
      [productIcon.marinInsu]: productIcon.prodIconMarAviation,
      [productIcon.aviInsu]: productIcon.prodIconAviInsu,
      [productIcon.protSaving]: productIcon.prodIconProtSaving,
      [productIcon.specInsur]: productIcon.prodIconSpecInsur,
      [productIcon.engInsur]: productIcon.prodIconEngInsur,
    };

    Object.entries(iconMap).forEach(([input, expected]) => {
      expect(getFormattedIconName(input)).toBe(expected);
    });
  });

  it('returns original product name if not matched', () => {
    expect(getFormattedIconName('UnknownProduct')).toBe('UnknownProduct');
  });
});
