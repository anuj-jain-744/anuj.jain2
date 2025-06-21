import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.scss";
import { convertYear, apiFormatDate } from "utils/formatDate";
import HousePropertyContent, { HousePropertyContentItem } from "./HousePropertyContent";
import HousePropertyLinks from "./HousePropertyLinks";
import HousePremiumDetails from "./HousePremiumDetails";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";
import { LanguageData } from "types/languageData";
import { DateObject } from "react-multi-date-picker";
import { useLocation } from "react-router-dom";
import { calculatePremium } from "Home/QuoteAndBuy/utils/calculatePremium";
import { getFormattedDate } from "Motor/QuoteAndBuy/CoveragePlan/CommonFunction/CommonFunction";
import { POLICY_EXPIRY_DAYS } from "constant";
import { getAmountText } from "@dpm/shared-module";

interface HousePropertyDetailsProps {
  languageData: LanguageData;
}

const HousePropertyDetails: React.FC<HousePropertyDetailsProps> = ({ languageData }) => {
  const [housePropertyData, setHousePropertyData] = useState<HousePropertyContentItem>([]);
  const [housePremiumDetail, setHousePremiumDetail] = useState<HousePropertyContentItem[]>([]);
  const [housePropertyAddressData, setHousePropertyAddressData] = useState(null);
  const {
    policyStartDate,
    repairTypeSelected,
    coverageType,
    homePremiumResponse
  } = useQuoteAndBuyContext();

  const location = useLocation();
  const propsData = location?.state?.data;

  const { formAddressSelection } = usePHQuoteBuyContext();
  const coverageValue = repairTypeSelected ? repairTypeSelected.replace(/\s+/g, '').toLowerCase() : null;
  const premiumPayload = homePremiumResponse[coverageValue];
  const calculateRequest: Record<string, any> = { [coverageValue]: homePremiumResponse[coverageValue] };
  const priceData = calculatePremium(calculateRequest);
  const propertyId = formAddressSelection.propertyNo > "0" && Number(formAddressSelection.propertyNo)-1 || "0";

  useEffect(() => {
    if (languageData && premiumPayload) {
      const address = propsData?.addressData?.addresses[propertyId] || [];
      const formOption = languageData.property_form_values_string.type_form.option;
      const houseDetail = coverageType && languageData[coverageType][0] || [];
      const houseDetailValue = houseDetail[coverageValue] || [];
      setHousePropertyData([{
        label: languageData?.total_floors?.toString() || "",
        value: formAddressSelection?.propertyFloor,
      }, {
        label: languageData?.age_of_building?.toString() || "",
        value: `${convertYear(formAddressSelection.propertyBuildYear)} Yrs.` || "N/A",
      }, {
        label: languageData?.property_type?.toString() || "",
        value: formOption[formAddressSelection?.propertyType.activeIndex] || "N/A",
      }]);
      setHousePropertyAddressData(address);
      const policyToStartOn = policyStartDate ?? getFormattedDate();
      const startDate = new DateObject(new Date(apiFormatDate(policyToStartOn, '/')));
      setHousePremiumDetail([
        {
          label: houseDetail?.benefits[0] || "",
          value: `${houseDetailValue[0]}`,//"SAR 40,000.00",
        }, {
          label: houseDetail?.benefits[1] || "",
          value: `${houseDetailValue[1]}`,//"SAR 40,000.00",

        }, {
          label: languageData?.policy_period,
          value: policyToStartOn ? `${startDate.format("DD MMM, YYYY")} - ${startDate.add(POLICY_EXPIRY_DAYS, "day").format("DD MMM, YYYY")}` : "",
        }, {
          label: languageData?.premium_amount,
          value: `${languageData?.sar} ${getAmountText(priceData?.netPremium) ?? 0}`,//"SAR 40,000.00",
        }])
    }
  }, [languageData, premiumPayload]);

  return (
    <div className="vehi-details-card-wrap">
      <div className="vehi-details-card">
        {housePropertyData && <HousePropertyContent propertyNo={propertyId} housePropertyAddress={housePropertyAddressData} housePropertyData={housePropertyData} languageData={languageData} />}
        <HousePropertyLinks languageData={languageData as LanguageData} />
      </div>

      <HousePremiumDetails houseDetail={housePremiumDetail} />
    </div>
  );
};

export default HousePropertyDetails;
