import React from "react";
import style from "../../../VehicleDetails/VehicleDetails.module.scss";
import { LanguageData } from "types/languageData";
import CompareBenefitsAllCoverages from "./CompareBenefitsAllCoverages";
import SelectCoveragePlanType from "./SelectCoveragePlanType";
import { CompensationTypeKeys, ICoveragePlanData } from "types/coverageplan";
import AutoSuggest from "./AutoSuggest";
import "./style.scss";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import ThemeAlert from "components/ThemeAlert";
import { coverage_plan_for_renew } from "../../ConstantValue/ConstantValue";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";

interface ISelectCoveragePlanProps {
  languageData: LanguageData | undefined | null;
  coveragePlanData: ICoveragePlanData[];
  onChange: (title: string) => void;
  coveragePlanSelected: CompensationTypeKeys | null;
  isRepairTypeChecked: boolean;
  isCoverageTypeDowngrading: boolean;
  clickHandlerRenewDowngrade: (val: string) => void;
  onRepairTypeChecked: (checked: boolean) => void;
}

const SelectCoveragePlan: React.FC<ISelectCoveragePlanProps> = ({
  languageData,
  coveragePlanData,
  onChange,
  coveragePlanSelected,
  isRepairTypeChecked,
  isCoverageTypeDowngrading,
  clickHandlerRenewDowngrade,
  onRepairTypeChecked,
}) => {
  const { repairTypeSelected } = useQuoteAndBuyContext();
  const { homePolicyRenewal } = usePHQuoteBuyContext();

  return (
    <div className={`${style.vehicleContainer} pb-0`}>
      <div className={style.vehicleHeading}>
        <div className="row w-100 d-flex align-items-center">
          <div className="col d-flex align-items-center">
            <div className={`${style.vehicleTitle} pe-2`}>
              {languageData?.select_coverage_plan}
            </div>
            {((!homePolicyRenewal && coverage_plan_for_renew) || homePolicyRenewal) && (
              <div>
                <ThemeAlert
                  variant="warning"
                  title={languageData?.existing_policy as string}
                  classes={`${homePolicyRenewal ? 'home-renewal-warning' : 'alert-warning'} walaa-medium-500 alert-text`}
                />
              </div>
            )}
          </div>
          {languageData?.compare_benefits_for_all && (
            <div className="col d-flex align-items-center justify-content-end pe-0">
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
        {/* row 2 */}
        <AutoSuggest
          languageData={languageData}
          //selected card
          coveragePlanSelected={coveragePlanSelected}
          isRepairTypeChecked={repairTypeSelected}
          onRepairTypeChecked={onRepairTypeChecked}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default SelectCoveragePlan;
