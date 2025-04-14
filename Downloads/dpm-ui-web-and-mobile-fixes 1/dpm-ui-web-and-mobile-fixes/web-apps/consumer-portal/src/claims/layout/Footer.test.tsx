// Footer.test.tsx
import { render } from '@testing-library/react';
import Footer from './Footer';

describe('Footer Component', () => {
  it('renders the footer text', () => {
    // Render the Footer component
    const { getByText } = render(<Footer />);

    // Assert that the Footer component renders the expected text
    const footerElement = getByText(/Footer/i);
    expect(footerElement).toBeInTheDocument();
  });
});
