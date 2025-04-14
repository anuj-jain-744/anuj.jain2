import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeButton from './ThemeButton';

describe('ThemeButton Component', () => {
  const mockClickHandler = jest.fn();

  it('should render the button with the correct title', () => {
    render(<ThemeButton title="Click Me" variant="outline" />);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('should render the button with the correct variant class', () => {
    render(<ThemeButton title="Click Me" variant="policyPrimary" />);
    expect(screen.getByText('Click Me')).toHaveClass('policy-primary-right');
  });

  it('should render the button as disabled when isDisabled is true', () => {
    render(<ThemeButton title="Click Me" variant="outline" isDisabled />);
    expect(screen.getByText('Click Me')).toBeDisabled();
  });

  it('should call the onClickhandler when the button is clicked', () => {
    render(<ThemeButton title="Click Me" variant="outline" onClickhandler={mockClickHandler} />);
    fireEvent.click(screen.getByText('Click Me'));
    expect(mockClickHandler).toHaveBeenCalledTimes(1);
  });

  it('should render the correct icon when icon and iconName are provided', () => {
    render(<ThemeButton title="Click Me" variant="outline" icon iconName="ChevronLeft" />);
    expect(screen.getByLabelText('Chevron Left')).toBeInTheDocument();
  });

});