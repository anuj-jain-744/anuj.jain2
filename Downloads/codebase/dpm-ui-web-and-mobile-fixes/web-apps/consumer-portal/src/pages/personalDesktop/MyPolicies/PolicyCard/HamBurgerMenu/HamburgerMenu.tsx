import React, { useState } from "react";
import Warning from "assets/Dashboard/Warning Fill.svg";
import Warning_large from "assets/Dashboard/Warning Fill_Large.svg";
import policyDetailIcon from "assets/Dashboard/hamburgerLibraryBooks.svg";
import VerifiedUser_disabled from "assets/Dashboard/Verified User_disable.svg";
import claimIcon from "assets/Dashboard/hamburgerVerifiedUser.svg";
import historyIcon from "assets/Dashboard/hamburgerHistory.svg";
import cancelIcon from "assets/Dashboard/hamburgerCancelledPolicy.svg";
import closeIcon from "assets/Dashboard/hamburgerClose.svg";
import downloadIcon from "assets/Dashboard/Download-hamburger.svg";
import addOnIcon from "assets/Dashboard/Contextual Token Add-hamburger.svg";
import disableAddOnIcon from "assets/Dashboard/Contextual Token Add_disabled.svg";
import style from "./HamburgerMenu.module.scss";
import { LanguageData } from "types/languageData";
import Union from "assets/Dashboard/Union.svg";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from '@tanstack/react-query';
import { useSelector } from "react-redux";
import { RootState, sanitizeHtml } from "@dpm/shared-module";
import {
  MOTOR,
  TRAVEL,
  dateFormats,
  travelMultiTripDurationDays,
} from "constant";
import { ClaimDetails } from "types/Dashboard";
import ErrorDialogBox from "components/ErrorDialogBox/ErrorDialogBox";
import { getActiveClaimNumberForPolicy } from "utils/policyDetails";
import { isPastDateTime } from "utils/formatDate";
import { getTravelDuration } from "utils/quoteAndBuy";

interface MenuItem {
  label: string | undefined;
  url: string | undefined;
  isVisible: boolean | undefined;
}

interface Props {
  menuItems?: MenuItem[];
  languageData?: LanguageData;
  navigateTo?: (url: string) => void;
  toggleMenuVisibility: () => void;
  isOpen: boolean;
  onMouseLeave?: () => void;
  policyData?: any;
  isOpenClaim?: boolean;
  travelClaimDisabled?: boolean;
}

