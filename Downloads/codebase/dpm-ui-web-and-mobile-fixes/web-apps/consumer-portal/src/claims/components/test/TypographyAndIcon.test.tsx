import React from 'react';
import { render, waitFor } from '@testing-library/react';
import TypographyAndIcon from '../TypographyAndIcon';

describe('TypographyAndIcon Component', () => {
  test('renders text correctly', () => {
    const { getByText } = render(<TypographyAndIcon text="Hello World" />);
    expect(getByText('Hello World')).toBeInTheDocument();
  });

  test('renders required asterisk when required is true', () => {
    const { getByText } = render(<TypographyAndIcon text="Hello World" required />);
    expect(getByText('*')).toBeInTheDocument();
    expect(getByText('*')).toHaveStyle('color: red');
  });

  test('renders icon when isIcon is true', () => {
    const { container } = render(<TypographyAndIcon text="Hello World" isIcon />);
    expect(container.querySelector('span')).toBeInTheDocument();
  });

  test('renders ThemePopover when tooltip is true', () => {
    const { container } = render(
      <TypographyAndIcon
        text="Hello World"
        isIcon
        tooltip
        iconclasses="icon-class"
        tooltipdataheader="Tooltip Header"
        tooltipclasses="tooltip-class"
      />
    );
    waitFor(() => {
        expect(container.querySelector('span')).toBeInTheDocument();
        expect(container.querySelector('.icon-class')).toBeInTheDocument();
        expect(container.querySelector('.tooltip-class')).toBeInTheDocument();
     });
  });

  test('does not render ThemePopover when tooltip is false', () => {
    const { container } = render(<TypographyAndIcon text="Hello World" isIcon tooltip={false} />);
    waitFor(() => {
        expect(container.querySelector('span')).toBeInTheDocument();
        expect(container.querySelector('.icon-class')).not.toBeInTheDocument();
     });
   
  });
});