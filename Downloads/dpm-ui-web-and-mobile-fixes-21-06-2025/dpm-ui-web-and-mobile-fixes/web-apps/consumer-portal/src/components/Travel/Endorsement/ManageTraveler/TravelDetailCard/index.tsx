import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.scss";
import TravelContent, { TravelItem } from "./TravelContent";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";  
import { CombinedData } from "types/languageData";
import FlightIcon from "assets/QuoteAndBuy/flightIcon.png";

export interface TraItem {
  label: string;
  value: string;
}

export interface PolicyData { 
      policyEffectiveDate: string,
      policyExpiryDate: string,
      pricingOptions: [
        {
          premiumDue:string,
        }
      ],
      purchasedCoverage: [],
      quotationDate: string,
      renewalInd: string
}
interface TravelDetailCardProps {
  languageData: CombinedData | undefined | null; 
  policyRelData : PolicyData ; 
} 
 
const TravelDetailCard: React.FC<TravelDetailCardProps> = ({ languageData , policyRelData  }) => {
  
  const [travelData, setTravelData] = useState<TravelItem[]>([]);
  const [policyDetail, setPolicyDetail] = useState<TravelItem[]>([]); 

  const { travelStartDate, 
    selectedPeriod, 
    totalCount , 
    travellerType,
  } = useQuoteAndBuyContext();

  const TravelPeriod=selectedPeriod ? selectedPeriod.split(" ")[0] : ""
  
  const calculateEndDate = (startDate: Date, days: number): string => {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + days);
    const day = endDate.getDate().toString().padStart(2, '0');
    const month = (endDate.getMonth() + 1).toString().padStart(2, '0');
    const year = endDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const travelEndDate = travelStartDate ? calculateEndDate(new Date(travelStartDate as string | number | Date), parseInt(TravelPeriod)) : "";
  const adjustedTotalCount = travellerType === "self" ? 1 : totalCount;
  const combinedDateString = `${travelStartDate?.toLocaleString()} - ${travelEndDate?.toLocaleString()}`;
 const premiumDuesar = `${languageData?.sar} ${policyRelData?.pricingOptions && policyRelData.pricingOptions.length > 0 ? policyRelData.pricingOptions[0].premiumDue : 'default-value'}`;
 
  useEffect(() => {
    if(languageData && policyRelData && selectedPeriod) {
       
      setTravelData([
      {
        label: languageData?.travel_start_date || "null",
        value: travelStartDate?.toLocaleString()  
      },{
        label: languageData?.travel_end_date || "null",
        value: travelEndDate?.toLocaleString(),  
      },{
        label: languageData?.travel_period || "null",
        value: selectedPeriod?.toString(),
      },{
        label: languageData?.no_of_travellers || "null",
        value: adjustedTotalCount?.toString(),
      }
    ]);
      setPolicyDetail([
        {
          label:languageData?.policy_period || "",
          value: combinedDateString ,  
        }, {
          label: languageData?.premium_amount || "",          
          value:  premiumDuesar, //"SAR", 
       
        }])
    }
  }, [languageData, travelStartDate, selectedPeriod, totalCount, travellerType, policyRelData, travelEndDate, adjustedTotalCount, combinedDateString]);
  // to get travellertype starts


return (
  <div className="vehi-details-card-wrap">
  <div className="vehi-details-card">
  <div className="vehi-top">
      <div className="travle-logo">
         <img src={FlightIcon} alt="user icon" />
      </div>
      <div className="label-container text-start">
      <div className="vehi-label">{languageData?.travellerType ? languageData.travellerType : 'default-label'} </div>
      <div className="vehi-value">{travellerType ? travellerType.toString() : 'default-value'} </div>
      </div> 
    </div>
    {travelData && <TravelContent travelData={travelData}/>} 
  </div>  
</div> 
  
);

};

export default TravelDetailCard;
