import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DriverDetailsModal from './DriverDetailsModal';
import { LanguageData } from 'types/languageData';
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';
import * as quoteAndBuyUtils from "utils/quoteAndBuy";

// Mock necessary modules and components
jest.mock('components/hooks/useQuoteAndBuyContext');
jest.mock('./Card', () => ({
  __esModule: true,
  default: ({ driverData }: any) => (
    <div data-testid="card">{driverData?.driverID}</div>
  ),
}));
jest.mock('./CardDetails', () => ({
  __esModule: true,
  default: ({
    onMaritalStatusChange,
    onNoOfChildrenChange,
    onDriverRelationChange,
    onDriverEducationChange,
    onLicenseCountryChange,
    onTrafficViolationChange,
    onHealthConditionChange,
    selectedMaritalStatus,
    selectedNoOfChildren,
    selectedDriverRelation,
    selectedDriverEducation,
    selectedLicenseCountry,
    selectedTrafficViolation,
    selectedHealthCondition,
    driverID
  }: any) => (
    <div data-testid="card-details">
      <button data-testid="marital-status-button" onClick={() => onMaritalStatusChange('Married')}></button>
      <button data-testid="children-button" onClick={() => onNoOfChildrenChange(1)}></button>
      <button data-testid="relation-button" onClick={() => onDriverRelationChange('Friend')}></button>
      <button data-testid="education-button" onClick={() => onDriverEducationChange('Bachelor')}></button>
      <button data-testid="country-button" onClick={() => onLicenseCountryChange('USA')}></button>
      <button data-testid="traffic-button" onClick={() => onTrafficViolationChange('Speeding')}></button>
      <button data-testid="health-button" onClick={() => onHealthConditionChange('None')}></button>
      <div>
        Marital Status: {selectedMaritalStatus}
      </div>
      <div>
        No Of Children: {selectedNoOfChildren}
      </div>
       <div>
        driverID: {driverID}
      </div>
      <div>
        selectedDriverRelation: {selectedDriverRelation}
      </div>
    </div>
  ),
}));
jest.mock('components/ThemeButton/ThemeButton', () => ({
  __esModule: true,
  default: ({ title, onClickhandler }: any) => (
    <button onClick={onClickhandler}>{title}</button>
  ),
}));
jest.mock('./DriverDetailsModal.module.scss', () => ({
  __esModule: true,
  default: {
    mainContainer: 'mainContainer',
    modalContainer: 'modalContainer',
    frame: 'frame',
    heading: 'heading',
    body: 'body',
    frameBottom: 'frameBottom',
    modalCloseIcon: 'modalCloseIcon',
  },
}));
jest.mock("utils/quoteAndBuy", () => ({
  geteDriverRelation: jest.fn(),
  getMaritalStatus: jest.fn(),
  driverEducationMappingValue: jest.fn(),
  driverMaritalMappingValue: jest.fn(),
  driverRelationMappingValue: jest.fn(),
  getDriverEducation: jest.fn(),
}));

const mockLanguageData: LanguageData = {
  driver_details: 'Driver Details',
  cancel: 'Cancel',
  update: 'Update',
};

const mockDriverDetailsResponseData = [
  {
    driverID: '123',
    maritalStatus: 'Single',
    noOfChildren: 0,
    driverRelationship: 'Friend',
    driverEducation: 'Bachelor',
    licenseCountry: 'Saudi Arabia',
    trafficViolation: 'Speed Ticket',
    healthCondition: 'No Restriction',
    additionalDriverDetails: {
      maritalStatusCd: 2,
      childrenBelow16: 0,
      driverRelationship: '1',
      educationLevel: 5,
      licenseCountry: "Saudi Arabia",
    }
  },
];

const mockSetDriverDetailsResponseData = jest.fn();
const mockGetMaritalStatus = jest.fn();
const mockGeteDriverRelation = jest.fn();
const mockGetDriverEducation = jest.fn();

