import React from "react";
import { Button, Container } from "react-bootstrap";
import { Breadcrumbs } from "../Breadcrumbs";
import EastIcon from "@mui/icons-material/East";
import { useSpring, animated } from "@react-spring/web";

interface SlideItem {
  slider_image_url?: string;
  slider_title?: string;
  slider_video_url?: string;
  slider_description?: string;
}

interface Item {
  label: string;
  route: string;
}

interface CarouselContentProps {
  slideItem: SlideItem;
  type: "image" | "video";
  breadcrumbs?: Item[];
  navigateTo?: (url: string) => void;
  buttonLabel?: string;
  buttonLink?: string;
  isVisible?: boolean;
  isProductPage?: boolean;
}

const CarouselContent: React.FC<CarouselContentProps> = ({
  slideItem,
  type,
  breadcrumbs,
  navigateTo,
  buttonLabel,
  buttonLink,
  isVisible = false,
  isProductPage = false,
}) => {

  const springs = useSpring({
    from: { 
      transform: isVisible ? 'translateX(100%) translateY(-50%)' : "translateX(0%) translateY(-50%)",
    },
    to: { 
      transform: isVisible ? 'translateX(0%) translateY(-50%)' : "translateX(100%) translateY(-50%)",
    },
    config: { tension: 50, friction: 30 },
    delay: 200,
  });
  return (
    <div className={`carousel-content-container ${breadcrumbs && 'regular-banner'}`} data-testid="carousel-content">
      {breadcrumbs && (
        <Breadcrumbs items={breadcrumbs} navigateTo={navigateTo} />
      )}
      {type === "image" ? (
        <img
          src={slideItem?.slider_image_url}
          alt={slideItem?.slider_title}
          className={`banner-graphic ${isProductPage ? "product-page-banner" : ""}`}
        />
      ) : (
        <video
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          className={`banner-graphic ${isProductPage ? "product-page-banner" : ""}`}
        >
          <source src={slideItem?.slider_video_url} type="video/mp4" />
        </video>
      )}

      <Container>
        <animated.div className={`carousel-content ${breadcrumbs ? 'highlighter-banner' : ''}`} style={isVisible ? springs : {}}>
          <h1 className="content-header walaa-medium-500">
            {slideItem?.slider_title}
          </h1>
          <span className="content-subheader walaa-regular-400">
            {slideItem?.slider_description}
          </span>
          {buttonLabel && <Button onClick={() => navigateTo ? navigateTo(buttonLink ?? ""): ""} className="carouselButton">
              <span className="button-label walaa-medium-500">
                {buttonLabel}
              </span>
              <span className="icon">
                <EastIcon />
              </span>
            </Button>}
        </animated.div>
      </Container>
    </div>
  );
};

export default CarouselContent;
