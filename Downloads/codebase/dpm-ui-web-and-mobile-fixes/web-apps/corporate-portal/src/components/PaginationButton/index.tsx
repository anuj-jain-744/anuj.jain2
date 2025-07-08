import { Button } from "react-bootstrap";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import styles from "../../styles/custom.module.css";
import "./index.scss"
interface ResponsiveObjectProps {
  [key: string]: {
    breakpoint: {
      max: number;
      min: number;
    },
    items: number;
    slidesToSlide: number;
    partialVisibilityGutter?: number;
  }
}

interface ButtonGroupProps {
  next?: () => void;
  previous?: () => void;
  carouselState?: {
    currentSlide: number;
    totalPages: number;
  }
}

export const PaginationButton = ({ next, previous, carouselState }: ButtonGroupProps) => {
  let { currentSlide, totalPages } = { currentSlide: 0, totalPages: 0 }
  if (carouselState)
    ({ currentSlide, totalPages } = carouselState);

  return (
    <div className="carousel-button-group">
      <Button
        data-testid="carouselButtonPrevious"
        className={`carousel-button-previous ${currentSlide === 0 ? "disable" : ""
          }`}
        onClick={() => {
          if (previous) {
            previous();
          }
        }}
      >
        <KeyboardArrowLeftIcon
          fontSize="small"
          className={`${styles.arrowprev} ${currentSlide === 0 ? "ondisable" : ""
            }`}
        />
      </Button>
      <Button
        data-testid="carouselButtonNext"
        className={`carousel-button-next ${totalPages && (totalPages -1) === currentSlide ? "disable" : ""
          }`}
        onClick={() => {
          if (next) {
            next()
          }
        }}
      >
        <KeyboardArrowRightIcon
          fontSize="small"
          className={`${styles.arrownext} ${totalPages && (totalPages -1) === currentSlide ? "ondisable" : ""}`}
        />
      </Button>
    </div>
  );
};