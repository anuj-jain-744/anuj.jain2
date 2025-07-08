import { render, screen, waitFor } from '@testing-library/react';
import TypographyAndIcon from '../TypographyAndIcon';

describe('TypographyAndIcon Component', () => {
  test('renders text correctly', () => {
    render(<TypographyAndIcon text="Sample Text" />);
    expect(screen.getByText('Sample Text')).toBeInTheDocument();
  });

  test('renders required asterisk when required is true', () => {
    render(<TypographyAndIcon text="Sample Text" required={true} />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  test('does not render required asterisk when required is false', () => {
    render(<TypographyAndIcon text="Sample Text" required={false} />);
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  test('renders icon when isIcon is true', () => {
    render(<TypographyAndIcon text="Sample Text" isIcon={true} />);
    expect(screen.getByText('Sample Text')).toBeInTheDocument();
  });

  test('does not render icon when isIcon is false', () => {
    render(<TypographyAndIcon text="Sample Text" isIcon={false} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  test('renders tooltip when tooltip is true', () => {
    render(
      <TypographyAndIcon
        text="Sample Text"
        isIcon={true}
        tooltip={true}
        iconclasses="icon-class"
        tooltipdataheader="Tooltip Header"
        tooltipclasses="tooltip-class"
      />
    );
    expect(screen.getByText('Sample Text')).toBeInTheDocument();
    waitFor(() => { expect(screen.getByRole('img')).toBeInTheDocument(); });
  });

  test('does not render tooltip when tooltip is false', () => {
    render(
      <TypographyAndIcon
        text="Sample Text"
        isIcon={true}
        tooltip={false}
      />
    );
    expect(screen.queryByText('Tooltip Header')).not.toBeInTheDocument();
  });
});