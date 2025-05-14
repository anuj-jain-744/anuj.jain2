import React, { useState } from "react";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { Container } from "react-bootstrap";
import "./index.scss";

// Defining the types for the props
interface WalaaObjectiveCard {
  icon: string;
  alt: string;
  description: string;
}

interface WalaaObjectiveProps {
  title: string;
  cards: WalaaObjectiveCard[];
}

export const WalaaObjective: React.FC<WalaaObjectiveProps> = ({ title, cards }): JSX.Element => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const maxVisibleCards = 3;

  const handlePrevious = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, cards.length - maxVisibleCards));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <Container fluid className="frame-objective">
      <div className="components-card">
        <div className="WalaaObjective-title">{title}</div>

        <div className="objective-carousel">
          {/* Previous Button */}
          <div className="WalaaObjective-buttons-action" onClick={handlePrevious}>
            <ChevronLeft
              className={`icons-material-icons ${currentSlide === 0 ? "disable" : ""}`}
            />
          </div>

          {/* Next Button */}
          <div className="icons-material-icons-wrapper" onClick={handleNext}>
            <ChevronRight
              className={`icons-material-icons ${currentSlide === cards.length - maxVisibleCards ? "disable" : ""}`}
            />
          </div>
        </div>
      </div>

      <div className="WalaaObjective-cards">
        {cards.slice(currentSlide, currentSlide + maxVisibleCards).map((card, index) => (
          <div className="cards-icon-cards" key={index}>
            <div className="icon">
              <img src={card.icon} alt={card.alt} className="icon-img" />
            </div>
            <div className="WalaaObjective-content">
              <p className="contact-us">{card.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="carousel-dots">
        {/* Dot for the first slide */}
        <div
          className={`carousel-dot ${currentSlide === 0 ? "active" : ""}`}
          onClick={() => goToSlide(0)}
        />
        {/* Dot for the last slide */}
        <div
          className={`carousel-dot ${currentSlide === cards.length - maxVisibleCards ? "active" : ""}`}
          onClick={() => goToSlide(cards.length - maxVisibleCards)}
        />
      </div>
    </Container>
  );
};
