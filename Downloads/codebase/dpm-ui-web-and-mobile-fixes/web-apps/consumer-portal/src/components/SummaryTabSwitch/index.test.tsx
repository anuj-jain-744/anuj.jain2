import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import SummaryTabSwitch from './index';

describe('SummaryTabSwitch', () => {
  const mockHandleCanvas = jest.fn();

  const defaultProps = {
    handleCanvas: mockHandleCanvas,
    label: 'Test Label',
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders the component with the correct label', () => {
    render(<SummaryTabSwitch {...defaultProps} />);

    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('shows and hides the preview correctly', () => {
    render(<SummaryTabSwitch {...defaultProps} />);

    expect(screen.getByText('Test Label')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText('Test Label')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1500);
    });
    expect(screen.queryByText('Test Label')).not.toBeInTheDocument();
  });

  it('calls handleCanvas with true when the component is clicked', () => {
    render(<SummaryTabSwitch {...defaultProps} />);

    const summaryTab = screen.getByRole('img', { name: /panel-svg/i }).parentElement;
    fireEvent.click(summaryTab);

    expect(mockHandleCanvas).toHaveBeenCalledWith(true);
  });
});