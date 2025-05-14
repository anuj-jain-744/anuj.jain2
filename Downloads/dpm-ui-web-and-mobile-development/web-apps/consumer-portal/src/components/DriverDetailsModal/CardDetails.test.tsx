import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CardDetails from './CardDetails';

jest.mock('./CardDetailsFrame', () => {
  return function MockCardDetailsFrame({ frameValues }: { frameValues: any[] }) {
    return (
      <div data-testid="card-details-frame">
        {frameValues.map((value, index) => (
          <div key={index}>
            <label>{value.label}</label>
            {value.type === 'dropdown' ? (
              <select
                data-testid={`select-${value.label}`}
                value={value.selectedValue}
                onChange={value.onChange}
              >
                {value.value.map((option: string) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                data-testid={`input-${value.label}`}
                type="text"
                value={value.value}
                onChange={value.onChange}
              />
            )}
          </div>
        ))}
      </div>
    );
  };
});

const mockLanguageData = {
  driver_s_personal_details: "Driver's Personal Details",
  marital_status: "Marital Status",
  no_of_children_under_16: "Number of Children Under 16",
  driver_relation: "Driver Relation",
  driver_education: "Driver Education",
  license_country: "License Country",
  traffic_violation: "Traffic Violation",
  health_condition: "Health Condition",
};

const mockProps = {
  languageData: mockLanguageData,
  maritalStatus: ['Single', 'Married'],
  driverRelation: ['Self', 'Spouse'],
  driverEducation: ['High School', 'College'],
  licenseCountry: ['USA', 'Canada'],
  trafficeVoilations: ['None', 'Minor'],
  healthCondition: ['Good', 'Excellent'],
  selectedMaritalStatus: 'Single',
  selectedNoOfChildren: 0,
  selectedDriverRelation: 'Self',
  selectedDriverEducation: 'High School',
  selectedLicenseCountry: 'USA',
  selectedTrafficViolation: 'None',
  selectedHealthCondition: 'Good',
  onMaritalStatusChange: jest.fn(),
  onNoOfChildrenChange: jest.fn(),
  onDriverRelationChange: jest.fn(),
  onDriverEducationChange: jest.fn(),
  onLicenseCountryChange: jest.fn(),
  onTrafficViolationChange: jest.fn(),
  onHealthConditionChange: jest.fn(),
};

describe('CardDetails', () => {
  it('renders without crashing', () => {
    render(<CardDetails {...mockProps} />);
    expect(screen.getByText("Driver's Personal Details")).toBeInTheDocument();
  });

  it('renders correct number of CardDetailsFrame components', () => {
    render(<CardDetails {...mockProps} />);
    const frames = screen.getAllByTestId('card-details-frame');
    expect(frames).toHaveLength(3);
  });

  it('handles marital status change', () => {
    render(<CardDetails {...mockProps} />);
    const select = screen.getByTestId('select-Marital Status');
    fireEvent.change(select, { target: { value: 'Married' } });
    expect(mockProps.onMaritalStatusChange).toHaveBeenCalledWith('Married');
  });

  it('handles number of children change', () => {
    render(<CardDetails {...mockProps} />);
    const input = screen.getByTestId('input-Number of Children Under 16');
    fireEvent.change(input, { target: { value: '2' } });
    expect(mockProps.onNoOfChildrenChange).toHaveBeenCalledWith(2);
  });

  it('handles driver education change', () => {
    render(<CardDetails {...mockProps} />);
    const select = screen.getByTestId('select-Driver Education');
    fireEvent.change(select, { target: { value: 'College' } });
    expect(mockProps.onDriverEducationChange).toHaveBeenCalledWith('College');
  });

  it('handles license country change', () => {
    render(<CardDetails {...mockProps} />);
    const select = screen.getByTestId('select-License Country');
    fireEvent.change(select, { target: { value: 'Canada' } });
    expect(mockProps.onLicenseCountryChange).toHaveBeenCalledWith('Canada');
  });

  it('handles traffic violation change', () => {
    render(<CardDetails {...mockProps} />);
    const select = screen.getByTestId('select-Traffic Violation');
    fireEvent.change(select, { target: { value: 'Minor' } });
    expect(mockProps.onTrafficViolationChange).toHaveBeenCalledWith('Minor');
  });

  it('handles health condition change', () => {
    render(<CardDetails {...mockProps} />);
    const select = screen.getByTestId('select-Health Condition');
    fireEvent.change(select, { target: { value: 'Excellent' } });
    expect(mockProps.onHealthConditionChange).toHaveBeenCalledWith('Excellent');
  });
});