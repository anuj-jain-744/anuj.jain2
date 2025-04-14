import React from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface CarouselState {
  currentSlide: number;
  deviceType: string;
}

interface ArrowProps {
  onClick?: () => void;
  heroBannerLength?: number;
  carouselState?: CarouselState;
}

export const CustomRightArrow: React.FC<ArrowProps> = ({
  onClick,
  heroBannerLength = 0,
  ...rest
}) => {
  const { carouselState } = rest;
  const currentSlide = carouselState?.currentSlide;
  const isLastSlide = currentSlide === heroBannerLength - 1;

  return (
    <span
      onClick={() => onClick && onClick()}
      className={`carousel-navigation-button ${
        isLastSlide ? "disabled-navigation" : "active-navigation"
      } right-anchor ${heroBannerLength === 1 && "d-none"}`}
      data-testid="right-arrow"
    >
      <ChevronRightIcon />
    </span>
  );
};

export const CustomLeftArrow: React.FC<ArrowProps> = ({
  onClick,
  heroBannerLength,
  ...rest
}) => {
  const { carouselState } = rest;
  const currentSlide = carouselState?.currentSlide;
  const isFirstSlide = currentSlide === 0;

  return (
    <span
      onClick={() => onClick && onClick()}
      className={`carousel-navigation-button ${
        isFirstSlide ? "disabled-navigation" : "active-navigation"
      } left-anchor ${heroBannerLength === 1 && "d-none"}`}
      data-testid="left-arrow"
    >
      <ChevronLeftIcon />
    </span>
  );
};
