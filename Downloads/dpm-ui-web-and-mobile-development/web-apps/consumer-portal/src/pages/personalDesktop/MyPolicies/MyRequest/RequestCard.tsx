import React from "react";
import motorReqProduct from "assets/DashboardBanner/motorMyReqProduct.svg";
import actionArrow from "assets/Dashboard/Arrow_Right.svg";
import disableArrow from "assets/Dashboard/disableArrowRight.svg";
import downArrow from "assets/Dashboard/Chevron Down.svg";
import upArrow from "assets/Dashboard/Chevron Up.svg";
import warning from "assets/Dashboard/Warning Fill.svg";
import success from "assets/Dashboard/Circle Tick.svg";
import cancel from "assets/Dashboard/Cancel.svg";
import TravelLogo from "assets/Dashboard/Travel_MyRequest.svg";
import HomeLogo from "assets/Dashboard/Home_MyRequest.svg";
import style from "./RequestCard.module.scss";
import { PolicyDetail, QuoteDetail, PolicyStatus, ClaimDetails } from "types/Dashboard";
import { formatDate } from "utils/formatDate";
import { LanguageData } from "types/languageData";
import { REQUEST_TYPES, PaymentUrl } from "constant";
import { useNavigate } from "react-router-dom";
import { getProductCode, getlineOfBusiness } from "utils/fileUtil";

interface RequestCardProps {
  data: PolicyDetail | QuoteDetail | ClaimDetails;
  isQuote: boolean;
  isClaim?: boolean;
  isOpen: boolean;
  onToggle: () => void;
  languageData?: LanguageData;
}

  // producut icon constant
  const ProductLogos: { [key: string]: string } = {
    Motor: motorReqProduct,
    TRVL: TravelLogo,
    HOME: HomeLogo,
    "Travel Accident": TravelLogo,
    "Home Insurance": HomeLogo,
    default: motorReqProduct,
  };

