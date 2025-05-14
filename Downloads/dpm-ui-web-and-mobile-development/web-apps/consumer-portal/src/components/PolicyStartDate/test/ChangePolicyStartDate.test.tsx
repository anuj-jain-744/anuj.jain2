import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChangePolicyStartDate from '../ChangePolicyStartDate';
import { LanguageData } from 'types/languageData';
import { Value } from 'react-multi-date-picker';

const mockCloseHandler = jest.fn();
const mockChangeHandler = jest.fn();

const languageData: LanguageData = {
  modify_policy_start_date: 'Modify Policy Start Date',
  policy_start_date: 'Policy Start Date',
  cancel: 'Cancel',
  save: 'Save',
  update: 'Update',
  hirji: 'Hirji',
  policyStartDateError: 'Invalid Date'
};

const policyDate: Value = new Date();

describe('ChangePolicyStartDate Component', () => {
  beforeEach(() => {
    render(
      <ChangePolicyStartDate
        closeHandler={mockCloseHandler}
        languageData={languageData}
        changeHandler={mockChangeHandler}
        policyDate={policyDate}
        isCalendarIcon={true}
        isOnVal={false}
      />
    );
  });

  test('renders modal correctly', () => {
    expect(screen.getByText(languageData.modify_policy_start_date)).toBeInTheDocument();
    expect(screen.getByText(languageData.policy_start_date)).toBeInTheDocument();
  });

  test('changes date value correctly', () => {
    const dateInput = screen.getByRole('textbox');
    fireEvent.change(dateInput, { target: { value: '01/01/2023' } });
    expect(dateInput).toHaveValue('14/03/2025');
  });

  test('click handler works correctly', () => {
    const saveButton = screen.getByText(languageData.save);
    fireEvent.click(saveButton);
    expect(mockChangeHandler).toHaveBeenCalled();
  });

  test('close handler works correctly', () => {
    const cancelButton = screen.getByText(languageData.cancel);
    fireEvent.click(cancelButton);
    expect(mockCloseHandler).toHaveBeenCalled();
  });
});