import { PremiumBreakdown } from "types/quoteAndBuy";
import { PremiumDescription, PromoCodeResponse } from ".";
import { LanguageData } from "types/languageData";
import { compensationTypeCardFinalVAT } from "Motor/QuoteAndBuy/CoveragePlan/CommonFunction/CommonFunction";
import { PRODUCTCODE_HOME } from "constant";

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
  quoteHeading,
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
                {languageData?.sar} {`${val.sign === -1 ? "-" : "\xa0"}${val.amount?.toFixed(2)}`}
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
                  {languageData?.sar} {paymentInfo?.planAmount}
                </div>
              </div>
            </div>
          </>}
          <hr className="horizontal-line" />
          <div className="order-body-content">
            <div className="order-body-package-content content-light">
              <div>{paymentInfo?.adminFeesLabel}</div>
              <div>
                {languageData?.sar} {paymentInfo?.adminFees}
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
          {languageData?.sar} {!isHome && priceAmount?.toFixed(2)}{" "}
          {isHome && homePriceAmount?.minFinalPrice.toFixed(2)}
        </div>
      </div>}
      {selectedBenefits?.length > 0 && languageData?.additional_benefits && <div className="additional">{languageData?.additional_benefits}</div>}
      {selectedBenefits?.filter(val => val?.title)?.map((benefit, index) => (
        <div key={index} className="order-body-package-content content-light">
          <div className="w-50">{benefit.title}</div>
          <div>
            {languageData?.sar} {benefit?.price?.toFixed(2)}
          </div>
        </div>
      ))}
      <hr className="horizontal-line" />
      <div className="order-body-content">
        <div className="order-body-package-content content-subtotal">
          <div>{languageData?.subtotal}</div>
          <div>
            {languageData?.sar} {subtotalAmount}
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
            {languageData?.sar} {vatAmount?.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumBreakUpBody;
