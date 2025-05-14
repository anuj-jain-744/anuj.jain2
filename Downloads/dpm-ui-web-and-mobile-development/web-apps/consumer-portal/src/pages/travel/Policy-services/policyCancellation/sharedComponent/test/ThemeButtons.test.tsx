import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeButton from '../ThemeButton';
import { Button } from 'react-bootstrap';

describe('ThemeButton Component', () => {
  test('renders button with given title', () => {
    render(<ThemeButton title="Click Me" classes="" />);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  test('button is disabled when isDisabled is true', () => {
    render(<ThemeButton title="Click Me" classes="" isDisabled={true} />);
    expect(screen.getByText('Click Me')).toBeDisabled();
  });

  test('button has correct class names', () => {
    render(<ThemeButton title="Click Me" classes="custom-class" />);
    expect(screen.getByText('Click Me')).toHaveClass('custom-class register-call2action');
  });

  test('renders left icon when iconLeft is true', () => {
    render(<ThemeButton title="Click Me" classes="" iconLeft={true} iconName="ChevronLeftIcon" />);
    expect(screen.getByTestId('ChevronLeftIcon')).toBeInTheDocument();
  });

  test('renders right icon when iconRight is true', () => {
    render(<ThemeButton title="Click Me" classes="" iconRight={true} iconName="ChevronRightIcon" />);
    expect(screen.getByTestId('ChevronRightIcon')).toBeInTheDocument();
  });

  test('calls onClickhandler when button is clicked', () => {
    const handleClick = jest.fn();
    render(<ThemeButton title="Click Me" classes="" onClickhandler={handleClick} />);
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});