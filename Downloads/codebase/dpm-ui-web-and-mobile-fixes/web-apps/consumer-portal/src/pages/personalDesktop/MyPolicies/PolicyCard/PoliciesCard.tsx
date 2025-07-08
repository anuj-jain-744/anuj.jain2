import React, { useMemo, useState } from "react";
import "./PoliciesCard.scss";
import Union from "assets/Dashboard/Union.svg";
import travelIcon from "assets/Dashboard/Travel-icon.svg";
import MotorLogo from "assets/Dashboard/Motor_Logo.svg";
import Home from "assets/Dashboard/Home.svg";
import More from "assets/Dashboard/More_new.svg";
import ContextualTokenAdd from "assets/Dashboard/Contextual Token Add.svg";
import Addons_disabled from "assets/Dashboard/Contextual Token Add_disabled.svg";
import VerifiedUser from "assets/Dashboard/Verified User.svg";
import VerifiedUser_disabled from "assets/Dashboard/Verified User_disable.svg";
import Download from "assets/Dashboard/Download.svg";
import HamburgerMenu from "./HamBurgerMenu/HamburgerMenu";
import { formatDate, isPastDateTime } from "utils/formatDate";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@dpm/shared-module";
import { dateFormats, NA, TRAVEL } from "constant";
import { PolicyDetail } from "types/Dashboard";
import { getAmountWithIcon } from "@app-shell/utils/common";
import { isTravelClaimDisabled } from "utils/quoteAndBuy";

  // producut icon
  const ProductLogos: { [key: string]: string } = {
    Motor: MotorLogo,
    TRVL: travelIcon,
    HOME: Home,
  };

