import React, { useState, useEffect } from "react";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { Container } from "react-bootstrap";
import "./index.scss";

interface KeyFeatureProps {
  cards: { icon: string; alt: string; title: string; description: string }[];
  title: string;
}

export const KeyFeature = ({ cards, title }: KeyFeatureProps): JSX.Element => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [maxVisibleCards, setMaxVisibleCards] = useState(3);

   
  useEffect(() => {
    const updateMaxVisibleCards = () => {
      if (window.matchMedia("(max-width: 768px)").matches) {
        setMaxVisibleCards(1); 
      } 
      else if (window.matchMedia("(max-width: 1024px)").matches) {
        setMaxVisibleCards(2); 
      } 
      else {
        setMaxVisibleCards(3);  
      }
    };

    
    updateMaxVisibleCards();
    window.addEventListener("resize", updateMaxVisibleCards);

    return () => {
      window.removeEventListener("resize", updateMaxVisibleCards);
    };
  }, []); 
  

  const handlePrevious = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentSlide((prev) =>
      Math.min(prev + 1, cards.length - maxVisibleCards)
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <Container  id="productToggle-1" fluid className="key-feature-frame">
      <div className="key-feature-components-card">
        <div
          className="key-feature-title"
          dangerouslySetInnerHTML={{ __html: title }}
        />

        <div className="key-feature-buttons">
          <div
            className="key-feature-buttons-navigate"
            onClick={handlePrevious}
          >
            <ChevronLeft
              className={`key-feature-material-icons ${
                currentSlide === 0 ? "disable" : ""
              }`}
            />
          </div>

          <div
            className="key-feature-material-icons-wrapper"
            onClick={handleNext}
          >
            <ChevronRight
              className={`key-feature-material-icons ${
                currentSlide === cards.length - maxVisibleCards ? "disable" : ""
              }`}
            />
          </div>
        </div>
      </div>

      <div className="key-feature-cards">
        {cards
          .slice(currentSlide, currentSlide + maxVisibleCards)
          .map((card, index) => (
            <div className="key-feature-icon-cards" key={index}>
              <div className="key-feature-icon">
                <img src={card.icon} alt={card.alt} className="icon-img" />
              </div>
              <div className="key-feature-content">
                <p
                  className="key-feature-contact-us"
                  dangerouslySetInnerHTML={{ __html: card.title }}
                />
                <p
                  className="key-feature-contact-us"
                  dangerouslySetInnerHTML={{ __html: card.description }}
                />
              </div>
            </div>
          ))}
      </div>

      <div className="carousel-dots">
        {Array.from({ length: Math.ceil(cards.length / maxVisibleCards) }).map(
          (_, index) => (
            <div
              key={index}
              className={`carousel-dot ${
                currentSlide === index * maxVisibleCards ? "active" : ""
              }`}
              onClick={() => goToSlide(index * maxVisibleCards)}
            />
          )
        )}
      </div>
    </Container>
  );
};