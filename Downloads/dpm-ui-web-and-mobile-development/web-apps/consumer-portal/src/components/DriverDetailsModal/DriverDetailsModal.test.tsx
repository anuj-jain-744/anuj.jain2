import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LanguageData } from 'types/languageData';
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';
import DriverDetailsModal from '.';
import { DriverProps } from 'types/driver';

jest.mock('components/hooks/useQuoteAndBuyContext');

const mockLanguageData: LanguageData = {
  driver_details: 'Driver Details',
  cancel: 'Cancel',
  update: 'Update',
};

const mockDriverDetails = [
  {
    driverID: '123',
    maritalStatus: 'Single',
    noOfChildren: 0,
    driverRelationship: 'Friend',
    driverEducation: 'Bachelor',
    licenseCountry: 'Saudi Arabia',
    trafficViolation: 'Speed Ticket',
    healthCondition: 'No Restriction',
  },
];

const mockSetDriverDetails = jest.fn();

(useQuoteAndBuyContext as jest.Mock).mockReturnValue({
  driverDetails: mockDriverDetails,
  setDriverDetails: mockSetDriverDetails,
});

describe('DriverDetailsModal', () => {
  const onHide = jest.fn();
  const mockDriverDetails: DriverProps = {
    driverID: '123',
    driverName: 'John Doe',
    driverNameArabic: 'John Doe',
    dateofBirth: '01/01/1990',
    streetName: '',
    licenseYear: 0,
    actuarialCity: '',
    postalCode: '',
    gender: '',
    usagePercentage: 0,
    licenseType: 0,
    relation: 0,
    noOfClaims: 0,
    maritalStatusCd: 0,
    idIssuePlaceCode: '',
    mainDriverInd: '',
    childrenBelow16: 0,
    city: '',
    additionalNumber: '',
    educationLevel: 0,
    nationality: '',
    noOfAccidents: 0,
    occupation: '',
    buildingNumber: '',
    driverIDType: 0,
    licenseExpiryDateH: '',
    district: '',
    licenseCountry: 0,
    healthConditions: "",
    trafficViolations: "",
  }
  
  const mockFunction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <DriverDetailsModal
        show={true}
        onHide={onHide}
        languageData={mockLanguageData} 
        showDriverDetails={true} 
        driverDetails={mockDriverDetails} 
        setDriverDetails={mockFunction}
        newDriverRelation={0} 
        setNewDriverRelation={mockFunction} 
        handleDriverUpdate={mockFunction}
      />
    );
    expect(screen.getByText('Driver Details')).toBeInTheDocument();
  });

  it('displays driver details', () => {
    render(
      <DriverDetailsModal
        show={true}
        onHide={onHide}
        languageData={mockLanguageData}
        showDriverDetails={true} 
        driverDetails={mockDriverDetails} 
        setDriverDetails={mockFunction}
        newDriverRelation={0} 
        setNewDriverRelation={mockFunction} 
        handleDriverUpdate={mockFunction}
      />
    );
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('calls onHide when cancel button is clicked', () => {
    render(
      <DriverDetailsModal
        show={true}
        onHide={onHide}
        languageData={mockLanguageData} 
        showDriverDetails={true} 
        driverDetails={mockDriverDetails} 
        setDriverDetails={mockFunction}
        newDriverRelation={0} 
        setNewDriverRelation={mockFunction} 
        handleDriverUpdate={mockFunction}
      />
    );
    fireEvent.click(screen.getByText('Cancel'));
    expect(onHide).toHaveBeenCalled();
  });

  it('updates driver details when update button is clicked', async () => {
    render(
      <DriverDetailsModal
        show={true}
        onHide={onHide}
        languageData={mockLanguageData}
        showDriverDetails={true} 
        driverDetails={mockDriverDetails} 
        setDriverDetails={mockFunction}
        newDriverRelation={0} 
        setNewDriverRelation={mockFunction} 
        handleDriverUpdate={mockFunction}
      />
    );
    fireEvent.click(screen.getByText('Update'));
    await waitFor(() => {
      expect(mockFunction).toHaveBeenCalledWith(mockDriverDetails);
    });
  });

  it('calls onHide when close icon is clicked', () => {
    render(
      <DriverDetailsModal
        show={true}
        onHide={onHide}
        languageData={mockLanguageData} 
        showDriverDetails={true} 
        driverDetails={mockDriverDetails} 
        setDriverDetails={mockFunction}
        newDriverRelation={0} 
        setNewDriverRelation={mockFunction} 
        handleDriverUpdate={mockFunction}
      />
    );
    fireEvent.click(screen.getByAltText('close icon'));
    expect(onHide).toHaveBeenCalled();
  });
});