const HamburgerMenu: React.FC<Props> = ({
  menuItems,
  navigateTo,
  toggleMenuVisibility,
  isOpen,
  onMouseLeave,
  policyData,
  travelClaimDisabled,
}) => {

  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const { languageData } = useSelector((state: RootState) => state.dashbaordLanguageData);
  const getIcon = (label: string, isDisabled: boolean) => {

    if (isDisabled) {
      switch (label) {
        case languageData?.raise_a_claim:
          return VerifiedUser_disabled;
        case languageData?.policy_details:
        case languageData?.policy_history:
        case languageData?.cancel_policy:
        case languageData?.documents:
          return "";
        case languageData?.add_ons:
          return disableAddOnIcon;
        default:
          return disableAddOnIcon;
      }
    }

    switch (label) {
      case languageData?.policy_details:
        return policyDetailIcon;
      case languageData?.raise_a_claim:
        return claimIcon;
      case languageData?.policy_history:
        return historyIcon;
      case languageData?.cancel_policy:
        return cancelIcon;
      case languageData?.documents:
        return downloadIcon;
      case languageData?.add_ons:
        return addOnIcon;
      default:
        return policyDetailIcon;
    }
  };

  const menuClassName = `${style.policyCardHamburgerMenuBox} ${isOpen ? style.open : ""
    }`;

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const data = policyData;

  const {
    claims = [],
    isLoading: isQueryClaimLoading,
    error: queryClaimError,
  } = useSelector(
    (state: RootState) => state.queryClaim || { claims: [], error: null }
  ) as { claims: ClaimDetails[]; isLoading: boolean; error: unknown };

  const activeClaim = getActiveClaimNumberForPolicy(claims, data?.policyNo || "", languageData as LanguageData);
  const claimNumber: string = activeClaim?.claimNo || "";

  const productCode: Record<string, string> = {
    RMCOM: "Motor",
    RMTPL: "Motor",
    TRVL: "Travel",
    HOME: "Home",
  };
  const claimData = {
    policies: data,
    ownerId: data?.nationalID,
    mobileNumber: data?.mobileNo,
    productIDs: data?.productCode?.toLowerCase(),
    isPolicyCardSelected: true,
  }

  const handleNavigate = (e, isDisabled: boolean) => {
    if (isDisabled) return;

    switch (e.target.textContent) {
      case languageData?.policy_details:
        navigate("/PolicyService/Details", {
          state: { data },
        });
        break;
      case languageData?.add_ons:
        navigate(
          "/PolicyService/Endorsement",
          {
            state: { data },
          }
        );
        break;
      case languageData?.cancel_policy:
        navigate(
          `/${productCode[data?.productCode]}/Claim/Policy-Cancellation`,
          {
            state: { data: { ...data } },
          }
        );
        break;
      case languageData?.policy_history:
        queryClient.invalidateQueries({
          queryKey: [languageData?.policy_history],
        });
        navigate("/PolicyService/History", {
          state: { data },
        });
        break;
      case languageData?.raise_a_claim:
        navigate(
          data?.productCode === TRAVEL
            ? "/travel/claim/registerclaim"
            : "/register-claim", {
          state: { data: claimData },
        });
        break;
      case languageData?.documents:
        navigate("/PolicyService/Documents", {
          state: { data },
        });
        break;
      default:
    }
  };

  const getModalBodyContent = () => (claimNumber ? <div>
    <p
      dangerouslySetInnerHTML={{
        __html: sanitizeHtml(languageData?.cancelModalContent
          .replace(
            /<<claimNo>>/i,
            `<strong>${claimNumber || ""}</strong>`
          )
          .replace(
            /<<policyNo>>/i,
            `<strong>${data?.policyNo || ""}</strong>`
          ),
        )
      }}
    ></p>
  </div> : <p>{languageData?.policyCancelErrMsg}</p>)

const isTravelMultiTrip =
  getTravelDuration(data?.expiryDate, data?.effectiveDate) >
  travelMultiTripDurationDays;


  return (
    <>
      {showErrorDialog && (
        <ErrorDialogBox
          imgSrc={Warning_large}
          onClose={() => {
            setShowErrorDialog(false);
            toggleMenuVisibility();
          }}
          buttonName={languageData?.ok || "Ok"}
          headingContent={languageData?.cancelModalHeader}
          bodyContent={getModalBodyContent()}
          isCentered={true}
        />
      )}

      <div data-testid="mock-hamburger-menu" className={menuClassName} onMouseLeave={showErrorDialog ? showErrorDialog : onMouseLeave} role="button" tabIndex={0} onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
        }
      }}>
        <div className={style.policyCardHamburgerMenuContainer}>
          {menuItems &&
            menuItems
              .filter((item) => item.isVisible)
              .map((item, index) => {
                const isDisabled =
                  ((item.label === languageData?.add_ons ||
                    (travelClaimDisabled &&
                      item.label === languageData?.raise_a_claim)) &&
                    data?.productCode === TRAVEL) ||
                  (item.label === languageData?.raise_a_claim &&
                    data?.productCode === MOTOR);

                return (
                  <div
                    key={index}
                    className={style.navigateContainer}
                  >
                    <img
                      src={getIcon(item.label || "", isDisabled)}
                      alt={`${item.label} icon`}
                    />
                    <div
                      className={` ${style.navigateTextContainer} ${isDisabled ? style.disabledMenuUnderline : ''}`}
                      onClick={(event) => {
                        if (
                          item.label === languageData?.cancel_policy &&
                          (claimNumber ||
                            (data?.productCode === TRAVEL &&
                              isPastDateTime(
                                data?.effectiveDate,
                                dateFormats.apiDate
                              ) && !isTravelMultiTrip))
                        ) {
                          event.preventDefault(); // Prevent default behavior if needed
                          setShowErrorDialog(true);
                          return; // Block handleNavigate
                        }
                        handleNavigate(event, isDisabled);
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <div className={`${style.navigateText} ${isDisabled ? style.disabledMenu : ''}`}>{item.label}</div>
                      {item.label === languageData?.cancel_policy && claimNumber && (<img src={Warning} />)}
                    </div>
                  </div>
                );
              })}
        </div>
        <div
          className={style.policyCardHamburgerMenuClose}
          onClick={toggleMenuVisibility}
          role="button" tabIndex={0} onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              toggleMenuVisibility();
            }
          }}
        >
          <img src={closeIcon} alt="closeIcon" />
        </div>
        <img src={Union} className={style.backgroundUnion} />
      </div>
    </>
  );
};

export default HamburgerMenu;
