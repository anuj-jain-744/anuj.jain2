import React from 'react';
import { render, screen } from '@testing-library/react';
import PolicyNotification from './PolicyNotification';
import { LanguageData } from 'types/languageData';

describe('PolicyNotification Component', () => {
  const mockLanguageData: LanguageData = {
    policy_expiring_on: 'Policy expiring on',
  };

  it('should render the component with correct data', () => {
    render(<PolicyNotification languageData={mockLanguageData} />);
    
    expect(screen.getByText('Policy expiring on 31/10/2024')).toBeInTheDocument();
  });

});