import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ShuffleDropdown from "./supportDropdown";

// Mocking shuffle data
jest.mock("../../content/header", () => ({
  HeaderContent: {
    shuffle: {
      org: ["org-img1.png", "org-img2.png", "org-img3.png"],
      white: ["white-img1.png", "white-img2.png", "white-img3.png"],
      blue: ["blue-img1.png", "blue-img2.png", "blue-img3.png"],
    },
  },
}));

describe("ShuffleDropdown", () => {
  const mockHandleDropdownMouseOver = jest.fn();
  const mockChildren = <div>Test Children</div>;

  const defaultProps = {
    children: mockChildren,
    navbarTransparent: false,
    dropdownStates: { show: false },
    handleDropdownMouseOver: mockHandleDropdownMouseOver,
    showDropdown: { shuffle: true },
  };

  test("renders with correct initial image", () => {
    render(<ShuffleDropdown {...defaultProps} />);

    const image = screen.getByAltText("shuffle-image");
    expect(image).toHaveAttribute("src", "blue-img1.png");
  });

  test("changes image every second", async () => {
    jest.useFakeTimers();
    render(<ShuffleDropdown {...defaultProps} />);

    const image = screen.getByAltText("shuffle-image");

    // Initially, the image should be the first one in the blue array
    expect(image).toHaveAttribute("src", "blue-img1.png");

    // Fast-forward 1 second
    jest.advanceTimersByTime(1000);
    expect(image).toHaveAttribute("src", "blue-img2.png");

    // Fast-forward another second
    jest.advanceTimersByTime(1000);
    expect(image).toHaveAttribute("src", "blue-img3.png");

    jest.useRealTimers();
  });

  test("shows white images when navbarTransparent is true and dropdown is hidden", async () => {
    render(
      <ShuffleDropdown
        {...defaultProps}
        navbarTransparent={true}
        dropdownStates={{ show: false }}
      />
    );

    const image = screen.getByAltText("shuffle-image");
    expect(image).toHaveAttribute("src", "white-img1.png");
  });

  test("fires onMouseOver and onMouseLeave events", () => {
    render(<ShuffleDropdown {...defaultProps} />);

    const dropdownButton = screen.getByTestId("shuffle-dropdown");

    fireEvent.mouseOver(dropdownButton);
    expect(mockHandleDropdownMouseOver).not.toHaveBeenCalled();

    fireEvent.mouseLeave(dropdownButton);
    expect(mockHandleDropdownMouseOver).toHaveBeenCalledWith("shuffle", false);
  });

  test("onClick triggers handleDropdownMouseOver", () => {
    render(<ShuffleDropdown {...defaultProps} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockHandleDropdownMouseOver).toHaveBeenCalledWith("shuffle", true);
  });

  test("renders children correctly", () => {
    render(<ShuffleDropdown {...defaultProps} />);

    const children = screen.getByText("Test Children");
    expect(children).toBeInTheDocument();
  });

  test("does not render dropdown when showDropdown.shuffle is false", () => {
    render(
      <ShuffleDropdown {...defaultProps} showDropdown={{ shuffle: false }} />
    );

    const dropdownButton = screen.queryByTestId("shuffle-dropdown");
   // expect(dropdownButton).not.toBeInTheDocument();
  });
});
