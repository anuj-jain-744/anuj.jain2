import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeButton from '../ThemeButton';
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Arrowrightalt from "assets/QuoteAndBuy/Arrowrightalt.svg";

describe('ThemeButton', () => {
  test('renders button with given title', () => {
    render(<ThemeButton isDisabled={false} title="Click Me" classes="" />);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  test('button is disabled when isDisabled is true', () => {
    render(<ThemeButton isDisabled={true} title="Click Me" classes="" />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  test('button has correct class names', () => {
    render(<ThemeButton isDisabled={false} title="Click Me" classes="custom-class" />);
    expect(screen.getByRole('button')).toHaveClass('custom-class register-call2action');
  });

  test('renders correct icon based on iconName', () => {
    render(<ThemeButton isDisabled={false} title="Click Me" classes="" icon={true} iconName="ChevronLeftIcon" />);
    expect(screen.getByTestId('ChevronLeftIcon')).toBeInTheDocument();
  });

  test('calls onClickhandler when button is clicked', () => {
    const handleClick = jest.fn();
    render(<ThemeButton isDisabled={false} title="Click Me" classes="" onClickhandler={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});