import React from "react";
import { Card } from "react-bootstrap";
import { CompensationTypeKeys } from "types/coverageplan";
import "./style.scss";
import Car from "assets/QuoteAndBuy/car.svg";
import ThemeButton from "components/ThemeComponents/ThemeButton";
import GroupIcon from "@mui/icons-material/Group";
import { LanguageData } from "types/languageData";
import RepairType from "Motor/QuoteAndBuy/SelectRepairType";
import SumInsuredAndDeductibles from "Motor/QuoteAndBuy/SumInsuredAndDeductibles";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import {
  autoSuggestFinalVal,
  compensationTypeCardComprehensiveFinalVal,
} from "Motor/QuoteAndBuy/CoveragePlan/CommonFunction/CommonFunction";
import { IComprehensive, IThirdParty } from "Motor/QuoteAndBuy/CoveragePlan/ConstantValue/ConstantValue";
import { getAmountText } from "@dpm/shared-module";

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
    comprehensiveCardPrice,
  } = useQuoteAndBuyContext();

  const minFinalPrice = compensationTypeCardComprehensiveFinalVal(
    compWorkShop,
    compAgency,
    compMath
  );

  const autoSuggestVal: number = autoSuggestFinalVal(
    minFinalPrice,
    comp3rdParty?.pricingOptions[0]?.finalAmount as number
  );

  const handleOnChange = (title: string) => {
    onChange(title);
    setSelectedBenefits([]);
  };


  return (
    <>
      {coveragePlanSelected === IThirdParty && (
        <Card className="autosuggest-card">
          <Card.Body className="w-100">
            <div className="d-flex align-items-center">
              <div className="autosuggest-icn-container">
                <img src={Car} alt="auto-suggest-icn" />
              </div>
              <div className="ps-3 d-flex flex-column">
                <div>
                  {languageData?.with_additional} {languageData?.sar}{" "}
                  {autoSuggestVal?.toFixed()}{" "}
                  {languageData?.you_can_get_better_coverag}
                </div>
                <div>
                  <span className="walaa-medium-500">
                    {languageData?.comprehensive} -{" "}
                    {languageData?.workshop_repair}
                  </span>
                  <span className="walaa-regular-400 px-3">
                    {languageData?.sar}&nbsp;
                    <span className="walaa-semibold-600">
                      + {getAmountText(autoSuggestFinalVal(comprehensiveCardPrice as number, comp3rdParty?.pricingOptions[0]?.finalAmount as number))}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </Card.Body>
          <Card.Footer className="autosuggest-card-footer">
            <div className="d-flex align-items-center ps-5 ms-1">
              <div>
                <GroupIcon />
              </div>
              <div className="ps-2 pe-4 walaa-regular-400">
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

      {(coveragePlanSelected === IComprehensive || coveragePlanSelected === "comprehensive" || coveragePlanSelected === "buildingcontents" || coveragePlanSelected === "contents") && (
        <>{languageData && <div className="comprehensive-content">
          {/* <div className="col d-flex align-items-center justify-content-end">
            <CompareBenefitsValues languageData={languageData} coveragePlanSelected={coveragePlanSelected} />
          </div> */}
          <RepairType languageData={languageData} coveragePlanSelected={coveragePlanSelected} />
          {repairTypeSelected && coveragePlanSelected === "comprehensive" && (
            <>
              <hr />
              <SumInsuredAndDeductibles languageData={languageData}/>
            </>
          )}
        </div>}
        </>
      )}
    </>
  );
};

export default AutoSuggest;
