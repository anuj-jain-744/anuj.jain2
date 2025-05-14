import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import DriverDetails from './DriverDetails';
import { LanguageData } from 'types/languageData';
import { HolderDetails } from 'types/policyDetails';
import { MemoryRouter, useLocation } from 'react-router-dom';

jest.mock('components/ThemeButton/ThemeButton', () => {
  return jest.fn(({ onClickhandler ,title}) => (
    <button data-testid="add-driver-id" onClick={onClickhandler}>{title}</button>
  ));
});
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: jest.fn()
}));
jest.mock("@dpm/shared-module", () => ({
  callAPI: jest.fn(),
  getFullUrl: jest.fn(),
   useApiCall: jest.fn(() => ({
    makeApiCall: jest.fn(),
    data: null,
    errors: null,
    isLoading: false
  }))
}));


describe('DriverDetails', () => {
  const mockLanguageData: LanguageData = {
    driver_details: 'Driver Details',
    addresses: 'Addresses',
    manage_drivers: 'Manage Driver',
  };

  const mockHolderDetails: HolderDetails = {
    'Customer Name': 'Rabindra',
    'ID Number': '123456789',
    'Gender': 'Male',
    'Age': 30,
    'License Type': 'Private',
  };

  const mockAddress = '123 Example St, City, Country';
  const mockNavigateTo = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    (useLocation as jest.Mock).mockReturnValue({ state: { some: "data" } });
  });

  it('renders driver details correctly', () => {
    render(
      <DriverDetails 
        languageData={mockLanguageData} 
        holderDetails={mockHolderDetails} 
        address={mockAddress} 
        navigateTo={mockNavigateTo}
      />
    );

    
    expect(screen.getByText(/Driver Details/i)).toBeInTheDocument();
    expect(screen.getByText(/Customer Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Rabindra/i)).toBeInTheDocument();
    
    expect(screen.getByText(/ID Number/i)).toBeInTheDocument();
    expect(screen.getByText(/123456789/i)).toBeInTheDocument();
    
    expect(screen.getByText(/Gender/i)).toBeInTheDocument();
    expect(screen.getByText(/Male/i)).toBeInTheDocument();
    
    expect(screen.getByText(/30/i)).toBeInTheDocument();
    
    expect(screen.getByText(/License Type/i)).toBeInTheDocument();
    expect(screen.getByText(/Private/i)).toBeInTheDocument();

    expect(screen.getByText(/Addresses/i)).toBeInTheDocument();
    expect(screen.getByText(mockAddress)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Manage Driver/i })).toBeInTheDocument();
  });
  it('click on handle driver', async() => {
    render(
      <MemoryRouter>
        <DriverDetails 
          languageData={mockLanguageData} 
          holderDetails={mockHolderDetails} 
          address={mockAddress} 
          navigateTo={mockNavigateTo}
        />
        </MemoryRouter>
    );
    const button=screen.getByTestId('add-driver-id')
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(mockNavigateTo).toHaveBeenCalledWith('/Motor/Claim/Endorsement',{some:'data'});
  });
});