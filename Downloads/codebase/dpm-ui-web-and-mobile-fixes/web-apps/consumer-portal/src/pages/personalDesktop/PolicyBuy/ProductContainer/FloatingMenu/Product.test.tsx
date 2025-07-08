import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Product from './Product';
import { useNavigate } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import { showNotification } from "components/ThemeAlertNotification/ThemeAlertNotification";
import usePolicyData from "hook/common/usePolicyData";


// Mock all icons
jest.mock('assets/DashboardBanner/newMotorIcon.svg', () => 'motor-icon.svg');
jest.mock('assets/DashboardBanner/newTravelIcon.svg', () => 'travel-icon.svg');
jest.mock('assets/DashboardBanner/newHomeIcon.svg', () => 'home-icon.svg');
jest.mock('assets/DashboardBanner/newMedicalIcon.svg', () => 'medical-icon.svg');


jest.mock('types/Dashboard', () => ({
  PolicyStatus:{
    Active : "Active",
    Open : "Open",
    Reopen : "Reopen",
    New : "New",
    Cancelled : "Cancelled",
    Closed : "Closed",
    Reject : "Reject",
    Expired : "Expired",
    ClaimRegister : "Claim Register",
  }
  
}));
// Mock constants
jest.mock('constant', () => ({
  TRAVEL: "TRVL",
  PRODUCTS_NAMES: {
    HOME: 'Home',
    MOTOR: 'Motor',
    TRVL: "Travel",
    MEDICAL: 'Medical',
  },
  productIDs: {
    home: 'home-id',
    travel: 'travel-id'
  },
  REQUEST_TYPES:{
    ALL: "All",
  CLAIM: "Claim",
  ENQUIRY: "Enquiry",
  APPROVAL: "Approval",
  CANCELLATION: "Cancellation",
  QUOTATION: "Quotation",
  ENDORSEMENT: "Endorsement",
  }
}));

// Mock Travel constants
jest.mock('components/Travel/constantsTravel', () => ({
  familtyFlowConstants: { dobG: '2000-01-01' }
}));

// Mock usePolicyData
jest.mock("hook/common/usePolicyData");
jest.mock('components/ThemeAlertNotification/ThemeAlertNotification', () => ({
  showNotification: jest.fn()
}));

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

// Mock react-redux
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

