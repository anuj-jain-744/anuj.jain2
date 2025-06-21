import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import "./style.scss";
import { useEffect } from "react";
import data from "./../../../SumInsuredAndDeductibles/SumInsuredAndDeductibles.json"
import ThemeAlert from "components/ThemeAlert";
import { LanguageData } from "types/languageData";
import { getAmountWithIcon } from "@app-shell/utils/common";

interface SumInsuredDeductibleProps {
  languageData: LanguageData | undefined | null;
}

const SumInsuredDeductibleCard: React.FC<SumInsuredDeductibleProps> = ({ languageData }) => {
  const { sliderValueDeductibles, sliderValueSumInsured, viewPolicyData, isRenewpolicy } =
    useQuoteAndBuyContext();

  useEffect(() => { }, [sliderValueDeductibles, sliderValueSumInsured]);

  const formatDate = (dateString: string): string => {
    // Extract the date part before 'T00'
    const datePart = dateString ? dateString.split('T')[0] : '';

    // Parse the date string
    const date = new Date(datePart);

    // Format the date as 'DD-MM-YYYY'
    return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
  };

  const dateString = viewPolicyData?.policyBasic?.expiryDate;

  const formattedDate = formatDate(dateString);

  return (
    <div className="sum-insured-deductible-card">
      {isRenewpolicy && (
        <div className="d-flex align-items-center justify-content-between">
          <div className="ps-2 d-flex flex-column">
            <div className="existing-policy walaa-regular-400">
              {languageData?.existing_policy_no}
            </div>
            <div className="walaa-medium-500 existing-policy-val">
              {viewPolicyData?.policyBasic?.policyNumber}
            </div>
          </div>

          <div className="policystart-icn-container">
            <ThemeAlert
              variant="danger"
              title={
                `${languageData?.policy_expiring_on}` +
                ` ` +
                `${formattedDate}`
              }
              classes="alert-danger walaa-regular-400 alert-text"
            />
          </div>

        </div>
      )}

      <div className="d-flex align-items-center">
        <div className="left">
          <div className="card-head walaa-regular-400">{data.sum_insured}</div>
          <div className="card-value walaa-medium-500">
            {getAmountWithIcon(sliderValueSumInsured)}
          </div>
        </div>
        <div className="horizontal-line">
          <hr />
        </div>
        <div className="right">
          <div className="card-head walaa-regular-400">{data.deductible}</div>
          <div className="card-value walaa-medium-500">
            {getAmountWithIcon(sliderValueDeductibles)}
          </div>
        </div>
      </div>

    </div>
  );
};

export default SumInsuredDeductibleCard;
