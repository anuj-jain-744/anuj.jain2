import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import "./index.scss";

interface AcadamyVisionProps {
  visionTitle: string;
  visionDescription: string;
  missionTitle: string;
  missionDescription: string;
  aimTitle: string;
  aimDescription: string;
  visionImage: string;
  missionImage: string;
  aimImage: string;
}

export const AcadamyVision: React.FC<AcadamyVisionProps> = ({
  visionTitle,
  visionDescription,
  missionTitle,
  missionDescription,
  aimTitle,
  aimDescription,
  visionImage,
  missionImage,
  aimImage,
}: AcadamyVisionProps): JSX.Element => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [maxVisibleCards, setMaxVisibleCards] = useState(2);

  const visionCards = [
    { title: visionTitle, description: visionDescription, image: visionImage },
    { title: missionTitle, description: missionDescription, image: missionImage },
    { title: aimTitle, description: aimDescription, image: aimImage },
  ];

  useEffect(() => {
    const updateMaxVisibleCards = () => {
      if (window.matchMedia("(max-width: 768px)").matches) {
        setMaxVisibleCards(1);
      } else if (window.matchMedia("(max-width: 1024px)").matches) {
        setMaxVisibleCards(2);
      } else {
        setMaxVisibleCards(3);
      }
    };

    updateMaxVisibleCards();
    window.addEventListener("resize", updateMaxVisibleCards);

    return () => {
      window.removeEventListener("resize", updateMaxVisibleCards);
    };
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const totalSlides = Math.ceil(visionCards.length / maxVisibleCards);
  const visibleCards = visionCards.slice(currentSlide * maxVisibleCards, (currentSlide + 1) * maxVisibleCards);

  return (
    <div className="vision-support-screen">
      <div className="vision-frame">
        <div className="vision-cards">
          {visibleCards.map((card, index) => (
            <div key={index} className="cards-icon-cards-2">
              <img
                src={card.image}
                alt={`${card.title} Icon`}
                className="icons-custom-icons-instance"
              />
              <div className="vision-content">
                <div className="vision-contact-us">{card.title}</div>
                <p className="vision-contact-us-to-seek">{card.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="carousel-dots">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <div
              key={index}
              className={`carousel-dot ${currentSlide === index ? "active" : ""}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
