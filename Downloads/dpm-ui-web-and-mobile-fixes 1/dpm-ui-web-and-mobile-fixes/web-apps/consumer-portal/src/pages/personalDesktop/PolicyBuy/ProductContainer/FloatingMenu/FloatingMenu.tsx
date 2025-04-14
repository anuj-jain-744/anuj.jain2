import React, { useState } from "react";
import style from "./FloatingMenu.module.scss";
import Product from "./Product";
import { LanguageData } from "types/languageData";

interface Props {
    navigateTo?: (url: string) => void;
    languageData?: LanguageData;
    onMenuToggle: () => void;
    actionName: string;
  }

const FloatingMenu:React.FC<Props> = ({ navigateTo, languageData, onMenuToggle, actionName }) => {
  const [isHovered, setIsHovered] = useState(true);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onMenuToggle();
  };

  return (
    isHovered && (
      <div
        className={style.container}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="menu"
      >
        <Product iconName={languageData?.motor ?? 'motor'} navigateTo={navigateTo} action={ actionName }/>
        <Product iconName={languageData?.travel ?? 'travel'} navigateTo={navigateTo} action={ actionName }/>
        <Product iconName={languageData?.home ?? 'home'} navigateTo={navigateTo} action={ actionName }/>
        <Product iconName={languageData?.medical ?? 'medical'} navigateTo={navigateTo} action={ actionName }/>
      </div>
    )
  );
};

export default FloatingMenu;