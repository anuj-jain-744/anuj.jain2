import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./index.scss";

import CarouselContent from "./CarouselContent";
import { CustomLeftArrow, CustomRightArrow } from "./CustomAnchors";
import VisibilityWrapper from "components/VisibilityWrapper";
import {
  useCommonContext,
} from "@dpm/shared-module";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

interface SlidesProps {
  slider_title: string;
  slider_description: string;
  slider_video_url?: string;
  slider_image_url?: string;
  slider_type: string;
}

interface Item {
  label: string;
  route: string;
}

interface HeroBannerProps {
  heroBanner: SlidesProps[];
  breadcrumbs?: Item[];
  navigateTo?: (url: string) => void;
  buttonLabel?: string;
  buttonLink?: string;
  isParallex?: boolean;
}

export const HeroBanner = ({
  heroBanner,
  breadcrumbs,
  navigateTo,
  buttonLabel, 
  buttonLink,
  isParallex = false,
}: HeroBannerProps) => {
  const { currentLanguage } = useCommonContext();
  return (
    <div id="hero-banner" data-testid="hero-banner">
      <Carousel
        swipeable={true}
        draggable={true}
        responsive={responsive}
        customTransition="transform 1000ms ease-in-out"
        autoPlaySpeed={1000}
        keyBoardControl={true}
        transitionDuration={1000}
        containerClass="carousel-container"
        itemClass="carousel-item-padding-40-px"
        renderArrowsWhenDisabled={true}
        rtl={currentLanguage === 'ar' ? true : false}
        customRightArrow={
          <CustomRightArrow
            heroBannerLength={heroBanner?.length}
          />
        }
        customLeftArrow={
          <CustomLeftArrow
            heroBannerLength={heroBanner?.length}
          />
        }
      >
        {heroBanner?.map((slideItem, index) => (
          <React.Fragment key={index}>
            <VisibilityWrapper isParallex={isParallex}>
            {slideItem?.slider_type === "Image" ? (
              
              <CarouselContent
                slideItem={slideItem}
                type="image"
                breadcrumbs={breadcrumbs}
                navigateTo={navigateTo}
                buttonLabel={buttonLabel}
                buttonLink={buttonLink}
              />
            ) : (
              <CarouselContent
                slideItem={slideItem}
                type="video"
                breadcrumbs={breadcrumbs}
                navigateTo={navigateTo}
                buttonLabel={buttonLabel}
                buttonLink={buttonLink}
              />
            )}
            </VisibilityWrapper>
          </React.Fragment>
        ))}
      </Carousel>
    </div>
  );
};
