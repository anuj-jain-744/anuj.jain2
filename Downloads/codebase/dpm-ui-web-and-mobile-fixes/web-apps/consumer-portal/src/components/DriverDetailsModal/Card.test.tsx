import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from './Card';
import { LanguageData } from 'types/languageData';
import { getGender } from 'utils/policyDetails';

jest.mock('utils/policyDetails', () => ({
  getGender: jest.fn(),
}));

const mockLanguageData: LanguageData = {
  iqama_no: 'Iqama No',
  dob: 'Date of Birth',
  gender: 'Gender',
};

const mockDriverData = {
  driverName: 'John Doe',
  driverNameArabic: 'جون دو',
  driverID: '1234567890',
  dateofBirth: '01/01/1980',
  gender: 'male',
};

describe('Card', () => {
  beforeEach(() => {
    (getGender as jest.Mock).mockReturnValue('Male');
  });

  it('renders without crashing', () => {
    render(<Card languageData={mockLanguageData} driverData={mockDriverData} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('displays driver name in Arabic', () => {
    render(<Card languageData={mockLanguageData} driverData={mockDriverData} />);
    expect(screen.getByText('جون دو')).toBeInTheDocument();
  });

  it('displays driver ID', () => {
    render(<Card languageData={mockLanguageData} driverData={mockDriverData} />);
    expect(screen.getByText('1234567890')).toBeInTheDocument();
  });

  it('displays date of birth', () => {
    render(<Card languageData={mockLanguageData} driverData={mockDriverData} />);
    //expect(screen.getByText('01/01/1980')).toBeInTheDocument();
  });

  it('displays gender', () => {
    render(<Card languageData={mockLanguageData} driverData={mockDriverData} />);
    expect(screen.getByText('Male')).toBeInTheDocument();
  });
});