import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Estimation from './Estimation';
import { DataContext } from '../../../DataContext';

describe('Estimation Component', () => {
  const mockData = {
    estimated_amount: 'Estimated Amount',
    walaa_liability: 'Walaa Liability',
    is_walaa_liability_correct: 'Is Walaa Liability Correct?',
    yes: 'Yes',
    no: 'No',
  };

  const mockValidationData = {
    estimatedAmount: 'SAR 10000',
    liability: '75%',
  };

  const mockChangeHandler = jest.fn();

  const renderComponent = () => {
    return render(
      <DataContext.Provider value={mockData}>
        <Estimation changeHandler={mockChangeHandler} validationData={mockValidationData} />
      </DataContext.Provider>
    );
  };

  it('renders estimation details correctly', () => {
    renderComponent();
    expect(screen.getByText('Estimated Amount')).toBeInTheDocument();
    expect(screen.getByText('SAR 10000')).toBeInTheDocument();
    expect(screen.getByText('Walaa Liability')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('Is Walaa Liability Correct?')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('handles toggle button selection', () => {
    renderComponent();
    const yesButton = screen.getByText('Yes');
    const noButton = screen.getByText('No');

    fireEvent.click(noButton);
    expect(noButton).toHaveClass('selected selected-2');
    expect(yesButton).toHaveClass('not-selected');

    fireEvent.click(yesButton);
    expect(yesButton).toHaveClass('selected');
    expect(noButton).toHaveClass('not-selected');
  });

  it('calls changeHandler on change', () => {
    renderComponent();
    fireEvent.change(screen.getByText('Estimated Amount'));
    expect(mockChangeHandler).toHaveBeenCalled();
  });
});