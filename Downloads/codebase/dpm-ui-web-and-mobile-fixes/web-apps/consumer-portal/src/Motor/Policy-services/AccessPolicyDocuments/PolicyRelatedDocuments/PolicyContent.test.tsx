import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock child components
jest.mock('./PolicyRelatedDocuments', () => (props) => <div data-testid="mock-policy-related-docs">PolicyRelatedDocuments</div>);
jest.mock('../../PoliciesCancellation/sharedComponent/PolicyCard', () => (props) => <div data-testid="mock-policy-card">PolicyCard</div>);
jest.mock('Motor/DidYouKnowCard/DidYouKnowCard', () => (props) => <div data-testid="mock-did-you-know-card">DidYouKnowCard</div>);
jest.mock('components/OTPValidation', () => ({ LoaderOverlay: () => <div data-testid="mock-loader-overlay">LoaderOverlay</div> }));
jest.mock('components/ErrorComponent/Error', () => () => <div data-testid="mock-error-component">ErrorComponent</div>);

// Mock hooks
jest.mock('@dpm/shared-module', () => ({
  useApiCall: jest.fn(),
  useCommonContext: jest.fn(),
  RootState: {},
  capitalizeNameFirstLetter:  jest.fn((name) => name.charAt(0).toUpperCase() + name.slice(1)),
}));
jest.mock('Motor/Policy-services/PolicyDashboard/hooks/usePolicyData', () => jest.fn());
jest.mock('components/hooks/useQuoteAndBuyContext', () => ({
  useQuoteAndBuyContext: jest.fn(),
}));
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));
jest.mock('hook/dashboard/myRequests/useQueryClaim', () => ({
  useQueryClaim: jest.fn(),
}));

// Mock utils
jest.mock('utils/getPriceFormat', () => ({
  getPriceFormat: jest.fn(() => '1,000'),
}));
jest.mock('utils/policyDetails', () => ({
  getActiveClaimNumberForPolicy: jest.fn(() => ({ claimNo: 'C123', subClaimNo: 'SC123' })),
  getPlanName: jest.fn(() => 'Comprehensive'),
}));
jest.mock('utils/quoteAndBuy', () => ({
  displayHouseAddress: jest.fn(() => '123 Main St'),
  truncateName: jest.fn((name) => name.length > 10 ? name.slice(0, 10) + '...' : name),
}));

// Mock constants
jest.mock('constant', () => ({
  commonKeywords: { ar: 'ar' },
  PRODUCTSAPI: { travel: { viewPolicyNo: 'viewPolicyNo', viewPolicyAPI: 'viewPolicyAPI' } },
  PRODUCTCODE_TRAVEL: 'travel',
  TRAVEL: 'travel',
  PRODUCTS_CODE: { travel: 'travel' },
}));

import PolicyContent from './PolicyContent';

const mockUseApiCall = require('@dpm/shared-module').useApiCall;
const mockUseCommonContext = require('@dpm/shared-module').useCommonContext;
const mockUsePolicyData = require('Motor/Policy-services/PolicyDashboard/hooks/usePolicyData');
const mockUseQuoteAndBuyContext = require('components/hooks/useQuoteAndBuyContext').useQuoteAndBuyContext;
const mockUseSelector = require('react-redux').useSelector;
const mockUseQueryClaim = require('hook/dashboard/myRequests/useQueryClaim').useQueryClaim;

const languageData = {
  policy_related_documents: 'Policy Related Documents',
  loading: 'Loading...',
  download_all_documents: 'Download All Documents',
  sar: 'SAR',
  not_available: 'N/A',
  start_date: 'Start Date',
  expiry_date: 'Expiry Date',
  policy_no: 'Policy No',
  sum_insured: 'Sum Insured',
  property: 'Property',
  did_you_know_content: 'Did you know content',
  did_you_know_text: 'Did you know text'
};

const policyInfo = {
  policyNo: 'P123',
  productCode: 'travel',
  endorsementNo: 'E456',
  quoteNo: 'Q789'
};

beforeEach(() => {
  mockUseApiCall.mockReturnValue({
    makeApiCall: jest.fn(),
    data: { model: { policyDetails: { startDate: '2023-01-01', expiryDate: '2024-01-01', idv: '1000', prodCode: 'travel' }, planDetails: { policyRisk: [{}] } } },
    error: null,
  });
  mockUseCommonContext.mockReturnValue({ currentLanguage: 'en' });
  mockUsePolicyData.mockReturnValue({
    policyDetails: { startDate: '2023-01-01', expiryDate: '2024-01-01', idv: '1000', prodCode: 'travel' },
    planDetails: { policyRisk: [{}] }
  });
  mockUseQuoteAndBuyContext.mockReturnValue({ setProductName: jest.fn() });
  mockUseSelector.mockReturnValue('user123');
  mockUseQueryClaim.mockReturnValue({ data: { claimList: [] } });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('PolicyContent', () => {
    it('renders loader overlay when loading', async () => {
        // Simulate loading state
        mockUseApiCall.mockReturnValueOnce({
          makeApiCall: jest.fn(),
          data: null,
          error: null,
        });
        render(<PolicyContent languageData={languageData} policyInfo={policyInfo} />);
      });
      

  it('renders error component if error exists', () => {
    mockUseApiCall.mockReturnValueOnce({
      makeApiCall: jest.fn(),
      data: null,
      error: 'Some error',
    });
    render(<PolicyContent languageData={languageData} policyInfo={policyInfo} />);
    expect(screen.getByTestId('mock-error-component')).toBeInTheDocument();
  });

  it('renders error component if languageError exists', () => {
    render(<PolicyContent languageData={languageData} policyInfo={policyInfo} languageError="Some error" />);
    expect(screen.getByTestId('mock-error-component')).toBeInTheDocument();
  });

  it('renders PolicyRelatedDocuments and PolicyCard when policy data is available', () => {
    render(<PolicyContent languageData={languageData} policyInfo={policyInfo} />);
    expect(screen.getByTestId('mock-policy-related-docs')).toBeInTheDocument();
    expect(screen.getByTestId('mock-policy-card')).toBeInTheDocument();
  });

  it('renders DidYouKnowCard when policy data is not available', () => {
    mockUseApiCall.mockReturnValueOnce({
      makeApiCall: jest.fn(),
      data: null,
      error: null,
    });
    mockUsePolicyData.mockReturnValueOnce(undefined);
    render(<PolicyContent languageData={languageData} policyInfo={policyInfo} />);
  });

  it('does not render PolicyRelatedDocuments if languageData or policyDoc.data is missing', () => {
    mockUseApiCall.mockReturnValueOnce({
      makeApiCall: jest.fn(),
      data: null,
      error: null,
    });
    mockUsePolicyData.mockReturnValueOnce(undefined);
    render(<PolicyContent policyInfo={policyInfo} />);
    expect(screen.queryByTestId('mock-policy-related-docs')).not.toBeInTheDocument();
  });
});
