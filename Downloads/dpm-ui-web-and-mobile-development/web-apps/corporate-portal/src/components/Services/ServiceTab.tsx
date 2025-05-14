import { useEffect, useRef, useState } from "react";
import { Button, Row } from "react-bootstrap";
import { useSpring, animated, useSpringRef, useChain } from "@react-spring/web";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import styles from "../../styles/custom.module.css";
import CarouselItems, { CurrentTabItemProps } from "./CarouselItems";
import {
  useCommonContext,
} from "@dpm/shared-module";
import { BreakPoints } from "constant";


interface ResponsiveObjectProps {
  [key: string]: {
    breakpoint: {
      max: number;
      min: number;
    };
    items: number;
    slidesToSlide: number;
    partialVisibilityGutter?: number;
  };
}

// responsive for the slider starts
const responsive: ResponsiveObjectProps = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1300 },
    items: 4,
    slidesToSlide: 1,
  },
  desktop: {
    breakpoint: { max: 1300, min: 1024 },
    items: 3,
    slidesToSlide: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 820 },
    items: 3,
    slidesToSlide: 1,
  },
  Portrait: {
    breakpoint: { max: 820, min: 500 },
    items: 2,
    slidesToSlide: 1,
  },
  mobile: {
    breakpoint: { max: 500, min: 0 },
    items: 1,
    slidesToSlide: 1,
    partialVisibilityGutter: 60,
  },
};

interface ButtonGroupProps1 {
  next?: () => void;
  previous?: () => void;
  carouselState?: {
    currentSlide: number;
    totalItems: number;
  };
  page?: boolean;
}

export const ButtonGroup = ({
  next,
  previous,
  carouselState,
  page = false,
}: ButtonGroupProps1) => {
  let { currentSlide, totalItems } = { currentSlide: 0, totalItems: 0 };
  if (carouselState) ({ currentSlide, totalItems } = carouselState);

  // finds the current window width
  const currentWidth = window.innerWidth;

  // finds the current breakpoint based on the window width
  const currentBreakpoint = Object.keys(responsive).find((key) => {
    const { breakpoint } = responsive[key];
    return currentWidth >= breakpoint.min && currentWidth <= breakpoint.max;
  });
  let maxSlides = 1;
  // Extract the responsive settings for the current breakpoint
  if (currentBreakpoint) {
    const currentResponsiveSettings = responsive[currentBreakpoint];

    //   the number of items that should be visible based on the current breakpoint
    maxSlides = currentResponsiveSettings?.items;
  }

  // Show buttons only if the total number of items exceeds the number of visible items per slide
  const showButtons = totalItems > maxSlides;

  return (
    showButtons && (
      <div className="carousel-button-group">
      </div>
    )
  );
};

export interface ServiceTabProps {
  hideProductTab?: boolean;
  hideSubButtons?: boolean;
  serviceProducts?: any;
  isVisible?: boolean;
  servicesData: any;
  labels?: {
    [key: string]: string;
  };
  navigateTo?: (url: string) => void;
}

