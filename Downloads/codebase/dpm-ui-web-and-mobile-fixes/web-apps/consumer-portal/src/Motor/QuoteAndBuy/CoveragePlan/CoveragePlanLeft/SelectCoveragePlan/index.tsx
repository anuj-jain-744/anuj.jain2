import React from "react";
import style from "../../../VehicleDetails/VehicleDetails.module.scss";
import { LanguageData } from "types/languageData";
import CompareBenefitsAllCoverages from "./CompareBenefitsAllCoverages";
import SelectCoveragePlanType from "./SelectCoveragePlanType";
import { CompensationTypeKeys, ICoveragePlanData } from "types/coverageplan";
import AutoSuggest from "./AutoSuggest";
import "./style.scss";
import ThemeAlert from "components/ThemeAlert";
import { coverage_plan_for_renew } from "../../ConstantValue/ConstantValue";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";
interface ISelectCoveragePlanProps {
  languageData: LanguageData | undefined | null;
  coveragePlanData: ICoveragePlanData[];
  onChange: (title: string) => void;
  coveragePlanSelected: CompensationTypeKeys | null;
  isCoverageTypeDowngrading: boolean;
  clickHandlerRenewDowngrade: (val: string) => void;
  isRenewpolicy?: boolean; // Optional prop for renew policy
}

const SelectCoveragePlan: React.FC<ISelectCoveragePlanProps> = ({
  languageData,
  coveragePlanData,
  onChange,
  coveragePlanSelected,
  isCoverageTypeDowngrading,
  clickHandlerRenewDowngrade,
  isRenewpolicy
}) => {
  const { homePolicyRenewal } = usePHQuoteBuyContext();

  return (
    <div className={`${style.vehicleContainer} pb-0`}>
      <div className={style.vehicleHeading}>
        <div className="row w-100 d-flex align-items-center coverage-plan-heading">
          <div className="col d-flex align-items-center">
            <div className={`${style.vehicleTitle} pe-2`}>
              {languageData?.select_coverage_plan}
            </div>
            {((!homePolicyRenewal && coverage_plan_for_renew) || homePolicyRenewal || isRenewpolicy) && (
              <div>
                <ThemeAlert
                  variant="warning"
                  title={languageData?.existing_policy as string}
                  classes={`${homePolicyRenewal || isRenewpolicy ? 'home-renewal-warning' : 'alert-warning'} walaa-medium-500 alert-text`}
                />
              </div>
            )}
          </div>
          {languageData?.compare_benefits_for_all && (
            <div className="col d-flex align-items-center justify-content-end pe-0 compare-benefit-link">
              <CompareBenefitsAllCoverages
                languageData={languageData}
                coveragePlanSelected={coveragePlanSelected}
              />
            </div>
          )}
        </div>
      </div>
      <div className="coverageplan-liner">&nbsp;</div>
      <div className={style.vehicleBody}>
        <SelectCoveragePlanType
          languageData={languageData}
          coveragePlanData={coveragePlanData}
          onChange={onChange}
          coveragePlanSelected={coveragePlanSelected}
          //for renew coverage type downgrade alert
          isCoverageTypeDowngrading={isCoverageTypeDowngrading}
          clickHandlerRenewDowngrade={clickHandlerRenewDowngrade}
        />
        {/* Comprehensive Apply Recommendation Card */}
        {languageData && (
          <AutoSuggest
            languageData={languageData}
            coveragePlanSelected={coveragePlanSelected}
            onChange={onChange}
          />
        )}
      </div>
    </div>
  );
};

export default SelectCoveragePlan;
