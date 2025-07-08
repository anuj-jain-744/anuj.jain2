import React from "react";
import { getAmountText } from "@dpm/shared-module";
import { CurrencyText, CurrencyTextSR } from "@src/constants";

export const arabicMonthinEnglish = [
  "Muharram",
  "Safar",
  "Rabi’ al-Awwal",
  "Rabi’ al-Thani",
  "Jumada al-Awwal",
  "Jumada al-Thani",
  "Rajab",
  "Sha’ban",
  "Ramadan",
  "Shawwal",
  "Dhu al-Qadah",
  "Dhu al-Hijjah",
]

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
      <React.Fragment key={"content_"+index}>
        <>{item}</>
        {index < totalDataCount && <span className="icon-saudi_riyal" />}
      </React.Fragment>
    ))
  )
}

export const getCurrencySymbolForSR = (text: string) => {
  const contents = text?.split(CurrencyTextSR);
  const totalDataCount = contents?.length - 1;
  return (
    contents?.map((item, index) => (
      <>
        <>{item}</>
        {index < totalDataCount && <span className="icon-saudi_riyal" />}
      </>
    ))
  )
}
