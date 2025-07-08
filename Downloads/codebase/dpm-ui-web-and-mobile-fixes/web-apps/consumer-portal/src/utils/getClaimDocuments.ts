import { CMSRule, CMSDocument } from "types/common";
import { OPERATORS } from "constant";

type InputData = Record<string, string | number | null | undefined>;
 
export const getClaimDocuments = (
  rules: CMSRule[],
  inputData: InputData
): CMSDocument[] => {
 
  const matched = rules
    .map((rule) => {
      const matches = rule.condition.every((cond) => {
        const field = cond.fieldName;
        const inputValue = inputData[field];
        const operator = cond.operator?.toLowerCase();
        const condValue = cond.value;

        switch (operator) {
          case OPERATORS.Operator_Equal.toLowerCase():
            if (condValue === null) {
              return inputValue === null || inputValue === undefined || inputValue === "";
            }
            return inputValue?.toString().toLowerCase() === condValue?.toString().toLowerCase();
          case OPERATORS.Operator_Greater.toLowerCase():
            const greaterVal = typeof inputValue === "number" ? inputValue : parseInt(inputValue as string);
            return !isNaN(greaterVal) && greaterVal > Number(condValue ?? 0);
          case OPERATORS.Operator_Less.toLowerCase():
            const lessVal = typeof inputValue === "number" ? inputValue : parseInt(inputValue as string);
            return !isNaN(lessVal) && lessVal < Number(condValue ?? 0);
          default:
            return false;
        }
      });
      return matches ? rule.documents : null;
    })
    .filter(Boolean);
  const finalDocs = matched.length > 0 ? matched[0] || [] : [];
  return finalDocs;
};
