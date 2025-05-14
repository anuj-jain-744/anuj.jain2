import React from "react";
import styles from "./PolicyDetails.module.scss";
import MotorLogo from "assets/Dashboard/Motor_Logo.svg";
import TravelLogo from "assets/Dashboard/Travel-icon.svg";
import Home from "assets/Dashboard/Home.svg";
import vectorIcon from "assets/PolicyDetails/vector.svg";
import Union from "assets/Dashboard/Union.svg";
import { LanguageData } from "types/languageData";
import { PolicyDetails, PlanDetails } from "types/policyDetails";
import { getRemainingDays } from "utils/policyDetails";
import { formatDate, convertToDateString } from "utils/formatDate";
import { QuickLinks } from "./QuickLinks";
import RenewalBanner from "./RenewalBanner";
import { subtractDates } from "utils/subtractDates";
import { RenewPolicyAlert } from "Motor/QuoteAndBuy/CoveragePlan/ConstantValue/ConstantValue";
import { MOTOR, TRAVEL, HOME, MOTOR_COMP, NA, TRAVEL_TYPE, OWNER_OR_TENANT, TRAVEL_POLICY_TYPE, Home_POLICY_TYPE } from "constant";
import { getPlanName } from "utils/policyDetails";
import {  getNoOfTravellers } from "utils/getCoverageDetails";
import PolicySelector from "../PolicySelector";
import ShareButton from "components/ShareButton";
import { getPlateNumber } from "utils/getPlateNumber";
import Bullet from "assets/Dashboard/Bullet.svg";
import ClaimCard from "./ClaimCard";
import { RootState } from "@dpm/shared-module";
import { useSelector } from "react-redux";
import { ClaimDetails } from "types/Dashboard";
import { useQueryClaim } from "hook/dashboard/myRequests/useQueryClaim";

interface PolicyDetailProps {
  policyDetails: PolicyDetails | undefined | null;
  policyData: PolicyDetails | undefined | null;
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

  const {planDetails, policyPremiumAndBenefits, vehicleDetails, policyHolderDetails} = policyData ?? {};
  const {deductibleAmount, plateNo, plateNoText1, plateNoText2, plateNoText3, repairCondition} = planDetails?.policyRisk[0] ?? {};
  const {buildingNumber, city, countryInArabic, district, postCode} = policyHolderDetails?.address ?? {};

  const formatedStartDate = startDate && formatDate(startDate);
  const formatedExpiryDate = expiryDate && formatDate(expiryDate);
  const today = new Date();
  const differenceInDays = subtractDates(formatedExpiryDate, formatDate(today.toISOString()));
  const stringDate = expiryDate && convertToDateString(expiryDate);
  const renewMessage = `${languageData?.your_policy_is_set_to_exp?.replace(/\.$/, '')} ${daysToExpiry} days (on ${stringDate}). ${languageData?.please_take_action_to_ensu}.`;
  const highlightCancelPolicy = differenceInDays <= 0;
  const coverageName = getPlanName(policyData);
  const numOfTravellers = getNoOfTravellers(policyLob);

  const userId = useSelector((state: RootState) => state.auth?.userInfo?.userId);

  const {
    data: queryClaimData,
  } = useQueryClaim({ idNumber: userId, policyNo: policyNo });

  const getProductLogo = (productCode: string) => {
    switch (productCode) {
      case MOTOR_COMP:
      case MOTOR:
        return MotorLogo;
      case HOME:
        return Home;
      default:
        return TravelLogo;
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.frame}>
        <div className={styles.titleContainer}>
          <div className={styles.titleFrame}>
            <h2 className={styles.title}>{languageData?.policy_details}</h2>
            <PolicySelector selectedPolicyInfo={policyInfo} navigateTo={navigateTo}/>
          </div>
          <img src={vectorIcon} alt="vector icon" className={styles.vector} />
        </div>
        <div className={styles.contents}>
          <div className={styles.contentsFrame}>
            <div className={styles.union}><img src={Union}/></div>
            <div className={styles.detailsContainer}>
              <div className={styles.row}>
                <div className={styles.rowTitle}>
                  <div className={styles.productInfo}>
                    <img
                      src={getProductLogo(policyInfo?.productCode)}
                      alt="product icon"
                    />
                    <div className={styles.productText}>
                      <div className={styles.policyNumberLabel}>
                        {languageData?.policy_no}
                      </div>
                      <div className={styles.policyNumberValue}>{policyNo}</div>
                    </div>
                  </div>

                  <div className={styles.statusLabel}>
                    <div className={styles.cmpRepairType}>
                      {policyInfo?.productCode === TRAVEL
                        ? TRAVEL_POLICY_TYPE[
                            Number(planDetails?.typeOfCoverage)
                          ]
                        : policyInfo?.productCode === HOME
                        ? Home_POLICY_TYPE[Number(planDetails?.typeOfCoverage)]
                        : coverageName}
                    </div>
                    {policyInfo?.productCode === MOTOR_COMP && (
                      <>
                        <div>
                          <img src={Bullet} />
                        </div>
                        <div className={styles.cmpRepairType}>
                          {repairCondition || NA}
                        </div>
                      </>
                    )}
                  </div>

                  <div>
                    <ShareButton
                      showIcon={true}
                      paymentLanguageData={languageData ?? ({} as LanguageData)}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.row}>
                <hr className={styles.horizontalLine} />
              </div>

