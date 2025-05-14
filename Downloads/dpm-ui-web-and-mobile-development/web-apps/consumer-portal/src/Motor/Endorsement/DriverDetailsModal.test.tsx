
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DriverDetailsModal from './DriverDetailsModal';

const mockSetShowDriverDetails = jest.fn();
const mockSetNewDriver = jest.fn();
const mockHandleDriverUpdate = jest.fn();

const mockProps = {
  showDriverDetails: true,
  setShowDriverDetails: mockSetShowDriverDetails,
  languageData: {
    driver_details: "Driver Details",
    owner_id: "Owner ID",
    dob: "Date of Birth",
    gender: "Gender",
    driver_relation: "Driver Relation",
    driver_s_personal_details: "Driver's Personal Details",
    marital_status: "Marital Status",
    no_of_children_under_16: "No. of Children Under 16",
    license_country: "License Country",
    traffic_violation: "Traffic Violation",
    health_condition: "Health Condition",
    cancel: "Cancel",
    update: "Update",
    select: "Select"
  },
  newDriver: {
    driverName: "John Doe",
    driverNameArabic: "جون دو",
    driverID: "12345",
    dateofBirth: "01/01/1980",
    gender: "Male",
    relation: "Brother",
    maritalStatusCd: "Single",
    childrenBelow16: "2",
    validDrivingLicenses: "USA",
    trafficViolations: "None",
    healthConditions: "Healthy"
  },
  setNewDriver: mockSetNewDriver,
  driverIndex: 0,
  newDriverRelation: 1,
  setNewDriverRelation: jest.fn(),
  handleDriverUpdate: mockHandleDriverUpdate
};

describe('DriverDetailsModal', () => {
  it('renders the modal with driver details', () => {
    render(<DriverDetailsModal {...mockProps} />);
    
    expect(screen.getByText("Driver Details")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("جون دو")).toBeInTheDocument();
    expect(screen.getByText("12345")).toBeInTheDocument();
    expect(screen.getByText("01/01/1980")).toBeInTheDocument();
    expect(screen.getByText("Male")).toBeInTheDocument();
    expect(screen.getByText("Brother")).toBeInTheDocument();
  });

  it('calls setShowDriverDetails when cancel button is clicked', () => {
    render(<DriverDetailsModal {...mockProps} />);
    
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockSetShowDriverDetails).toHaveBeenCalledWith(false);
  });

  it('calls handleDriverUpdate when update button is clicked', () => {
    render(<DriverDetailsModal {...mockProps} />);
    
    fireEvent.click(screen.getByText("Update"));
    expect(mockHandleDriverUpdate).toHaveBeenCalled();
  });
});