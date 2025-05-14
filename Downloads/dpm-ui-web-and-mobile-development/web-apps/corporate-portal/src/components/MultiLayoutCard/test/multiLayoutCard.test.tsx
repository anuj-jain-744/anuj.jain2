import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MultiLayoutCard } from '../index';
import { MultiLayoutCardProps } from '../types';

const mockNavigateTo = jest.fn();

const defaultProps: MultiLayoutCardProps = {
  label: 'Document 1',
  link: 'http://example.com/doc1',
  layout: 'list',
  navigateTo: mockNavigateTo,
};

describe('MultiLayoutCard', () => {
  it('renders the card label correctly', () => {
    render(<MultiLayoutCard {...defaultProps} />);
    expect(screen.getByText('Document 1')).toBeInTheDocument();
  });

  it('calls navigateTo when the card is clicked', () => {
    render(<MultiLayoutCard {...defaultProps} />);
    fireEvent.click(screen.getByText('Document 1'));
    expect(mockNavigateTo).toHaveBeenCalledWith('http://example.com/doc1');
  });

  it('renders the correct layout class', () => {
    render(<MultiLayoutCard {...defaultProps} />);
    expect(screen.getByText('Document 1').closest('div')).toHaveClass('card-content');
  });
});