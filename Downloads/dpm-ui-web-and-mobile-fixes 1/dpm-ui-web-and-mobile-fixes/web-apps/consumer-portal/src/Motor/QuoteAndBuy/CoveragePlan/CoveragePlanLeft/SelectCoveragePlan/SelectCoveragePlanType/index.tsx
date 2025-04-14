import RadioCard from "Motor/QuoteAndBuy/CoveragePlan/Components/RadioCard";
import React from "react";
import { CompensationTypeKeys, ICoveragePlanData } from "types/coverageplan";
import { LanguageData } from "types/languageData";
import CoverageDowngradeAlert from "./CoverageDowngradeAlert";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { repairTypeComp, repairTypeThird } from "constant";

interface ISelectCoveragePlanTypeProps {
  languageData: LanguageData | undefined | null;
  coveragePlanData: ICoveragePlanData[];
  onChange: (title: string) => void;
  coveragePlanSelected: CompensationTypeKeys | null;
  isCoverageTypeDowngrading: boolean;
  clickHandlerRenewDowngrade: (val: string) => void;
}

const SelectCoveragePlanType: React.FC<ISelectCoveragePlanTypeProps> = ({
  languageData,
  coveragePlanData,
  onChange,
  coveragePlanSelected,
  isCoverageTypeDowngrading,
  clickHandlerRenewDowngrade,
}) => {
  const { availableRepairTypes } = useQuoteAndBuyContext();


  const isThirdParty = availableRepairTypes?.includes(repairTypeThird);
  const isComprehensive = availableRepairTypes?.some(type => 
    repairTypeComp.includes(type)
  );

  return (
    <div className="d-flex gap-3">
      {coveragePlanData?.map((card, index) => (
        <React.Fragment key={index}>
          <RadioCard
            radiokey={card.key as CompensationTypeKeys}
            label={card.title}
            cardlistitems={card.details}
            checked={card.key === coveragePlanSelected}
            languageData={languageData}
            imageLink={card.image}
            coveragePlanSelected={coveragePlanSelected}
            onChange={onChange}
            disabled={
              (card.key === 'thirdparty' && !isThirdParty) ||
              (card.key === 'comprehensive' && !isComprehensive)
            }
          />
        </React.Fragment>
      ))}

      {isCoverageTypeDowngrading && (
        <CoverageDowngradeAlert
          clickHandlerRenewDowngrade={clickHandlerRenewDowngrade}
          isCoverageTypeDowngrading={isCoverageTypeDowngrading}
          languageData={languageData}
        />
      )}
    </div>
  );
};

export default SelectCoveragePlanType;