import React, { useEffect, useState } from "react";

import { LoaderOverlay } from "../../../components";
import ComprehensiveClaim from "@consumer-portal/Motor/Claims/Comprehensive";
import { OthersClaimInfo } from "@corporate-portal/components/GetQuoteWidget/getQuoteInterface";

type ClaimsInfo = {
  refNo: string;
  ownerId: string;
  SourceType: number;
  type: string
};

type ComprehensiveType = {
  claimCheckData: any;
  validationData?: any;
  claimsInfo: ClaimsInfo;
  setIsFirstPage: (show: boolean) => void;
  backBtnClickHandler: () => void;
  othersClaimInfo?: OthersClaimInfo;
};

const Comprehensive = ({
  claimCheckData,
  validationData,
  claimsInfo,
  setIsFirstPage,
  backBtnClickHandler,
  othersClaimInfo,
}: ComprehensiveType) => {
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
    if (setIsFirstPage != undefined)
      setIsFirstPage(false);
  }, []);

  return (
    <React.Fragment>
      {loading && <LoaderOverlay />}
      <ComprehensiveClaim
        type={claimsInfo?.type}
        module="motor"
        claimCheckData={claimCheckData}
        othersClaimInfo={othersClaimInfo}
        validationData={validationData}
        claimsInfo={claimsInfo} 
        // backbtn click handler
        backBtnClickHandler={backBtnClickHandler}
      />
    </React.Fragment>
  );
};

export default Comprehensive;
