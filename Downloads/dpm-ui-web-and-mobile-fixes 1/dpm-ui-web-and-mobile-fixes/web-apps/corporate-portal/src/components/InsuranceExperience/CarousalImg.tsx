import React from "react";

interface SlideItem {
  slider_image_url?: string;
}

interface CarouselImgProps {
  slideItem: SlideItem;
}

const CarousalImg: React.FC<CarouselImgProps> = ({ slideItem }) => {
  return (
    <img
      src={slideItem.slider_image_url}
      alt="slider-img"
      className="phone-banner-img"
    />
  );
};

export default CarousalImg;
