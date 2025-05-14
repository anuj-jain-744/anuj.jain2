import React from "react";
import { LanguageData } from "types/languageData";
import style from "../../VehicleDetails/VehicleDetails.module.scss";
import SelectCoveragePlan from "./SelectCoveragePlan";
import ContentBenefits from "Motor/QuoteAndBuy/ContentBenefits";
import PropertyPhotos from "Motor/QuoteAndBuy/PropertyPhotos";
import { CompensationTypeKeys, ICoveragePlanData } from "types/coverageplan";
import AdditionalBenefits from "Motor/QuoteAndBuy/AdditionalBenefits";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { IComprehensive, IThirdParty, BuildingContents, Contents } from "../ConstantValue/ConstantValue";

interface ICoveragePlanLeftProps {
  languageData: LanguageData | undefined | null;
  coveragePlanData: ICoveragePlanData[];
  onChange: (title: string) => void;
  coveragePlanSelected: CompensationTypeKeys | null;
  isCoverageTypeDowngrading: boolean;
  clickHandlerRenewDowngrade: (val: string) => void;
  onRepairTypeChecked: (checked: boolean) => void;
  isCalculateData: boolean;
}

const CoveragePlanLeft: React.FC<ICoveragePlanLeftProps> = ({
  languageData,
  coveragePlanData,
  onChange,
  coveragePlanSelected,
  isCoverageTypeDowngrading,
  clickHandlerRenewDowngrade,
  onRepairTypeChecked,
  isCalculateData
}) => {

  const { repairTypeSelected } = useQuoteAndBuyContext();


  return (
    <div className={style.mainContainerCoveragePlanLeft}>
      <div className={style.mainContainerCoveragePlanLeftpadding}>
        {/* select coverage plan Section */}
        <SelectCoveragePlan
          languageData={languageData}
          coveragePlanData={coveragePlanData}
          onChange={onChange}
          //selected card
          coveragePlanSelected={coveragePlanSelected}
          //for renew coverage type downgrade alert
          isCoverageTypeDowngrading={isCoverageTypeDowngrading}
          clickHandlerRenewDowngrade={clickHandlerRenewDowngrade}
        />
      </div>
      {languageData && (coveragePlanSelected === IComprehensive || coveragePlanSelected === BuildingContents || coveragePlanSelected === Contents) && repairTypeSelected && (
        <AdditionalBenefits languageData={languageData} repairTypeSelected={repairTypeSelected} />
      )}
      {languageData && coveragePlanSelected === IThirdParty && <AdditionalBenefits languageData={languageData} repairTypeSelected={repairTypeSelected} />}
      {(coveragePlanSelected === BuildingContents || coveragePlanSelected === Contents) && repairTypeSelected && (
        <>
          <ContentBenefits languageData={languageData} />
          <PropertyPhotos languageData={languageData} />
        </>
      )}
    </div>
  );
};

export default CoveragePlanLeft;
