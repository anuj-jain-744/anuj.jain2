import React, { useEffect, useState } from "react";
import "./index.scss";
import TravelContent, { TravelItem } from "./TravelContent";
import VehicalPolicyDetails from "../../VehicalDetailCard/VehicalPolicyDetails"; 
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";  
import { CombinedData } from "types/languageData"; 
import BagIcon from "assets/QuoteAndBuy/bag-Icon.png";
import { familtyFlowConstants } from "../constantsTravel";
import { getAmountWithIcon } from "@app-shell/utils/common";
export interface TraItem {
  label: string;
  value: string;
}

interface TravelDetailCardProps {
  languageData: CombinedData | undefined | null; 
  policyPremiumAmt : string; 
} 
 
const TravelDetailCard: React.FC<TravelDetailCardProps> = ({ languageData , policyPremiumAmt  }) => {
  
  const [travelData, setTravelData] = useState<TravelItem[]>([]);
  const [policyDetail, setPolicyDetail] = useState<TravelItem[]>([]); 
  const [travellerTypeValue, setTravellerTypeValue] = useState('');

  const { travelStartDate, 
    selectedPeriod, 
    adultCount,
    childCount,
    srCitizenCount,
    travellerType,
  } = useQuoteAndBuyContext();

  const calculateEndDate = (startDate: Date, days: number): string => {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + days - 1);
    const day = endDate.getDate().toString().padStart(2, '0');
    const month = (endDate.getMonth() + 1).toString().padStart(2, '0');
    const year = endDate.getFullYear();
    return `${day}/${month}/${year}`;
  };
 
  const dateForm = typeof travelStartDate === 'string' ? travelStartDate.split("/").reverse().join("-") : travelStartDate;
  const travelEndDate = travelStartDate ? calculateEndDate(new Date(dateForm as string | number | Date), parseInt(selectedPeriod.value)) : "";
  const totalCount =
    travellerType === "1" ? adultCount + childCount + srCitizenCount : 1;

  const formatTravelStartDate = (date: string | number | Date): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = new Date(date.split("/").reverse().join("-"))
      .toLocaleDateString('en-GB', options)
      .replace(/(\d{1,2}) (\w+) (\d{4})/, '$1 $2,$3');
    return formattedDate;
  };
  
  const combinedDateString = `${travelStartDate && !(travelStartDate instanceof Date) ? formatTravelStartDate(travelStartDate.toString()) : ""} - ${travelEndDate && !(travelEndDate instanceof Date) ? formatTravelStartDate(travelEndDate.toString()) : ""}`;
   
 useEffect(() => { 

    if(languageData && selectedPeriod.value ) { 
      
      setTravelData([
      {
        label: languageData?.policy_start_date,
        value: travelStartDate?.toLocaleString()  
      },{
        label: languageData?.policy_end_date,
        value: travelEndDate?.toLocaleString(),  
      },{
        label: languageData?.travel_period,
        value: selectedPeriod.label,
      },{
        label: languageData?.no_of_travellers,
        value: totalCount,
      }
    ]);
      setPolicyDetail([
        {
          label: languageData?.policy_period || "",
          value: combinedDateString,  
        }, {
          label: languageData?.premium_amount || "",          
          value: getAmountWithIcon(policyPremiumAmt), 
        }])
    }
  }, [languageData, travelStartDate, selectedPeriod, totalCount,policyPremiumAmt, travellerType, travelEndDate, combinedDateString]);
  
  // to get travellertype starts  
  useEffect(() => {
    const travellerTypeNumber = Number(travellerType);
    if (travellerTypeNumber === 1) {
      setTravellerTypeValue("family");
    } else if (travellerTypeNumber === 2) {
      setTravellerTypeValue(familtyFlowConstants.TITLES.SELF);
    } else {
      setTravellerTypeValue('default-value');
    }
  }, [travellerType]);
 
return (
  <div className="vehi-details-card-wrap">
  <div className="vehi-details-card">
  <div className="vehi-top">
      <div className="travle-logo">
         <img src={BagIcon} alt="Bag icon"  title="Bag icon"/>
      </div>
      <div className="label-container text-start">
      <div className="vehi-label">{languageData?.travellerType ? languageData.travellerType : 'default-label'} </div>
      <div className="vehi-value"> {travellerTypeValue} </div>
      </div>
    </div>
    {travelData && <TravelContent travelData={travelData}/>} 
  </div>

  <VehicalPolicyDetails policyDetail={policyDetail}/>
</div> 
  
);

};

export default TravelDetailCard;
