import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CommonOffCanvas from "./index";

describe("CommonOffCanvas component", () => {
  const title = "My Offcanvas Title";
  const placement = "start";
  const childrenText = "Offcanvas body content";
  
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });  

  it("renders title and children when visible", () => {
    const setShowCanvas = jest.fn();
    render(
      <CommonOffCanvas
        placement={placement}
        title={title}
        showCanvas={true}
        setShowCanvas={setShowCanvas}
      >
        <div>{childrenText}</div>
      </CommonOffCanvas>
    );

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(childrenText)).toBeInTheDocument();
  });

  it("calls setShowCanvas(false) when close button clicked", () => {
    const setShowCanvas = jest.fn();
    render(
      <CommonOffCanvas
        placement={placement}
        title={title}
        showCanvas={true}
        setShowCanvas={setShowCanvas}
      >
        <div>{childrenText}</div>
      </CommonOffCanvas>
    );

    const closeButton = screen.getByLabelText(/close/i);
    fireEvent.click(closeButton);

    expect(setShowCanvas).toHaveBeenCalledWith(false);
  });
});
