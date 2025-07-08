import { LanguageData } from "types/languageData";
import Car_Icon from "assets/Endorsement/Car_Icon.svg";
import Home_Benefit_Icon from "assets/Home/home_benefits.png";
import ThemeButton from "components/ThemeButton/ThemeButton";
import "./styles.scss";
import { ZERO_PRICE } from "constant";
import { getAmountWithIcon } from "@app-shell/utils/common";
import approveIcon from "assets/QuoteAndBuy/Approve.svg";
import { sanitizeHtml } from "@dpm/shared-module";
interface Description {
  code: string;
  description: string;
}

interface BenifitCardProps {
  isHome: boolean;
  title: string;
  description: Description[] | string;
  price: string;
  isAdded: boolean;
  benefitCode?: string;
  onToggle: () => void;
  languageData: LanguageData;
  loading: boolean;
  mostPurchased: number;
}

function BenefitCard({ isHome, title, benefitCode, description, price, isAdded, onToggle, languageData, loading, mostPurchased }: Readonly<BenifitCardProps>) {
  const isPriceZero = price === ZERO_PRICE;

  // added free cover label when benefits price is zero for home product
  if (isHome && isPriceZero) { 
    isAdded = true;
  }

  let benefitsDescription = '';
  if (Array.isArray(description)) {
    const coverageBenefits = description.filter((item) => benefitCode === item.code);
    benefitsDescription = coverageBenefits[0]?.description;
  } else {
    benefitsDescription = description;
  }

  let buttonTitle = '';
  if (loading) {
    buttonTitle = languageData?.loading;
  } else {
    buttonTitle = isAdded ? languageData?.remove : languageData?.add_label;
  }

  return (
    <div data-testid="benefit-card" className={`small-card ${isAdded ? "small-card-selected" : ""}`}>
      {mostPurchased >= 0 ? <div className="most-frequently walaa-medium-500">{languageData?.most_frequently_purchased}</div>: ''}
      <div className="card-headerr">
        <div className="card-header-content">
          <img src={isHome ? Home_Benefit_Icon : Car_Icon} alt="Benefit Icon" />
          <div className="card-title-content walaa-medium-500">{title}</div>
        </div>
        <div className="card-description walaa-regular-400">
          {benefitsDescription || languageData?.emergency_support_for}{" "}
        </div>
      </div>
      <hr className="horizontal-line-card" />
      <div className="card-footerr">
      {!isPriceZero ? (
          <>
        <div className="price walaa-medium-500">{getAmountWithIcon(price,"price_position")}</div>
        <div>
          <ThemeButton
            title={isPriceZero ? languageData?.freeCover : buttonTitle}
            isDisabled={loading || isPriceZero}
            classes={
              isAdded
                ? "remove-btn walaa-medium-500"
                : "add-btn walaa-medium-500"
            }
            variant="outline"
            onClickhandler={onToggle}
          />
        </div>
        </>

        ):(
         <div className="freecover-container">
           <img
          src={approveIcon}
          alt="Approve"
          className="aprrove-icon"
        /> 
      
        <div className="free-cover-text" dangerouslySetInnerHTML={{
          __html: sanitizeHtml(`${languageData?.freecover_text}`),
        }}>


        </div>
        </div>
        )}
      </div>
    </div>
  );
}

export default BenefitCard;