const RequestCard: React.FC<RequestCardProps> = ({ data = {}, isQuote, isClaim, isOpen, onToggle, languageData }) => {
  const safeData = data || {};
  const getCardType = () => {
    if (isQuote) {
      return languageData?.quotation;
    } else if(isClaim) {
      return languageData?.claim;
    } else {
      const policyData = safeData as PolicyDetail;
      if (policyData.endorsementNo && policyData.endorsementType !== languageData?.cancellation) {
        return languageData?.endorsement;
      } else if (policyData.endorsementType === languageData?.cancellation) {
        return languageData?.cancellation;
      } else {
        return "";
      }
    }
  };

  const getStatusClass = () => {
    switch (status.text) {
        case PolicyStatus.Active:
            return style.active;
        case PolicyStatus.Reject:
        case PolicyStatus.Expired:  
            return style.expired;
        case PolicyStatus.Cancelled:
        case PolicyStatus.Closed:  
            return style.cancelled;
        default:
            return style.active;
    }
  };


const getStatusInfo = (): { text: string; icon: string } => {
  const StatusIconMap: { [key: string]: string } = {
    [PolicyStatus.Reject]: cancel,
    [PolicyStatus.Expired]: cancel,
    [PolicyStatus.Cancelled]: success,
    [PolicyStatus.Closed]: success,
    [PolicyStatus.Active]: warning,
    [PolicyStatus.ClaimRegister]: warning,
  };

  if (isQuote) {
    const quoteData = safeData as QuoteDetail;
    const status = quoteData.quoteStatus ?? PolicyStatus.Active;
    return { text: status, icon: StatusIconMap[status] || warning };
  } else if (isClaim) {
    const claimData = safeData as ClaimDetails;
    const status = claimData.subClaimStatus ?? PolicyStatus.Active;
    return { 
      text: claimData.subClaimStatus ?? PolicyStatus.Active, 
      icon: StatusIconMap[status] || warning
    };
  } else {
    const policyData = safeData as PolicyDetail;
    const status =
      policyData.policyStatus === PolicyStatus.Cancelled ||
      policyData.endorsementType === languageData?.cancellation
        ? PolicyStatus.Cancelled
        : policyData.policyStatus ?? PolicyStatus.Active;
    return { text: status, icon: StatusIconMap[status] || warning };
  }
};

  const cardType = getCardType();
  const status = getStatusInfo();
  
  // Get reference ID (policy number or quote number)
  const getType = () => {
    if (isQuote) {
      return (safeData as QuoteDetail).quoteNo || "-";
    } else if(isClaim) {
      return (safeData as ClaimDetails).claimNo || "-";
    } else {
      return (safeData as PolicyDetail).policyNo || "-";
    }
  };

  // Get formatted date
const getFormattedDate = () => {
    const dateString = isClaim
      ? (safeData as ClaimDetails).dateOfNotification
      : isQuote
      ? (safeData as QuoteDetail).issueDate
      : (safeData as PolicyDetail).issueDate;

    return formatDate(dateString ?? "");
};

  const referenceId = '-';
  const formattedDate = getFormattedDate();
  
  // Get description text
  const getDescription = () => {
    if (safeData.description) {
      return safeData.description;
    } else if (isClaim) {
      safeData as ClaimDetails;
      return safeData?.productName;
    }
    
    return `-`;
  };

  const navigate = useNavigate();

  // handle navigation
  const handleNavigate = (type: string | undefined) => {

    const isStatusDisabled = isStatusDisable();
    if (isStatusDisabled) return;

    if (type === REQUEST_TYPES.QUOTATION) {
      const code = getProductCode(safeData.productCode);
      // navigate(PaymentUrl + safeData.quoteNo + "_" + code);
      const encryptedQuoteNumber = btoa(safeData?.quoteNo + "_" + code);
      navigate(PaymentUrl + encryptedQuoteNumber);
    } else if(type === REQUEST_TYPES.CLAIM) {
      const {claimNo, productName} = safeData as ClaimDetails;
      const lineOfBusiness = getlineOfBusiness(productName);
      data && navigate("/track-claim", {
        state: { data: {
          claimNo: claimNo,
          lineOfBusiness: lineOfBusiness,
        } },
      });

    } else if (type === REQUEST_TYPES.ENDORSEMENT || type === REQUEST_TYPES.CANCELLATION) {
      const data = safeData as PolicyDetail;
      data && navigate("/Motor/Claim/PolicyHistory", {
        state: { data },
      });
    }
  };

  // isDisable status
  const isStatusDisable = () => {
    if (isQuote) {
      return status.text === PolicyStatus.Reject || status.text === PolicyStatus.Expired;
    }
  };

  // get product logo
const getProductLogo = (key: string | undefined): string => {
  if (isClaim) {
    const claimData = safeData as ClaimDetails;
    const productName = claimData.productName;
    if (productName && ProductLogos[productName]) {
      return ProductLogos[productName];
    }
  }
  return ProductLogos[key || 'default'] || motorReqProduct;
};

  // navigation text
  const  getNavigationText = () => {
    if (isQuote) {
      return languageData?.pay;
    } else if (isClaim) {
      return languageData?.track_your_claim ?? 'Track your Claim';
    } 

    return languageData?.view;
  }
  
  // common header component
  const CardHeader = () => (
    <div className={style.frameContainer}>
      <div className={style.productIconContainer}>
        <img src={getProductLogo(safeData.productCode)} alt="motor product" />
      </div>
      <div className={style.productContentContainer}>
        <div className={style.typeContainer}>
          <div className={style.typeLabelContainer}>{cardType}</div>
          <div className={style.typeValueContainer}>{getType()}</div>
        </div>
        <div className={style.statusContainer}>
          <div className={style.statusLabelContainer}>{languageData?.status}</div>
          <div className={style.statusValueContainer}>
            <img src={status.icon} alt="status img" />
            <div className={style.statusValue}>{status.text}</div>
          </div>
        </div>
        <div className={style.actionContainer}onClick={() => handleNavigate(cardType)} >
          <div className={style.linkContainer}>
            <div className={isStatusDisable() ?  style.isDisabled :style.linkTextContainer } >
              <div className={isStatusDisable() ? style.isDisabled : style.linkText}>
                {getNavigationText()}
              </div>
            </div>
            <img src={isStatusDisable() ? disableArrow : actionArrow } alt="arrow" />
          </div>
          {!isOpen && (
            <div className={style.dateContainer}>
              <div className={style.dateLabelContainer}>{`${languageData?.last_updated_on}:`}</div>
              <div className={style.dateValueContainer}>{formattedDate}</div>
            </div>
          )}
        </div>
        <img
          src={isOpen ? upArrow : downArrow}
          alt={isOpen ? "up arrow" : "down arrow"}
          onClick={onToggle}
          className={style.expandActionIcon}
        />
      </div>
    </div>
  );

  return (
    <div className={isOpen ? style.expandMainContainer : style.mainContainer}>
      <div className={isOpen ? ` ${style.expandContainer} ${getStatusClass()}` : `${style.container}`}>
        <div className={isOpen ? style.expandTitleContainer : ""}>
          <CardHeader />
        </div>

        {/* Render expanded content only when open */}
        {isOpen && (
          <>
            <div className={style.expandDescriptionContainer}>
              <div className={style.expandDescriptionTitleContainer}>
                <div className={style.expandDescriptionLabelContainer}>
                  <div className={style.expandDescriptionText}>{languageData?.description}</div>
                </div>
                <div className={style.expandDescriptionValue}>
                  <div className={style.expandDescriptionValueText}>
                    {getDescription()}
                  </div>
                </div>
              </div>
              <div className={style.expandReferenceContainer}>
                <div className={style.expandReferenceLabel}>
                  <div className={style.expandReferenceLabelText}>
                    {languageData?.reference_id}
                  </div>
                </div>
                <div className={style.expandReferenceValue}>
                  <div className={style.expandReferenceValueText}>{referenceId}</div>
                </div>
              </div>
            </div>
            <hr className={style.cardHorizontalLineOpen} />
            <div className={style.expandBottomContainer}>
              <div className={style.updatedOne}>{languageData?.last_updated_on}</div>
              <div className={style.updatedOne}>{formattedDate}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RequestCard;