describe('DriverDetailsModal', () => {
  const onHide = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      driverDetailsResponseData: mockDriverDetailsResponseData,
      setDriverDetailsResponseData: mockSetDriverDetailsResponseData,
    });

    (quoteAndBuyUtils.getMaritalStatus as jest.Mock).mockReturnValue("Single");
    (quoteAndBuyUtils.geteDriverRelation as jest.Mock).mockReturnValue("Friend");
    (quoteAndBuyUtils.getDriverEducation as jest.Mock).mockReturnValue("Bachelor");
    (quoteAndBuyUtils.driverEducationMappingValue as jest.Mock).mockReturnValue(5);
    (quoteAndBuyUtils.driverMaritalMappingValue as jest.Mock).mockReturnValue(2);
    (quoteAndBuyUtils.driverRelationMappingValue as jest.Mock).mockReturnValue(1);

    (quoteAndBuyUtils.getMaritalStatus as jest.Mock).mockImplementation((maritalStatusCd) => {
      switch (maritalStatusCd) {
        case 1:
          return "Married";
        case 2:
          return "Single";
        default:
          return "Other";
      }
    });

    (quoteAndBuyUtils.geteDriverRelation as jest.Mock).mockImplementation((driverRelationship) => {
      switch (driverRelationship) {
        case '0':
          return "Family member";
        case '1':
          return "Friend";
        default:
          return "Other";
      }
    });

    (quoteAndBuyUtils.getDriverEducation as jest.Mock).mockImplementation((educationLevel) => {
      switch (educationLevel) {
        case 1:
          return "Primary";
        case 5:
          return "Bachelor";
        default:
          return "Other";
      }
    });

  });

  it('renders without crashing', () => {
    render(
      <DriverDetailsModal
        show={true}
        onHide={onHide}
        languageData={mockLanguageData}
        driverID="123"
      />
    );
    expect(screen.getByText('Driver Details')).toBeInTheDocument();
    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('card-details')).toBeInTheDocument();
  });

  it('calls onHide when cancel button is clicked', () => {
    render(
      <DriverDetailsModal
        show={true}
        onHide={onHide}
        languageData={mockLanguageData}
        driverID="123"
      />
    );
    fireEvent.click(screen.getByText('Cancel'));
    expect(onHide).toHaveBeenCalled();
  });

  it('updates driver details when update button is clicked', () => {
    render(
      <DriverDetailsModal
        show={true}
        onHide={onHide}
        languageData={mockLanguageData}
        driverID="123"
      />
    );

    // Call the functions to change the value
    fireEvent.click(screen.getByTestId('marital-status-button'));
    fireEvent.click(screen.getByTestId('children-button'));
    fireEvent.click(screen.getByTestId('relation-button'));
    fireEvent.click(screen.getByTestId('education-button'));
    fireEvent.click(screen.getByTestId('country-button'));
    fireEvent.click(screen.getByTestId('traffic-button'));
    fireEvent.click(screen.getByTestId('health-button'));

    fireEvent.click(screen.getByText('Update'));

    expect(mockSetDriverDetailsResponseData).toHaveBeenCalledWith([
      {
        driverID: '123',
        maritalStatus: 'Single',
        noOfChildren: 0,
        driverRelationship: 'Friend',
        driverEducation: 'Bachelor',
        licenseCountry: 'Saudi Arabia',
        trafficViolation: 'Speed Ticket',
        trafficViolations: 'Speeding',
        healthCondition: "No Restriction",
        healthConditions: 'None',
        additionalDriverDetails: {
          maritalStatusCd: 2,
          childrenBelow16: 1,
          driverRelationship: '1',
          educationLevel: 5,
          licenseCountry: "USA",
        }
      }
    ]);

    expect(onHide);
  });

  it('calls onHide when close icon is clicked', () => {
    render(
      <DriverDetailsModal
        show={true}
        onHide={onHide}
        languageData={mockLanguageData}
        driverID="123"
      />
    );

    // Mock the close icon
    const closeIcon = document.createElement('img');
    closeIcon.setAttribute('alt', 'close icon');
    document.body.appendChild(closeIcon);

    fireEvent.click(closeIcon);
    expect(onHide);
  });
});
