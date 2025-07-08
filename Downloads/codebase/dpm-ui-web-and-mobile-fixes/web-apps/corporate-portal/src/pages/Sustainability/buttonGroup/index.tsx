import { Button, Container } from "react-bootstrap";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import styles from "../../../styles/custom.module.css";
import {responsive} from '../index';
import './index.scss';

interface ButtonGroupProps {
    next?: () => void;
    previous?: () => void;
    carouselState?: {
      currentSlide: number;
      totalItems: number;
    }
    enableInfiniteArrow?: boolean;
}

export const ButtonGroup = ({ next, previous, carouselState, enableInfiniteArrow=false }: ButtonGroupProps) => {
    let { currentSlide, totalItems } = { currentSlide: 0, totalItems: 0 }
    if (carouselState)
      ({ currentSlide, totalItems } = carouselState);
  
    // finds the current window width
    const currentWidth = window.innerWidth;
  
    // finds the current breakpoint based on the window width
    const currentBreakpoint = Object.keys(responsive).find((key) => {
      const { breakpoint } = responsive[key];
      return currentWidth >= breakpoint.min && currentWidth <= breakpoint.max;
    });
    let maxSlides = 1;
    // Extract the responsive settings for the current breakpoint
    if (currentBreakpoint) {
      const currentResponsiveSettings = responsive[currentBreakpoint];
  
      //   the number of items that should be visible based on the current breakpoint
      maxSlides = currentResponsiveSettings?.items;
    }
  
    // Show buttons only if the total number of items exceeds the number of visible items per slide
    const showButtons = totalItems > maxSlides;
  
    return (
      showButtons && (
        <div className="news-carousel-button-group">
          <Container fluid>
          <Button
            data-testid="carouselButtonPrevious"
            className={`carousel-button-previous ${enableInfiniteArrow ? "" : (currentSlide === 0 ? "disable" : "")
              }`}
            onClick={() => {
              if (previous) {
                previous();
              }
            }}
          >
            <KeyboardArrowLeftIcon
              fontSize="small"
              className={`${styles.arrowprev} ${enableInfiniteArrow ? "" : (currentSlide === 0 ? "ondisable" : "")
                }`}
            />
          </Button>
          <Button
            data-testid="carouselButtonNext"
            className={`carousel-button-next ${enableInfiniteArrow ? "" : (totalItems && totalItems - maxSlides === currentSlide ? "disable" : "")
              }`}
            onClick={() => {
              if (next) {
                next()
              }
            }}
          >
            <KeyboardArrowRightIcon
              fontSize="small"
              className={`${styles.arrownext} ${totalItems && totalItems - maxSlides === currentSlide ? "ondisable" : ""}`}
            />
          </Button>
          </Container>
        </div>
      )
    );
  };
  