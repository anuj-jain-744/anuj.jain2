import { callAPI } from "@dpm/shared-module";
import { OthersClaimInfo } from "@dpm/corporate-portal/src/components/GetQuoteWidget/getQuoteInterface";
import { VITE_CONTENT_BASE_URI } from "../../../constant";
import { DataContext } from "../../../DataContext";
import React, { useEffect, useState } from "react";
import RegisterClaim from "./RegisterClaim";

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
  claimsInfo: ClaimsInfo;
  backBtnClickHandler: () => void;
  othersClaimInfo?: OthersClaimInfo;
}

const ComprehensiveClaim = ({
  type,
  module,
  claimCheckData,
  validationData,
  claimsInfo,
  backBtnClickHandler,
  othersClaimInfo,
}: IComprehensive) => {
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
    <React.Fragment>
      <div className="register-new-claim-comprehensive">
        <DataContext.Provider value={languageData}>
          <RegisterClaim
            languageData={languageData}
            type={type}
            module={module}
            validationData={validationData}
            claimCheckData={claimCheckData}
            claimsInfo={claimsInfo}
            othersClaimInfo={othersClaimInfo}
            // backbtn click handler
            backBtnClickHandler={backBtnClickHandler}
          />
        </DataContext.Provider>
      </div>
    </React.Fragment>
  );
};

export default ComprehensiveClaim;
