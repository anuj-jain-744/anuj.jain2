import React from "react";
import { Card } from "react-bootstrap";
import { CompensationTypeKeys } from "types/coverageplan";
import "./style.scss";
import Car_Icon from "assets/QuoteAndBuy/Car_Icon.svg";
import Group_Icon from "assets/QuoteAndBuy/Group.svg";
import ThemeButton from "components/ThemeComponents/ThemeButton";
import { LanguageData } from "types/languageData";
import RepairType from "Motor/QuoteAndBuy/SelectRepairType";
import SumInsuredAndDeductibles from "Motor/QuoteAndBuy/SumInsuredAndDeductibles";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import {
  autoSuggestFinalVal,
  compensationTypeCardComprehensiveFinalVal,
} from "Motor/QuoteAndBuy/CoveragePlan/CommonFunction/CommonFunction";
import { BuildingContents, Contents, IComprehensive, IThirdParty } from "Motor/QuoteAndBuy/CoveragePlan/ConstantValue/ConstantValue";
import { getCurrencySymbol } from "@app-shell/utils/common";
import { repairTypeComp } from "constant";

interface IAutoSuggest {
  coveragePlanSelected: CompensationTypeKeys | null;
  languageData: LanguageData | undefined | null;
  onChange: (title: string) => void;
}

const AutoSuggest: React.FC<IAutoSuggest> = ({
  coveragePlanSelected,
  languageData,
  onChange,
}) => {

  // comprehensive value
  const {
    compWorkShop,
    compAgency,
    compMath,
    comp3rdParty,
    repairTypeSelected,
    setSelectedBenefits,
    availableRepairTypes
  } = useQuoteAndBuyContext();

  const isComprehensive = availableRepairTypes?.some(type => repairTypeComp?.includes(type));

  const minFinalPrice = compensationTypeCardComprehensiveFinalVal(
    compWorkShop,
    compAgency,
    compMath
  );

  const autoSuggestVal: string = autoSuggestFinalVal(
    minFinalPrice,
    comp3rdParty?.pricingOptions[0]?.finalAmount as number
  );

  const handleOnChange = (title: string) => {
    onChange(title);
    setSelectedBenefits([]);
  };


  return (
    <>
      {(coveragePlanSelected === IThirdParty && isComprehensive) && (
        <Card className="autosuggest-card">
          <Card.Body className="w-100">
            <div className="d-flex align-items-center flex-icon-container">
              <div className="autosuggest-icn-container">
                <img src={Car_Icon} alt="auto-suggest-icn" />
              </div>
              <div className="ps-3 d-flex flex-column">
                <div className="additional-text walaa-medium-400">
                  {getCurrencySymbol(`${languageData?.with_additional} ${languageData?.sar}
                  ${autoSuggestVal}
                  ${languageData?.you_can_get_better_coverag}`)}
                </div>
                <div>
                  <span className="walaa-medium-500 comp-repair-text">
                    {languageData?.comprehensive} -{" "}
                    {languageData?.workshop_repair}
                  </span>
                  <span className="walaa-regular-400 px-3 cur-text">
                    <span className="walaa-semibold-600">
                      {getCurrencySymbol(`${languageData?.sar} +${autoSuggestVal}`)}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </Card.Body>
          <Card.Footer className="autosuggest-card-footer">
            <div className="d-flex align-items-center ps-5 ms-1 apply-recommend">
              <div>
                <img src={Group_Icon} alt="car" />
              </div>
              <div className="ps-2 pe-4 walaa-regular-400 most-cust">
                {languageData?.most_of_our_customers_choo}
              </div>
              <div>
                <ThemeButton
                  classes=""
                  isDisabled={false}
                  title={languageData?.apply_recommendation as string}
                  onClickhandler={() =>
                    handleOnChange(
                      String(IComprehensive[0]).toUpperCase() +
                      String(IComprehensive).slice(1)
                    )
                  }
                />
              </div>
            </div>
          </Card.Footer>
        </Card>
      )}

      {((coveragePlanSelected === IComprehensive && isComprehensive) || coveragePlanSelected === BuildingContents || coveragePlanSelected === Contents) && (
        <>{languageData && <div className="comprehensive-content">
          <RepairType languageData={languageData} coveragePlanSelected={coveragePlanSelected} />
          {repairTypeSelected && coveragePlanSelected === IComprehensive && (
            <>
              <hr />
              <SumInsuredAndDeductibles languageData={languageData} />
            </>
          )}
        </div>}
        </>
      )}
    </>
  );
};

export default AutoSuggest;
