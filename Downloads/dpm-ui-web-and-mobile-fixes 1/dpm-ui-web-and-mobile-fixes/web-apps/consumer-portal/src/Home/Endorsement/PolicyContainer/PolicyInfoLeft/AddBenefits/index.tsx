import React, { FC } from "react";
import Home_Benefit_Icon from "assets/Home/home_benefits.png";
import { LanguageData } from "types/languageData";
import { getAmountText } from "@dpm/shared-module";
import ThemeButton from "components/ThemeButton/ThemeButton";
import { Chargeable } from "constant";
import { LoaderOverlay } from "components/OTPValidation";
import { PolicyEndorsementDetails, PolicyInterestUpdate, ViewPolicy } from "types/endorsement";


interface PolicyCardProps {
  languageData: LanguageData;
  benefitsData: PolicyEndorsementDetails;
  benefitsClaimed: PolicyInterestUpdate;
  viewPolicy: ViewPolicy;
  handleSelectAddBenefits: () => void;
  isBenefitLoaded: string | null;
}

const AddBenefits: FC<PolicyCardProps> = ({ benefitsData, viewPolicy, isBenefitLoaded, benefitsClaimed, languageData, handleSelectAddBenefits }) => {

  const getDescription = (code: string) => {
    const coverageBenefits = languageData?.additional_benefits_plan?.filter((item) => code === item?.code);
    return coverageBenefits[0]?.description ?? "";
  }

  const checkBenefitOnPolicyOrder = (code: string) => {
    const isBenefitAdded = benefitsData?.filter((item) => (
      item?.premiumInfo?.finalPremium > 0 && item?.benefitCategory === Chargeable && item?.coverageCode === code
    ))
    return isBenefitAdded.length
  }

  const planCode = viewPolicy?.policyLob[0]?.planCode;

  return (
    <div className="policy-claim-container">
      <div className="select-policy-header walaa-medium-500">
        {languageData?.add_benefits}
      </div>
      <hr className="horizontal-line" />
      <div className="benefits-box-container">
        {languageData?.coverage_beneits?.map((item, index) => {
          // most purchased benefits identification
          const mostPurchased = languageData?.motor_additional_benefits?.findIndex((value: { key: string, mostpurchased: number, plan: string }) => value?.key === item?.coverageCode && value?.mostpurchased && value?.plan === planCode)
          const isBenefitAdded = benefitsClaimed?.findIndex((value) => (value?.policyRisk[0]?.policyCoverage[0]?.coverageCode === item?.coverageCode));
          return (<div key={index} className={`small-card${isBenefitAdded !== -1 ? '-selected' : ''}`}>
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
              <div className="price walaa-medium-500">{languageData?.sar} {getAmountText(item?.annualPremium)}</div>
              <div>
                {/* updated order summary panel by add or remove benefits loading notification  */}
                {isBenefitLoaded && isBenefitLoaded === item?.coverageCode && <LoaderOverlay />}
                <ThemeButton
                  title={isBenefitAdded !== -1 ? languageData?.remove : languageData?.add_label}
                  isDisabled={false}
                  classes={`${isBenefitAdded !== -1 ? "remove-btn" : "add-btn"} walaa-medium-500`}
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