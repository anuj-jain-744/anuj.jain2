import React, { useEffect, useState, useCallback } from "react";
import { useSpring, animated, useSpringRef, useChain } from "@react-spring/web";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css"; 
import { sanitizeHtml } from "@dpm/shared-module";

import "./index.scss";
import CarouselSlider from "./CarouselSlider";
import {
  useCommonContext,
} from "@dpm/shared-module";

// Configuration for the carousel
const carouselResponsive = {
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
    slidesToSlide: 1,
    partialVisibilityGutter: 50,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1,
    partialVisibilityGutter: 50,
  },
};

export interface SupportDataProps {
  title: string;
  desc: string;
  contact: string;
  icon: string;
  tinyicon: string;
  link:string;
}

interface SupportProps {
  supportData: SupportDataProps[];
  title: string;
  description: string;
  className?:string;
  isVisible?: boolean;
  carouselSetFlag?:boolean;
  navigateTo: (url: string) => void;
}

export const Support: React.FC<SupportProps> = ({
  supportData,
  title,
  description,
  className,
  isVisible= false,
  carouselSetFlag,
  navigateTo,
}) => {
  const supportTitleRef = useSpringRef();
  const supportCardRef = useSpringRef();

  const springSupportTitle = useSpring({
    ref: supportTitleRef,
    from: { transform: isVisible ? 'translateX(0%) translateY(50%)' : "translateX(0%) translateY(0%)" },
    to: { transform: isVisible ? 'translateX(0%) translateY(0%)' : "translateX(0%) translateY(0%)" },
    config: { tension: 50, friction: 30 },
  });

  const springSupportCards = useSpring({
    ref: supportCardRef,
    from: { 
      transform: isVisible ? 'translateX(0%) translateY(100%)' : "translateX(0%) translateY(0%)",
      opacity: isVisible ? 0 : 1,
    },
    to: { 
      transform: isVisible ? 'translateX(0%) translateY(0%)' : "translateX(0%) translateY(100%)",
      opacity: isVisible ? 1 : 0,
    },
    config: { tension: 50, friction: 30 },
  });

  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [carouselFlag, carouselFlagSet] = useState<boolean>(false);
  const handleResize = useCallback(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  useChain([supportTitleRef, supportCardRef], [0, 0.5]);

  useEffect(()=>{
    carouselSetFlag ? carouselFlagSet(carouselSetFlag) : carouselFlagSet(false);
  },[carouselSetFlag])

  const isMobileOrTablet = windowWidth <= 768;
  const { currentLanguage } = useCommonContext();
  return (
    <div className="support_section">
      <div className={`support ${className ?? ""}`}>
      <div className="ornament-btm"></div>
        <div className="ornament-top"></div>
  
        <Container fluid>
          <Row>
            <Col className="support_left" xs={12} sm={12} md={6} lg={4}>
              <animated.div style={isVisible ? springSupportTitle : {}} className="support_head flex-column justify-content-center">
                <h2 className="glob-walaa-heading-text walaa-medium-500" dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(title),
                  }}
                />
                <p
                  className="glob-walaa-subheading-text walaa-medium-400"
                  style={{ whiteSpace: "pre-wrap" }}
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(description).replace("\\n", "<br/>"),
                  }}
                />
              </animated.div>
            </Col>
            <Col className="support_right" xs={12} sm={12} md={6} lg={8}>
              {isMobileOrTablet && !carouselFlag ? (
                <Carousel
                  swipeable={true}
                  draggable={true}
                  responsive={carouselResponsive}
                  infinite={true}
                  autoPlay={true}
                  keyBoardControl={true}
                  transitionDuration={1000}
                  containerClass="carousel-container"
                  renderArrowsWhenDisabled={true}
                  renderButtonGroupOutside={true}
                  arrows={false}
                  partialVisible={true}
                  ssr={true}
                  rtl={currentLanguage === 'ar' ? true : false}
                  showDots={true}
                  renderDotsOutside={true}
                  dotListClass="custom-dot-list-style"
                >
                  {supportData.map((data, index) => (
                    <CarouselSlider key={index} data={data} index={index} navigateTo={navigateTo}/>
                  ))}
                </Carousel>
              ) : (
                <animated.div style={isVisible ? springSupportCards : {}}>
                <Row className="rtl-card">
                  {supportData.map((data, id) => (
                    <Col key={id} xs={12} sm={12} md={6} lg={6}>
                      <div className="support_card">
                        {data.icon && <img src={data.icon} alt="support" />}
                        <h3 className="walaa-medium-500">{data.title}</h3>
                        <p
                          className="walaa-medium-400"
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(data.desc).replace(
                              "\\n",
                              "<br/>"
                            ),
                          }}
                        />
                        <div className="support_contact walaa-medium-500">
                        {data.contact && navigateTo && (
                          <a onClick={()=>data.link ? navigateTo(data.link): ""}  className="link-underline-light">
                         
                            {data.tinyicon && (
                              <img src={data.tinyicon} alt="support" />
                            )}
                            {data.contact}
                          </a>
                        )}
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
                </animated.div>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Support;
