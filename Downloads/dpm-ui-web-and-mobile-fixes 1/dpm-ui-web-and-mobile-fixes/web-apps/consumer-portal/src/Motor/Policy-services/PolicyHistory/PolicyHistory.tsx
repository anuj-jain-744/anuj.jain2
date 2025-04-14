import React, { useEffect, useState } from "react";
import "./PolicyHistory.scss";
import Calendar from "assets/Dashboard/Calendar-Tick.svg";
import Minus from "assets/Dashboard/Minus.svg";
import Plus from "assets/Dashboard/Plus.svg";
import PolicyCard from "../PolicyCancellation/sharedComponent/PolicyCard";
import { useSelector } from "react-redux";
import { RootState } from "@dpm/shared-module";
import { formatDate } from "utils/formatDate";
import { NA } from "constant";
import { LanguageData } from "types/languageData";
import { BackFooter } from "components/index";
import { useReviewPolicy } from "../PolicyDashboard/hooks/useReviewPolicy";
import usePolicyData from "../PolicyDashboard/hooks/usePolicyData";
import { getPriceFormat } from "utils/getPriceFormat";
import { getPlanName } from "utils/policyDetails";

interface PolicyData {
  endorsementType: string;
  nationalID: string;
  policyNo: string;
  premium: number;
  productCode: string;
  endoSubType: string;
  endorsementNo: string;
}
interface PolicyHistoryProps {
  policyData: PolicyData;
  navigateTo: (path: string) => void;
}

interface CardData {
  issueDate: string;
  endorsementType: string;
  premiumChange: string;
  description: string;
}

const DynamicCard: React.FC<{
  policyHistory: CardData;
  isExpanded: boolean;
  onToggle: () => void;
  policyData: PolicyData;
  languageData: LanguageData;
}> = ({ policyHistory, isExpanded, onToggle, policyData, languageData }) => {

  return (
    <div className="dynamic-card">
      <div className="dynamic-card-body">
        <div className="questions">
          <div className="calendar-icon">
            <img src={Calendar} />
          </div>
          <div
            className={`date-text ${isExpanded ? "walaa-medium-500" : "walaa-regular-400"
              }`}
          >
            {formatDate(policyHistory.issueDate)}
          </div>
          <div className="toggle-icon" onClick={onToggle}>
            <img src={isExpanded ? Minus : Plus} />
          </div>
        </div>
        {isExpanded && policyHistory.endorsementType && (
          <div className="answers-container">
            <div className="answers">
              <div className="answer-one">
                <div className="label walaa-regular-400">
                  {languageData?.type_of_endorsement}
                </div>
                <div className="value walaa-medium-500">
                  {policyHistory.endorsementType || NA}
                </div>
              </div>
              <hr className="vertical-line" />
              <div className="premium-change">
                <div className="label walaa-regular-400">{languageData?.premium_change}</div>
                <div className="value walaa-medium-500">
                  {policyHistory.premiumChange || NA}
                </div>
              </div>
              <hr className="vertical-line" />
              <div className="description">
                <div className="label walaa-regular-400">{languageData?.description}</div>
                <div className="value walaa-medium-500">{policyHistory.description || NA}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const PolicyHistory: React.FC<PolicyHistoryProps> = ({ policyData, navigateTo }) => {
  const [expandedCardIndex, setExpandedCardIndex] = useState<number | null>(
    null
  );

  const { policyHistory } = useSelector((state: RootState) => state.policyHistory);
  const { languageData } = useSelector((state: RootState) => state.dashbaordLanguageData);

  const policyNumber = policyData?.policyNo;

  const { makeApiCall, data } = useReviewPolicy({
    PolicyNo: policyNumber,
    Product: policyData?.productCode,
  });

  const policyDataDetail = usePolicyData(data);

  const policyDetails = policyDataDetail?.policyDetails ?? undefined;

  useEffect(() => {
    const fetchData = async () => {
      await makeApiCall();
    };
    fetchData();
  }, [policyNumber]);


  const handleToggle = (index: number) => {
    setExpandedCardIndex(expandedCardIndex === index ? null : index);
  };

  const coverageName = getPlanName(policyDataDetail);

  return (
    <div className="policy-history-card-wrapper">
      <div className="policy-history-container">
        <div className="policy-history">
          <div className="policy-history-left">
            <div className="policy-history-main-card">
              <div className="policy-history-main-card-title">
                <div className="title-content">
                  <div className="title walaa-medium-500">
                    {languageData?.policy_history}
                  </div>
                </div>
                <hr className="horizontal-line" />
              </div>
              <div className="policy-history-main-card-body">
                <div className="main-card-body">
                  {policyHistory?.map(
                    (policyHistory: CardData, index: number) => (
                      <React.Fragment key={index}>
                        <DynamicCard
                          policyHistory={policyHistory}
                          isExpanded={expandedCardIndex === index}
                          onToggle={() => handleToggle(index)}
                          policyData={policyData}
                          languageData={languageData}
                        />
                        {index < policyHistory.length - 1 &&
                          expandedCardIndex !== index && (
                            <hr className="horizontal-line" />
                          )}
                      </React.Fragment>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="policy-history-right">
            <PolicyCard
              policyNumber={policyNumber}
              startDate={policyDetails?.startDate}
              expiryDate={policyDetails?.expiryDate}
              idvValue={
                policyDetails?.idv
                  ? `${languageData?.sar ?? "SAR"} ${getPriceFormat(
                    parseInt(policyDetails?.idv)
                  )}`
                  : `${languageData?.not_available ?? "Not Available"}`
              }
              coverageName={coverageName}
              startDateTitle={languageData?.start_date ?? "Start Date"}
              expiryDateTitle={languageData?.expiry_date ?? "Expiry Date"}
              policyNo={languageData?.policy_no ?? "Policy No"}
              idvTitle={languageData?.sum_insured ?? "Sum Insured"}
              prodCode={policyData?.productCode}
            />
          </div>
        </div>
      </div>
      <BackFooter
        selectedPolicyNumber={policyData.policyNo}
        setSelectedPolicyNumber={undefined}
        navigateTo={navigateTo}
      />
    </div>
  );
};

export default PolicyHistory;
