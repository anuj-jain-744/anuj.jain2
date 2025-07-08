import { CURRENCY_TEXT } from '../constant'
// Function to format numbers for display
const formatNumberForDisplay = (value: number): string => {
  return Number(value.toFixed(2)).toLocaleString("en-US", {
    currency: CURRENCY_TEXT,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Returns amount as text with two decimal places after the dot
export const getAmountText = (value?: number | string | null): string => {
  let result = "-";
  if (value !== undefined && value !== null) {
    const amount = typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;
    if (Number.isFinite(amount)) {
      result = formatNumberForDisplay(amount); // Pass the number directly to formatNumberForDisplay
    }
  }
  return result;
};

export const formatedAmountToDisplay = (value: string): string => {
  const numericValue = value.replace(/,/g, "");
  const numberValue = parseFloat(numericValue);

  if (isNaN(numberValue)) {
    return value;
  }

  return numberValue.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};