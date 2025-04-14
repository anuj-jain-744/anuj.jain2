import React from "react";
import policyDetailIcon from "assets/Dashboard/hamburgerLibraryBooks.svg";
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
import { RootState } from "@dpm/shared-module";
import { TRAVEL } from "constant";

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
}

const HamburgerMenu: React.FC<Props> = ({
  menuItems,
  navigateTo,
  toggleMenuVisibility,
  isOpen,
  onMouseLeave,
  policyData,
}) => {

  const { languageData } = useSelector((state: RootState) => state.dashbaordLanguageData);
  const getIcon = (label: string, isDisabled: boolean) => {

    if (isDisabled) {
      switch (label) {
        case languageData?.policy_details:
        case languageData?.raise_a_claim:
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

  const menuClassName = `${style.policyCardHamburgerMenuBox} ${
    isOpen ? style.open : ""
  }`;

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const data = policyData;

  const productCode: Record<string, string> = {
    RMCOM: "Motor",
    RMTPL: "Motor",
    TRVL: "Travel",
    HOME: "Home",
  };

  const handleNavigate = (e, isDisabled: boolean) => {
    if (isDisabled) return;

    switch (e.target.textContent) {
      case languageData?.policy_details:
        navigate("/Motor/Claim/PolicyDashboard", {
          state: { data },
        });
        break;
      case languageData?.add_ons:
        navigate(
          data?.productCode === TRAVEL
            ? "/Travel/Claim/Endorsement"
            : "/Motor/Claim/Endorsement",
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
        navigate("/Motor/Claim/PolicyHistory", {
          state: { data },
        });
        break;
      case languageData?.raise_a_claim:
        navigate("/Register-claim", {
          state: { data },
        });
        break;
      case languageData?.documents:
        navigate("/Motor/Claim/Policy-Dcouments", {
          state: { data },
        });
        break;
      default:
    }
  };

  return (
    <div data-testid="mock-hamburger-menu" className={menuClassName} onMouseLeave={onMouseLeave}>
      <div className={style.policyCardHamburgerMenuContainer}>
        {menuItems &&
          menuItems
            .filter((item) => item.isVisible)
            .map((item, index) => {
              const isDisabled =
                item.label === languageData?.add_ons && data?.productCode === TRAVEL;

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
                    className={` ${style.navigateTextContainer} ${isDisabled ? style.disabledMenuUnderline : ''   }`}
                    onClick={(e) => handleNavigate(e, isDisabled)}
                  >
                    <div className={`${style.navigateText} ${isDisabled ? style.disabledMenu : ''}`}>{item.label}</div>
                  </div>
                </div>
              );
            })}
      </div>
      <div
        className={style.policyCardHamburgerMenuClose}
        onClick={toggleMenuVisibility}
      >
        <img src={closeIcon} alt="closeIcon" />
      </div>
      <img src={Union} className={style.backgroundUnion} />
    </div>
  );
};

export default HamburgerMenu;
