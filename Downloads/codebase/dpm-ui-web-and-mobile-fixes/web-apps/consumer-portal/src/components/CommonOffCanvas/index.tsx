import React, { ReactNode } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import { PLACEMENTS } from "constant";
import "./index.scss";

type Placement = (typeof PLACEMENTS)[keyof typeof PLACEMENTS];

interface CommonOffCanvasProps {
  placement: Placement;
  title: string;
  children: ReactNode;
  showCanvas: boolean;
  setShowCanvas: (show: boolean) => void;
}

const CommonOffCanvas: React.FC<CommonOffCanvasProps> = ({
  placement,
  title,
  children,
  showCanvas,
  setShowCanvas,
}) => {
  const handleCloseCanvas = () => {
    setShowCanvas(false);
  };

  return (
    <Offcanvas
      show={showCanvas}
      onHide={handleCloseCanvas}
      placement={placement}
      className="common-offcanvas"
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{title}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>{children}</Offcanvas.Body>
    </Offcanvas>
  );
};

export default CommonOffCanvas;
