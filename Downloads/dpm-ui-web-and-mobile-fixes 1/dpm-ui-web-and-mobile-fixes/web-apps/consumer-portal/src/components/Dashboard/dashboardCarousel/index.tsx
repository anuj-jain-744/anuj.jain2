import React, { useState, useEffect } from "react";
import ArrowRight from "assets/dashboardFooter/Arrow_Right.svg";
import { useSelector } from "react-redux";
import { RootState } from "@dpm/shared-module";

import "./index.scss";

export const CarouselImages = (): JSX.Element => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { languageData } = useSelector(
    (state: RootState) => state.dashbaordLanguageData
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(
        (prevIndex) =>
          (prevIndex + 1) % (languageData?.dashboardslider?.length || 1)
      );
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [languageData]);

  const carouselData = languageData?.dashboardslider || [];

  const renderImage = (index: number) => {
    const data = carouselData[index];
    if (!data) return null;

    switch (index) {
      case 0:
        return (
          <>
            <div className="dashboard-carousel-gradient-overlay" />
            <div className="dashboard-carosel-first-slider-text-body">
              <div className="dashboard-carosel-first-slider-body">
                <div className="dashboard-first-slider-title">{data.title}</div>
                <p className="dashboard-first-slider-description">{data.description}</p>
              </div>
              {data.button_text && (
                <div className="dashboard-carosel-slider-button">
                  <div className="dashboard-slider-button-get-quote">
                    <button className="dashboard-carosel-slider-button">{data.button_text}</button>
                  </div>
                  <img
                    className="dashboard-carousel-arrow-icons"
                    src={ArrowRight}
                    alt="Arrow Right"
                  />
                </div>
              )}
            </div>
          </>
        );
      case 1:
        return (
          <>
            <div className="dashboard-carousel-empty-overlay" />
            <div className="dashboard-carosel-second-slider-text-body">
              <div className="dashboard-carosel-second-slider-body">
                <div className="dashboard-second-slider-title">{data.title}</div>
                <p className="dashboard-second-slider-description">{data.description}</p>
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="dashboard-carosel-third-slider-text-body"></div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-banner-container">
      <div className="dashboard-main-banner">
        <div className="dashboard-carousel-image-overlay">
          <img
            className="dashboard-carousel-banner-image"
            alt="Image"
            src={carouselData[currentIndex]?.image}
          />
          {renderImage(currentIndex)}
        </div>
      </div>

      <div className="dashboard-carousel-pagination-dots">
        {carouselData.map((_, index) => (
          <div
            key={index}
            className={index === currentIndex ? "active-dot" : "inactive-dot"}
          />
        ))}
      </div>
    </div>
  );
};
