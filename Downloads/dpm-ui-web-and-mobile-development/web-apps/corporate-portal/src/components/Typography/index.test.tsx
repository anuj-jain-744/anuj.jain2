import TypographyComponent from ".";
import { render, screen } from "@testing-library/react";

describe('TypographyComponent', () => {
    test('renders with default props', () => {
      render(<TypographyComponent content="Default content" />);
      const element = screen.getByText('Default content');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('typo-body1');
      expect(element).toHaveClass('typo-primary');
    });
  
    test('renders with specific variant', () => {
      render(<TypographyComponent variant="h1" content="Header content" />);
      const element = screen.getByText('Header content');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('typo-h1');
    });
  
    test('renders with specific color', () => {
      render(<TypographyComponent content="Colored content" color="secondary" />);
      const element = screen.getByText('Colored content');
      expect(element).toBeInTheDocument();
      expect(element).not.toHaveClass('typo-primary');
    });
  
    test('renders with custom content', () => {
      render(<TypographyComponent content="Custom content" />);
      const element = screen.getByText('Custom content');
      expect(element).toBeInTheDocument();
    });
  });