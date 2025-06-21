import React, { useMemo } from "react";
import { LanguageData } from "types/languageData";
import style from "../../VehicleDetails/VehicleDetails.module.scss";
import SelectCoveragePlan from "./SelectCoveragePlan";
import ContentBenefits from "Motor/QuoteAndBuy/ContentBenefits";
import PropertyPhotos from "Motor/QuoteAndBuy/PropertyPhotos";
import { CompensationTypeKeys, ICoveragePlanData } from "types/coverageplan";
import AdditionalBenefits from "Motor/QuoteAndBuy/AdditionalBenefits";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { IComprehensive, IThirdParty, BuildingContents, Contents } from "../ConstantValue/ConstantValue";
import { ucFirstAllWords } from "utils/quoteAndBuy";

interface ICoveragePlanLeftProps {
  languageData: LanguageData | undefined | null;
  coveragePlanData: ICoveragePlanData[];
  onChange: (title: string) => void;
  coveragePlanSelected: CompensationTypeKeys | null;
  isCoverageTypeDowngrading: boolean;
  clickHandlerRenewDowngrade: (val: string) => void;
}

const CoveragePlanLeft: React.FC<ICoveragePlanLeftProps> = ({
  languageData,
  coveragePlanData,
  onChange,
  coveragePlanSelected,
  isCoverageTypeDowngrading,
  clickHandlerRenewDowngrade,
}) => {

  const { repairTypeSelected, homePremiumResponse } = useQuoteAndBuyContext();
  const isHome = homePremiumResponse && Object.keys(homePremiumResponse).length > 0;

  const showContentBenefits = useMemo(() => {
    let displayContentBenefits = false;
    if(repairTypeSelected && Array.isArray(languageData?.most_popular_coverage_plans) && languageData?.most_popular_coverage_plans.length > 0) {
      const findContentBenefits = languageData?.most_popular_coverage_plans?.findIndex((item) => (item.name === ucFirstAllWords(repairTypeSelected) && Number(item.show_content_benefits)));
      if (findContentBenefits !== -1) {
        displayContentBenefits = true;
      }
    }
    return displayContentBenefits;
  }, [languageData, repairTypeSelected]);

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
      {languageData && (coveragePlanSelected === IComprehensive || isHome) && repairTypeSelected && (
        <AdditionalBenefits languageData={languageData} repairTypeSelected={repairTypeSelected} />
      )}
      {languageData && coveragePlanSelected === IThirdParty && <AdditionalBenefits languageData={languageData} repairTypeSelected={repairTypeSelected} />}
      {(coveragePlanSelected === BuildingContents || coveragePlanSelected === Contents) && repairTypeSelected && (
        <>
          {showContentBenefits ? <ContentBenefits languageData={languageData} />: ""}
          <PropertyPhotos languageData={languageData} />
        </>
      )}
    </div>
  );
};

export default CoveragePlanLeft;
