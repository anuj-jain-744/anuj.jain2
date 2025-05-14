import { DriverDetails, DriverDetailsMappingFields, DriverDetailsResponseData } from "types/quoteAndBuy";

  function updateCalculatePremiumPayload(field: string, value: any, payload: any) {
    
    if (field === 'repairCondition') {
      payload.policyLob[0].policyRisk[0].repairCondition = value;
    } else {
      payload = {
        ...payload,
        [field]: value
      };
    }
  
    return payload;
  }

  export function updateGenerateQuotePayload(field: string, value: any, payload: any) {
    if(field === 'commercialRegistration') {
      payload.policyCustomer[0].commercialRegistration = "";
    } else if(field === "email"){
      payload.policyCustomer[0].email = value;
    } else if(field === "primaryAddress"){
      payload.policyCustomer[0].primaryAddress = value;
    } else if(field === "deductibleAmount") {
      payload.policyLob[0].policyRisk[0].deductibleAmount = value;
    } else {
      payload = {
        ...payload,
        [field]: value
      };
    }
    return payload;
  }
  function updateSliderChangeCalculatePremiumPayload(field1: string, feild2:string, value1: any, value2:any, payload: any) {
    
    if (field1 === 'repairCondition' && feild2 === 'vehicleValue') {
      payload.policyLob[0].policyRisk[0].repairCondition = value1;
      payload.policyLob[0].policyRisk[0].vehicleValue = value2;
    } else {
      payload = {
        ...payload,
        [field1]: value1,
        [feild2]: value2
      };
    }
  
    return payload;
  }
  function updateTravelCovergaePlanPayload(field1: string, feild2:string, value1: number, value2:number, payload: any) {
    
   
      payload = {
        ...payload,
        [field1]: value1,
        [feild2]: value2
      };
    
  
    return payload;
  }
  function deepCopy(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  }

  export function toCamelCase(str: string): string {
    return str?.toLowerCase()?.replace(/\b\w/g, (match) => match.toUpperCase());
  }

  export {updateCalculatePremiumPayload, deepCopy,updateSliderChangeCalculatePremiumPayload,updateTravelCovergaePlanPayload};


