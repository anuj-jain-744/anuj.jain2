import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LayoutTab } from './index';

const mockHandleLayout = jest.fn();

const defaultProps = {
  activeLayout: 'list',
  handleLayout: mockHandleLayout,
};

describe('LayoutTab', () => {
  it('renders the layout icons correctly', () => {
    render(<LayoutTab {...defaultProps} />);
    expect(screen.getByAltText('list icon')).toBeInTheDocument();
    expect(screen.getByAltText('grid icon')).toBeInTheDocument();
  });

  it('sets the active layout correctly', () => {
    render(<LayoutTab {...defaultProps} />);
    expect(screen.getByAltText('list icon').closest('div')).toHaveClass('active-layout');
    expect(screen.getByAltText('grid icon').closest('div')).not.toHaveClass('active-layout');
  });

  it('calls handleLayout when a layout is clicked', () => {
    render(<LayoutTab {...defaultProps} />);
    fireEvent.click(screen.getByAltText('grid icon'));
    expect(mockHandleLayout).toHaveBeenCalledWith('grid');
  });

  it('changes the active layout when a layout is clicked', () => {
    render(<LayoutTab {...defaultProps} />);
    fireEvent.click(screen.getByAltText('grid icon'));
    expect(screen.getByAltText('grid icon').closest('div')).toHaveClass('active-layout');
    expect(screen.getByAltText('list icon').closest('div')).not.toHaveClass('active-layout');
  });
});