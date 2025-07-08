import React, { useEffect, useState, useRef } from "react";
import "./index.scss";
import { Container } from "react-bootstrap";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import CircleIcon from "@mui/icons-material/Circle";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import CarousalImg from "./CarousalImg";
import { useSpring, animated, useSpringRef, useChain } from "@react-spring/web";

export interface SliderItem {
  slider_image_url: string;
  slider_title: string;
  slider_description: string;
}

export interface MobileDownloadItem {
  app_image_title: string;
  app_image_url: string;
  app_url: string;
}

interface InsuranceExperienceProps {
  title: string;
  description: string;
  downLoadApp: string;
  mobileDownload: MobileDownloadItem[];
  sliderData: SliderItem[];
  isVisible?: boolean;
}

export const InsuranceExperience: React.FC<InsuranceExperienceProps> = ({
  title,
  description,
  downLoadApp,
  mobileDownload,
  sliderData,
  isVisible = false,
}) => {
  const responsiveMain = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };
  const mobileRef = useSpringRef();
  const contentRef = useSpringRef();

  const springMobile = useSpring({
    ref: mobileRef,
    from: { 
      transform: isVisible ? 'translateX(0%) translateY(50%)' : "translateX(0%) translateY(0%)",
      display: isVisible ? "none" : "block",
    },
    to: { 
      transform: isVisible ? 'translateX(0%) translateY(0%)' : "translateX(0%) translateY(50%)",
      display: isVisible ? "block" : "none",
    },
    config: { tension: 90, friction: 20 },
  });

  const springContent = useSpring({
    ref: contentRef,
    from: { 
      transform: isVisible ? 'translateX(0%) translateY(100%)' : "translateX(0%) translateY(0%)",
      opacity: isVisible ?  0 : 1,
    },
    to: { 
      transform: isVisible ? 'translateX(0%) translateY(0%)' : "translateX(0%) translateY(100%)",
      opacity: isVisible ? 1 :  0,
    },
    config: { tension: 90, friction: 20 },
  });

  const [activeSlider, setActiveSlider] = useState(0);
  const [visitedDots, setVisitedDots] = useState(new Set<number>());
  const [filteredData, setFilteredData] = useState<{
    filteredArray: MobileDownloadItem[];
    qrCodeItem: MobileDownloadItem | null;
  }>({
    filteredArray: [],
    qrCodeItem: null,
  });

  const carouselRef = useRef<Carousel | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlider((prev) => (prev + 1) % sliderData.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [sliderData.length]);

  useEffect(() => {
    if (carouselRef.current) {
      (carouselRef.current as any).goToSlide(activeSlider);
    }
    setVisitedDots((prev) => new Set(prev).add(activeSlider));
  }, [activeSlider]);

  const filterMobileDownload = (mobileDownload: MobileDownloadItem[]) => {
    const filteredArray = mobileDownload.filter(
      (item) => item.app_image_title !== "QR Code"
    );
    const qrCodeItem = mobileDownload.find(
      (item) => item.app_image_title === "QR Code"
    ) || null; // Explicitly set to null if not found
    setFilteredData({ filteredArray, qrCodeItem });
  };

  useEffect(() => {
    filterMobileDownload(mobileDownload);
  }, [mobileDownload]);

  useChain([mobileRef, contentRef]);

  return (
    <div className="insurance-experience">
      <Container className="content">
        <animated.div style={isVisible ? springMobile : {}} className="insurance-image">
          <Carousel
            swipeable={false}
            arrows={false}
            draggable={false}
            responsive={responsiveMain}
            ssr={true}
            infinite={false}
            ref={carouselRef}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={300}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
          >
            {sliderData.map((image, index) => (
              <div key={index} className="phone-banner">
                <CarousalImg slideItem={image} />
              </div>
            ))}
          </Carousel>
        </animated.div>
        <animated.div style={isVisible ? springContent : {}} className="text-content">
          <h2 className="walaa-medium-500">{title}</h2>
          <p className="walaa-medium-400">{description}</p>
          <div className="feature">
            <div className="custom-dot-list">
              {sliderData.map((_, index) => (
                <div key={index} className="custom-dot-list-style" >
                  <div>
                    {index <= activeSlider ? (
                      <div role="button"
                        className={`react-multi-carousel-dot ${
                          visitedDots.has(index) ? "visited" : ""
                        }`}
                      >
                        <CircleIcon
                          sx={{ color: "#CD0833" }}
                          fill="red"
                          className={`button-dots ${index === activeSlider ? "current_active" : ""} button-dots-active`}
                        />
                      </div>
                    ) : (
                      <div className="react-multi-carousel-dot">
                        <CircleOutlinedIcon className="button-dots" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="carousel-container">
              <h3 className="walaa-medium-500">
                {sliderData[activeSlider]?.slider_title}
              </h3>
              <p className="walaa-medium-400">
                {sliderData[activeSlider]?.slider_description}
              </p>
            </div>
          </div>
          <div className="download-section">
            <div className="qr-code">
              <img
               src={
                filteredData?.qrCodeItem?.app_image_url || ''  
              } 
                alt="QR Code"
              />
            </div>
            <div className="app-links">
              <h3 className="walaa-medium-500">{downLoadApp}</h3>
              <ul className="download-link">
                {filteredData?.filteredArray.length > 0 &&
                  filteredData?.filteredArray.map((item, index) => (
                    <li key={index}>
                      <a href={item.app_url} target="_blank" rel="noopener noreferrer">
                        <img
                          src={item.app_image_url}
                          alt="app_image_alt"
                          className="download-icon"
                        />
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </animated.div>
      </Container>
    </div>
  );
};
