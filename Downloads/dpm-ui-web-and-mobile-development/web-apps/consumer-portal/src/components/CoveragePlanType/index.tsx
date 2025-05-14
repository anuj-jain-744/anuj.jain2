import RadioCard from "../RadioCard";
import React from "react";
import { SelectPlanTypeKeys, ICoveragePlanData } from "types/coverageplan";
import { TravelData } from "types/languageData";

interface ISelectCoveragePlanTypeProps {
  TravelData: TravelData | undefined | null;
  coveragePlanData: ICoveragePlanData[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>, key: string) => void;
  coveragePlanSelected: SelectPlanTypeKeys | null | string;
}

const CoveragePlanType: React.FC<ISelectCoveragePlanTypeProps> = ({
  TravelData,
  coveragePlanData,
  onChange,
  coveragePlanSelected,
}) => {

  const selectedCoveragePlanName = TravelData?.travel_coverage_plan.find(plan => plan.codeid === coveragePlanSelected)?.title ?? ''

  return (
    <div className="d-flex gap-3 w-100">
      {coveragePlanData.map((card, index) => (
        <React.Fragment key={index}>
          <RadioCard
            radiokey={card.key as SelectPlanTypeKeys}
            label={card.title}
            cardlistitems={card.details}
            checked={card.title === selectedCoveragePlanName}
            coveragePlanSelected={selectedCoveragePlanName}
            onChange={(
              event: React.ChangeEvent<HTMLInputElement>
            ) => onChange(event, card.codeid)}

            popup={false}
            TravelData={TravelData}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

export default CoveragePlanType;
