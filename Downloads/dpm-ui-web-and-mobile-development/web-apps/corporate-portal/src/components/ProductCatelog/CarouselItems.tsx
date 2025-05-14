import React, { useState } from "react";
import ReactFlipCard from "reactjs-flip-card";
import { sanitizeHtml } from "@dpm/shared-module";
import { Button } from "react-bootstrap";

import CardFlipImg from "../../assets/product/card-flip.png";

export interface CarouselItemProps {
  item: {
    title: string;
    content: string;
    flip_content: string;
    image_url: string;
    image_alt: string;
    button_text: string;
    button_link?: string | null;
  };
  index: number;
  isMobileOrTablet: boolean;
  flippedIndex: number | null;
  onCardClick: (index: number) => void;
  navigateTo?: (url: string) => void;
}

interface FrontComponentProps {
  handleCardClick: () => void;
  item: CarouselItemProps['item'];
}

interface BackComponentProps {
  item: CarouselItemProps['item'];
  navigateTo?: (url: string) => void;
}

export const FrontComponent: React.FC<FrontComponentProps> = ({ handleCardClick, item }) => {
  return (
    <div
      className="face front"
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
    {item.flip_content && (
      <div className="flipcard-img">
        <img src={CardFlipImg} alt="Card Flip" />
      </div>
    )}
      <img className="cardimg" src={item.image_url} alt={item.image_alt} />
      <div className="trasparent-layer"></div>
      <div className="content-over">
        <h3 className="walaa-medium-500">{item.title}</h3>
        <p className="walaa-regular-400">{item.content}</p>
      </div>
    </div>
  );
};

export const BackComponent: React.FC<BackComponentProps> = ({ item, navigateTo }) => {
  const sanitizedContent = sanitizeHtml(item.flip_content);
  return (
    <div className="face back">
      <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
      {item.button_link && navigateTo && (
        <Button 
          className="walaa-medium-500"
          onClick={()=>item.button_link ? navigateTo(item.button_link): ""}
        >{item.button_text}
      </Button>)}
    </div>
  );
};

export const flipTriggerOn = (isMobile: boolean, hasFlipContent: boolean) => {
  if (!hasFlipContent) return null;
  return !isMobile ? "onHover" : "onClick";
}

const CarouselItems: React.FC<CarouselItemProps> = ({
  item,
  index,
  isMobileOrTablet,
  flippedIndex,
  onCardClick,
  navigateTo
}) => {
  const [flipped, setFlipped] = useState(flippedIndex === index);

  const handleCardClick = () => {
    setFlipped(!flipped);
    onCardClick(index);
  };
  const hasFlipContent = !!item.flip_content;
  return (
    <ReactFlipCard
      data-testid={`flipcard-${index}`}
      containerCss="card"
      flipTrigger={flipTriggerOn(isMobileOrTablet, hasFlipContent)}
      frontComponent={
        <FrontComponent handleCardClick={handleCardClick} item={item} />
      }
      backComponent={
        item.flip_content ? <BackComponent item={item} navigateTo={navigateTo} /> : null
      }
    />
  );
};

export default CarouselItems;