import { PremiumBreakdown } from "types/quoteAndBuy";
import { PremiumDescription, PromoCodeResponse } from ".";
import { LanguageData } from "types/languageData";
import { compensationTypeCardFinalVAT } from "Motor/QuoteAndBuy/CoveragePlan/CommonFunction/CommonFunction";
import { PRODUCTCODE_HOME } from "constant";
import { getAmountWithIcon, getCurrencySymbol } from "@app-shell/utils/common";
import { getAmountText } from "@dpm/shared-module";


interface PremiumBreakUpBodyProps {
  title?: string;
  premiumArr: PremiumBreakdown[];
  data: PromoCodeResponse;
  languageData: LanguageData;
  isHome: boolean;
  priceAmount?: number;
  homePriceAmount?: { minFinalPrice: number; vatPrice: number };
  repairTypeSelected?: string;
  selectedBenefits?: { title: string; price: number; code: string }[];
  subtotalAmount: number;
  vatAmount: number;
  paymentInfo: {
    adminFees: number,
    planAmount: number,
    productCode: string | number,
    planName: string,
    adminFeesLabel: string
  };
}
const PremiumBreakUpBody = ({
  title,
  premiumArr,
  data,
  languageData,
  priceAmount,
  homePriceAmount,
  isHome,
  repairTypeSelected,
  selectedBenefits,
  subtotalAmount,
  vatAmount,
  paymentInfo
}: PremiumBreakUpBodyProps) => {
  return (
    <div className="order-body-content">
      {paymentInfo?.productCode !== PRODUCTCODE_HOME && premiumArr
        ?.sort((a, b) => Number(a.type) - Number(b.type))
        ?.map((val: PremiumBreakdown) => {
          return (
            <div className="order-body-package-content" key={val?.amount}>
              <div>
                {
                  data?.config.premium_breakdown.find(
                    (valD: PremiumDescription) => {
                      return valD.code.toString() === val.type;
                    }
                  )?.description
                }
              </div>
              <div>
                {getCurrencySymbol(`${languageData?.sar} ${val.sign === -1 ? "-" : "\xa0"}${getAmountText(Number(val.amount))}`)}
              </div>
            </div>
          );
        })}
      {paymentInfo?.productCode === PRODUCTCODE_HOME &&
        <>
          {paymentInfo?.planName && <>
            <hr className="horizontal-line" />
            <div className="order-body-content">
              <div className="order-body-package-content content-light">
                <div>{paymentInfo?.planName}</div>
                <div>
                  {getAmountWithIcon(paymentInfo?.planAmount)}
                </div>
              </div>
            </div>
          </>}
          <hr className="horizontal-line" />
          <div className="order-body-content">
            <div className="order-body-package-content content-light">
              <div>{paymentInfo?.adminFeesLabel}</div>
              <div>
                {getAmountWithIcon(paymentInfo?.adminFees)}
              </div>
            </div>
          </div>
        </>
      }
      {title && <div className="order-body-package-content bold-data">
        <div>
          {title}
          {repairTypeSelected !== null && <span>({repairTypeSelected})</span>}
        </div>
        <div>
          {!isHome && getAmountWithIcon(priceAmount)}{" "}
          {isHome && getAmountWithIcon(homePriceAmount?.minFinalPrice)}
        </div>
      </div>}
      {selectedBenefits?.length > 0 && languageData?.additional_benefits && <div className="additional">{languageData?.additional_benefits}</div>}
      {selectedBenefits?.filter(val => val?.title)?.map((benefit, index) => (
        <div key={index} className="order-body-package-content content-light">
          <div className="w-50">{benefit.title}</div>
          <div>
            {getAmountWithIcon(benefit?.price)}
          </div>
        </div>
      ))}
      <hr className="horizontal-line" />
      <div className="order-body-content">
        <div className="order-body-package-content content-subtotal">
          <div>{languageData?.subtotal}</div>
          <div>
            {getAmountWithIcon(subtotalAmount)}
          </div>
        </div>
      </div>
      <hr className="horizontal-line" />
      <div className="order-body-content">
        <div className="order-body-package-content content-light">
          <div>
            {languageData?.vat_amount} (
            {isHome
              ? compensationTypeCardFinalVAT(homePriceAmount?.vatPrice ?? 0)
              : "15"}
            %)
          </div>
          <div>
            {getAmountWithIcon(vatAmount)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumBreakUpBody;
