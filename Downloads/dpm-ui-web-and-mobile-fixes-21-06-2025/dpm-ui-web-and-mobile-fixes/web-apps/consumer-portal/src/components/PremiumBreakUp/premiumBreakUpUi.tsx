import { Card } from "react-bootstrap";
import { LanguageData } from "types/languageData";
import { PromoCodeScheme } from "types/promoCodeType";
import ThemeRadioCheckbox from "components/ThemeComponents/ThemeRadioCheckbox";
import SchemeCodeApplied from "./schemeCodeApplied";
import { PromoCodeResponse } from ".";
import PremiumBreakUpBody from "./premiumBreakUpBody";
import { PremiumBreakdown } from "types/quoteAndBuy";
import { getAmountWithIcon } from "@app-shell/utils/common";
import "./style.scss";

interface PremiumBreakdownProps {
  title: string;
  schemeCode?: PromoCodeScheme;
  showSchemeCode: boolean;
  languageData: LanguageData;
  isToggled?: boolean;
  setIsCouponApplied?: (value: boolean) => void;
  setIsToggled?: (value: boolean) => void;
  data?: PromoCodeResponse;
  premium: number | null;
  subTitle?: string;
  premiumArr: PremiumBreakdown[];
  priceAmount: number;
  isHome?: boolean;
  homePriceAmount?: { minFinalPrice: number; vatPrice: number };
  repairTypeSelected?: string;
  selectedBenefits?: { title: string; price: number; code: string }[];
  subtotalAmount: number;
  vatAmount: number;
  quoteHeading?: string;
  paymentInfo: {
    adminFees: number,
    planAmount: number,
    productCode: string | number,
    planName: string,
    adminFeesLabel: string
  };
}
export default function PremiumBreakUpUi({
  title,
  quoteHeading,
  schemeCode,
  showSchemeCode = true,
  languageData,
  isToggled = false,
  setIsCouponApplied,
  setIsToggled,
  data,
  premium,
  subTitle,
  premiumArr,
  priceAmount,
  homePriceAmount,
  isHome,
  repairTypeSelected,
  selectedBenefits,
  subtotalAmount,
  vatAmount,
  paymentInfo,
}: Readonly<PremiumBreakdownProps>) {
  return (
    <Card className="order-summary-premium-breakup w-100">
      <div className="order-header justify-content-between flex-row">
        <div className="order-title walaa-medium-500">{title}</div>
        {showSchemeCode && setIsCouponApplied && !schemeCode ? (
          <div className="order-sub-title walaa-medium-500 flex-row pt-1">
            <div>{languageData?.apply_promo_code}</div>
            <div className="apply-promo-container">
              <ThemeRadioCheckbox
                type="switch"
                classes="mx-0"
                defaultChecked={isToggled}
                checked={isToggled}
                onChangehandler={() => {
                  if (!isToggled) {
                    setIsCouponApplied(false);
                  }
                  setIsToggled && setIsToggled(!isToggled);
                }}
                label=""
              />
            </div>
          </div>
        ) : (
          <>
            {showSchemeCode && (
              <SchemeCodeApplied
                promoCodeApplied={data?.config?.promo_code_applied ?? ""}
              />
            )}
          </>
        )}
      </div>
      <hr className="horizontal-line" />
      <div className="order-body">
        {quoteHeading && (
          <div className="order-heading walaa-medium-500">{quoteHeading}</div>
        )}
        {data && (
          <PremiumBreakUpBody
            title={subTitle}
            premiumArr={premiumArr}
            data={data}
            languageData={languageData}
            priceAmount={priceAmount}
            homePriceAmount={homePriceAmount}
            isHome={isHome ?? false}
            repairTypeSelected={repairTypeSelected}
            selectedBenefits={selectedBenefits}
            subtotalAmount={subtotalAmount}
            vatAmount={vatAmount}
            paymentInfo={paymentInfo}
          />
        )}
      </div>
      <div className="order-summary-footer walaa-medium-500">
        <div className="left">{languageData?.net_premium}</div>
        <div className="right">
          {getAmountWithIcon(premium)}
        </div>
      </div>
    </Card>
  );
}
