import React, { useState, useEffect } from "react";
import "./PoliciesCard.scss";
import Union from "assets/Dashboard/Union.svg";
import Bullet from "assets/Dashboard/Bullet.svg";
import MotorLogo from "assets/Dashboard/Motor_Logo.svg";
import Logo from "assets/QuoteAndBuy/travelinfo.svg";
import More from "assets/Dashboard/More_new.svg";
import ContextualTokenAdd from "assets/Dashboard/Contextual Token Add.svg";
import Addons_disabled from "assets/Dashboard/Contextual Token Add_disabled.svg";
import VerifiedUser from "assets/Dashboard/Verified User.svg";
import VerifiedUser_disabled from "assets/Dashboard/Verified User_disable.svg";
import Download from "assets/Dashboard/Download.svg";
import HamburgerMenu from "./HamBurgerMenu/HamburgerMenu";
import Travel from "assets/Dashboard/Travel.svg";
import Home from "assets/Dashboard/Home.svg";
import { formatDate } from "utils/formatDate";
import { useNavigate } from "react-router-dom";
import {CURRENCY} from "constant";
import { useSelector , useDispatch} from "react-redux";
import { RootState,slices } from "@dpm/shared-module";
import {NA, TRAVEL} from "constant";


const productLogos: { [key: string]: string } = {
  Motor: MotorLogo,
  TRVL: Travel,
  HOME: Home,
};

const PoliciesCard = ({ policy, navigateTo, disabled }: { policy: any, navigateTo: any, disabled: boolean }) => {
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
      url: "/Motor/Claim/PolicyDashboard",
      isVisible: true,
    },
    {
      label: languageData?.documents,
      url: "",
      isVisible: true,
    },
    {
      label: languageData?.policy_history,
      url: "",
      isVisible: true,
    },
    {
      label: languageData?.add_ons,
      url: "/Motor/Claim/Endorsement",
      isVisible: true,
    },
    {
      label: languageData?.raise_a_claim,
      url: "/Motor/Register-claim",
      isVisible: true,
    },
    {
      label: languageData?.cancel_policy,
      url: "/Motor/Claim/Policy-Cancellation",
      isVisible: true,
    },
  ];

  const productLogo = (productLogos[policy.productCode]) || MotorLogo;

  const navigate = useNavigate();

  const data = policy;

  const handleNavigate = (e) => {
    switch (e.target.textContent) {
      case languageData?.add_ons:
        if (!disabled && data?.productCode !== TRAVEL) {
          navigate("/Motor/Claim/Endorsement", {
            state: { data },
          });
        }
        break;
      case languageData?.raise_a_claim:
        if (!disabled) {
          navigate("/Register-claim", {
            state: { data },
          });
        }
        break;
      case languageData?.documents:
        navigate("/Motor/Claim/Policy-Dcouments", {
          state: { data },
        });
        break;
      default:
    }
  };

  const {
    setDashboard,
    clearDashboardData,
  } = slices.dashboardSlice;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearDashboardData({ currentPolicy: null }));
    dispatch(setDashboard({ currentPolicy: policy }));

  }, [policy]);
  return (
    <div
      data-testid="policies-card-container"
      className={`policies-card-container ${
        isMenuVisible
          ? "menu-visible-background"
          : "top-card-container-background"
      } ${disabled ? "disabled" : ""}`}
    >
      <img className="union-policy-card" src={Union} />
      <div className="card-policy">
        <div className={`status-label ${disabled ? "status-label-disabled" :""}`}>
          <div className="cmp-repair-type walaa-medium-500">
            {policy.coverageName || NA}
          </div>
          <div>
            <img src={Bullet} />
          </div>
          <div className="cmp-repair-type walaa-medium-500">
            {policy.repairCondition || NA}
          </div>
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
                {policy.issueDate ? formatDate(policy.issueDate) : NA} - {policy.expiryDate ? formatDate(policy.expiryDate) : NA}
              </div>
            </div>
            <div className="label-value">
              <div className="label walaa-regular-400">{languageData?.premium_amount}</div>
              <div className="value walaa-medium-500">{CURRENCY} {policy.premium || NA}</div>
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
            <div className={`walaa-regular-400 ${data?.productCode === TRAVEL || disabled ? 'disabled-label' : 'label'}`} onClick={handleNavigate}>{languageData?.add_ons}</div>
          </div>
          <div className="footer-logo-label">
            <div className="logo">
              <img src={disabled ? VerifiedUser_disabled : VerifiedUser} />
            </div>
            <div className={`walaa-regular-400 ${disabled ? 'disabled-label' : 'label'}`} onClick={handleNavigate}>{languageData?.raise_a_claim}</div>
          </div>
          <div className="footer-logo-label">
            <div className="logo">
              <img src={Download} />
            </div>
            <div className="label" onClick={handleNavigate}>{languageData?.documents}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliciesCard;
