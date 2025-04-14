import React from 'react';
import { render, screen } from '@testing-library/react';
import PolicyAccordionLinks from '.';
import { LanguageData } from 'types/languageData';

jest.mock('./PolicyHolder', () => () => <div>Policy Holder Component</div>);
jest.mock('./DriverDetails', () => () => <div>Driver Details Component</div>);
jest.mock('./VehicleDetailsSection', () => () => <div>Vehicle Details Section</div>);
jest.mock('./PolicyPremiumAndBenefitsSection', () => () => <div>Premium and Benefits Section</div>);
jest.mock('./PolicyAdditionalPackages', () => () => <div>Additional Packages Section</div>);
jest.mock('./TermsAndConditions', () => () => <div>Terms and Conditions Section</div>);

describe('PolicyAccordionLinks', () => {
  const mockLanguageData: LanguageData = {
    insurance_name: 'Insurance Name',
    id_number: 'ID Number',
    gender: 'Gender',
    age: 'Age',
    license_type: 'License Type',
    registration_plate_no: 'Registration Plate No',
    chassis_no: 'Chassis No',
    type_of_chassis: 'Type of Chassis',
    vehicle_make: 'Vehicle Make',
    vehicle_model: 'Vehicle Model',
    year_of_manufacture: 'Year of Manufacture',
    serial_no: 'Serial No',
    vehicle_color: 'Vehicle Color',
    transmission: 'Transmission',
  };

  const mockPolicyHolderDetails: any = {
    customerNameEnglish: "Rabindra",
    idNumer: "123456789",
    gender: "Male",
    dateOfBirth: "1990-01-01",
    licenseType: "Full License",
    address: ["123 Example St", "City", "Country"],
  };

  const mockVehicleDetails: any = [
    {
      registrationPlateNo: "ABC123",
      chassisNo: "CH123456789",
      typeOfChassis: "Sedan",
      vehicleMake: "Nissan",
      vehicleModel: "Altima",
      vehicleSequenceNo: "1",
      vehicleColor: 1,
      transmission: "Automatic"
    },
    {
      registrationPlateNo: "XYZ789",
      chassisNo: "CH987654321",
      typeOfChassis: "SUV",
      vehicleMake: "Mercedes",
      vehicleModel: "GLE",
      vehicleSequenceNo: "2",
      vehicleColor: "Black",
      transmission: "Automatic"
    },
  ];

  const mockPolicyPremiumAndBenefits: any = {
    sumInsured: 10000,
    premiumAmount: 500,
  };

  it('renders policy accordion links correctly', () => {
    render(
      <PolicyAccordionLinks
        details={{
          policyHolderDetails: mockPolicyHolderDetails,
          vehicleDetails: mockVehicleDetails,
          policyPremiumAndBenefits: mockPolicyPremiumAndBenefits,
        }}
        languageData={mockLanguageData}
      />
    );

    expect(screen.getByText(/Policy Holder Component/i)).toBeInTheDocument();
    expect(screen.getByText(/Driver Details Component/i)).toBeInTheDocument();
    expect(screen.getByText(/Vehicle Details Section/i)).toBeInTheDocument();
    expect(screen.getByText(/Premium and Benefits Section/i)).toBeInTheDocument();
    expect(screen.getByText(/Additional Packages Section/i)).toBeInTheDocument();
    expect(screen.getByText(/Terms and Conditions Section/i)).toBeInTheDocument();
  });

  it('displays correct holder details', () => {
     render(
       <PolicyAccordionLinks
         details={{
           policyHolderDetails: mockPolicyHolderDetails,
           vehicleDetails: mockVehicleDetails,
           policyPremiumAndBenefits: mockPolicyPremiumAndBenefits,
         }}
         languageData={mockLanguageData}
       />
     );

     expect(screen.getByText(/Policy Holder/i)).toBeInTheDocument();
     expect(screen.getByText(/Driver Details/i)).toBeInTheDocument();
  });

  it('handles no policy holder details gracefully', () => {
     render(
       <PolicyAccordionLinks
         details={{
           policyHolderDetails: null,
           vehicleDetails: mockVehicleDetails,
           policyPremiumAndBenefits: mockPolicyPremiumAndBenefits,
         }}
         languageData={mockLanguageData}
       />
     );

     expect(screen.queryByText(/Rabindra/i)).not.toBeInTheDocument();
  });
});