import React, { useState, useMemo } from "react";
import "./MyRequest.scss";
import { useSelector } from "react-redux";
import { RootState } from "@dpm/shared-module";
import { REQUEST_TYPES, ERROR_LOADING_REQUESTS } from "constant";
import RequestCard from "./RequestCard";
import RequestTabs from "./RequestTabs";
import ZeroState from "./ZeroState";
import usePolicyData from "hook/common/usePolicyData";
import { ClaimDetails, QuoteDetail } from "types/Dashboard";

const MyRequest: React.FC = () => {

const { quotes = [], isLoading, error } = useSelector(
    (state: RootState) => state.queryQuote || { quotes: [], error: null }
  ) as { quotes: QuoteDetail[]; isLoading: boolean; error: unknown };

  const { claims = [], isLoading: isQueryClaimLoading, error: queryClaimError } = useSelector(
    (state: RootState) => state.queryClaim || { claims: [], error: null }
  ) as { claims: ClaimDetails[]; isLoading: boolean; error: unknown };

  const [activeTab, setActiveTab] = useState(REQUEST_TYPES.ALL);
  const { languageData } = useSelector(
    (state: RootState) => state.dashbaordLanguageData
  );
  const { policies: policyDeck = [] } = useSelector(
    (state: RootState) => state.policy || { policies: [] }
  );

  const {
    cancelledPolicies: cancelledPolicies = [],
    endorsementsPolicies: endorsePolicies = [],
  } = usePolicyData(policyDeck);


  const [openCardIndex, setOpenCardIndex] = useState<number | null>(null); // Track the open card index

  const displayData = useMemo(() => {
    const safeQuotes: QuoteDetail[] = quotes || [];
    const safeClaims: ClaimDetails[] = claims || [];

    switch (activeTab) {
      case REQUEST_TYPES.ALL:
        return [
          ...safeQuotes,
          ...(cancelledPolicies || []), // Fallback to an empty array
          ...(endorsePolicies || []),  // Fallback to an empty array
          ...safeClaims,
        ] || [];
      case REQUEST_TYPES.CANCELLATION:
        return cancelledPolicies || [];
      case REQUEST_TYPES.ENDORSEMENT:
        return endorsePolicies || [];
      case REQUEST_TYPES.QUOTATION:
        return safeQuotes;
      case REQUEST_TYPES.CLAIM:
        return safeClaims || [];
      case REQUEST_TYPES.ENQUIRY:
      case REQUEST_TYPES.APPROVAL:
        return [];
      default:
        return [...safeQuotes, ...safeClaims];
    }
  }, [activeTab, cancelledPolicies, endorsePolicies, quotes, claims]);

  const handleTabClick = (tabType: string) => {
    setActiveTab(tabType);
  };

  const totalRequestCount = useMemo(() => {
    return (
      (cancelledPolicies?.length || 0) +
      (endorsePolicies?.length || 0) +
      (quotes?.length || 0) +
      (claims?.length || 0)
    );
  }, [endorsePolicies, cancelledPolicies, quotes, claims]);

  const isTabDisabled = () => {
    return totalRequestCount === 0;
  };

  const isDataAvailable = useMemo(() => {
    switch (activeTab) {
      case REQUEST_TYPES.ENDORSEMENT:
        return Array.isArray(endorsePolicies) && endorsePolicies.length > 0;
      case REQUEST_TYPES.CANCELLATION:
        return Array.isArray(cancelledPolicies) && cancelledPolicies.length > 0;
      case REQUEST_TYPES.QUOTATION:
        return Array.isArray(quotes) && quotes.length > 0;
      case REQUEST_TYPES.CLAIM:
        return Array.isArray(claims) && claims.length > 0;
      case REQUEST_TYPES.ALL:
        return (
          (Array.isArray(cancelledPolicies) && cancelledPolicies.length > 0) ||
          (Array.isArray(endorsePolicies) && endorsePolicies.length > 0) ||
          (Array.isArray(quotes) && quotes.length > 0) ||
          (Array.isArray(claims) && claims.length > 0)
        );
      default:
        return false;
    }
  }, [activeTab, cancelledPolicies, endorsePolicies, quotes, claims]);

const checkIsQuote = (item: QuoteDetail | null | undefined): boolean => {
  if (!item) return false;

  // Check if the object has properties unique to QuoteDetail
  return (
    "quoteNo" in item &&
    "quoteStatus" in item &&
    "productCode" in item
  );
};

const checkIsClaim = (item: ClaimDetails | null | undefined): boolean => {
  if (!item) return false;

  // Check if the object has properties unique to ClaimDetails
  return (
    "claimNo" in item &&
    "policyNo" in item &&
    "productName" in item
  );
}

  const handleToggleAccordion = (index: number) => {
    setOpenCardIndex((prevIndex) => (prevIndex === index ? null : index)); // Toggle the open card
  };

  return (
    <div className="my-request-container">
      <div className="my-request-header">
        <div className="my-request-heading walaa-medium-500">
          {languageData?.my_request} ({totalRequestCount})
        </div>
        <hr className="horizon" />
      </div>

      <RequestTabs
        activeTab={activeTab}
        handleTabClick={handleTabClick}
        isTabDisabled={isTabDisabled}
        languageData={languageData}
      />

      <div className="my-request-body">
        <div className="dropdown-cards">
          {(isLoading || isQueryClaimLoading) ? (
            <div><ZeroState languageData={languageData}/></div>
          ) : (error && queryClaimError && !endorsePolicies && !cancelledPolicies) ? (
            <div>{ERROR_LOADING_REQUESTS}</div>
          ) : isDataAvailable && displayData.length > 0 ? (
            <div className="my-request-body-card">
              {displayData.map((item, index) => (
                <RequestCard
                  key={index}
                  data={item || {}}
                  isQuote={checkIsQuote(item as QuoteDetail)}
                  isClaim={checkIsClaim(item as ClaimDetails)}
                  isOpen={openCardIndex === index} // Pass whether the card is open
                  onToggle={() => handleToggleAccordion(index)} // Pass toggle function
                  languageData={languageData}
                />
              ))}
            </div>
          ) : (
            <ZeroState languageData={languageData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRequest;