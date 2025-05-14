import { callAPI } from "@dpm/shared-module";
import { VITE_CONTENT_BASE_URI } from "../../../constant";
import { DataContext } from "../../../DataContext";
import React, { useEffect, useState } from "react";
import RegisterClaim from "./RegisterClaim";

type ClaimsInfo = {
  refNo: String;
  ownerId: String;
  SourceType: Number;
};

interface IComprehensive {
  type: string;
  module: string;
  claimCheckData: any;
  validationData?: any;
  claimsInfo: ClaimsInfo;
  backBtnClickHandler: () => void;
}

const ComprehensiveClaim = ({
  type,
  module,
  claimCheckData,
  validationData,
  claimsInfo,
  backBtnClickHandler,
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
            type={type}
            module={module}
            validationData={validationData}
            claimCheckData={claimCheckData}
            claimsInfo={claimsInfo}
            // backbtn click handler
            backBtnClickHandler={backBtnClickHandler}
          />
        </DataContext.Provider>
      </div>
    </React.Fragment>
  );
};

export default ComprehensiveClaim;
