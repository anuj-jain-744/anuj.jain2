import React from "react";
import VehicleInformation from "./VehicleInformation";
import { LanguageData } from "types/languageData";
import PremiumBreakUp from "components/PremiumBreakUp";
import DidYouKnowPlain from "../Components/DidYouKnowPlain";
import PolicyStartDate from "components/PolicyStartDate";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import SumInsuredDeductibleCard from "../Components/SumInsuredDeductibleCard";
import HomeCoverageDeductibleCard from "components/HomeCoverageDeductibleCard";
import NationalAddress from "../../../../components/NationalAddress";
import ExistingPremiumBreakUp from "components/ExistingPremiumBreakUp";
import RenewalPolicy from "components/RenewalPolicy";
import { coverage_plan_for_renew, IThirdParty } from "../ConstantValue/ConstantValue";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";

interface ICoveragePlanRightProps {
  languageData: LanguageData | undefined | null;
}

const CoveragePlanRight: React.FC<ICoveragePlanRightProps> = ({
  languageData,
}) => {
  const { repairTypeSelected, coverageType, homePremiumResponse } = useQuoteAndBuyContext();
  const { homePolicyRenewal } = usePHQuoteBuyContext();
  const isHome = homePremiumResponse && Object.keys(homePremiumResponse).length > 0;

  let subtitle: string | undefined = ''
  if (coverageType === IThirdParty) {
    subtitle = languageData?.third_party;
  }else if (repairTypeSelected && coverageType) {
    if (isHome) {
      subtitle = languageData?.title;
    } else {
      subtitle = languageData?.comprehensive;
    }
  }

  return (
    <React.Fragment>
      {/* for coverage right content */}
      <span className="w-100 pt-2">
        <PolicyStartDate isCalendarIcon={true} languageData={languageData} />
      </span>
      {languageData?.national_address &&
        <span className="w-100 py-2">
          <NationalAddress languageData={languageData} />
        </span>
      }
      {homePolicyRenewal &&
        < span className="w-100 py-2">
          <RenewalPolicy languageData={languageData} />
        </span>
      }
      {!isHome && <span className="w-100 py-2">
        <VehicleInformation languageData={languageData} />
      </span>}
      {!isHome && repairTypeSelected && coverageType && (
        <span className="w-100 py-2">
          <SumInsuredDeductibleCard />
        </span>
      )}
      {(isHome && repairTypeSelected && coverageType) ? (
        <span className="w-100 py-2">
          <HomeCoverageDeductibleCard languageData={languageData} />
        </span>
      ) : <></>}
      <span className="w-100 pb-2">
        {((repairTypeSelected && coverageType) && (coverage_plan_for_renew || homePolicyRenewal)) ? (
          <ExistingPremiumBreakUp
            languageData={languageData}
            title={languageData?.existing_premium_breakup as string}
            subtitle={languageData?.third_party as string}
          />
        ) : (
          coverageType === IThirdParty &&
          coverage_plan_for_renew && (
            <ExistingPremiumBreakUp
              languageData={languageData}
              title={languageData?.existing_premium_breakup as string}
              subtitle={languageData?.third_party as string}
            />
          )
        )}
      </span>
      <span className="w-100 pb-2">
      {subtitle ? (
          <PremiumBreakUp
            languageData={languageData}
            title={languageData?.premium_breakup as string}
            subtitle={subtitle}
          />
        ): ''}
      </span>
      <DidYouKnowPlain languageData={languageData} />
    </React.Fragment>
  );
};

export default CoveragePlanRight;
