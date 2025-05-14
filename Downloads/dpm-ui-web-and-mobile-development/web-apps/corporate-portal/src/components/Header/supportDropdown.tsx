import React, { useEffect, useRef, useCallback, ReactNode } from "react";
import { DropdownButton } from "react-bootstrap";
import { ShuffleDropdownProps } from "./types/common.types";
import { HeaderContent } from "../../content/header";

const ShuffleDropdown: React.FC<ShuffleDropdownProps> = ({
  children,
  navbarTransparent,
  dropdownStates,
  handleDropdownMouseOver,
  showDropdown,
}) => {
  const currentImageIndexRef = useRef(0);
  const imageRef = useRef<HTMLImageElement>(null);
  const { shuffle } = HeaderContent;

  useEffect(() => {
    const intervalId = setInterval(() => {
      currentImageIndexRef.current =
        (currentImageIndexRef.current + 1) % shuffle.org.length;
      if (imageRef.current) {
        imageRef.current.src =
          navbarTransparent && !dropdownStates?.show
            ? shuffle?.white[currentImageIndexRef.current]
            : shuffle?.org[currentImageIndexRef.current];
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [shuffle.org.length, navbarTransparent, dropdownStates?.show]);

  return (
    <DropdownButton
      title={
        <span className="shuffle-item">
          <img
            ref={imageRef}
            src={
              navbarTransparent && !dropdownStates?.show
                ? shuffle?.white[currentImageIndexRef.current]
                : shuffle?.org[currentImageIndexRef.current]
            }
            alt="shuffle-image"
          />
        </span>
      }
      className="header-option-button shuffle-selector-button"
      onMouseOver={() => handleDropdownMouseOver("shuffle", true)}
      onMouseLeave={() => handleDropdownMouseOver("shuffle", false)}
      show={showDropdown?.shuffle}
      data-testid="shuffle-dropdown"
    >
      {children}
    </DropdownButton>
  );
};

export default React.memo(ShuffleDropdown);
