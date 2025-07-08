import { Container } from "react-bootstrap";
import Carousel, { ResponsiveType } from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useCommonContext } from "@dpm/shared-module";
import {CustomCarouselProps} from './customCarousel.types';
import "./index.scss";



const responsive: ResponsiveType = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1299 },
    items: 3,
    slidesToSlide: 1,
  },
  desktop: {
    breakpoint: { max: 1200, min: 1024 },
    items: 2,
    slidesToSlide: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 820 },
    items: 2,
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

export const CustomCarousel: React.FC<CustomCarouselProps> = ({ title, carouselItems }) => {
  const { currentLanguage } = useCommonContext();
  return (
    <div className="custom-carousel-wrapper">
      <Container fluid>
        <div className="custom-content-wrapper">
          <div className="first-half-circle" />
          <h2 className="custom-title">{title}</h2> 
          <Carousel
            swipeable={true}
            draggable={true}
            showDots={true}
            responsive={responsive}
            autoPlaySpeed={3000}
            keyBoardControl={true}
            customTransition="transform 1s ease"
            itemClass="carousel-padding"
            partialVisible={true}
            arrows={false}
            autoPlay={true}
            infinite={true}
            rtl={currentLanguage === "ar"}
            renderArrowsWhenDisabled={false}
            renderButtonGroupOutside={true}
            // customButtonGroup={<ButtonGroup/>}
            pauseOnHover={true}
            className="custom-carousel"
          >
            {carouselItems.length > 0 &&
              carouselItems.map(
                ({ title, body, image_url, image_alt }, index) => (
                  <div key={index} className="carousel-item d-flex">
                    <div className="header-content">
                      <img src={image_url} alt={image_alt} />
                    </div>
                    <div className="title-content" test-id="element-title">
                      {title}
                      </div>
                    <div className="description-content">{body}</div>
                  </div>
                )
              )}
          </Carousel>
          <div className="second-half-circle" />
        </div>
      </Container>
    </div>
  );
};