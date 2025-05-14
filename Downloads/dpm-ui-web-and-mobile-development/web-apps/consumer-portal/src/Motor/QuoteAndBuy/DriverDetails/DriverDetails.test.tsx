import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DriverDetails from './DriverDetails';
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';
import { geteDriverRelation } from "utils/quoteAndBuy";
import verticleLine from "assets/QuoteAndBuy/verticleLine.svg";
import driverIcon from "assets/QuoteAndBuy/driver.svg";
import cross from "assets/QuoteAndBuy/cross.svg";

// Mock the modules and context
jest.mock('components/hooks/useQuoteAndBuyContext');
jest.mock('utils/quoteAndBuy');
jest.mock('./DriverDetails.module.scss', () => ({
    container: 'container',
    row: 'row',
    iconContainer: 'iconContainer',
    icon: 'icon',
    frame: 'frame',
    text: 'text',
    label: 'label',
    value: 'value',
    valueInput: 'valueInput',
    fieldContainer: 'fieldContainer',
    field: 'field',
    fieldLabel: 'fieldLabel',
    fieldValue: 'fieldValue',
    driverText: 'driverText',
    driverLabel: 'driverLabel',
    crossicon: 'crossicon',
}));

describe('DriverDetails Component', () => {
  const mockLanguageData = {
    iqama_no: 'Iqama Number',
    relationship: 'Relationship',
    driver_details: 'Driver Details',
  };

  const mockDriverDetailsData = [
    { driverID: '1', driverName: 'Main Driver' },
    { driverID: '2', driverName: 'Secondary Driver' },
  ];

  const mockDriverDetailsResponseData = [
    { driverID: '1', driverName: 'Main Driver Arabic', mainDriverInd: 'Y' },
    {
      driverID: '2',
      driverName: 'Secondary Driver Arabic',
      mainDriverInd: 'N',
      additionalDriverDetails: { driverRelationship: '0' },
    },
  ];

  const mockSetDriverDetails = jest.fn();
  const mockSetDriverDetailsResponseData = jest.fn();
  const mockSetSelectedDriverID = jest.fn();
  const mockHandleClose = jest.fn();

  beforeEach(() => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      driverDetails: mockDriverDetailsData,
      driverDetailsResponseData: mockDriverDetailsResponseData,
      setDriverDetails: mockSetDriverDetails,
      setDriverDetailsResponseData: mockSetDriverDetailsResponseData,
      showManageDriverModal: false,
      setSelectedDriverID: mockSetSelectedDriverID,
      selectedDriverID: null,
    });
    (geteDriverRelation as jest.Mock).mockImplementation((relationCode) => {
      switch (relationCode) {
        case 0:
          return "Family member";
        default:
          return "Unknown";
      }
    });
    jest.clearAllMocks();
  });

  it('renders driver details correctly', () => {
    render(
      <DriverDetails languageData={mockLanguageData} />
    );

    expect(screen.getByText('Secondary Driver Arabic')).toBeInTheDocument();
    expect(screen.getByText('Iqama Number.')).toBeInTheDocument();
    expect(screen.getByText('Relationship')).toBeInTheDocument();
    expect(screen.getByText('Driver Details')).toBeInTheDocument();
  });

  it('displays the correct driverID and relationship', () => {
    render(<DriverDetails languageData={mockLanguageData} />);

    expect(screen.getByText(mockDriverDetailsResponseData[1].driverID)).toBeInTheDocument();
    expect(screen.getByText('Family member')).toBeInTheDocument();
  });

  it('calls handleDriverDetails when driver details is clicked', () => {
    render(<DriverDetails languageData={mockLanguageData} handleClose={mockHandleClose} />);
    const driverDetailsLabel = screen.getByTestId('driver-details-label-0');
    fireEvent.click(driverDetailsLabel);

    expect(mockSetSelectedDriverID).toHaveBeenCalledWith('2');
    expect(mockHandleClose).toHaveBeenCalledWith(false);
  });

  it('calls handleDeleteDriver when cross icon is clicked', () => {
    render(<DriverDetails languageData={mockLanguageData} />);
    const crossIcon = screen.getAllByAltText('cross icon')[0];
    fireEvent.click(crossIcon);

    expect(mockSetDriverDetailsResponseData).toHaveBeenCalled();
  });

  it('does not render DriverDetailsModal when selectedDriverID is null', () => {
    render(<DriverDetails languageData={mockLanguageData} />);
    expect(screen.queryByText('Driver Details Modal')).toBeNull();
  });
});