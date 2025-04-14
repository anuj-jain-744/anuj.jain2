import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RadioCard from './index'; 
import { SelectPlanTypeKeys, IDetails } from 'types/coverageplan';
import { TravelData } from 'types/languageData';

const mockOnChange = jest.fn();

const mockProps = {
  radiokey: 'someKey' as SelectPlanTypeKeys,
  cardlistitems: [
    { id: 1, itemname: 'Item 1' },
    { id: 2, itemname: 'Item 2' },
    { id: 3, itemname: 'Item 3' },
  ] as IDetails[],
  label: 'Test Label',
  checked: true,
  onChange: mockOnChange,
  coveragePlanSelected: 'someKey' as SelectPlanTypeKeys,
  popup: true,
  TravelData: {} as TravelData,
};

describe('RadioCard Component', () => {
  test('renders RadioCard component', () => {
    render(<RadioCard {...mockProps} />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  test('applies correct classes based on checked and coveragePlanSelected props', () => {
    const { container } = render(<RadioCard {...mockProps} />);
    expect(container.firstChild).toHaveClass('card-checked');
  });

  test('renders ThemeRadioCheckbox with correct props', () => {
    render(<RadioCard {...mockProps} />);
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Test Label'), { target: { checked: true } });
    expect(mockOnChange).toHaveBeenCalled();
  });

  test('conditionally renders ViewDetails based on popup prop', () => {
    render(<RadioCard {...mockProps} />);
    expect(screen.getByText('View Details')).toBeInTheDocument();
  });

  test('renders RadioCardFooter with correct props', () => {
    render(<RadioCard {...mockProps} />);
    expect(screen.getByText('someKey')).toBeInTheDocument();
  });
});