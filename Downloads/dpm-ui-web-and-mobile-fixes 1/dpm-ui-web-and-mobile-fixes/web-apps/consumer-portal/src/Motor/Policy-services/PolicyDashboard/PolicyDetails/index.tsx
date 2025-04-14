import React from "react";
import styles from "./PolicyDetails.module.scss";

import product from "assets/PolicyDetails/product.svg";
import Travel_Logo from "assets/Dashboard/Travel_MyRequest.svg"
import Home_logo from "assets/Dashboard/Home.svg"
import vectorIcon from "assets/PolicyDetails/vector.svg";
import { LanguageData } from "types/languageData";
import { PolicyDetails, PlanDetails } from "types/policyDetails";
import { getRemainingDays } from "utils/policyDetails";
import { formatDate, convertToDateString } from "utils/formatDate";
import { QuickLinks } from "./QuickLinks";
import RenewalBanner from "./RenewalBanner";
import { getPriceFormat } from "utils/getPriceFormat";
import { subtractDates } from "utils/subtractDates";
import { RenewPolicyAlert } from "Motor/QuoteAndBuy/CoveragePlan/ConstantValue/ConstantValue";
import { MOTOR, TRAVEL, HOME, MOTOR_COMP } from "constant";
import { getPlanName } from "utils/policyDetails";
import {  getNoOfTravellers } from "utils/getCoverageDetails";

interface PolicyDetailProps {
  policyDetails: PolicyDetails | undefined | null;
  policyData: PlanDetails;
  languageData: LanguageData | undefined | null;
  navigateTo?: (url: string) => void;
  policyInfo: { policyNo: string, endorsementNo: string, productCode: string };
  policyLob: PlanDetails
}

const PolicyDetailsPage: React.FC<PolicyDetailProps> = ({
  policyDetails,
  policyData,
  languageData,
  navigateTo,
  policyInfo,
  policyLob,
}) => {
  const daysToExpiry = getRemainingDays(policyDetails?.expiryDate ?? "");
  const { policyNo, startDate, expiryDate, idv, prodCode } =
    policyDetails ?? {
      policyNo: null,
      startDate: null,
      expiryDate: null,
      idv: null,
      prodCode: null,
    };
  const formatedStartDate = startDate && formatDate(startDate);
  const formatedExpiryDate = expiryDate && formatDate(expiryDate);
  const today = new Date();
  const differenceInDays = subtractDates(formatedExpiryDate, formatDate(today.toISOString()));
  const stringDate = expiryDate && convertToDateString(expiryDate);
  const renewMessage = `${languageData?.your_policy_is_set_to_exp?.replace(/\.$/, '')} ${daysToExpiry} days (on ${stringDate}). ${languageData?.please_take_action_to_ensu}.`;
  const highlightCancelPolicy = differenceInDays <= 0;
  const coverageName = getPlanName(policyData);
  const numOfTravellers = getNoOfTravellers(policyLob);

  const getProductLogo = (productCode: string) => {
    switch (productCode) {
      case MOTOR_COMP:
      case MOTOR:
        return product;
      case HOME:
        return Home_logo;
      default:
        return Travel_Logo;
    }
  }
  return (
    <div className={styles.container}>
      <div className={styles.frame}>
        <div className={styles.titleContainer}>
          <div className={styles.titleFrame}>
            <h2 className={styles.title}>{languageData?.policy_details}</h2>
          </div>
          <img src={vectorIcon} alt="vector icon" className={styles.vector} />
        </div>
        <div className={styles.contents}>
          <div className={styles.contentsFrame}>
            <div className={styles.detailsContainer}>
              <div className={styles.row}>
                <div className={styles.rowTitle}>
                  <div className={styles.productInfo}>
                    <img
                      src={getProductLogo(policyInfo?.productCode)}
                      alt="product icon"
                      className={styles.icon}
                    />
                    <div className={styles.productText}>
                      <div className={styles.label}>
                        {languageData?.policy_no}
                      </div>
                      <div className={styles.value}>{policyNo}</div>
                    </div>
                  </div>
                  <div className={styles.type}>{coverageName}</div>
                </div>
              </div>
              <div className={styles.row}>
                <DetailField
                  label={languageData?.start_date}
                  value={formatedStartDate}
                />
                <div className={styles.line} />
                <DetailField
                  label={languageData?.expiry_date}
                  value={formatedExpiryDate}
                />
                {policyInfo?.productCode === MOTOR &&
                  <>
                    <div className={styles.line} />
                    <DetailField
                      label={languageData?.sum_insured}
                      value={idv ? `${languageData?.sar} ${getPriceFormat(parseInt(idv!))}` : languageData?.not_available}
                    />
                  </>}
                {(policyInfo?.productCode === TRAVEL || policyInfo?.productCode === HOME) &&
                  <>
                    <div className={styles.line} />
                    <DetailField
                      label={languageData?.premium_amount}
                      value={`${languageData?.sar} ${policyData?.policyPremiumAndBenefits?.premiumDue?.toFixed(2)}`}
                    />
                    <div className={styles.line} />
                    <DetailField
                      label={languageData?.noOfTravellers}
                      value={numOfTravellers}
                    />
                  </>}
              </div>
            </div>
          </div>
        </div>
        <QuickLinks navigateTo={navigateTo} policyInfo={policyInfo} highlightCancelPolicy={highlightCancelPolicy} productCode={prodCode} />
      </div>
      {(daysToExpiry <= RenewPolicyAlert) && <RenewalBanner message={renewMessage} languageData={languageData} />}
    </div>
  );
};

interface DetailFieldProps {
  label: string | undefined | null;
  value: string | undefined | null;
}

const DetailField: React.FC<DetailFieldProps> = ({ label, value }) => (
  <div className={styles.detailField}>
    <div className={styles.label}>{label}</div>
    <div className={styles.value}>{value}</div>
  </div>
);

export default PolicyDetailsPage;
