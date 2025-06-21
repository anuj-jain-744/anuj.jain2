import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SelectYourPolicy from './SelectYourPolicy';
import { LanguageData } from 'types/languageData';

jest.mock('./PolicyNotification', () => () => <div>PolicyNotification</div>);

describe('SelectYourPolicy Component', () => {
  const mockOnSelect = jest.fn();
  const mockLanguageData: LanguageData = {
    policy_placeholder: 'Policy #',
    active: 'Active',
    nissan_magnite_xe: 'Nissan Magnite XE',
    sum_insured: 'Sum Insured',
    coverage_plan: 'Coverage Plan',
    comprehensive: 'Comprehensive',
    premium_amount: 'Premium Amount',
  };

  const defaultProps = {
    policyNumber: '123456',
    isSelected: false,
    isNotificationEnable: false,
    onSelect: mockOnSelect,
    languageData: mockLanguageData,
  };

  it('should render the component with correct data', () => {
    render(<SelectYourPolicy {...defaultProps} />);
    
    expect(screen.getByText('Policy NO.')).toBeInTheDocument();
    expect(screen.getByText('123456')).toBeInTheDocument();
    expect(screen.getByText('Nissan Magnite XE')).toBeInTheDocument();
    expect(screen.getByText('7403 - RUA')).toBeInTheDocument();
    expect(screen.getByText('Sum Insured')).toBeInTheDocument();
    expect(screen.getByText('SAR 40,000.00')).toBeInTheDocument();
    expect(screen.getByText('Coverage Plan')).toBeInTheDocument();
    expect(screen.getByText('Comprehensive')).toBeInTheDocument();
    expect(screen.getByText('Premium Amount')).toBeInTheDocument();
    expect(screen.getByText('SAR 1,500')).toBeInTheDocument();
  });

  // it('should call onSelect with correct policy number when clicked', () => {
  //   render(<SelectYourPolicy {...defaultProps} />);
    
  //   fireEvent.click(screen.getByRole('button'));
  //   expect(mockOnSelect).toHaveBeenCalledWith('123456');
  // });

  it('should render PolicyNotification when isNotificationEnable is true', () => {
    render(<SelectYourPolicy {...defaultProps} isNotificationEnable={true} />);
    
    expect(screen.getByText('PolicyNotification')).toBeInTheDocument();
  });

  it('should apply correct styles based on isSelected prop', () => {
    const { rerender } = render(<SelectYourPolicy {...defaultProps} isSelected={false} />);
    
    expect(screen.getByRole('button')).toHaveClass('policyDeactive');
    
    rerender(<SelectYourPolicy {...defaultProps} isSelected={true} />);
    
    expect(screen.getByRole('button')).toHaveClass('policyActive');
  });
});