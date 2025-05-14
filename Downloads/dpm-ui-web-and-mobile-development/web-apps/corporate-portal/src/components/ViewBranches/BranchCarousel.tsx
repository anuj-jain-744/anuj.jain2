import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { renderBranchCard } from './renderBranchCard';

interface Branch {
  title: string;
  address: string;
  phone: string;
  email: string;
  working_hours: string;
  working_days: string;
  working_hours_data: any; // Replace 'any' with the appropriate type if known
}

interface BranchCarouselProps {
  filteredBranch: Branch[];
  activeCardIndex: number;
  handleCardClick: (index: number) => void;
  commonLabels: any; // Replace 'any' with the appropriate type if known
}

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

const BranchCarousel: React.FC<BranchCarouselProps> = ({
  filteredBranch,
  activeCardIndex,
  handleCardClick,
  commonLabels,
}) => (
  <Carousel
    swipeable
    draggable
    responsive={carouselResponsive}
    autoPlay={false}
    infinite={false}
    keyBoardControl
    containerClass="branch-card-wrapper"
    renderArrowsWhenDisabled
    renderButtonGroupOutside
    arrows={false}
    partialVisible
    ssr
    itemClass="card-wrapper"
    rtl={false}
    showDots
    renderDotsOutside
    dotListClass="custom-dot-list-style"
  >
    {filteredBranch?.map(
      (
        {
          title,
          address,
          phone,
          email,
          working_hours,
          working_days,
          working_hours_data,
        },
        bIndex
      ) =>
        renderBranchCard(
          title,
          address,
          phone,
          email,
          working_hours,
          working_days,
          working_hours_data,
          bIndex,
          commonLabels,
          activeCardIndex,
          handleCardClick
        )
    )}
  </Carousel>
);

export default BranchCarousel;