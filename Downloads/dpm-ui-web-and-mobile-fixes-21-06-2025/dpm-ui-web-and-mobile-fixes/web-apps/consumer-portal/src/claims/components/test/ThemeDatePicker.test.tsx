import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ThemeDatePicker from '../ThemeDatePicker';

describe('ThemeDatePicker Component', () => {
  test('renders with default props', () => {
    render(<ThemeDatePicker name="test" placeholder="Select date" />);
    waitFor(() => {  
        expect(screen.getByPlaceholderText('Select date')).toBeInTheDocument();
    });
    
  });

  test('renders with Hijri calendar type', () => {
    render(<ThemeDatePicker name="test" placeholder="Select date" calendarType="Hijri" />);
    waitFor(() => { 
        expect(screen.getByPlaceholderText('Select date')).toBeInTheDocument();
    });
  });

  test('displays error message', () => {
    render(<ThemeDatePicker name="test" placeholder="Select date" errorValue="Error message" />);
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });
});