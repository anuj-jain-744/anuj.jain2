import { renderHook } from '@testing-library/react';
import usePolicyData from './usePolicyData';
import { processPolicies, getUniquePoliciesWithLatestEndorsementNumber } from 'utils/processPolicies';
import { PolicyStatus } from 'types/Dashboard';
import { PRODUCTS_CODE, REQUEST_TYPES } from 'constant';

jest.mock('utils/processPolicies');
jest.mock('constant', () => ({
  PRODUCTS_CODE: {
    MOTOR: '01',
    HOME: '02',
    TRAVEL: '03',
  },
  REQUEST_TYPES: {
    CANCELLATION: 'CANCELLATION',
  },
}));

describe('usePolicyData', () => {
  const mockPolicies = [
    { policyStatus: PolicyStatus.Active, endorsementType: null, productCode: '01', endorsementNo: null },
    { policyStatus: PolicyStatus.Expired, endorsementType: null, productCode: '02', endorsementNo: null },
    { policyStatus: PolicyStatus.Cancelled, endorsementType: REQUEST_TYPES.CANCELLATION, productCode: '03', endorsementNo: null },
    { policyStatus: PolicyStatus.Active, endorsementType: null, productCode: '01', endorsementNo: '123' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (processPolicies as jest.Mock).mockImplementation((policies) => policies);
    (getUniquePoliciesWithLatestEndorsementNumber as jest.Mock).mockImplementation((policies) => policies);
  });

  it('should categorize policies correctly', () => {
    const { result } = renderHook(() => usePolicyData(mockPolicies));

    expect(result.current.allPolicies).toEqual(mockPolicies);
    expect(result.current.activePolicies).toEqual([mockPolicies[0], mockPolicies[3]]);
    expect(result.current.expiredPolicies).toEqual([mockPolicies[1]]);
    expect(result.current.cancelledPolicies).toEqual([mockPolicies[2]]);
    expect(result.current.endorsementsPolicies).toEqual([mockPolicies[3]]);
  });

  it('should handle empty policyDeck', () => {
    const { result } = renderHook(() => usePolicyData([]));

    expect(result.current.allPolicies).toEqual([]);
    expect(result.current.activePolicies).toEqual([]);
    expect(result.current.expiredPolicies).toEqual([]);
    expect(result.current.cancelledPolicies).toEqual([]);
    expect(result.current.endorsementsPolicies).toEqual([]);
    expect(result.current.motorPolicies).toEqual([]);
    expect(result.current.travelPolicies).toEqual([]);
    expect(result.current.homePolicies).toEqual([]);
  });

  it('should call processPolicies and getUniquePoliciesWithLatestEndorsementNumber', () => {
    renderHook(() => usePolicyData(mockPolicies));

    expect(processPolicies).toHaveBeenCalledWith(mockPolicies);
    expect(getUniquePoliciesWithLatestEndorsementNumber).toHaveBeenCalled();
  });
});