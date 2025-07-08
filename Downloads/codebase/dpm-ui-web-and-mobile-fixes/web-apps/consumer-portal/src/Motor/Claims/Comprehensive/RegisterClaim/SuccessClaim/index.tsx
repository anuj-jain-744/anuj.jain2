import React, { useContext, useEffect } from "react";
import { DataContext } from "../../../../../DataContext";
import Success from "Motor/SuccessPage";

interface IClaimDetails {
  validationData: any;
  claimResponse: any;
  claimsInfo?: any;
}

interface CaseRefNoLabelProps {
  POLICE: string;
  NAJM: string;
  OTHERS: string; 
}

export default function ClaimsDetails({
  validationData,
  claimResponse,
  claimsInfo,
}: IClaimDetails) {
  const languageData = useContext(DataContext);

  const caseRefNoLabel: CaseRefNoLabelProps = {
    POLICE: languageData?.police_case_reference ?? "",
    NAJM: languageData?.najm_case_reference ?? "",
    OTHERS: languageData?.other_case_reference ?? "",
  }

  const getCaseRefNoLabel = (refNo: string): string => {
    if (/^\d{2}/.test(refNo)) {
      if (/^[4567]/.test(refNo)) {
        return caseRefNoLabel.POLICE;
      } else {
        return caseRefNoLabel.OTHERS;
      }
    }
    return caseRefNoLabel.NAJM;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {languageData ? (
        <Success
          status
          claimData={{
            claimLabel: getCaseRefNoLabel(claimsInfo?.refNo),
            claimNo: claimResponse?.claimNo,
            validationData,
            claimsInfo,
            claimResponse,
          }}
          data={null}
        />
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}
