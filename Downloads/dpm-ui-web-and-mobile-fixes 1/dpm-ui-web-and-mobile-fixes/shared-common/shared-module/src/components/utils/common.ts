// returns amount as text with two decimal places after the dot
export const getAmountText = (value?: number | string | null): string => {
  let result = "-";
  if (value !== undefined && value !== null) {
    const amount = typeof value === "string" ? parseFloat(value) : value;
    if (Number.isFinite(amount)) result = amount.toFixed(2);
  }
  return result;
};
