import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.scss";
import VehicalContent, { VehicleItem } from "./VehicalContent";
import VehicalLinks from "./VehicalLinks";
import VehicalPolicyDetails from "./VehicalPolicyDetails";
import useLanguageData from "../../Motor/Policy-services/AccessPolicyDocuments/hooks/useLanguageData";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { getPlateNumber } from "utils/getPlateNumber";
import { LanguageData } from "types/languageData";
import { DateObject } from "react-multi-date-picker";
import { getAmountText, NOT_APPLICABLE } from "@dpm/shared-module";
import { getVehicleMakeModel } from "utils/quoteAndBuy";
import { IThirdParty, DEDUCTIBLES, SUM_INSURED } from "Motor/QuoteAndBuy/CoveragePlan/ConstantValue/ConstantValue";
 
interface VehicalDetailCardProps {
 
}
 
const VehicalDetailCard: React.FC<VehicalDetailCardProps> = () => {
  const [vehicleData, setVehicleData] = useState<VehicleItem[]>([]);
  const [policyDetail, setPolicyDetail] = useState<VehicleItem[]>([]);
 
  const {
    vehicaleFormResponse,
    vehicleDetails,
    sliderValueSumInsured,
    sliderValueDeductibles,
    premium,
    vehicleDetailsResponseData,
    policyStartDateAPI: policyStartDate,
    coverageType,
    // policyStartDate,
  } = useQuoteAndBuyContext();
 
  const {
    languageData,
  } = useLanguageData();
 
 
useEffect(() => {
  if (languageData && vehicleDetails) {
    setVehicleData([
      {
        label: getVehicleMakeModel(vehicleDetailsResponseData) ?? NOT_APPLICABLE,
        value: vehicleDetailsResponseData ? getPlateNumber(vehicleDetailsResponseData) : NOT_APPLICABLE,
      },
      {
        label: (vehicleDetails?.vehicleCustomID != null)
          ? languageData?.custom_card_no?.toString()
          : languageData?.vehicle_sequence?.toString() || NOT_APPLICABLE,
        value: (vehicleDetails?.vehicleCustomID != null)
          ? vehicleDetails?.vehicleCustomID
          : vehicleDetails?.vehicleSequenceNo ?? NOT_APPLICABLE,
      },
      {
        label: languageData?.registration_year_label?.toString() || "",
        value: vehicleDetailsResponseData?.manufactureYear ?? NOT_APPLICABLE,
      },
      {
        label: languageData?.chassis_no?.toString() || "",
        value: vehicleDetailsResponseData?.chassisNumber ?? NOT_APPLICABLE,
      },
    ]);

    const filteredPolicyDetails = [
      {
        label: languageData?.policy_period?.toString() || "",
        value: policyStartDate
          ? `${new DateObject(new Date(policyStartDate)).format("DD MMM, YYYY")} - ${new DateObject(new Date(policyStartDate))
              .add(1, "year")
              .add(-1, "day")
              .format("DD MMM, YYYY")}`
          : "",
        isAmount: false,
      },
      {
        label: languageData?.premium_amount?.toString() || "",
        value: `${languageData?.sar?.toString()} ${getAmountText(premium)}`,
        isAmount: true,
      },
    ];

    const fullPolicyDetails = [
      {
        label: languageData?.sum_insured?.toString() || "",
        isAmount: true,
        value: `${languageData?.sar?.toString()} ${getAmountText(sliderValueSumInsured)}`,
      },
      {
        label: languageData?.deductibles?.toString() || "",
        value: `${languageData?.sar?.toString()} ${getAmountText(sliderValueDeductibles)}`,
        isAmount: true,
      },
      ...filteredPolicyDetails,
    ];

    setPolicyDetail(coverageType === IThirdParty ? filteredPolicyDetails : fullPolicyDetails);
  }
}, [
  languageData,
  vehicaleFormResponse?.vehicleSequenceNo,
  vehicleDetails,
  policyStartDate,
  sliderValueSumInsured,
  sliderValueDeductibles,
  premium,
  vehicleDetailsResponseData,
]);


  return (
    <div className="vehi-details-card-wrap">
      <div className="vehi-details-card motor-vehi-card">
        {vehicleData && <VehicalContent vehicleData={vehicleData}/>}
        <div className="horizontal-line-light-grey" />
        <VehicalLinks languageData={languageData as LanguageData} />
      </div>
 
      <VehicalPolicyDetails policyDetail={policyDetail}/>
    </div>
  );
};
 
export default VehicalDetailCard;