describe('Product Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock useNavigate
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    // Mock useSelector for all selectors in the component
    (reactRedux.useSelector as jest.Mock).mockImplementation(selectorFn =>
      selectorFn({
        auth: {
          userInfo: {
            name: 'John Doe',
            userId: '12345',
            mobileNumber: '0551234567',
            ownerDobG: '1990-01-01',
            ownerDobH: '1410-01-01',
            gender: 'Male',
            nationality: 'Saudi',
            nationalityCode: 'SA',
            email: 'john@example.com',
            ownerFullNameArabic: 'جون دو',
            dateOfBirth: '1990-01-01'
          },
          authDetails: {
            message: 'msg',
            isValid: true,
            referenceNo: 'ref123',
            sessionSecretId: 'sess123'
          }
        },
        addressData: {
          addressData: [{ city: 'Riyadh' }]
        },
        policy: {
          policies: [{ id: 1,policyStatus:"Inforce or Active" }]
        }
      })
    );
    // Mock usePolicyData
    (usePolicyData as jest.Mock).mockReturnValue({
      motorPolicies: [{
              "productCode": "RMCOM",
              "policyStatus": "Inforce or Active",   
          }],
            travelPolicies: { mock: 'travelPolicies' },
            homePolicies: { mock: 'homePolicies' }
    });
  });

  it('renders and navigates correctly for Motor buy', () => {
    render(<Product iconName="Motor" action="buy" />);
    const btn = screen.getByRole('button');
    expect(btn).toBeInTheDocument();
    expect(screen.getByText('Motor Insurance')).toBeInTheDocument();
    expect(screen.getByAltText('Motor icon')).toBeInTheDocument();

    fireEvent.click(btn);

    expect(mockNavigate).toHaveBeenCalledWith('/Motor/QuoteAndBuy', {
      state: { data: expect.any(Object) }
    });
  });

  it('renders and navigates correctly for Travel buy', () => {
    render(<Product iconName="Travel" action="buy" />);
    expect(screen.getByAltText('Travel icon')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button'));
    expect(mockNavigate).toHaveBeenCalledWith('/Travel/QuoteAndBuy', {
      state: { data: expect.any(Object) }
    });
  });

  it('renders and navigates correctly for Home buy', () => {
    render(<Product iconName="Home" action="buy" />);
    expect(screen.getByAltText('Home icon')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button'));
    expect(mockNavigate).toHaveBeenCalledWith('/personal/Home/quote-buy', {
      state: { data: expect.any(Object) }
    });
  });

  it('renders and navigates correctly for Medical buy', () => {
    render(<Product iconName="Medical" action="buy" />);
    expect(screen.getByAltText('Medical icon')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button'));
    // Medical buy returns null data
    expect(mockNavigate).toHaveBeenCalledWith('/Medical/QuoteAndBuy', {
      state: { data: null }
    });
  });

  it('navigates to /Register-claim with correct data for Motor raiseClaim', () => {
    render(<Product iconName="Motor" action="raiseClaim" />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockNavigate).toHaveBeenCalledWith('/Register-claim', {
      state: { data: [{
        "productCode": "RMCOM",
        "policyStatus": "Inforce or Active",   
    }] }
    });
  });
  it('open alert message when no valid policy for Motor raiseClaim', async() => {
    (usePolicyData as jest.Mock).mockReturnValue({
      motorPolicies: [{
              "productCode": "RMCOM",
              "policyStatus": "Expired",   
          }],
            travelPolicies: { mock: 'travelPolicies' },
            homePolicies: { mock: 'homePolicies' }
    });
    render(<Product iconName="Motor" action="raiseClaim" languageData={{do_not_have_valid_policy:"Please select a valid policy to raise a claim."}}/>);
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(showNotification).toHaveBeenCalledWith({
        title: "",
        description: "Please select a valid policy to raise a claim.",
        type: "warning",
        duration: 5000,
        position: 'top-center',
        transition: expect.any(Function),
      });
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });


  it('navigates to /travel/claim/registerclaim with correct data for Travel raiseClaim', () => {
    render(<Product iconName="Travel" action="raiseClaim" />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockNavigate).toHaveBeenCalledWith("/travel/claim/registerclaim", {
      state: { data: {
        policies: { mock: 'travelPolicies' },
        ownerId: '12345',
        mobileNumber: '0551234567',
        productIDs: 'travel-id',
        userProfileData: expect.any(Object),
      } }
    });
  });

  it('navigates to /Register-claim with correct data for Home raiseClaim', () => {
    render(<Product iconName="Home" action="raiseClaim" />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockNavigate).toHaveBeenCalledWith('/Register-claim', {
      state: { data: {
        policies: { mock: 'homePolicies' },
        ownerId: '12345',
        mobileNumber: '0551234567',
        productIDs: 'home-id',
        isPolicyCardSelected: false
      } }
    });
  });

  it('navigates to /Register-claim with null for Medical raiseClaim', () => {
    render(<Product iconName="Medical" action="raiseClaim" />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockNavigate).toHaveBeenCalledWith('/Register-claim', {
      state: { data: null }
    });
  });

  it('navigates to /Track-claim with null data for trackClaim', () => {
    render(<Product iconName="Motor" action="trackClaim" />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockNavigate).toHaveBeenCalledWith('/Track-claim', {
      state: { data: null }
    });
  });

  it('does not navigate for unknown action', () => {
    render(<Product iconName="Motor" action="unknown" />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('renders correct label and icon for each product', () => {
    render(<Product iconName="Motor" action="buy" />);
    expect(screen.getByText('Motor Insurance')).toBeInTheDocument();
    expect(screen.getByAltText('Motor icon')).toBeInTheDocument();

    render(<Product iconName="Travel" action="buy" />);
    expect(screen.getByText('Travel Insurance')).toBeInTheDocument();
    expect(screen.getByAltText('Travel icon')).toBeInTheDocument();

    render(<Product iconName="Home" action="buy" />);
    expect(screen.getByText('Home Insurance')).toBeInTheDocument();
    expect(screen.getByAltText('Home icon')).toBeInTheDocument();

    render(<Product iconName="Medical" action="buy" />);
    expect(screen.getByText('Medical Insurance')).toBeInTheDocument();
    expect(screen.getByAltText('Medical icon')).toBeInTheDocument();
  });

  it('is accessible via keyboard (onKeyDown triggers navigation)', () => {
    render(<Product iconName="Motor" action="buy" />);
    const btn = screen.getByRole('button');
    fireEvent.keyDown(btn, { key: 'Enter', code: 'Enter' });
    expect(mockNavigate).toHaveBeenCalled();
  });
});
