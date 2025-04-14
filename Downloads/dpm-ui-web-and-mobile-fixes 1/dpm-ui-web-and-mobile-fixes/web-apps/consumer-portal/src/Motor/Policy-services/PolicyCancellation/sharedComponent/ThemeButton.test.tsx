import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeButton from './ThemeButton';
import '@testing-library/jest-dom';

// Mocking the icon components to avoid rendering unnecessary SVGs in the tests
jest.mock('@mui/icons-material/ChevronLeft', () => () => <div>ChevronLeftIcon</div>);
jest.mock('@mui/icons-material/ChevronRight', () => () => <div>ChevronRightIcon</div>);
jest.mock('@mui/icons-material/ArrowRightAlt', () => () => <div>ArrowRightIcon</div>);
jest.mock('@mui/icons-material/ReceiptLong', () => () => <div>ReceiptIcon</div>);
jest.mock('@mui/icons-material/Check', () => () => <div>CheckIcon</div>);

describe('ThemeButton', () => {
  // Test rendering the button with title only (no icons)
  it('renders button with title only', () => {
    render(<ThemeButton title="Click Me" classes="test-class" />);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Click Me');
    expect(button).not.toHaveClass('disabled');
  });

  // Test rendering the button with an icon on the left
  it('renders button with left icon', () => {
    render(
      <ThemeButton
        title="Click Me"
        classes="test-class"
        iconLeft={true}
        iconName="ChevronLeftIcon"
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Click Me');
    expect(screen.getByText('ChevronLeftIcon')).toBeInTheDocument();
  });

  // Test rendering the button with an icon on the right
  it('renders button with right icon', () => {
    render(
      <ThemeButton
        title="Click Me"
        classes="test-class"
        iconRight={true}
        iconName="ChevronRightIcon"
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Click Me');
    expect(screen.getByText('ChevronRightIcon')).toBeInTheDocument();
  });

  // Test rendering the button with both left and right icons
  it('renders button with both left and right icons', () => {
    render(
      <ThemeButton
        title="Click Me"
        classes="test-class"
        iconLeft={true}
        iconRight={true}
        iconName="ArrowRightIcon"
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Click Me');
    expect(screen.getByText('ArrowRightIcon')).toBeInTheDocument();
    expect(screen.getAllByText('ArrowRightIcon').length).toBe(2); // both sides should have the same icon
  });

  // Test the disabled state of the button
  it('renders button in disabled state', () => {
    render(
      <ThemeButton
        title="Click Me"
        classes="test-class"
        isDisabled={true}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled');
  });

  // Test if the onClick handler is called
  it('fires onClick handler when button is clicked', () => {
    const onClickhandler = jest.fn();
    render(
      <ThemeButton
        title="Click Me"
        classes="test-class"
        onClickhandler={onClickhandler}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(onClickhandler).toHaveBeenCalledTimes(1);
  });

  // Test if the button renders with the correct variant
  it('renders button with correct variant', () => {
    render(
      <ThemeButton
        title="Click Me"
        classes="test-class"
        variant="link"
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn-link');
  });

  // Test default variant is "primary" when not passed
  it('renders button with default variant "primary"', () => {
    render(<ThemeButton title="Click Me" classes="test-class" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn-primary');
  });
});
