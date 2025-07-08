import React, { useEffect, useRef, useState } from "react";
import { Button, Card } from "react-bootstrap";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./index.scss";
import {
  useCommonContext,
} from "@dpm/shared-module";
import { ButtonGroup } from "../../pages/Sustainability/buttonGroup";
import { HeaderProps } from "components/Header/types/index.types";
 
// Configuration for the carousel
const carouselResponsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  }

};
export interface MobileDownloadItem {
  app_image_title: string;
  app_image_url: string;
  app_url: string;
}
interface KnowMoreProps {
  content: any;
  navigateTo: (url: string) => void; 
  enableTransition?: boolean;
  mobile_app_images?:HeaderProps["mobile_app_images"];
} 
interface Slider {
  id?: string; // Assuming id is optional
  slider_image_url: string; // Replace with the actual type of slider_image_url
}
export const KnowMoreWidget: React.FC<KnowMoreProps> = ({
  content,
  navigateTo,
  mobile_app_images,
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
            infinite={false}
            autoPlay={true}
            {...(enableTransition && { transitionDuration: 2500 })}
            keyBoardControl={true}
            containerClass="carousel-container"
            renderArrowsWhenDisabled={true}
            renderButtonGroupOutside={true}
            arrows={true}
            partialVisible={true}
            ssr={true}
            rtl={currentLanguage === 'ar' ? true : false}
            showDots={true}
            renderDotsOutside={false}
            dotListClass="custom-dot-list-style"
            customButtonGroup={<ButtonGroup enableInfiniteArrow={true}/>}
          >
           

{sliderData.length > 0 && sliderData.map((slider: Slider, index: number) => (
  <Card className="login-outer" key={slider.id || `slider-${index}`}>
    <Card.Img
      data-testid={`login-card-image-${index}`}
      className="login-card-img"
      src={slider?.slider_image_url}
    />
    <Card.ImgOverlay className="login-overlay">
     
        {index === 0 && (
          <>
            <div className="login-white-wrapper"> 
            <p className="login-content-desc" data-testid={`login-content-desc-${index}`}>
              {slider?.slider_title || "Slide 1 Description"}
            </p>
                  
            <ul className="download-link">
  {mobile_app_images && mobile_app_images.map((item, index) => (
    <li key={index}>
      <a href={item.url} target="_blank" rel="noopener noreferrer">
        <img
          src={item.image}
          alt={`app_image_${index}`}
          className="download-icon"
        />
      </a>
    </li>
  ))}
</ul>

            
            </div>
          </>
        )}

      {(index === 1 || index === 2) && (
        <div className="login-blue-wrapper">
          <div className="red-boder-left">
            <h4 className="login-content-title" data-testid={`login-content-title-${index}`}>
              {slider?.slider_title}
            </h4>
            <p className="login-content-desc" data-testid={`login-content-desc-${index}`}>
              {slider?.slider_description}
            </p>
          </div>
        </div>
      )}

    </Card.ImgOverlay>
  </Card>
))}

          </Carousel>
        </div>
      )}
    </>
  );
};
