import React, { useEffect, useRef } from "react";
import { Button, Card } from "react-bootstrap";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./index.scss";
import {
  useCommonContext,
} from "@dpm/shared-module";
import { ButtonGroup } from "../../pages/Sustainability/buttonGroup";
// Configuration for the carousel
const carouselResponsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  }

};
interface KnowMoreProps {
  content: any;
  navigateTo: (url: string) => void;
  enableTransition?: boolean;
}
export const KnowMoreWidget: React.FC<KnowMoreProps> = ({
  content,
  navigateTo,
  enableTransition = true
}) => {
  const data = content?.sidebar_data ? content?.sidebar_data[0] : [];
  const sliderData = content?.slider ? content?.slider : [];
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let imageUrl = data?.sidebar_image?.url;
    if (cardRef.current && imageUrl) {
      imageUrl = imageUrl.replace(' ', '%20');
      cardRef.current.style.backgroundImage = `url(${imageUrl})`;
    }
  }, [data?.sidebar_image?.url]);

  const { currentLanguage } = useCommonContext();

  return (
    <>
      {data && content?.sidebar_data && content?.sidebar_data.length === 1 ? (

        <Card className="know-more-outer" ref={cardRef} >
          <Card.Body>
            <div className="widget-content-wrapper">
              <div className="widget-content">
                <h4 className="content-title" data-testid="img-title">{data?.image_title}</h4>
                <p className="content-desc" data-testid="img-desc">{data?.image_description}</p>
                <Button
                  data-testid="img-btn"
                  onClick={() =>
                    data?.check_eligibility_link
                      ? navigateTo(data?.image_button_link)
                      : ""
                  }
                  className="content-btn"
                >
                  {data?.image_button}
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>) : (
        <div className="login-carousel">
          <Carousel
            swipeable={true}
            draggable={true}
            responsive={carouselResponsive}
            infinite={true}
            autoPlay={true}
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
            renderDotsOutside={false}
            dotListClass="custom-dot-list-style"
            customButtonGroup={<ButtonGroup enableInfiniteArrow={true}/>}
          >
            {sliderData.length > 0 && sliderData.map((slider:any, index:any) => (

              <Card className="login-outer" key={index}>
                <Card.Img
                  data-testid={`login-card-image-${index}`}
                  className="login-card-img"
                  src={slider?.slider_image_url}
                />
                <Card.ImgOverlay className="login-overlay">
                  <div className="login-widget-content">
                    <h4 className="login-content-title" data-testid={`login-content-title-${index}`}>{slider?.slider_title}</h4>
                    <p className="login-content-desc" data-testid={`login-content-desc-${index}`}>{slider?.slider_description}</p>

                  </div>
                </Card.ImgOverlay>
              </Card>

            ))}
          </Carousel>
        </div>
      )}
    </>
  );
};
