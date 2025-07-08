import { QuoteDetail } from "@consumer-portal/types/Dashboard";
import { TRAVEL } from "constant";

interface CustomNotification {
    policyNo?: string;
    insurerName?: string;
    daysToExpiry?: number;
    daysSinceExpiry?: number;
    productCode: string;
    quoteNo?: string;
    type?: string; // 'policy' | 'quote'
    title?: string;
    policyStatus?: string; // e.g., 'Active', 'Cancelled'
    expiryDate?: string; // ISO date string
  }
  interface makeTheNotificationProps {
    policyNotification: CustomNotification[];
    quotesNotification: QuoteDetail[];
    languageData: Record<string, string>;
  }
export const makeTheNotification=({policyNotification, quotesNotification, languageData}:makeTheNotificationProps)=>{
  const fitleredPolicyNotification = (policyNotification ?? [])?.filter(
      (val) =>
        (val?.daysToExpiry !== undefined || val?.daysSinceExpiry !== undefined) &&
        val?.productCode !== TRAVEL // Exclude items with productCode "TRVL"
    )
    ?.map((val: CustomNotification) => ({
      type: "policy",
      title: languageData?.policy_renewal_reminder,
      policyNo: val?.policyNo ?? "",
      insurerName: val?.insurerName ?? "",
      daysToExpiry: val?.daysToExpiry, // number of days to expiry;
      daysSinceExpiry: val?.daysSinceExpiry, // number of days to expiry";
      productCode: val?.productCode ?? "",
      quoteNo: val?.quoteNo ?? "",
      expiryDate: val?.expiryDate ?? "",
    }));
    
   const filteredQuoteNotification = (quotesNotification ?? [])?.map((val) => ({
     type: 'quote',
     title:languageData?.quote_alert_title,
     policyNo: "",
     insurerName: "",
     daysToExpiry: "",
     daysSinceExpiry: "",
     productCode: val?.productCode ?? "",
     quoteNo: val?.quoteNo ?? "",
   }))

  return [...fitleredPolicyNotification, ...filteredQuoteNotification]
 }
 