const PoliciesCard = ({ policy, navigateTo, disabled }: { policy: PolicyDetail, navigateTo: (url: string, data?: { [key: string]: unknown }) => void, disabled: boolean }) => {
  const travelClaimDisabled = useMemo(() => {
    let result = disabled;
    if (policy?.productCode === TRAVEL) {
      result =
        isPastDateTime(policy.effectiveDate, dateFormats.apiDate) === true
          ? result
          : true;
      if (result === false) result = isTravelClaimDisabled(policy);
    }
    return result;
  }, [policy, disabled]);

  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const { languageData } = useSelector((state: RootState) => state.dashbaordLanguageData);

  const toggleMenuVisibility = () => {
    if (!disabled) {
      setIsMenuVisible(!isMenuVisible);
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setIsMenuVisible(false);
    }
  };

  const menuItems = [
    {
      label: languageData?.policy_details,
      url: "/PolicyService/Details",
      isVisible: true,
    },
    {
      label: languageData?.add_ons,
      url: "/PolicyService/Endorsement",
      isVisible: true,
    },
    {
      label: languageData?.documents,
      url: "",
      isVisible: true,
    },
    {
      label: languageData?.raise_a_claim,
      url: "/Motor/Register-claim",
      isVisible: true,
    },
    {
      label: languageData?.policy_history,
      url: "",
      isVisible: true,
    },
    {
      label: languageData?.cancel_policy,
      url: "/Motor/Claim/Policy-Cancellation",
      isVisible: true,
    },
  ];

  const productLogo = ProductLogos[policy.productCode || ""] || MotorLogo;

  const navigate = useNavigate();

  const data = policy;
  const claimData = {
    policies: policy,
    ownerId: policy?.nationalID,
    mobileNumber: policy?.mobileNo,
    productIDs: policy?.productCode?.toLowerCase(),
    isPolicyCardSelected: true,
  }

const handleNavigate = (e: React.MouseEvent<HTMLElement>) => {
  const targetText = (e.target as HTMLElement).textContent;
  const travelClaimEnabled = languageData?.raise_a_claim !== targetText || travelClaimDisabled === false;
  const isDisabled = disabled || !travelClaimEnabled || (policy?.productName?.includes(languageData?.third_party) && languageData?.raise_a_claim === targetText);

  switch (targetText) {
    case languageData?.add_ons:
      if (!isDisabled && data?.productCode !== TRAVEL) {
        navigate("/PolicyService/Endorsement", {
          state: { data },
        });
      }
      break;
    case languageData?.raise_a_claim:
      if (!isDisabled) {
        navigate(
          data?.productCode === TRAVEL
            ? "/travel/claim/registerclaim"
            : "/register-claim",
          { state: { data: claimData } }
        );
      }
      break;
    case languageData?.documents:
      navigate("/PolicyService/Documents", {
        state: { data },
      });
      break;
    default:
  }
};

  return (
    <div
      data-testid="policies-card-container"
      className={`policies-card-container ${
        isMenuVisible
          ? "menu-visible-background"
          : "top-card-container-background"
      } ${disabled && travelClaimDisabled ? "disabled" : ""}`}
    >
      <img className="union-policy-card" src={Union} />
      <div className="card-policy">
        <div className={`status-label ${disabled ? "status-label-disabled" :""}`}>
          <div className="cmp-repair-type walaa-medium-500">
            {policy.productName || NA}
          </div>
          {/* It will be required for future referance if EBAO is sending separate repairCondition and coverageName */}
          {/* <div>
            <img src={Bullet} />
          </div>
          <div className="cmp-repair-type walaa-medium-500">
            {policy.repairCondition || NA}
          </div> */}
        </div>
        <div className="card-policy-container">
          <div className="logo-policy">
            <div className="product-logo">
              <img src={productLogo} alt="product-logo"/>
            </div>
            <div className="product-policy">
              <div className="policy-number-label walaa-regular-400">
                {languageData?.policy_no}
              </div>
              <div className="policy-number walaa-medium-500">
                {policy.policyNo}
              </div>
            </div>
          </div>
          <div className="policy-period">
            <div className="label-value">
              <div className="label walaa-regular-400">{languageData?.policy_period}</div>
              <div className="value walaa-medium-500">
                {policy.effectiveDate ? formatDate(policy.effectiveDate) : NA} - {policy.expiryDate ? formatDate(policy.expiryDate) : NA}
              </div>
            </div>
            <div className="label-value">
              <div className="label walaa-regular-400">{languageData?.premium_amount}</div>
              <div className="value walaa-medium-500">{getAmountWithIcon(policy?.premium)}</div>
            </div>
          </div>
        </div>
      </div>
      <img
        className={`more-logo ${disabled ? "disabled" : ""}`}
        src={More}
        onClick={toggleMenuVisibility}
        alt="More"
      />
      {isMenuVisible && !disabled && ( 
        <HamburgerMenu
          data-testid="hamburger-menu"
          menuItems={menuItems}
          toggleMenuVisibility={toggleMenuVisibility}
          isOpen={isMenuVisible}
          onMouseLeave={handleMouseLeave}
          languageData={languageData}
          navigateTo={navigateTo}
          policyData={policy}
          travelClaimDisabled={travelClaimDisabled}
        />
      )}
      <div
        className={`card-policy-footer-container ${
          isMenuVisible ? "menu-visible-background" : "footer-card-background"
        } ${disabled ? "policies-card-footer-disabled" : ""}`}
      >
        <div className="card-policy-footer">
          <div className="footer-logo-label">
            <div className="logo">
              <img src={data?.productCode === TRAVEL || disabled ? Addons_disabled : ContextualTokenAdd} />
            </div>
            <div data-testid="policies-card-footer-addOns" className={`walaa-regular-400 ${data?.productCode === TRAVEL || disabled ? 'disabled-label' : 'label'}`}
              onClick={handleNavigate} role="button" tabIndex={0} onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleNavigate(e);
                }
              }}>{languageData?.add_ons}</div>
          </div>
          <div className="footer-logo-label">
            <div className="logo">
              <img src={disabled || travelClaimDisabled || policy?.productName?.includes(languageData?.third_party) ? VerifiedUser_disabled : VerifiedUser} />
            </div>
            <div data-testid="policies-card-footer" className={`walaa-regular-400 ${disabled || travelClaimDisabled || policy?.productName?.includes(languageData?.third_party)
              ? 'disabled-label' : 'label'}`} onClick={handleNavigate} role="button" tabIndex={0} onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleNavigate(e);
                }
              }}>{languageData?.raise_a_claim}</div>
          </div>
          <div className="footer-logo-label">
            <div className="logo">
              <img src={Download} />
            </div>
            <div className="label" onClick={handleNavigate} role="button" tabIndex={0} onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleNavigate(e);
              }
            }}>{languageData?.documents}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliciesCard;
