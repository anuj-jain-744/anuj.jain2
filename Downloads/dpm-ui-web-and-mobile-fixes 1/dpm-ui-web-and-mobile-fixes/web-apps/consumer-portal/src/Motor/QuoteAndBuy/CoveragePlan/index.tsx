import React, { useEffect, useState } from "react";
import CoveragePlanLeft from "./CoveragePlanLeft";
import { LanguageData } from "types/languageData";
import { resetCoverageCodePayload } from "utils/quoteAndBuy";
import { calculatePremium } from "Home/QuoteAndBuy/utils/calculatePremium";
import { CompensationTypeKeys, ICoveragePlanData } from "types/coverageplan";
import { compensationTypeCard } from "./CommonFunction/CommonFunction";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";
import { coverage_plan_for_renew, IComprehensive, IThirdParty, Contents } from "./ConstantValue/ConstantValue";
// commenting this code as real renewal link structure not provided by client
// import { encryptAES, decryptAES } from "@dpm/shared-module";

interface ICoveragePlanProps {
  languageData: LanguageData | undefined | null;
  isRepairTypeChecked?: boolean;
}

const CoveragePlan: React.FC<ICoveragePlanProps> = ({ languageData }) => {
  //mock data for coverage plan card data from cms typecasting to ICoveragePlanData
  const { setRepairTypeSelected, coverageType, setCoverageType, repairTypeSelected, requestPayload, updateRequestPayload, homePremiumResponse } = useQuoteAndBuyContext();
  const isHome = homePremiumResponse && Object.keys(homePremiumResponse).length > 0;
  const { formAddressSelection } = usePHQuoteBuyContext();
  let coveragePlanData = isHome ? languageData?.coverage_plan : languageData?.comprehensive_third_party
  const propertyType = Number(formAddressSelection?.propertyType?.activeIndex);
  if (isHome && propertyType === 1) { // home use case of rental house property type
    coveragePlanData = languageData?.coverage_plan.filter((item) => item.key === Contents);
  }
  const Coverageplandata: ICoveragePlanData[] =
    coveragePlanData as unknown as ICoveragePlanData[];
  //coverage plan selected card state
  const [isRepairTypeChecked, setIsRepairTypeChecked] = useState(false);

  //confirmation alert whether user wants to really switch coverage plan
  const [isCoverageTypeDowngrading, setCoverageTypeDowngrading] =
    useState(false);

  //use context api hook
  //change handler return for select coverage plan
  const onchangeHandlerCoveragePlanType = (title: string) => {
    // call common fn that returns which banner card selected
    const res = compensationTypeCard(
      title?.split(" ")?.join("")?.toLocaleLowerCase() as CompensationTypeKeys
    );
    const coverageType = res?.toLocaleLowerCase() as CompensationTypeKeys;

    if (isHome) {
      setRepairTypeSelected(null);
      const updatedPayload = resetCoverageCodePayload(requestPayload, languageData?.defaultCoverageCode);
      updateRequestPayload(updatedPayload);
    }

    setCoverageType(coverageType as CompensationTypeKeys);
  };

  // commenting this code as real renewal link structure not provided by client
  // encrypt - decrypt
  // const secretkey = "123";
  // const urlis = encryptAES(
  //   "https://wallaqq.com/Motor/QuoteAndBuy/renew/?nationalid=345252&&dob=11/2006&&mobnum=0547280221",
  //   secretkey
  // );
  // console.log("encryptedis==>   ", urlis);
  // const decrypt = decryptAES(urlis, secretkey);
  // console.log("decryptedis==>   ", decrypt);

  const handleRepairTypeChecked = (checked: boolean) => {
    setIsRepairTypeChecked(repairTypeSelected);
  };

  useEffect(() => {
    // set as default plan which is higher coverage rate for owned house property type
    if (isHome) {
      if (propertyType === 0) {
        const homeCoveragePlans: [] = languageData?.coverage_plan.map((item) => (item.key));
        let maxPricePlans = {};
        homeCoveragePlans.forEach((item) => {
          const coverageType = Object.keys(languageData[item][0]);
          const premiumResponse: Record<string, any> = {
            [coverageType[1]]: homePremiumResponse[coverageType[1]],
            [coverageType[2]]: homePremiumResponse[coverageType[2]]
          };
          const prices = calculatePremium(premiumResponse);
          maxPricePlans[item] = prices.maxFinalPrice;
        })
        const maxPlan = Object.keys(maxPricePlans).reduce((a, b) => maxPricePlans[a] > maxPricePlans[b] ? a : b);
        setCoverageType(maxPlan);
      }
      else {
        setCoverageType(Contents);
      }
    }
  }, [])

  useEffect(() => {
    // updating use context for selected coverage type
    if (coverageType) {
      setCoverageType(coverageType);
      if (coverageType === IThirdParty) {
        setRepairTypeSelected(null);
        //show alert for confirmation whether user wants to really switch coverage plan only for renew
        if (coverage_plan_for_renew) {
          setCoverageTypeDowngrading(true);
        }
      }
    }
  }, [setRepairTypeSelected, coverageType]);

  // renew downgrade modal dialog handler
  const onclickHandlerRenewDowngrade = async (val: string) => {
    switch (val) {
      case "close":
      case "cancel":
        // set coverage type to comprehensive only
        setCoverageType(IComprehensive as CompensationTypeKeys);
        // to set modal dialog to close state
        setCoverageTypeDowngrading(false);
        break;
      case "switch":
        // set coverage type to thirdparty
        setCoverageType(IThirdParty as CompensationTypeKeys);
        // to set modal dialog to close state
        setCoverageTypeDowngrading(false);
        break;
    }
  };
  return (
    <div data-testid="CoveragePlan-test">
      {/* for left content */}
      <CoveragePlanLeft
        languageData={languageData}
        coveragePlanData={Coverageplandata}
        onChange={onchangeHandlerCoveragePlanType}
        //selected card
        coveragePlanSelected={coverageType}
        isRepairTypeChecked={repairTypeSelected}
        onRepairTypeChecked={handleRepairTypeChecked}
        //for renew coverage type downgrade alert
        isCoverageTypeDowngrading={isCoverageTypeDowngrading}
        clickHandlerRenewDowngrade={onclickHandlerRenewDowngrade}
      />
    </div>
  );
};

export default CoveragePlan;
