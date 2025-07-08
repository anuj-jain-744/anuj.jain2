import React, { useEffect, useState } from "react";
import Line from "assets/SuccessPage/Line_new.svg";
import { useApiCall, useCommonContext } from "@dpm/shared-module";
import "./style.scss";
import { LanguageData } from "types/languageData";
import Home from "assets/Home/home-icon.svg";
import { HOME_COVERAGE_PLANS_TYPES, commonKeywords } from "constant";
import { displayHouseAddress } from "utils/quoteAndBuy";
import { getCurrencySymbol } from "@app-shell/utils/common";

interface HomeInfoSuccessProps {
  policyData: {
    planDetails: {
      planCode: string,
      policyRisk: Array<{
        areaLocalityEn: string
      }>
    }
  },
  languageData: LanguageData
}

const HomeInfoSuccess: React.FC<HomeInfoSuccessProps> = ({
  policyData,
}) => {
  const { currentLanguage } = useCommonContext();
  const { ar } = commonKeywords;
  const [languageData, setLanguageData] = useState<LanguageData | null>(null);
  const [houseDetailValue, setHouseDetailValue] = useState<string | null>(null);
  const address = policyData?.planDetails?.policyRisk[0];
  // language data api call
  const { makeApiCall, data: cmsData } = useApiCall<
    {
      config: LanguageData;
    },
    unknown
  >(1, "home-config", "get");

  const fetchData = async () => {
    await makeApiCall();
  };

  useEffect(() => {
    fetchData();
  }, [])


  useEffect(() => {
    if (cmsData && Object.keys(cmsData?.config).length > 0) {
      setLanguageData(cmsData?.config);
    }
  }, [cmsData]);

  useEffect(() => {
    if (policyData?.planDetails?.planCode && languageData) {
      const coverageValue = policyData.planDetails.planCode.replace(/\s+/g, '').toLowerCase();
      const planKey = HOME_COVERAGE_PLANS_TYPES[coverageValue];

      //safe check before accessing [0]
      if (planKey && languageData[planKey] && Array.isArray(languageData[planKey]) && languageData[planKey].length > 0) {
        const houseDetail = languageData[planKey][0];
        const value = houseDetail ? houseDetail[coverageValue] : null;
        setHouseDetailValue(value);
      } else {
        setHouseDetailValue(null); // clear value if not found
      }
    }
  }, [policyData, languageData]);


  return <div className="home-card-for-home-section">
    <div className="body-content-for-home-section">
      <div className="top-table">
        <div className="box">
          <div className="box-address">
            <div className="logo"><img src={Home} /></div>
            <div>
              <div>{languageData?.property}1</div>
              <div className="walaa-medium-500">{displayHouseAddress(address, currentLanguage, ar)}</div>
            </div>
          </div>
          <hr className="horizontal-line" />
          <div className="box-content">
            <div className="package-content">
              <div className="package-heading">
                {languageData?.coverage}
              </div>
              <div className="package-value walaa-medium-500">
                {policyData?.planDetails?.planCode}
              </div>
            </div>
            <div>
              <img src={Line} alt="" />
            </div>
            <div className="package-content-2">
              <div className="package-heading">
                {languageData?.sum_insured}
              </div>
              <div className="package-value walaa-medium-500">
                {houseDetailValue ? getCurrencySymbol(houseDetailValue[1]) : ""}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
};

export default HomeInfoSuccess;
