import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { useSpring, animated } from "@react-spring/web";

import "./index.scss";
import ServicesTab, { ButtonGroup, ServiceTabProps } from "./ServiceTab";
import CarouselItems from "./CarouselItems";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { BreakPoints } from "constant";
import { useCommonContext } from "@dpm/shared-module";


interface ServicesProps extends ServiceTabProps {
  title: string;
  description?: string;
  isVisible?:boolean;
  page?:boolean;
  servicesData:any;
  labels?: {
    [key: string]: string;
  };
  navigateTo?: (url: string) => void;
}

export const Services = ({
  title,
  description,
  hideProductTab = false,
  hideSubButtons = false,
  serviceProducts = null,
  isVisible = false,
  page=false,
  servicesData,
  labels,
  navigateTo
}: ServicesProps) => {

  const { Inner_Width } = BreakPoints;

  const springServices = useSpring({
    from: { transform: isVisible ? 'translateX(50%) translateY(0%)' : "translateX(0%) translateY(0%)" },
    to: { transform: isVisible ? 'translateX(0%) translateY(0%)' : "translateX(50%) translateY(0%)" },
    config: { tension: 50, friction: 50 },
    delay: 200,
  });
  const responsive:any = {
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
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= Inner_Width);
  const { currentLanguage } = useCommonContext();


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= Inner_Width);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div data-testid="serviceContainer" id="productToggle-services"  className={`serviceCat ${page ? "hideBackgroundImage hideBackColor" : ""}  ${serviceProducts ? "hideBackgroundImage" : ""}`}>
      <Container fluid className={`midContainer container-fluid ${page ? "gols-title" : ""}`}>
        <animated.div style={isVisible ? springServices : {}}>
        <h2 className="walaa-medium-500"> {title} </h2>
        {!page && (<p className="walaa-regular-400">{description}</p>)}
        </animated.div>
        { !page && (<ServicesTab 
          hideProductTab={hideProductTab} 
          hideSubButtons={hideSubButtons}
          serviceProducts={serviceProducts}
          isVisible={isVisible}
          servicesData={servicesData}
          navigateTo={navigateTo}
          labels={labels}
        />)}
       {page && servicesData.length > 0 &&
            ( <div className="service-white-container">
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
                  containerClass="carousel-container"
                  dotListClass="custom-dot-list-style"
                  partialVisible={true}
                  arrows={false}
                  renderArrowsWhenDisabled={true}
                  renderButtonGroupOutside={true}
                  customButtonGroup={<ButtonGroup page={page} />}
                  rtl={currentLanguage === 'ar' ? true : false}
                >
            {servicesData.map((item: any, itemIndex: number) => (
                <CarouselItems item={item} key={itemIndex} page={page} navigateTo={navigateTo}/>
            ))}
            </Carousel>
              </Row>
        </div>)}
        
      </Container>
    </div>
  );
};
