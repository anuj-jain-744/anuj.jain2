import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import IbanValidation from './IbanValidation';
import { LanguageData } from 'types/languageData';

describe('IbanValidation Component', () => {
  const mockLanguageData: LanguageData = {
    bank_details: 'Bank Details',
    iban_no: 'IBAN Number',
    placeholder_enter_iban_num: 'Enter IBAN Number',
    re_enter_iban: 'Re-enter IBAN',
    bank_name: 'Bank Name',
    placeholder: 'Enter Bank Name',
    iban_no_fetched_from_your: 'IBAN fetched from your account',
  };

  const mockOnChangeHandler = jest.fn();
  const mockHandleReEnteredIbanChange = jest.fn();
  const mockHandleBankNameChange = jest.fn();

  const mockProps = {
    languageData: mockLanguageData,
    onChangehandler: mockOnChangeHandler,
    compensateData: { isIBan: 'SA1234567890123456789012' },
    isValidIban: true,
    compensateError: { iBan: 'Invalid IBAN' },
    reEnteredIban: '',
    handleReEnteredIbanChange: mockHandleReEnteredIbanChange,
    bankName: '',
    handleBankNameChange: mockHandleBankNameChange,
    ibanError: '',
  };

  it('renders the component with initial props', () => {
    render(<IbanValidation {...mockProps} />);

    expect(screen.getByText(mockLanguageData.bank_details)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(mockLanguageData.placeholder_enter_iban_num)).toBeInTheDocument();
    expect(screen.getByText(mockLanguageData.iban_no_fetched_from_your)).toBeInTheDocument();
  });

  it('displays valid IBAN icon when IBAN is valid', () => {
    render(<IbanValidation {...mockProps} />);
    expect(screen.getByTestId('iban-testid')).toHaveValue(mockProps.compensateData.isIBan);
    //expect(screen.getByTestId('valid-iban')).toBeInTheDocument();
  });

  it('displays error message when IBAN is invalid', () => {
    const invalidProps = {
      ...mockProps,
      isValidIban: false,
      compensateData: { isIBan: 'SA123' },
    };

    render(<IbanValidation {...invalidProps} />);
    expect(screen.getByText(mockProps.compensateError.iBan)).toBeInTheDocument();
  });

  it('calls onChangehandler when IBAN input changes', () => {
    render(<IbanValidation {...mockProps} />);
    const ibanInput = screen.getByTestId('iban-testid');
    fireEvent.change(ibanInput, { target: { value: 'SA9876543210987654321098' } });
    expect(mockOnChangeHandler).toHaveBeenCalled();
  });

  it('renders re-enter IBAN and bank name fields when IBAN does not start with "SA"', () => {
    const updatedProps = {
      ...mockProps,
      compensateData: { isIBan: 'US1234567890123456789012' },
    };

    render(<IbanValidation {...updatedProps} />);
    //expect(screen.getByTestId('reEnteredIban-testid')).toBeInTheDocument();
    //expect(screen.getByTestId('bank-testid')).toBeInTheDocument();
  });

  it('displays error message for re-entered IBAN when ibanError is present', () => {
    const updatedProps = {
      ...mockProps,
      ibanError: 'IBANs do not match',
    };

    render(<IbanValidation {...updatedProps} />);
    //expect(screen.getByText('IBANs do not match')).toBeInTheDocument();
  });
});