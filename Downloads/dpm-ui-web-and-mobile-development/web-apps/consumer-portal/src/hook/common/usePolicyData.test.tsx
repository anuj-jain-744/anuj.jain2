import { renderHook } from '@testing-library/react';
import { PolicyDetail } from 'types/PolicyDetail';
import { processPolicies } from 'utils/processPolicies';
import usePolicyData from './usePolicyData';

jest.mock('utils/processPolicies', () => ({
  processPolicies: jest.fn(),
}));

describe('usePolicyData', () => {
  const mockPolicies: PolicyDetail[] = [
    {
        policyStatus: "Active or Inforce", endorsementType: null, endorsementNo: null,
        policyNo: ''
    },
    {
        policyStatus: "Expired", endorsementType: null, endorsementNo: null,
        policyNo: ''
    },
    {
        policyStatus: "Cancelled", endorsementType: 'Cancellation', endorsementNo: null,
        policyNo: ''
    },
    {
        policyStatus: "Active or Inforce", endorsementType: 'Endorsement', endorsementNo: '123',
        policyNo: ''
    },
  ];

  beforeEach(() => {
    (processPolicies as jest.Mock).mockImplementation((policies) => policies);
  });

  it('should categorize active policies correctly', () => {
    const { result } = renderHook(() => usePolicyData(mockPolicies));
    expect(result.current.activePolicies).toEqual([
      { policyStatus: "Active or Inforce", endorsementType: null, endorsementNo: null },
    ]);
  });

  it('should categorize expired policies correctly', () => {
    const { result } = renderHook(() => usePolicyData(mockPolicies));
    expect(result.current.expiredPolicies).toEqual([
      { policyStatus: "Expired", endorsementType: null, endorsementNo: null },
    ]);
  });

  it('should categorize cancelled policies correctly', () => {
    const { result } = renderHook(() => usePolicyData(mockPolicies));
    expect(result.current.cancelledPolicies).toEqual([
      { policyStatus: "Cancelled", endorsementType: 'Cancellation', endorsementNo: null },
    ]);
  });

  it('should categorize endorsements correctly', () => {
    const { result } = renderHook(() => usePolicyData(mockPolicies));
    expect(result.current.endorsementsPolicies).toEqual([
      { policyStatus: "Active or Inforce", endorsementType: 'Endorsement', endorsementNo: '123' },
    ]);
  });

  it('should return all unique policies', () => {
    const { result } = renderHook(() => usePolicyData(mockPolicies));
    expect(result.current.allPolicies).toEqual(mockPolicies);
  });

  it('should call processPolicies with the correct arguments', () => {
    renderHook(() => usePolicyData(mockPolicies));
    expect(processPolicies).toHaveBeenCalledWith(mockPolicies);
  });
});