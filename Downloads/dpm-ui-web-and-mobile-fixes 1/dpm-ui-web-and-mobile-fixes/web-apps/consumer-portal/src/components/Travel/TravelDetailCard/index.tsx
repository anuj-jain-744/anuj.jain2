import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.scss";
import TravelContent, { TravelItem } from "./TravelContent";
import VehicalPolicyDetails from "../../VehicalDetailCard/VehicalPolicyDetails"; 
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";  
import { CombinedData } from "types/languageData"; 
import BagIcon from "assets/QuoteAndBuy/bag-Icon.png";
 
 
export interface TraItem {
  label: string;
  value: string;
}

// export interface PolicyDataFamily {   
//     dataworldwideFamilynetpremium:"string",
//     dataworldwideFamilypurchasedCoverage: [
//       { 
//         riskId: "string",
//         nationalIqamaId: "string"
//       } 
//     ] 
    
// }
// export interface PloicyDataIndivi {
//    policyEffectiveDate: string,
//     policyExpiryDate: string,
//     pricingOptions: [
//       {
//         premiumDue:string,
//       }
//     ],
//     purchasedCoverage: [],
//     quotationDate: string,
//     renewalInd: string
// }
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
 
  const dateForm = typeof travelStartDate === 'string' ? travelStartDate.split("/").reverse().join("-") : travelStartDate;
  const travelEndDate = travelStartDate ? calculateEndDate(new Date(dateForm as string | number | Date), parseInt(TravelPeriod)) : "";
  const adjustedTotalCount = travellerType === "2" ? 1 : totalCount;
  const combinedDateString = `${travelStartDate?.toLocaleString()} - ${travelEndDate?.toLocaleString()}`;
    
 console.log("policyPremiumAmt traveldetailcard",policyPremiumAmt)

 useEffect(() => { 

    if(languageData && selectedPeriod ) { 
      
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
          value: `${languageData?.sar} ${policyPremiumAmt} `, 
       
        }])
    }
  }, [languageData, travelStartDate, selectedPeriod, totalCount,policyPremiumAmt, travellerType, travelEndDate, adjustedTotalCount, combinedDateString]);
  
  // to get travellertype starts  
  useEffect(() => {
    const travellerTypeNumber = Number(travellerType);
    if (travellerTypeNumber === 1) {
      setTravellerTypeValue("family");
    } else if (travellerTypeNumber === 2) {
      setTravellerTypeValue("individual");
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
