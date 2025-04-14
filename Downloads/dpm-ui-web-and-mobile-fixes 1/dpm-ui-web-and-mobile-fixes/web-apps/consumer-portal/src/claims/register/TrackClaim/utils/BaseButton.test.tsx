import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BaseButton from './BaseButton';

describe('BaseButton', () => {
  it('renders the button with the correct title', () => {
    render(<BaseButton title="Click Me" variant="primary" />);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('applies the correct variant class', () => {
    render(<BaseButton title="Click Me" variant="outline" />);
    expect(screen.getByRole('button', { name: /click me/i })).toHaveClass('outlineBtn');
  });

  it('disables the button when isDisabled is true', () => {
    render(<BaseButton title="Click Me" variant="primary" isDisabled />);
    expect(screen.getByRole('button', { name: /click me/i })).toBeDisabled();
  });

  it('calls the onClickhandler when clicked', () => {
    const handleClick = jest.fn();
    render(<BaseButton title="Click Me" variant="primary" onClickhandler={handleClick} />);
    fireEvent.click(screen.getByRole('button', { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders the left icon when icon and iconName are provided', () => {
    render(<BaseButton title="Click Me" variant="primary" icon iconName="ChevronLeft" iconPosition="left" />);
    expect(screen.getByLabelText('Chevron Left')).toBeInTheDocument();
  });

  it('renders the right icon when icon and iconName are provided', () => {
    render(<BaseButton title="Click Me" variant="primary" icon iconName="RightArrow" iconPosition="right" />);
    expect(screen.getByAltText('Right Arrow')).toBeInTheDocument();
  });

  it('renders the correct icon based on iconName', () => {
    const { rerender } = render(<BaseButton title="Click Me" variant="primary" icon iconName="Download" />);
    expect(screen.getByAltText('Download Document')).toBeInTheDocument();

    rerender(<BaseButton title="Click Me" variant="primary" icon iconName="Plus" />);
    expect(screen.getByAltText('Add Document')).toBeInTheDocument();

    rerender(<BaseButton title="Click Me" variant="primary" icon iconName="History" />);
    expect(screen.getByAltText('View History')).toBeInTheDocument();
  });

  it('applies additional classes when provided', () => {
    render(<BaseButton title="Click Me" variant="primary" classes="extra-class" />);
    expect(screen.getByRole('button', { name: /click me/i })).toHaveClass('extra-class');
  });
});