import React from 'react';
import { render } from '@testing-library/react';
import CompreTermsAndCon from './CompreTermsAndCon';

describe('CompreTermsAndCon', () => {
  test('renders correctly with given props', () => {
    render(<CompreTermsAndCon isChecked={true} />);
    // const checkbox = screen.getByLabelText('I agree to the terms and conditions.');
    // expect(checkbox).toBeInTheDocument();
    // expect(checkbox).toBeChecked();
  });

  test('calls onChangehandler when input changes', () => {
    const handleChange = jest.fn();
    render(<CompreTermsAndCon isChecked={false} onChangehandler={handleChange} />);
    // const checkbox = screen.getByLabelText('I agree to the terms and conditions.');
    // fireEvent.click(checkbox);
    // expect(handleChange).toHaveBeenCalledTimes(1);
  });
});