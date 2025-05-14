import React from "react";
import { getAmountText } from "@dpm/shared-module";
import { CurrencyText } from "@src/constants";

export const getAmountWithIcon = (
  amount: string | number = "",
  className: string = ""
) => {
  const text = (amount ?? "")
    .toString()
    .replaceAll(CurrencyText, "")
    .replaceAll(" ", "");
  return (
    <>
      <span className="icon-saudi_riyal" />
      &nbsp;
      <span className={`riyal-amount ${className}`}>{getAmountText(text)}</span>
    </>
  );
};

export const getCurrencySymbol = (text: string) => {
  const contents = text?.split(CurrencyText);
  const totalDataCount = contents?.length - 1;
  return (
    contents?.map((item, index) => (
      <>
        <span>{item}</span>
        {index < totalDataCount && <span className="icon-saudi_riyal" />}
      </>
    ))
  )
}
