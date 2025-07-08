import React, { useEffect, useRef, useState } from "react";
import { Button, Row } from "react-bootstrap";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import styles from "../../styles/custom.module.css";
import CarouselItems from "./CarouselItems";
import { useSpring, animated } from "@react-spring/web";
import {
  useCommonContext,
} from "@dpm/shared-module";

// TO DO :: Uncomment once typing issue fixed
// const { VITE_CONTENT_BASE_URI } = import.meta.env;

interface ResponsiveObjectProps {
  [key: string]: {
    breakpoint: {
      max: number;
      min: number;
    },
    items: number;
    slidesToSlide: number;
    partialVisibilityGutter?: number;
  }
}

const responsive: ResponsiveObjectProps = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1300 },
    items: 4,
    slidesToSlide: 1
  },
  desktop: {
    breakpoint: { max: 1300, min: 1024 },
    items: 3,
    slidesToSlide: 1
  },
  tablet: {
    breakpoint: { max: 1024, min: 820 },
    items: 3,
    slidesToSlide: 1
  },
  Portrait: {
    breakpoint: { max: 820, min: 500 },
    items: 2,
    slidesToSlide: 1
  },
  mobile: {
    breakpoint: { max: 500, min: 0 },
    items: 1,
    slidesToSlide: 1,
    partialVisibilityGutter: 60
  },
};

interface ButtonGroupProps2 {
  next?: () => void;
  previous?: () => void;
  carouselState?: {
    currentSlide: number;
    totalItems: number;
  }
}

interface ProductTabProps {
  compData: {
    [key: string]: any[];
  };
  showTab?: boolean;
  navigateTo?: (url: string) => void;
  isVisible?: boolean;
}

export const ButtonGroup = ({ next, previous, carouselState }: ButtonGroupProps2) => {
  let { currentSlide, totalItems } = { currentSlide: 0, totalItems: 0 }
  if (carouselState)
    ({ currentSlide, totalItems } = carouselState);

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
        <Button
          data-testid="carouselButtonPrevious"
          className={`carousel-button-previous ${currentSlide === 0 ? "disable" : ""
            }`}
          onClick={() => {
            if (previous) {
              previous();
            }
          }}
        >
          <KeyboardArrowLeftIcon
            fontSize="small"
            className={`${styles.arrowprev} ${currentSlide === 0 ? "ondisable" : ""
              }`}
          />
        </Button>
        <Button
          data-testid="carouselButtonNext"
          className={`carousel-button-next ${totalItems && totalItems - maxSlides === currentSlide ? "disable" : ""
            }`}
          onClick={() => {
            if (next) {
              next()
            }
          }}
        >
          <KeyboardArrowRightIcon
            fontSize="small"
            className={`${styles.arrownext} ${totalItems && totalItems - maxSlides === currentSlide ? "ondisable" : ""}`}
          />
        </Button>
      </div>
    )
  );
};

const ProductTab: React.FC<ProductTabProps> = ({
  compData,
  showTab = true,
  navigateTo,
  isVisible = false
}) => {

  const springs = useSpring({
    from: {
      transform: isVisible ? 'translateX(50%) translateY(0%)' : "translateX(0%) translateY(0%)",
      opacity: isVisible ? 0 : 1,
    },
    to: {
      transform: isVisible ? 'translateX(0%) translateY(0%)' : "translateX(50%) translateY(0%)",
      opacity: isVisible ? 1 : 0,
    },
    config: { tension: 50, friction: 30 },
    delay: 1200,
  });

  const [activeTab, setActiveTab] = useState<number>(0);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState<boolean>(false);
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null); // State to track flipped card index

  const carouselRef = useRef<any>(null);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobileOrTablet(window.innerWidth <= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset carousel to first slide
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.goToSlide(0);
    }
  }, [activeTab]);

  // Handle tab click
  const handleTabClick = (tabIndex: number) => {
    setActiveTab(tabIndex);
  };

  // Handle card click
  const handleCardClick = (index: number) => {
    // Toggle the flip state or reset all cards
    setFlippedIndex(index === flippedIndex ? null : index);
  };

  const activeTabKey = Object.keys(compData)[activeTab];
  const currentTabData = compData[activeTabKey] || [];
  const { currentLanguage } = useCommonContext();


  return (
    <div className="productcateg" id="productToggle-1">
      <animated.div style={isVisible ? springs : {}} className="carousal-tab-container">
        {showTab && <div className="tab-buttons">
          {Object.keys(compData).map((tab, index) => (
            <div
              key={index}
              data-testid={`productToggle-${index}`}
              onClick={() => handleTabClick(index)}
              className={`${activeTab === index ? "active" : ""} tab-list walaa-medium-400`}
              role="button" tabIndex={0} onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handleTabClick(index)
                }
            }}
            >
              {tab}
            </div>
          ))}
        </div>}

        {Object.keys(compData).length > 0 ? (
          currentTabData.length > 0 ? (
            <Row className="align-items-start tab-content">
              <Carousel
                swipeable={true}
                draggable={true}
                showDots={false}
                renderDotsOutside={true}
                responsive={responsive}
                ssr={true}
                infinite={false}
                autoPlaySpeed={1000}
                keyBoardControl={true}
                customTransition="transform 500ms ease-in-out"
                transitionDuration={500}
                containerClass="carousel-container"
                dotListClass="custom-dot-list-style"
                itemClass="carousel-padding"
                ref={carouselRef}
                partialVisible={true}
                arrows={false}
                rtl={currentLanguage === 'ar' ? true : false}
                renderArrowsWhenDisabled={true}
                renderButtonGroupOutside={true}
                customButtonGroup={<ButtonGroup />}
              >

                {currentTabData.map((item: any, index: number) => (
                  <div className="product-item" key={index}>
                    <CarouselItems
                      item={item}
                      index={index}
                      isMobileOrTablet={isMobileOrTablet}
                      flippedIndex={flippedIndex}
                      onCardClick={handleCardClick}
                      navigateTo={navigateTo}
                    />
                  </div>
                ))}

              </Carousel>
            </Row>
          ) : (
            <div className="no-data-message">No items available for this tab.</div>
          )
        ) : (
          <div className="loading-message">Loading...</div>
        )}
      </animated.div>
    </div>
  );
};

export default ProductTab;
