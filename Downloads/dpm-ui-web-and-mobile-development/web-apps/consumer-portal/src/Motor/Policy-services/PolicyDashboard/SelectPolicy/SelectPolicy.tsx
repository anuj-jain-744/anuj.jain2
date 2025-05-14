import React, { useEffect } from "react";
import style from "./SelectPolicy.module.scss";
import info from "assets/PolicySelection/info.svg";
import infoTootip from "assets/PolicySelection/infoTooltip.svg";
import SelectYourPolicy from "./SelectYourPolicy";
import useLanguageData from "Motor/Policy-services/AccessPolicyDocuments/hooks/useLanguageData";
import ErrorPage from "components/ErrorComponent/Error";
import { useApiCall } from "@dpm/shared-module";
import { processPolicies } from "utils/processPolicies";
import { PolicyDetail } from "types/PolicyDetail";
import { viewPolicyIqmaId } from "Motor/QuoteAndBuy/CoveragePlan/ConstantValue/ConstantValue";
interface SelectPolicyProps {
  onPolicySelect: (policyNumber: string, endorsementNumber: string, productCode: string) => void;
  selectedPolicyNumber: string;
  setAllPolicy: (allPolicy: string[]) => void;
}

interface PolicyResponse {
    result: PolicyDetail[];
}

const SelectPolicy: React.FC<SelectPolicyProps> = ({
  onPolicySelect,
  selectedPolicyNumber,
  setAllPolicy,
}) => {
  const iqmaId = sessionStorage.getItem("iqmaId");
  const [policies, setPolicies] = React.useState<PolicyDetail[]>([]);
  const { makeApiCall, data } = useApiCall<PolicyResponse, undefined>(
    11,
    `/Dashboard/V1/GetPolicyList`,
    "post"
  );

  const handlePolicySelect = (policyNumber: string, endorsementNumber: string, productCode: string) => {
    if (selectedPolicyNumber === policyNumber) {
      onPolicySelect("", "");
    } else {
      onPolicySelect(policyNumber, endorsementNumber, productCode);
    }
  };

  const {
    languageData,
    error: languageError,
  } = useLanguageData();

  const name = "Javed"; // TODO: replace with actual name when login is implemented

  useEffect(() => {
    if (data) {
      const processedPolicy = processPolicies(data.result);
      setPolicies(processedPolicy || []);
      setAllPolicy(processedPolicy.map((policy) => policy.policyNo));
    }
  }, [data]);

  useEffect(() => {
    makeApiCall({
      includeEndoVersion:"N",
      nationalID: iqmaId ?? viewPolicyIqmaId, // TODO :: need to remove once login is done.
    });
  }, []);

  if (languageError) {
    return <ErrorPage />;
  }

  return (
    <div className={style.container}>
      <div className={style.infoContainer}>
        <img src={info} alt="info icon" />
        <div className="infoText">
          <div className="infoTextValue">
            {`${name} ${languageData?.here_are_the_motor_policy}`}
          </div>
        </div>
      </div>
      <div className={style.frameContainer} >
        <div className={style.frameArea}>
          <div className={style.cardTitle}>
            <div className={style.cardTitleValue}>
              <div className={style.cardTitleInput}>
                <div className={style.cardTitleInputValue}>
                  {languageData?.select_policy}
                </div>
                <img src={infoTootip} alt={"infoTootip icon"} />
              </div>
            </div>
            <hr className={style.horizontalLine} />
            {/* <img src={vector} alt="vector line" /> */}
          </div>
          <div className={style.cardFrameContainer}>
            {Array.isArray(policies) && policies.map((policy) => (
              <SelectYourPolicy
                key={policy.policyNo}
                policyNumber={policy.policyNo}
                isSelected={selectedPolicyNumber === policy.policyNo}
                isNotificationEnable={policy?.isNotificationEnable}
                onSelect={handlePolicySelect}
                languageData={languageData}
                endorsementNumber={policy.endorsementNo || ""}
                productCode={policy.productCode}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectPolicy;
