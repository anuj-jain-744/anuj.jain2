import RegisterClaim from "./RegisterClaim";
import useTravelData from "Motor/Policy-services/AccessPolicyDocuments/hooks/useTravelData";
import "./index.scss";
import { VITE_CONTENT_BASE_URI } from "constant";
import { DataContext } from "DataContext";
import { useState, useEffect } from "react";
import { callAPI } from "@dpm/shared-module";

type ClaimsInfo = {
  refNo: string;
  ownerId: string;
  SourceType: number;
};

interface IComprehensive {
  type: string;
  module: string;
  claimCheckData: any;
  validationData?: any;
  policyNumber?: string;
  claimsInfo: ClaimsInfo;
  backBtnClickHandler: () => void;
}

const Claim = ({
  type,
  module,
  claimCheckData,
  validationData,
  policyNumber,
  claimsInfo,
  backBtnClickHandler,
}: IComprehensive) => {
  const { travelData } = useTravelData();
  const [languageData, setLanguageData] = useState();
  const fetchData = async () => {
    const response = await callAPI(
      "get",
      VITE_CONTENT_BASE_URI + "en/api/consumerportal-config"
    );
    setLanguageData(response.config[0]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="register-new-claim-comprehensive">
      <DataContext.Provider value={languageData}>
        <RegisterClaim
          policyNumber={policyNumber}
          travelData={travelData}
          type={type}
          module={module}
          validationData={validationData}
          claimCheckData={claimCheckData}
          claimsInfo={claimsInfo}
          backBtnClickHandler={backBtnClickHandler}
        />
      </DataContext.Provider>
    </div>
  );
};

export default Claim;
