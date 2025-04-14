import React from 'react';
import { render, screen } from '@testing-library/react';
import Title from './Title';

describe('Title Component', () => {
  test('renders the title and description', () => {
    const title = 'Test Title';
    const description = 'Test Description';

    render(<Title title={title} description={description} />);

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
  });
});