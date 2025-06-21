import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import CardDetailsFrame from './CardDetailsFrame';

describe('CardDetailsFrame Component', () => {
  it('renders frame values and calls onChange when typing in the textbox', () => {
    const mockOnChange = jest.fn();
    const frameValues = [
      {
        label: 'Test Label',
        type: 'textbox' as const,
        value: '',
        onChange: mockOnChange,
      },
    ];

    const { getByRole } = render(<CardDetailsFrame frameValues={frameValues} />);

    const textbox = getByRole('textbox');
    fireEvent.change(textbox, { target: { value: '0' } });

    expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
      target: expect.objectContaining({
        value: '0',
      }),
    }));
  });

  it('renders dropdown and calls onChange when selecting an option', async() => {
    const mockOnChange = jest.fn();
    const frameValues = [
      {
        label: 'Test Dropdown',
        type: 'dropdown' as const,
        value: ['Option 1', 'Option 2'],
        selectedValue: 'Option 1',
        onChange: mockOnChange,
      },
    ];

    const { getByRole } = render(<CardDetailsFrame frameValues={frameValues} />);

    const dropdown = getByRole('combobox');
    fireEvent.change(dropdown, { target: { value: 'Option 2' } });

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled();
    //  expect(mockOnChange.mock.calls[0][0].target.value).toBe('Option 1');
    });
  });
});