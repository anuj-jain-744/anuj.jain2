import { useCallback } from "react";
import {
  TyperFormAddressSelection,
  TypePropertyType,
} from "context/PHQuoteBuyContext";
import { commonKeywords } from "../constant";


export const usePropertySelection = (
  setterHook: (value: any) => void,
  resetFormValue: TyperFormAddressSelection,
  resetPropertyCoodinates: TypePropertyType,
  setShowPropertyMap: (value: TypePropertyType) => void
) => {
  const handlePropertySelection = useCallback(
    (
      key: string,
      value: { activeIndex: number; activelabel: string } | string | boolean
    ) => {
      if (key === commonKeywords.propertyNoLabel) {
        setShowPropertyMap(resetPropertyCoodinates);
      }
      setterHook((prevValue: TyperFormAddressSelection) => ({
        ...(key === commonKeywords.propertyNoLabel
          ? resetFormValue
          : prevValue),
        [key]: value,
      }));
    },
    [setterHook, resetFormValue]
  );

  return { handlePropertySelection };
};