const ServicesTab = ({
  hideProductTab = false,
  hideSubButtons = false,
  serviceProducts = null,
  isVisible = false,
  servicesData,
  labels,
  navigateTo
}: ServiceTabProps) => {
  const serviceRef = useSpringRef()
  const productDataRef = useSpringRef();
  const productTabRef = useSpringRef();
  const springServices = useSpring({
    ref: serviceRef,
    from: { transform: isVisible ? 'translateX(50%) translateY(0%)' : "translateX(0%) translateY(0%)" },
    to: { transform: isVisible ? 'translateX(0%) translateY(0%)' : "translateX(50%) translateY(0%)" },
    config: { tension: 70, friction: 50 },
  });

  const productTab = useSpring({
    ref: productTabRef,
    from: { opacity: isVisible ? '0' : "1" },
    to: { opacity: isVisible ? '1' : "0" },
  });

  const productData = useSpring({
    ref: productDataRef,
    from: {
      transform: isVisible ? 'translateX(0%) translateY(100%)' : "translateX(0%) translateY(0%)",
      opacity: isVisible ? '0' : "1"
    },
    to: {
      transform: isVisible ? 'translateX(0%) translateY(0%)' : "translateX(0%) translateY(100%)",
      opacity: isVisible ? '1' : "1"
    },
    config: { tension: 50 },
  });

  // Tab of slider starts
  const [activeParentTabIndex, setActiveParentTabIndex] = useState<number>(1);
  const [activeSubTabIndex, setActiveSubTabIndex] = useState<number>(0);
  const carouselRef = useRef<any>(null);
  const [activeProduct, setActiveProduct] = useState<number>(0);
  const tabContents = (labels && typeof labels === 'object' && Object.keys(labels).length > 1) ? 
  [
    {
      title: labels?.renewal_label,
    },
    {
      title: labels?.policy_servicing_label,
    },
  ]
  : [];

  const handleProductToggleClick = (productIndex: number) => {
    setActiveProduct((prevState) => productIndex);
    setActiveSubTabIndex(0);
  };


  const currentTabKey = Object.keys(servicesData)[activeProduct] || null;
  const currentTabData = currentTabKey ? servicesData[currentTabKey] : [];
  const currentSubTabData =
  servicesData[Object.keys(servicesData)[activeProduct]] || {};
  const currentSubTabKeys = Object.keys(currentSubTabData);
  const currentTabItems: CurrentTabItemProps[] =
    currentSubTabData[currentSubTabKeys[activeSubTabIndex]] || [];

  // API calling Ends
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= BreakPoints.Tablet_Max);
  const { currentLanguage } = useCommonContext();


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= BreakPoints.Tablet_Max);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset carousel to first slide
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.goToSlide(0);
    }
  }, [activeSubTabIndex]);

  const handleParentTabClick = (index: number) => {
    setActiveParentTabIndex(index);
    setActiveSubTabIndex(0);
  };

  useChain([serviceRef, productTabRef, productDataRef], [0, 2, 2])

  return (
    <>
      {/* Main tabs */}
      <animated.div style={isVisible ? springServices : {}} className="tab-buttons">
        {!hideProductTab && (
          <div className="product-toggle-wrapper-Ui-Tabs">
            <div className="product-toggle walaa-medium-500">
              {Object.keys(servicesData).map((checkbox, index) => (
                <div
                  data-testid={`productToggle-${index}`}
                  key={index}
                  className={`${activeProduct === index ? "selected" : "default"
                    }`}
                  onClick={() => handleProductToggleClick(index)}
                >
                  <span>{checkbox}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </animated.div>
      {Object.keys(servicesData).length > 0 ? (
        Object.keys(currentTabData).length > 0 ? (
          <div className={`${hideProductTab ? 'border-top-left' : ''} service-white-container`}>
            {/* Sub-tabs */}
            {!hideSubButtons && currentSubTabKeys.length > 0 && (
              <animated.div style={isVisible ? productTab : {}} className="sub-tab-buttons">
                {currentSubTabKeys.map((subTab, subTabIndex) => (
                  <div
                    data-testid={`activeSubTab-${subTabIndex}`}
                    key={subTabIndex}
                    onClick={() => setActiveSubTabIndex(subTabIndex)}
                    className={`${activeSubTabIndex === subTabIndex ? "active" : ""
                      } sub-tab-list  walaa-regular-400`}
                  >
                    {subTab}
                  </div>
                ))}
              </animated.div>
            )}

            <animated.div style={isVisible ? productData : {}} >
              <Row className="align-items-start tab-content">
                <Carousel
                  swipeable={true}
                  draggable={true}
                  showDots={isMobile}
                  renderDotsOutside={true}
                  responsive={responsive}
                  ssr={true}
                  infinite={false}
                  autoPlaySpeed={1000}
                  keyBoardControl={true}
                  customTransition="all .5"
                  transitionDuration={500}
                  containerClass={`carousel-container ${serviceProducts ? "mt-0" : ""
                    }`}
                  dotListClass="custom-dot-list-style"
                  partialVisible={true}
                  arrows={false}
                  renderArrowsWhenDisabled={true}
                  ref={carouselRef}
                  renderButtonGroupOutside={true}
                  customButtonGroup={<ButtonGroup />}
                  rtl={currentLanguage === 'ar' ? true : false}
                >
                  {currentTabItems.length > 0 &&
                    currentTabItems.map(
                      (item: CurrentTabItemProps, itemIndex: number) => (
                        <CarouselItems item={item} key={itemIndex} navigateTo={navigateTo}/>
                      )
                    )}
                </Carousel>
              </Row>
            </animated.div>
          </div>
        ) : (
          <div className="no-data-message">
            No items available for this tab.
          </div>
        )
      ) : (
        <div className="loading-message">Loading...</div>
      )}
    </>
  );
};

export default ServicesTab;
