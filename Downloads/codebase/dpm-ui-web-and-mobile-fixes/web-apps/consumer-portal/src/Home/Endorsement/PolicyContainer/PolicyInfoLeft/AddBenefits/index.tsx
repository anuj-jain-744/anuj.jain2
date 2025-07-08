import { FC } from "react";
import Home_Benefit_Icon from "assets/Home/home_benefits.png";
import { LanguageData } from "types/languageData";
import ThemeButton from "components/ThemeButton/ThemeButton";
import { Chargeable } from "constant";
import { LoaderOverlay } from "components/OTPValidation";
import { PolicyInterestUpdate, ViewPolicy } from "types/endorsement";
import { getAmountWithIcon } from "@app-shell/utils/common";

interface PolicyCardProps {
  languageData: LanguageData;
  benefitsClaimed: PolicyInterestUpdate;
  viewPolicy: ViewPolicy;
  handleSelectAddBenefits: () => void;
  isBenefitLoaded: string | null;
}

const AddBenefits: FC<PolicyCardProps> = ({ viewPolicy, isBenefitLoaded, benefitsClaimed, languageData, handleSelectAddBenefits }) => {

  const getDescription = (code: string) => {
    const coverageBenefits = languageData?.additional_benefits_plan?.filter((item: { code: string }) => code === item?.code);
    return coverageBenefits[0]?.description ?? "";
  }

  // first, check the benefit has purchased or not for the policy which is selected and if not then will check in endorsement API is added
  const checkBenefitStatus = (code: string) => {
    const isBenefitAdded = benefitsClaimed?.findIndex((value: { coverageCode: string }) => value?.coverageCode === code);
    return {
      addedBenefit: isBenefitAdded
    }
  }

  const endorsementBenefits = [];
  const purchasedBenefits = viewPolicy?.policyLob[0]?.policyRisk[0]?.policyCoverage || [];
  const coverageBenefits = languageData?.coverage_beneits;
  // filter out the benefits which are not purchased yet
  if (Array.isArray(coverageBenefits) && coverageBenefits.length > 0) { // check if coverageBenefits is an array and has items
    for (const item of coverageBenefits) {
      let isPurchased = false;
      for (const subItem of purchasedBenefits) {
        if (Number(subItem?.premiumInfo?.finalPremium) > 0 && subItem?.benefitCategory === Chargeable && subItem?.coverageCode === item.coverageCode) {
          isPurchased = true
        }
      }
      if (!isPurchased) {
        endorsementBenefits.push(item);
      }
    }
  }

  return (
    <div className="policy-claim-container">
      <div className="select-policy-header walaa-medium-500">
        {languageData?.add_benefits}
      </div>
      <hr className="horizontal-line" />
      <div className="benefits-box-container">
        {endorsementBenefits.length === 0 && <div className="walaa-regular-400">{languageData?.no_benefits_endorsement}</div>}
        {endorsementBenefits?.map((item, index) => {
          // most purchased benefits identification
          const mostPurchased = languageData?.home_additional_benefits?.findIndex((value: { key: string, mostpurchased: number }) => value?.key === item?.coverageCode && value?.mostpurchased)
          const benefitOf = checkBenefitStatus(item?.coverageCode);
          return (<div key={"endorsement_benifit_"+index} className={`small-card${benefitOf.addedBenefit !== -1 ? '-selected' : ''}`}>
            {mostPurchased >= 0 ? <div className="most-frequently">{languageData?.most_frequently_purchased}</div> : ''}
            <div className="card-headerr">
              <div className="card-header-content">
                <img src={Home_Benefit_Icon} alt="Benefit Icon" />
                <div className="card-title-content walaa-medium-500">{item?.coverageName}</div>
              </div>
              <div className="card-description walaa-regular-400">
                {getDescription(item?.coverageCode)}
              </div>
            </div>
            <hr className="horizontal-line-card" />
            <div className="card-footerr">
              <div className="price walaa-medium-500">{getAmountWithIcon(Number(item?.annualPremium))}</div>
              <div>
                {/* updated order summary panel by add or remove benefits loading notification  */}
                {isBenefitLoaded && isBenefitLoaded === item?.coverageCode && <LoaderOverlay />}
                <ThemeButton
                  title={benefitOf.addedBenefit !== -1 ? languageData?.remove : languageData?.add_label}
                  isDisabled={false}
                  classes={`${benefitOf.addedBenefit !== -1 ? "remove-btn" : "add-btn"} walaa-medium-500`}
                  variant="outline"
                  onClickhandler={handleSelectAddBenefits(item?.coverageCode)}
                />
              </div>
            </div>
          </div>
          )
        })}
      </div>
    </div>
  );
};

export default AddBenefits;