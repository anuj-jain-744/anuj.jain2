import React from "react";
import { Container } from "react-bootstrap";
import Carousel from "react-multi-carousel";
import {
  useCommonContext,
} from "@dpm/shared-module";
import "./index.scss";
import { ButtonGroup } from "../../Sustainability/buttonGroup";
// Defining the types for the props

const carouselResponsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1300 },
    items: 3,
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
    slidesToSlide: 1
  },
};
interface WalaaObjectiveCard {
  icon: string;
  alt: string;
  description: string;
}
interface WalaaObjectiveProps {
  title: string;
  cards: WalaaObjectiveCard[];
  enableTransition?: boolean;
}
export const WalaaObjective: React.FC<WalaaObjectiveProps> = ({ title, cards, enableTransition = true }): JSX.Element => {

  const { currentLanguage } = useCommonContext();

  return (
    <Container fluid className="frame-objective">
      <div className="frame-obj-wrapper">
        <div className="components-card">
          <div className="WalaaObjective-title">{title}</div>
        </div>
        <div className="objective-carousel">
        <Carousel
          swipeable={true}
          draggable={true}
          responsive={carouselResponsive}
          infinite={false}
          autoPlay={false}
          {...(enableTransition && { transitionDuration: 2500 })}
          keyBoardControl={true}
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
          customButtonGroup={<ButtonGroup enableInfiniteArrow={false} />}
        >
          {cards && cards.length > 0 ? (
            cards.map((card, index) => (
              <div className="cards-icon-cards" key={index}>
                <div className="icon">
                  <img src={card.icon} alt={card.alt} className="icon-img" />
                </div>
                <div className="WalaaObjective-content">
                  <p className="contact-us">{card.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="no-cards-message">No items to display</div>
          )}
        </Carousel>
        </div>
      </div>
    </Container>
  );
};