              <div className={styles.row}>
                <DetailField
                  label={languageData?.policy_period}
                  value={`${formatedStartDate} - ${formatedExpiryDate}`}
                />
                <DetailField
                  label={languageData?.premium_amount}
                  value={
                    policyPremiumAndBenefits
                      ? `${
                          languageData?.sar
                        } ${policyPremiumAndBenefits?.premiumAmount?.toFixed(
                          2
                        )}`
                      : languageData?.not_available
                  }
                />

                {policyInfo?.productCode === HOME && (
                  <>
                    <DetailField
                      label={languageData?.property_type}
                      value={
                        planDetails?.ownerOrTenant
                          ? OWNER_OR_TENANT[Number(planDetails?.ownerOrTenant)]
                          : ""
                      }
                    />
                  </>
                )}
              </div>

              <div className={styles.row}>
                {(policyInfo?.productCode === MOTOR ||
                  policyInfo?.productCode === MOTOR_COMP) && (
                  <>
                    <DetailField
                      label={vehicleDetails[0]?.vehicleMakeText}
                      value={
                        vehicleDetails
                          ? getPlateNumber({
                              plateNo,
                              plateNoText1,
                              plateNoText2,
                              plateNoText3,
                            })
                          : languageData?.not_available
                      }
                    />
                    <DetailField
                      label={languageData?.sum_insured}
                      value={
                        policyPremiumAndBenefits?.sumInsured
                          ? `${
                              languageData?.sar
                            } ${Number(policyPremiumAndBenefits?.sumInsured)?.toFixed(
                              2
                            )}`
                          : languageData?.not_available
                      }
                    />
                    <DetailField
                      label={languageData?.deductibles}
                      value={
                        policyPremiumAndBenefits
                          ? `${languageData?.sar} ${deductibleAmount?.toFixed(
                              2
                            )}`
                          : languageData?.not_available
                      }
                    />
                  </>
                )}

                {policyInfo?.productCode === HOME && (
                  <>
                    <DetailField
                      label={languageData?.property_address}
                      value={ `${buildingNumber} ${city} ${postCode} ${district} ${countryInArabic}`}
                    />
                    <DetailField
                      label={languageData?.sum_insured}
                      value={languageData?.sum_insured_home_amount}
                    />
                    <DetailField
                      label={languageData?.deductibles}
                      value={`${languageData?.content}: ${languageData?.home_content_deductible} 
                      ${languageData?.property}: ${languageData?.home_property_deductible}`}
                    />
                  </>
                )}

                {policyInfo?.productCode === TRAVEL && (
                  <>
                    <DetailField
                      label={languageData?.traveler_type}
                      value={
                        planDetails?.familyIndividual
                          ? TRAVEL_TYPE[Number(planDetails?.familyIndividual)]
                          : ""
                      }
                    />
                    <div className={styles.line} />
                    <DetailField
                      label={languageData?.noOfTravellers}
                      value={numOfTravellers.toString()}
                    />
                  </>
                )}
              </div>

              {policyInfo?.productCode === TRAVEL && (
                <div className={styles.row}>
                  <DetailField
                    label={languageData?.Travel_start_date}
                    value={formatedStartDate}
                  />
                  <DetailField
                    label={languageData?.travel_end_date}
                    value={formatedExpiryDate}
                  />
                  <DetailField
                    label={languageData?.travel_period}
                    value={languageData?.upto_travel_days?.replace(
                      /{{travel}}/g,
                      planDetails?.travelDuration
                    )}
                  />
                </div>
              )}
            </div>
            {daysToExpiry <= RenewPolicyAlert && (
              <RenewalBanner
                message={renewMessage}
                languageData={languageData}
              />
            )}
          </div>
        </div>
        <QuickLinks
          navigateTo={navigateTo}
          policyInfo={policyInfo}
          highlightCancelPolicy={highlightCancelPolicy}
          languageData={languageData as LanguageData}
        />
        {queryClaimData && 
        queryClaimData?.data?.claimList?.map((claim: ClaimDetails) => (
        <ClaimCard
          key={claim.claimNo}
          navigateTo={navigateTo}
          policyInfo={policyInfo}
          claimNumber={claim.claimNo}
          claimInfo={claim}
          claimStatus={claim.subClaimStatus}
          languageData={languageData}
        />
      ))}
      </div>
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
