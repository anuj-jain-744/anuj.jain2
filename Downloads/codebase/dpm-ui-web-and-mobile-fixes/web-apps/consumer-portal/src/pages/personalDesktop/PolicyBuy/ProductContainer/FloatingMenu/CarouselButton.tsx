import React, { useState } from 'react';
import menuLeftNormal from 'assets/DashboardBanner/menuLeftNormal.svg';
import menuLeftActive from 'assets/DashboardBanner/menuLeftActive.svg';
import menuRightNormal from 'assets/DashboardBanner/menuRightNormal.svg';
import menuRightActive from 'assets/DashboardBanner/menuRightActive.svg';
import style from './CarouselButton.module.scss';

interface CarouselProps {
  arrowButton: string;
}

const CarouselButton: React.FC<CarouselProps> = ({ arrowButton }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getIcon = () => {
    if (arrowButton === 'left') {
      return isHovered ? menuLeftActive : menuLeftNormal;
    } else if (arrowButton === 'right') {
      return isHovered ? menuRightActive : menuRightNormal;
    }
    return undefined;
  };

  return (
    <div
      className={style.container}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
        }
      }}
    >
      <img src={getIcon()} alt={`${arrowButton} button`} />
    </div>
  );
};

export default CarouselButton;