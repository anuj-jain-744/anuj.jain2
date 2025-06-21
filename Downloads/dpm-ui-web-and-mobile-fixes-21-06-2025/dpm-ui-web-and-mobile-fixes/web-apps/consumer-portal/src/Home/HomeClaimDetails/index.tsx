import { FC, useEffect } from "react";
import { LanguageData } from "types/languageData";
import RegisterClaim from "./RegisterClaim";

interface PolicyCardProps {
  backBtnClickHandler: () => void;
  claimData: { policyList: [] };
  setIsFirstPage: (show: boolean) => void;
  isPolicyCardSelected: boolean;
  policies: { policyNo: string };
  languageData: LanguageData;
  handleNavigate?: (url: string) => void;
}

const HoemClaimDetails: FC<PolicyCardProps> = ({ claimData, backBtnClickHandler, setIsFirstPage, isPolicyCardSelected, policies, languageData, handleNavigate }) => {
  useEffect(() => {
    if (setIsFirstPage !== undefined)
      setIsFirstPage(false);
  }, []);

  return (
    <RegisterClaim
      claimData={claimData}
      languageData={languageData}
      backBtnClickHandler={backBtnClickHandler}
      isPolicyCardSelected={isPolicyCardSelected}
      policies={policies}
      handleNavigate={handleNavigate}
    />
  );
};

export default HoemClaimDetails;