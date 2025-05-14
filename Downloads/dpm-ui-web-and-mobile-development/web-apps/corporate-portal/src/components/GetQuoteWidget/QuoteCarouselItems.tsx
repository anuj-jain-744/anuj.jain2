import { RefObject, useEffect, useState, useRef } from "react";
import { Overlay, Tooltip } from "react-bootstrap";
import { IconsSet } from "../../utils/icons";
import { ProductDetailToolTip } from "./getQuoteInterface";
import { BreakPoints } from "constant";

interface QuoteCarouselItems {
    showProductDetailTooltip: ProductDetailToolTip;
    index: number,
    activeTabRef: RefObject<HTMLDivElement>;
    productName: string;
    className: string;
    productCategory: string;
    activeProduct: {
        [type: string]: {
          label: string;
          index: number;
        };
    }
    handleToggleClick: (
    type: string,
    productLabel: string,
    productIndex: number,
    productCategory: string,
    className: string
    ) => void;
    setShowProductDetailTooltip: (val: ProductDetailToolTip) => void;
    animationDone?: boolean;
}
export default function QuoteCarouselItems({
    showProductDetailTooltip,
    index,
    productName,
    className,
    activeProduct,
    activeTabRef,
    productCategory,
    handleToggleClick,
    setShowProductDetailTooltip,
    animationDone
}: QuoteCarouselItems) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);
  const { Inner_Width } = BreakPoints;

  return (
    <div>
      {window.innerWidth > Inner_Width && (
        <Overlay target={ref?.current} show={show} placement="top">
          {(props) => (
            <Tooltip
              data-testid="overlayTootltip"
              id="overlay-example"
              {...props}
            >
              {productName}
            </Tooltip>
          )}
        </Overlay>
      )}
      <div
        data-testid={`categoryCauroselToggle-${index}`}
        className={`categ walaa-medium-500 ${
          activeProduct?.category?.index === index
            ? "active-tab"
            : "unactive-tab"
        }`}
        onClick={() => {
          setShow(false);
          handleToggleClick("category", productName, index, productCategory, className)
        }}
        ref={ref}
        onMouseOver={() => {
          if (index !== activeProduct?.category?.index) {
            setShow(true);
          }
        }}
        onMouseLeave={() => {
          if (index !== activeProduct?.category?.index) {
            setShow(false);
          }
        }}
      >
          {IconsSet[className.toLowerCase()] && (
          <img 
         src = {
            activeProduct?.category?.index === index
              ? IconsSet[className.toLowerCase()]
              : IconsSet[className.toLowerCase()]?.replace(/active(?=\w+\.svg$)/, "nonactive")
          }
          alt={productName} />
        )}
        
        <div className={`active-slice-left ${animationDone && `visible`}`} />
        <div className={`active-slice-right ${animationDone && `visible`}`} />
        {activeProduct?.category?.index === index && (
          <label>{productName}</label>
        )}
      </div>
    </div>
  );
}
