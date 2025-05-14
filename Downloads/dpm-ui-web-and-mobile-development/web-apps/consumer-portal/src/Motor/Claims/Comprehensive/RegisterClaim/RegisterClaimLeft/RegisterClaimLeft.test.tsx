import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RegisterClaimLeft from '.';  // Update the path if necessary
import { DataContext } from "../../../../../DataContext"; // Ensure the correct path
import { comprehensiveOD } from "constant";

// Mock child components
jest.mock('./CompensationType', () => {
  return jest.fn(() => <div>Mocked CompensationType</div>);
});
jest.mock('./ClaimDetails', () => {
  return jest.fn(() => <div>Mocked ClaimDetails</div>);
});
jest.mock('./ContactDetails', () => {
  return jest.fn(() => <div>Mocked ContactDetails</div>);
});
jest.mock('./CompreTermsAndConditions', () => {
  return jest.fn(() => <div>Mocked CompreTermsAndConditions</div>);
});
jest.mock("../../Components/RegisterClaimModalDialog", () => {
  return jest.fn(() => <div>Mocked RegisterClaimModalDialog</div>);
});

describe('RegisterClaimLeft Component', () => {
  const mockChangeHandler = jest.fn();
  const mockContactDetchangeHandler = jest.fn();
  const mockUpdateHandler = jest.fn();
  const mockUpdateHandlerWorkshop = jest.fn();
  const mockChangeHandlerFiles = jest.fn();
  const mockIsMandatoryFileUploaded = jest.fn();
  const mockValidationData = {};
  const mockClaimsInfo = {};
  const mockMobilenumData = {};
  
  // Mock DataContext values
  const mockDataContext = {
    register_claim_top_message: "Top message content",
    compensation_type: comprehensiveOD,
    claim_details: "Claim Details",
    claimant_details: "Claimant Details",
    bank_transfer: "Bank Transfer",
    damage_repair: "Damage Repair",
  popup_body_content_one: [
    {
      value: "Before making a claim, check these terms and conditions, the specific exclusions under each section, your certificate of insurance, including the schedule of benefits. If you have a valid claim and you follow the proper process for claiming, upon submitting all required supporting documents, we will pay your claim within fourteen (14) working days to the Insured's bank account via electronic transfer. The most we pay for any insured event is the benefit limit shown on the schedule of benefits.",
      format: "plain"
    },
  ],
  popup_body_content_two:[
    {
      value: "Before making a claim, check these terms and conditions, the specific exclusions under each section, your certificate of insurance, including the schedule of benefits. If you have a valid claim and you follow the proper process for claiming, upon submitting all required supporting documents, we will pay your claim within fourteen (14) working days to the Insured's bank account via electronic transfer. The most we pay for any insured event is the benefit limit shown on the schedule of benefits.",
      format: "plain"
    },
  ]
  };

  it('should render RegisterClaimLeft with child components', () => {
    render(
      <DataContext.Provider value={mockDataContext}>
        <RegisterClaimLeft
          isBankTransferSelected={true}
          isDamageRepairSelected={false}
          isIAgreeSelected={true}
          liabilitySelected={0}
          changeHandler={mockChangeHandler}
          updateHandler={mockUpdateHandler}
          updateHandlerWorkshop={mockUpdateHandlerWorkshop}
          changeHandlerFiles={mockChangeHandlerFiles}
          isMandatoryFileUploaded={mockIsMandatoryFileUploaded}
          contactDetchangeHandler={mockContactDetchangeHandler}
          validationData={mockValidationData}
          claimsInfo={mockClaimsInfo}
          mobilenumData={mockMobilenumData}
          type={"TPL"}
          isEstimatedAmountData={0}
        />
      </DataContext.Provider>
    );

    // Check if the child components are rendered correctly
    expect(screen.getByText('Mocked CompensationType')).toBeInTheDocument();
    expect(screen.getByText('Mocked ClaimDetails')).toBeInTheDocument();
    expect(screen.getByText('Mocked ContactDetails')).toBeInTheDocument();
    expect(screen.getByText('Mocked CompreTermsAndConditions')).toBeInTheDocument();

    // Check for modal dialog content
    expect(screen.queryByText('Mocked RegisterClaimModalDialog')).not.toBeInTheDocument();
  });

  it('should open the modal when clicking the top message', () => {
    render(
      <DataContext.Provider value={mockDataContext}>
        <RegisterClaimLeft
          isBankTransferSelected={true}
          isDamageRepairSelected={false}
          isIAgreeSelected={true}
          liabilitySelected={0}
          changeHandler={mockChangeHandler}
          updateHandler={mockUpdateHandler}
          updateHandlerWorkshop={mockUpdateHandlerWorkshop}
          changeHandlerFiles={mockChangeHandlerFiles}
          isMandatoryFileUploaded={mockIsMandatoryFileUploaded}
          contactDetchangeHandler={mockContactDetchangeHandler}
          validationData={mockValidationData}
          claimsInfo={mockClaimsInfo}
          mobilenumData={mockMobilenumData}
          type={comprehensiveOD}
          isEstimatedAmountData={0}
        />
      </DataContext.Provider>
    );

    // Initially, modal should not be rendered
    expect(screen.queryByText('Mocked RegisterClaimModalDialog')).not.toBeInTheDocument();

    // Simulate clicking on the top message to open the modal
    fireEvent.click(screen.getByTestId('registration-modelid'));

    // After click, modal should be rendered
    expect(screen.getByText('Mocked RegisterClaimModalDialog')).toBeInTheDocument();
  });

  it('should display the correct text based on the DataContext values', () => {
    render(
      <DataContext.Provider value={mockDataContext}>
        <RegisterClaimLeft
          isBankTransferSelected={true}
          isDamageRepairSelected={false}
          isIAgreeSelected={true}
          liabilitySelected={0}
          changeHandler={mockChangeHandler}
          updateHandler={mockUpdateHandler}
          updateHandlerWorkshop={mockUpdateHandlerWorkshop}
          changeHandlerFiles={mockChangeHandlerFiles}
          isMandatoryFileUploaded={mockIsMandatoryFileUploaded}
          contactDetchangeHandler={mockContactDetchangeHandler}
          validationData={mockValidationData}
          claimsInfo={mockClaimsInfo}
          mobilenumData={mockMobilenumData}
          type={"TPL"}
          isEstimatedAmountData={0}
        />
      </DataContext.Provider>
    );

    // Check if the `compensation_type` is rendered
    expect(screen.getByText('Mocked CompensationType')).toBeInTheDocument();
    expect(screen.getByText('Claim Details')).toBeInTheDocument();
    expect(screen.getByText('Claimant Details')).toBeInTheDocument();
  });

  it('should not render CompensationType if type is comprehensiveOD', () => {
    render(
      <DataContext.Provider value={mockDataContext}>
        <RegisterClaimLeft
          isBankTransferSelected={true}
          isDamageRepairSelected={false}
          isIAgreeSelected={true}
          liabilitySelected={0}
          changeHandler={mockChangeHandler}
          updateHandler={mockUpdateHandler}
          updateHandlerWorkshop={mockUpdateHandlerWorkshop}
          changeHandlerFiles={mockChangeHandlerFiles}
          isMandatoryFileUploaded={mockIsMandatoryFileUploaded}
          contactDetchangeHandler={mockContactDetchangeHandler}
          validationData={mockValidationData}
          claimsInfo={mockClaimsInfo}
          mobilenumData={mockMobilenumData}
          type={comprehensiveOD}
          isEstimatedAmountData={0}
        />
      </DataContext.Provider>
    );

    // CompensationType should not be rendered for comprehensiveOD
    expect(screen.queryByText('Mocked CompensationType')).not.toBeInTheDocument();
  });
});
