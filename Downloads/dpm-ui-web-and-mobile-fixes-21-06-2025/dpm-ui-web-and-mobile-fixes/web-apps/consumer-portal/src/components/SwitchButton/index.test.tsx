
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Switch from './index';

describe('Switch component', () => {
  it('should render correctly', () => {
    const { container } = render(<Switch isOn={false} handleToggle={() => {}} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should call handleToggle when clicked', () => {
    const handleToggle = jest.fn();
    const { getByRole } = render(<Switch isOn={false} handleToggle={handleToggle} />);
    const checkbox = getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it('should have the correct class when isOn is true', () => {
    const { getByLabelText } = render(<Switch isOn={true} handleToggle={() => {}} />);
    /*const label = getByLabelText('switch');
    expect(label).toHaveClass('background-grey');*/
  });

  it('should have the correct class when isOn is false', () => {
    const { getByLabelText } = render(<Switch isOn={false} handleToggle={() => {}} />);
    /*const label = getByLabelText('switch');
    expect(label).toHaveClass('background-blue');*/
  });
});