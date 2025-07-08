import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ThemePopover from '../ThemePopover';

describe('ThemePopover', () => {
  test('renders InfoOutlinedIcon and displays popover on hover', () => {
    render(
      <ThemePopover
        iconclasses="test-icon-class"
        placement="right"
        tooltipclasses="test-tooltip-class"
        tooltipdataheader="Test Header"
      />
    );

    // Check if InfoOutlinedIcon is rendered
    const iconElement = screen.getByTestId('InfoOutlinedIcon');
    expect(iconElement).toBeInTheDocument();

    // Simulate hover event
    fireEvent.mouseOver(iconElement);

    // Check if popover is displayed
    const popoverElement = screen.getByRole('tooltip');
    expect(popoverElement).toBeInTheDocument();

    // Check if ReferenceTooltip is displayed within the popover
    waitFor(() => { 
        const referenceTooltipElement = screen.getByText('ReferenceTooltip');
        expect(referenceTooltipElement).toBeInTheDocument();
    });
    
    
  });
});