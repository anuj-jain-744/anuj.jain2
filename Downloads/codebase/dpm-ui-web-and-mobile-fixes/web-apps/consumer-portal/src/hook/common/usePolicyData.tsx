import { useMemo } from 'react';
import { PolicyDetail } from 'types/PolicyDetail';
import { processPolicies, getUniquePoliciesWithLatestEndorsementNumber } from 'utils/processPolicies';
import { PolicyStatus } from "types/Dashboard";
import { PRODUCTS_CODE, REQUEST_TYPES } from "constant";


const getActivePolicies = (policies: PolicyDetail[]) => {
  return policies.filter(policy => policy?.policyStatus !== PolicyStatus.Expired && policy?.endorsementType !== REQUEST_TYPES.CANCELLATION);
};

const getExpiredPolicies = (policies: PolicyDetail[]) => {
  return policies.filter(policy => policy?.policyStatus === PolicyStatus.Expired);
};

const getCancelledPolicies = (policies: PolicyDetail[]) => {
  return policies.filter(policy => policy?.endorsementType === REQUEST_TYPES.CANCELLATION || policy?.policyStatus === PolicyStatus.Cancelled);
};

const getEndorsements = (policies: PolicyDetail[]) => {
  const endorsements = policies.filter(policy => policy?.endorsementNo !== null && policy?.endorsementType !== REQUEST_TYPES.CANCELLATION);
  return getUniquePoliciesWithLatestEndorsementNumber(endorsements);
};

const getPoliciesByProductCode = (policies: PolicyDetail[], productCodes: string[]) => {
  return policies.filter(policy => productCodes.includes(policy.productCode));
};

const usePolicyData = (policyDeck: PolicyDetail[]) => {
  const uniquePolicies = useMemo(() => processPolicies(policyDeck), [policyDeck]);
  const activePolicies = useMemo(() => getActivePolicies(uniquePolicies), [uniquePolicies]);
  const expiredPolicies = useMemo(() => getExpiredPolicies(uniquePolicies), [uniquePolicies]);
  const cancelledPolicies = useMemo(() => getCancelledPolicies(uniquePolicies), [uniquePolicies]);
  const endorsements = useMemo(() => getEndorsements(uniquePolicies), [uniquePolicies]);
const MotorPolicies = useMemo(
  () =>
    getPoliciesByProductCode(
      uniquePolicies,
      Object.keys(PRODUCTS_CODE).filter(
        (key) => PRODUCTS_CODE[key] === '01' // '01' corresponds to RMCOM and RMTPL
      )
    ),
  [uniquePolicies]
);

const TravelPolicies = useMemo(
  () =>
    getPoliciesByProductCode(
      uniquePolicies,
      Object.keys(PRODUCTS_CODE).filter(
        (key) => PRODUCTS_CODE[key] === '03' // '03' corresponds to TRVL
      )
    ),
  [uniquePolicies]
);

const HomePolicies = useMemo(
  () =>
    getPoliciesByProductCode(
      uniquePolicies,
      Object.keys(PRODUCTS_CODE).filter(
        (key) => PRODUCTS_CODE[key] === '02' // '02' corresponds to HOME
      )
    ),
  [uniquePolicies]
);
  return {
    allPolicies: uniquePolicies,
    activePolicies: activePolicies,
    expiredPolicies: expiredPolicies,
    cancelledPolicies: cancelledPolicies,
    endorsementsPolicies: endorsements,
    motorPolicies: MotorPolicies,
    travelPolicies: TravelPolicies,
    homePolicies: HomePolicies,
  };
};

export default usePolicyData;