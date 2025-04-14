import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { AcadamyVision } from "./index";

describe("AcadamyVision Component", () => {
  
  const defaultProps = {
    visiontitle: "Vision Title",
    visiondiscription: "Vision description here",
    imageurl: "https://example.com/image.jpg",
    imagealt: "Vision image"
  };

  test("renders the AcadamyVision component with given props", () => {
    render(<AcadamyVision {...defaultProps} />);
    expect(screen.getByText("Vision Title")).toBeInTheDocument();
    expect(screen.getByText("Vision description here")).toBeInTheDocument();
    expect(screen.getByAltText("Vision image")).toBeInTheDocument();
    expect(screen.getByAltText("Vision image")).toHaveAttribute('src', defaultProps.imageurl);
  });

  test("renders with empty visiontitle and visiondiscription", () => {
    const emptyTextProps = { ...defaultProps, visiontitle: "", visiondiscription: "" };
    render(<AcadamyVision {...emptyTextProps} />);
    expect(screen.queryByText("Vision Title")).toBeNull();
    expect(screen.queryByText("Vision description here")).toBeNull();
  });

  test("renders with empty imageurl and imagealt", () => {
    const emptyImageProps = { ...defaultProps, imageurl: "", imagealt: "" };
    render(<AcadamyVision {...emptyImageProps} />); 
    const image = screen.getByAltText("");
    expect(image).toHaveAttribute('src', '');
    expect(image).toHaveAttribute('alt', '');
  });

  test("renders with only visiontitle", () => {
    const titleOnlyProps = { ...defaultProps, visiondiscription: "" };
    render(<AcadamyVision {...titleOnlyProps} />);
    expect(screen.getByText("Vision Title")).toBeInTheDocument();
    expect(screen.queryByText("Vision description here")).toBeNull();
  });

  test("renders with only visiondiscription", () => {
    const descriptionOnlyProps = { ...defaultProps, visiontitle: "" };
    render(<AcadamyVision {...descriptionOnlyProps} />);
    expect(screen.queryByText("Vision Title")).toBeNull();
    expect(screen.getByText("Vision description here")).toBeInTheDocument();
  });

});
