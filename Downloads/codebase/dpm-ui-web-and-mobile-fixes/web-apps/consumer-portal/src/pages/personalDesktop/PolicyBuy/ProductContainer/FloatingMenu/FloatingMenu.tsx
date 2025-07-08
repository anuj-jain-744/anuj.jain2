import React, { useState } from "react";
import style from "./FloatingMenu.module.scss";
import Product from "./Product";
import { LanguageData } from "types/languageData";
import CarouselButton from "./CarouselButton";

interface Props {
  navigateTo?: (url: string) => void;
  languageData?: LanguageData;
  onMenuToggle: () => void;
  actionName: string;
}

const FloatingMenu: React.FC<Props> = ({ navigateTo, languageData, onMenuToggle, actionName }) => {
  const [isHovered, setIsHovered] = useState(true);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onMenuToggle();
  };

  const products = [
    { iconName: languageData?.motor ?? "motor" },
    { iconName: languageData?.travel ?? "travel" },
    { iconName: languageData?.home ?? "home" },
    { iconName: languageData?.medical ?? "medical" },
  ];

  return (
    isHovered && (
      <div
        className={style.container}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="menu"
        tabIndex={0}
      >
        <CarouselButton arrowButton="left" />
        {products.map((product, index) => (
          <Product
            key={index}
            iconName={product.iconName}
            navigateTo={navigateTo}
            action={actionName}
            languageData={languageData}
          />
        ))}
        <CarouselButton arrowButton="right" />
      </div>
    )
  );
};

export default FloatingMenu;