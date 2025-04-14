import React from 'react';
import { render, screen } from '@testing-library/react';
import PolicyHolders from './PolicyHolder';
import { LanguageData } from 'types/languageData';
import { HolderDetails } from 'types/policyDetails';

jest.mock('components/ThemeButton/ThemeButton', () => {
  return function MockThemeButton({ title }: any) {
    return <button>{title}</button>;
  };
});

describe('PolicyHolders', () => {
  const mockLanguageData: LanguageData = {
    policy_holder_details: 'Policy Holder Details',
    addresses: 'Addresses',
    view_profile: 'View Profile',
  };

  const mockHolderDetails: HolderDetails = {
    'Customer Name': 'Rabindra',
    'ID Number': '123456789',
    'Gender': 'Male',
    'Age': 30,
    'License Type': 'Private',
  };

  const mockAddress = '123 Example St, City, Country';

  it('renders driver details correctly', () => {
    render(
      <PolicyHolders 
        languageData={mockLanguageData} 
        holderDetails={mockHolderDetails} 
        address={mockAddress} 
      />
    );

    expect(screen.getByText(/Policy Holder Details/i)).toBeInTheDocument();
    
    expect(screen.getByText(/Customer Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Rabindra/i)).toBeInTheDocument();
    
    expect(screen.getByText(/ID Number/i)).toBeInTheDocument();
    expect(screen.getByText(/123456789/i)).toBeInTheDocument();
    
    expect(screen.getByText(/Gender/i)).toBeInTheDocument();
    expect(screen.getByText(/Male/i)).toBeInTheDocument();
    
    expect(screen.getByText(/Age/i)).toBeInTheDocument();
    expect(screen.getByText(/30/i)).toBeInTheDocument();
    
    expect(screen.getByText(/License Type/i)).toBeInTheDocument();
    expect(screen.getByText(/Private/i)).toBeInTheDocument();

    expect(screen.getByText(/Addresses/i)).toBeInTheDocument();
    expect(screen.getByText(mockAddress)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /View Profile/i })).toBeInTheDocument();
  });
});