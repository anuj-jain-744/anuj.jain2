import React, { useState } from "react";
import style from "./ProductElement.module.scss";
import buyNormal from 'assets/DashboardBanner/buyNormal.svg';
import buyHover from 'assets/DashboardBanner/buyHover.svg';
import buySelected from 'assets/DashboardBanner/buySelected.svg';
import registerClaimNormal from 'assets/DashboardBanner/registerClaimNormal.svg';
import registerClaimDisabled from 'assets/DashboardBanner/registerClaimDisabled.svg';
import trackClaimDisabled from 'assets/DashboardBanner/trackClaimDisabled.svg';
import registerClaimHover from 'assets/DashboardBanner/registerClaimHover.svg';
import registerClaimSelected from 'assets/DashboardBanner/registerClaimSelected.svg';
import trackClaimNormal from 'assets/DashboardBanner/trackClaimNormal.svg';
import trackClaimHover from 'assets/DashboardBanner/trackClaimHover.svg';
import trackClaimSelected from 'assets/DashboardBanner/trackClaimSelected.svg';
import FloatingMenu from './../FloatingMenu/FloatingMenu';
import { LanguageData } from "types/languageData";

interface ProductElementProps {
    iconName: string;
    text: string;
    navigateTo?: (url: string) => void;
    isDisabled?: boolean;
    languageData?: LanguageData;
    showMenu: boolean;
    onMenuToggle: () => void;
    isZeroUser?: boolean;
}

const ProductElement: React.FC<ProductElementProps> = ({ 
    iconName, 
    text, 
    navigateTo, 
    isDisabled, 
    languageData, 
    showMenu, 
    onMenuToggle,
    isZeroUser
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const getIcon = (iconName: string) => {
        if (iconName === 'buy') {
            if (showMenu) return buySelected;
            if (isHovered) return buyHover;
            return buyNormal;
        } else if (iconName === 'raiseClaim') {
            if (showMenu) return registerClaimSelected;
            if (isHovered) return registerClaimHover;
            return registerClaimNormal;
        } else if (iconName === 'trackClaim') {
            if (showMenu) return trackClaimSelected;
            if (isHovered) return trackClaimHover;
            return trackClaimNormal;
        }
        return buyNormal;
    }

    const getIconZeroUser = (iconName: string) => {
        if (iconName === 'raiseClaim') {
            return registerClaimDisabled;
        } else if (iconName === 'trackClaim') {
            return trackClaimDisabled;
        }
        return buyNormal;
    }

    const isClickable = () => {
        if (isZeroUser && iconName !== 'buy') {
            return false;
        }
        return true;
    };

    const handleClick = () => {
        if (isClickable()) {
            onMenuToggle();
        }
    };

    const isZeroUserValid = (isZeroUser && iconName !== 'buy');

    return (
      <div
        className={`${style.container} ${
          isZeroUserValid ? style.noCursor : ""
        }`}
      >
        <div
          className={`${style.productBox} ${showMenu ? style.selected : ""}`}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleClick();
            }
          }}
        >
          <img
            src={
              isZeroUserValid ? getIconZeroUser(iconName) : getIcon(iconName)
            }
            alt={`${iconName}Icon`}
            className={isZeroUserValid ? style.iconBoxDisabled : style.iconBox}
          />
          <div
            className={
              isZeroUserValid ? style.productDisableText : style.productText
            }
          >
            {text}
          </div>
        </div>
        {showMenu &&
          !isDisabled &&
          !(isZeroUser && iconName === "trackClaim") &&
          (isZeroUser ? iconName === "buy" : true) && (
            <FloatingMenu
              navigateTo={navigateTo}
              languageData={languageData}
              onMenuToggle={onMenuToggle}
              actionName={iconName}
            />
          )}
      </div>
    );
}

export default ProductElement;