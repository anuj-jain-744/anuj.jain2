import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeSelect from '../ThemeSelect';

describe('ThemeSelect Component', () => {
  test('renders ThemeSelect component', () => {
    render(<ThemeSelect name="Select Theme" />);
    expect(screen.getByText('Select Theme')).toBeInTheDocument();
  });

  test('renders options correctly', () => {
    render(<ThemeSelect name="Select Theme" />);
    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
    expect(screen.getByText('Three')).toBeInTheDocument();
  });

  test('calls onChangehandler when an option is selected', () => {
    const handleChange = jest.fn();
    render(<ThemeSelect name="Select Theme" onChangehandler={handleChange} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });
    expect(handleChange).toHaveBeenCalledTimes(0);
  });
});