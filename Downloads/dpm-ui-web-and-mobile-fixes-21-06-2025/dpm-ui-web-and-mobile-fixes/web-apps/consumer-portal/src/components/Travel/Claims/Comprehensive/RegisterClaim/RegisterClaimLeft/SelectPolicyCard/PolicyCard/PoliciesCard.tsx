import travelIcon from "assets/Dashboard/Travel-icon.svg";
import { formatDate } from "utils/formatDate";
import { NA } from "constant";
import { PolicyDetail } from "types/Dashboard";
import style from "./PoliciesCard.module.scss";
import { LanguageData } from "types/languageData";

const PoliciesCard = ({
  policy,
  isSelected,
  onClick,
  languageData,
}: {
  policy: PolicyDetail;
  isSelected: boolean;
  onClick?: (policyNumber: string) => void;
  languageData: {
    consumer: LanguageData;
    product: LanguageData;
  };
}) => {
  const handleCardClick = () => {
    onClick?.(policy.policyNo);
  };

  return (
    <div
      data-testid="policies-register-claim-card-container"
      className={`${style["policies-register-claim-card-container"]} ${
        isSelected ? style.selected : ""
      }`}
      onClick={handleCardClick}
    >
      <div className={style["card-policy"]}>
        <div className={style["card-policy-container"]}>
          <div className={style["logo-policy"]}>
            <div className={style["product-policy"]}>
              <div
                className={`${style["policy-number-label"]} ${style["walaa-regular-400"]}`}
              >
                {languageData?.product.policy_number}
              </div>
              <div className={`${style["policy-number"]} ${style["walaa-medium-500"]}`}>
                {policy.policyNo}
              </div>
            </div>
            <div
              className={`${style["product-logo"]} ${
                isSelected ? style["product-logo-selected"] : ""
              }`}
            >
              <img src={travelIcon} alt="product-logo" />
            </div>
          </div>
          <div className={style["policy-period"]}>
            <div className={style["label-value"]}>
              <div
                className={`${style["label"]} ${style["label-bg"]} ${style["walaa-regular-400"]}`}
              >
                {`${policy.coverageType ?? languageData?.consumer.not_applicable} - ${policy.travellerType ?? languageData?.consumer.not_applicable}`}
              </div>
            </div>
          </div>
          <div className={style["policy-period"]}>
            <div className={style["label-value"]}>
              <div className={`${style["label"]} ${style["walaa-regular-400"]}`}>
                {languageData?.product.policy_period}
              </div>
              <div className={`${style["value"]} ${style["walaa-medium-500"]}`}>
                {policy.effectiveDate ? formatDate(policy.effectiveDate) : NA} -{" "}
                {policy.expiryDate ? formatDate(policy.expiryDate) : NA}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliciesCard;
