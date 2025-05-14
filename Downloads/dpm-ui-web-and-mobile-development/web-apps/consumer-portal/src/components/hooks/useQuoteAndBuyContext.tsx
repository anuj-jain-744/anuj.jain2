import { useContext } from "react";
import { QuoteAndBuyContext } from "Motor/QuoteAndBuy/QuoteAndBuyContext";

export const useQuoteAndBuyContext = () => {
  const context = useContext(QuoteAndBuyContext);
  if (!context) {
    throw new Error(
      "useQuoteAndBuyContext must be used within a QuoteAndBuyProvider"
    );
  }
  return context;
};