import React from 'react';
import { render, screen } from '@testing-library/react';
import VehicleInfo from './VehicleInfo';
import { CURRENCY } from 'constant';
import { LanguageData } from 'types/languageData';
import { SuccessPagePolicyData } from 'types/quoteAndBuy';
import { getModelIcon } from 'utils/getModelIcon';

// Mock the getModelIcon function to return a dummy icon for testing
jest.mock('utils/getModelIcon', () => ({
  getModelIcon: jest.fn().mockReturnValue('dummy-icon.png'),
}));

describe('VehicleInfo Component', () => {
  const mockLanguageData: LanguageData = {
    repair_type: 'Repair Type',
    repair: 'Repair',
    sum_insured: 'Sum Insured',
    not_applicable: 'Not Applicable',
  };

  const mockPolicyData: SuccessPagePolicyData = {
    vehicleMakeText: 'Toyota',
    vehicleModelText: 'Corolla',
    vehicleMake: 'Toyota',
    vehicleModel: 'Corolla',
    plateNumber: 'ABC123',
    coverageName: 'Comprehensive', // Could be "ThirdParty" in another test case
    sumInsured: 10000,
  };

  const mockRepairCondition = 'Minor Damage';
  const mockMakeModelResponse = [{ image: 'car-icon.png', model: 'Corolla' }];

  test('renders VehicleInfo with correct details', () => {
    render(
      <VehicleInfo
        policyData={mockPolicyData}
        languageData={mockLanguageData}
        plateNumber={mockPolicyData.plateNumber}
        repairCondition={mockRepairCondition}
        makeModelResponse={mockMakeModelResponse}
      />
    );

    // Check if vehicle details (make, model, plate number) are rendered correctly
    expect(screen.getByText('Toyota Corolla')).toBeInTheDocument();
    expect(screen.getByText('ABC123')).toBeInTheDocument();

    // Check if repair type and sum insured are rendered correctly
    expect(screen.getByText('Repair Type')).toBeInTheDocument();
    expect(screen.getByText('Minor Damage Repair')).toBeInTheDocument();
    expect(screen.getByText('Sum Insured')).toBeInTheDocument();
    expect(screen.getByText(`${CURRENCY} 10000`)).toBeInTheDocument();

    // Check if the dummy vehicle icon is rendered
    expect(screen.getByRole('img')).toHaveAttribute('src', 'dummy-icon.png');
  });

  test('renders repair type as "Not Applicable" for ThirdParty coverage', () => {
    const thirdPartyPolicyData = { ...mockPolicyData, coverageName: 'ThirdParty' };

    render(
      <VehicleInfo
        policyData={thirdPartyPolicyData}
        languageData={mockLanguageData}
        plateNumber={thirdPartyPolicyData.plateNumber}
        repairCondition={mockRepairCondition}
        makeModelResponse={mockMakeModelResponse}
      />
    );

    // Check if repair type is rendered as "Not Applicable"
    expect(screen.getByText('Not Applicable')).toBeInTheDocument();
  });

  test('renders VehicleHeader with vehicle details and icon', () => {
    render(
      <VehicleInfo
        policyData={mockPolicyData}
        languageData={mockLanguageData}
        plateNumber={mockPolicyData.plateNumber}
        repairCondition={mockRepairCondition}
        makeModelResponse={mockMakeModelResponse}
      />
    );

    // Check if vehicle make and model are displayed
    expect(screen.getByText('Toyota Corolla')).toBeInTheDocument();
    expect(screen.getByText('ABC123')).toBeInTheDocument();

    // Check if the icon is rendered
    expect(screen.getByRole('img')).toHaveAttribute('src', 'dummy-icon.png');
  });

  test('renders VehicleInfoItem for repair type and sum insured', () => {
    render(
      <VehicleInfo
        policyData={mockPolicyData}
        languageData={mockLanguageData}
        plateNumber={mockPolicyData.plateNumber}
        repairCondition={mockRepairCondition}
        makeModelResponse={mockMakeModelResponse}
      />
    );

    // Check if repair type item is rendered
    expect(screen.getByText('Repair Type')).toBeInTheDocument();
    expect(screen.getByText('Minor Damage Repair')).toBeInTheDocument();

    // Check if sum insured item is rendered
    expect(screen.getByText('Sum Insured')).toBeInTheDocument();
    expect(screen.getByText(`${CURRENCY} 10000`)).toBeInTheDocument();
  });
});
