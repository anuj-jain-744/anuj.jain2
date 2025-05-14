import { useSpring, animated } from "@react-spring/web";
import { Container } from "react-bootstrap";
import "./index.scss";
import ProductTab from "./ProductTab";
import VisibilityWrapper from "components/VisibilityWrapper";

interface ProductCatalogProps {
  catalogTitle: string;
  catalogDescription: string;
  navigateTo: (url: string) => void;
  isVisible?: boolean;
  carouselData:  {
    [key: string]: any[];
  };
}

export const ProductCatalog = ({
  catalogTitle,
  catalogDescription,
  navigateTo,
  isVisible=false,
  carouselData
}: ProductCatalogProps) => {

  const springs = useSpring({
    from: { 
      transform: isVisible ? 'translateX(50%) translateY(0%)' : "translateX(0%) translateY(0%)",
      display: isVisible ? "none" : "block",
      opacity: isVisible ? 0 : 1,
    },
    to: { 
      transform: isVisible ? 'translateX(0%) translateY(0%)' : "translateX(50%) translateY(0%)",
      display: isVisible ? "block" : "none",
      opacity: isVisible ? 1 : 0,
    },
    config: { tension: 50, friction: 30 },
    delay: 200,
  });


  return (
    <div className="productCat" id="productToggle-2">
      <Container fluid className="midContainer container-fluid ">
        <animated.div style={isVisible ? springs: {}} className="ar-style">
          <h2 className="walaa-medium-500"> {catalogTitle} </h2>
          <p className="walaa-regular-400">{catalogDescription}</p>
        </animated.div>
        <ProductTab compData={carouselData} navigateTo={navigateTo} isVisible={isVisible}/>
      </Container>
    </div>
  );
};
