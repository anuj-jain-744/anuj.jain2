import React, { useEffect, useState } from "react";
import "./index.scss";
import TravelContent, { TravelItem } from "./TravelContent";
import VehicalPolicyDetails from "../../VehicalDetailCard/VehicalPolicyDetails"; 
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";  
import { CombinedData } from "types/languageData"; 
import BagIcon from "assets/QuoteAndBuy/bag-Icon.png";
import { familtyFlowConstants } from "../constantsTravel";
import { getAmountWithIcon } from "@app-shell/utils/common";
import { subtractDates } from "utils/subtractDates";
import { formatDateObjectTo } from "utils/formatDate";
import { DATE_FORMATS } from "constant";
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

  const { travelDateRange, 
    adultCount,
    childCount,
    srCitizenCount,
    travellerType,
  } = useQuoteAndBuyContext();

  const[travelStartDate, travelEndDate] = travelDateRange;

  const totalCount =
    travellerType === "1" ? adultCount + childCount + srCitizenCount : 1;

  const formatTravelStartDate = (date: string | number | Date): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = new Date(date.split("/").reverse().join("-"))
      .toLocaleDateString('en-GB', options)
      .replace(/(\d{1,2}) (\w+) (\d{4})/, '$1 $2,$3');
    return formattedDate;
  };
  
  const combinedDateString = `${travelStartDate && !(travelStartDate instanceof Date) ? formatTravelStartDate(formatDateObjectTo(travelStartDate, DATE_FORMATS["DD/MM/YYYY"])) : ""} - ${travelEndDate && !(travelEndDate instanceof Date) ? formatTravelStartDate(formatDateObjectTo(travelEndDate, DATE_FORMATS["DD/MM/YYYY"])) : ""}`;
   
  useEffect(() => { 

    if(languageData && travelDateRange.length === 2 ) { 
      const travelDuration = subtractDates(formatDateObjectTo(travelEndDate, DATE_FORMATS["DD/MM/YYYY"]).toString(), formatDateObjectTo(travelStartDate, DATE_FORMATS["DD/MM/YYYY"]).toString())
      setTravelData([
      {
        label: languageData?.policy_start_date,
        value: travelStartDate?.format("DD/MM/YYYY"),
      },{
        label: languageData?.policy_end_date,
        value: travelEndDate?.format("DD/MM/YYYY"),  
      },{
        label: languageData?.travel_period,
        value: travelDuration,
      },{
        label: languageData?.no_of_travellers,
        value: totalCount.toString().padStart(2, "0"),
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
  }, [languageData, travelStartDate, travelDateRange, totalCount,policyPremiumAmt, travellerType, travelEndDate, combinedDateString]);
   
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
