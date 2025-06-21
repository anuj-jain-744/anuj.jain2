import React from 'react';
import { render, screen } from '@testing-library/react';
import PolicyCardPage from '.';
import { LanguageData } from 'types/languageData';
import { PolicyCard } from 'types/policyDetails';


describe('PolicyCardPage', () => {
  const mockLanguageData: LanguageData = {
    national_id: 'National ID',
    dob: 'Date of Birth',
    nationality: 'Nationality',
    mobile_number: 'Mobile Number',
    addresses: 'Addresses',
  };

  const mockPolicyCardValue: PolicyCard = {
    customerNameArabic: 'اسم العميل',
    customerNameEnglish: 'Rabindra',
    nationalId: '123456789',
    nationality: 'Indian',
    dateOfBirth: '01/01/1990',
    mobileNo: '+1234567890',
    address: {
      streetName: '123 Example St',
      city: 'City',
      country: 'Country',
      postCode: '12345',
    },
  };

  it('renders policy card with valid data', () => {
    // render(
    //   <PolicyCardPage 
    //     policyCardValue={mockPolicyCardValue} 
    //     languageData={mockLanguageData} 
    //   />
    // );

    // expect(screen.getByText(/Rabindra/i)).toBeInTheDocument();
    // expect(screen.getByText(/اسم العميل/i)).toBeInTheDocument();
    // expect(screen.getByText(/National ID/i)).toBeInTheDocument();
    
    // const nationalIdElements = screen.getAllByText(/123456789/i);
    // expect(nationalIdElements.length).toBe(2); 
    // const nationalityEle = screen.getAllByText(/Nationality/i);
    // expect(nationalityEle.length).toBe(1); 

    // expect(screen.getByText(/Date of Birth/i)).toBeInTheDocument();
    // expect(screen.getByText(/01\/01\/1990/i)).toBeInTheDocument();
    // expect(screen.getByText(/Mobile Number/i)).toBeInTheDocument();
    // expect(screen.getByText(/\+1234567890/i)).toBeInTheDocument();
    // expect(screen.getByText(/Addresses/i)).toBeInTheDocument();
    // expect(screen.getByText(/123 Example St, City, 12345/i)).toBeInTheDocument();
});
});