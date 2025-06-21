import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeMasterSelect from '../ThemeMasterSelect';

describe('ThemeMasterSelect Component', () => {
  const mockOptions = [
    { codeID: '1', codeDesc: 'Option 1' },
    { codeID: '2', codeDesc: 'Option 2' },
  ];
  const mockOnChangeHandler = jest.fn();

  test('renders without crashing', () => {
    render(
      <ThemeMasterSelect
        options={mockOptions}
        placeholder="Select an option"
        value=""
        onChangehandler={mockOnChangeHandler}
        isRequired={true}
        fieldName="themeSelect"
        classes="custom-class"
        label="Theme"
      />
    );
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  test('renders options correctly', () => {
    render(
      <ThemeMasterSelect
        options={mockOptions}
        placeholder="Select an option"
        value=""
        onChangehandler={mockOnChangeHandler}
        isRequired={true}
        fieldName="themeSelect"
        classes="custom-class"
        label="Theme"
      />
    );
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  test('calls onChangehandler when an option is selected', () => {
    render(
      <ThemeMasterSelect
        options={mockOptions}
        placeholder="Select an option"
        value=""
        onChangehandler={mockOnChangeHandler}
        isRequired={true}
        fieldName="themeSelect"
        classes="custom-class"
        label="Theme"
      />
    );
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });
    expect(mockOnChangeHandler).toHaveBeenCalled();
  });

  test('displays the correct value when an option is selected', () => {
    render(
      <ThemeMasterSelect
        options={mockOptions}
        placeholder="Select an option"
        value="1"
        onChangehandler={mockOnChangeHandler}
        isRequired={true}
        fieldName="themeSelect"
        classes="custom-class"
        label="Theme"
      />
    );
    expect(screen.getByRole('combobox')).toHaveClass('custom-class dark-input-border form-select');
  });

  test('applies the correct class names', () => {
    render(
      <ThemeMasterSelect
        options={mockOptions}
        placeholder="Select an option"
        value=""
        onChangehandler={mockOnChangeHandler}
        isRequired={true}
        fieldName="themeSelect"
        classes="custom-class"
        label="Theme"
      />
    );
    expect(screen.getByRole('combobox')).toHaveClass('custom-class dark-input-border');
  });
});