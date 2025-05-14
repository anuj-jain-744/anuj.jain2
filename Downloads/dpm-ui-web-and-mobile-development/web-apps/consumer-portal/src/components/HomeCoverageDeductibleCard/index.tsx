import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { LanguageData } from "types/languageData";
import "./style.scss";
import { getCurrencySymbol } from "@app-shell/utils/common";

interface HomeCoverageDeductibleCardProps {
  languageData: LanguageData | null | undefined;
}

const HomeCoverageDeductibleCard: React.FC<HomeCoverageDeductibleCardProps> = ({languageData}) => {
  const { coverageType, repairTypeSelected } =
    useQuoteAndBuyContext();
  const coverageValue = repairTypeSelected ? repairTypeSelected.replace(/\s+/g, '').toLowerCase() : null;
  const houseDetail = (coverageType && languageData && languageData[coverageType][0]) || [];
  const houseDetailValue = houseDetail[coverageValue] || [];

  return (
    <div className="renewal-policy-wrapper">
      <div className="policy-number-benefits">
        <div className="left-box">
          <div className="label">{getCurrencySymbol(houseDetail?.benefits[0])}</div>
          <div className="heading">{houseDetailValue ? houseDetailValue[0] : ""}</div>
        </div>
        <div className="right-box">
          <div className="label">{houseDetail?.benefits[1]}</div>
          <div className="content">{houseDetailValue ? getCurrencySymbol(houseDetailValue[1]) : ""}</div>
        </div>
      </div>
    </div>
  );
};

export default HomeCoverageDeductibleCard;
