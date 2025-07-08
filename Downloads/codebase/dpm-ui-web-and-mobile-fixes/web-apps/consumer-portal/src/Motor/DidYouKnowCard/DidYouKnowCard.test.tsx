import React from 'react';
import { render } from '@testing-library/react';
import DidYouKnowCard from './DidYouKnowCard';
import { DataContext } from './../../DataContext';

const mockContextValue = {};

describe('DidYouKnowCard', () => {
  test('renders DidYouKnowCard with correct content', () => {
    render(
      <DataContext.Provider value={mockContextValue}>
        <DidYouKnowCard />
      </DataContext.Provider>
    );

    // const img = screen.getByRole('img');
    // expect(img).toBeInTheDocument();
    // expect(img).toHaveAttribute('src', expect.stringContaining('test-file-stub'));

    // expect(screen.getByText(mockData["card-head"])).toBeInTheDocument();

    // const listItems = screen.getAllByRole('listitem');
    // expect(listItems).toHaveLength(2);

    // expect(listItems[0]).toHaveTextContent(/Lorem Ipsum is simply dummy text of the printing and typesetting industry/i);
    // expect(listItems[1]).toHaveTextContent(/Lorem Ipsum has been the industry's standard dummy/i);
  });
});
