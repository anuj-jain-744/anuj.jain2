import { useEffect } from "react";
import Success from "./Success";
import { useNavigate } from "react-router-dom";
import useLanguageData from "components/PolicyServices/AccessPolicyDocuments/hooks/useLanguageData";

interface IClaimDetails {
  validationData: any;
  claimResponse: any;
  claimsInfo?: any;
  travelData: any;
  handleClaimDownload: any;
  policyNo: string;
}

export default function ClaimsDetails({
  validationData,
  claimResponse,
  claimsInfo,
  travelData,
  handleClaimDownload,
  policyNo
}: IClaimDetails) {
  const { languageData } = useLanguageData();

  enum CaseRefNoLabel {
    POLICE = languageData?.police_case_reference,
    NAJM = languageData?.najm_case_reference,
    OTHERS = languageData?.other_case_reference,
  }

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/track-claim");
  };

  const getCaseRefNoLabel = (refNo: string): CaseRefNoLabel => {
    if (/^\d{2}/.test(refNo)) {
      if (/^[4567]/.test(refNo)) {
        return CaseRefNoLabel.POLICE;
      } else {
        return CaseRefNoLabel.OTHERS;
      }
    }
    return CaseRefNoLabel.NAJM;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  return (
    <>
      {languageData ? (
        <Success
          status={true}
          claimLabel={getCaseRefNoLabel(claimsInfo?.refNo)}
          claimNo={claimResponse?.claimInfo?.claimNo}
          validationData={validationData}
          claimsInfo={claimsInfo}
          claimResponse={claimResponse}
          travelData={travelData}
          handleClaimDownload={handleClaimDownload}
          handleNavigate={handleNavigate}
          policyNo={policyNo}
        />
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}
