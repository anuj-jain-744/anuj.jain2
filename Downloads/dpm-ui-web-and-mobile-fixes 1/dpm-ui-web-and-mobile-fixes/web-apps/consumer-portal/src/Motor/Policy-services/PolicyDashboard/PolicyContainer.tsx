import React, { useState } from "react";
import style from "./PolicyContainer.module.scss";
import PolicyDashboard from "./PolicyDashboard";
import SelectPolicy from "./SelectPolicy/SelectPolicy";
import { useLocation } from "react-router-dom";
import { RootState} from "@dpm/shared-module";
import { useSelector } from "react-redux";
interface Props {
  navigateTo?: (url: string) => void;
}

const PolicyContainer: React.FC<Props> = ({ navigateTo }) => {
  const [selectedPolicyNumber, setSelectedPolicyNumber] = useState<string>("");
  const [selectedEndorsementNumber, setSelectedEndorsementNumber] =
    useState<string>("");
  const [allPolicy, setAllPolicy] = useState<string[]>([]);

  const handlePolicySelect = (
    policyNumber: string,
    endorsementNumber: string
  ) => {
    setSelectedPolicyNumber(policyNumber);
    setSelectedEndorsementNumber(endorsementNumber);
  };
  const location = useLocation();
  const {currentPolicy} = useSelector((state: RootState) => state.dashboardData);
  const policyInfo = location.state.data ? location.state.data : currentPolicy;

  return (
    <div className={style.container}>
      {/* <SelectPolicy
                onPolicySelect={handlePolicySelect}
                selectedPolicyNumber={selectedPolicyNumber} 
                setAllPolicy={setAllPolicy}
            /> */}
      {policyInfo && (
        <PolicyDashboard
          navigateTo={navigateTo}
          policyInfo={policyInfo}
          allPolicy={allPolicy}
        />
      )}
    </div>
  );
};

export default PolicyContainer;
