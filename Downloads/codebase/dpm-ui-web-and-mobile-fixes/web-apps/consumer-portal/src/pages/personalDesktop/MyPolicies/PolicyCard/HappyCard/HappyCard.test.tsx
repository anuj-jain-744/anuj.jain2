import React from "react";
import { render, screen } from "@testing-library/react";
import HappyCard from "./HappyCard";

describe("HappyCard Component", () => {
  const mockProps = {
    title: "Happy Title",
    description: "This is a happy description",
  };

  test("renders without crashing", () => {
    render(<HappyCard {...mockProps} />);
    const titleElement = screen.getByText(mockProps.title);
    expect(titleElement).toBeInTheDocument();
  });

  test("displays the correct title", () => {
    render(<HappyCard {...mockProps} />);
    const titleElement = screen.getByText(mockProps.title);
    expect(titleElement).toBeInTheDocument();
  });

  test("renders the video element", () => {
    render(<HappyCard {...mockProps} />);
    const videoElement = screen.getByTestId("happy-video");
    expect(videoElement).toBeInTheDocument();
  });

  test("renders the vector image", () => {
    render(<HappyCard {...mockProps} />);
    const vectorImage = screen.getByAltText("happy-vector");
    expect(vectorImage).toBeInTheDocument();
  });

  test("renders the union image", () => {
    render(<HappyCard {...mockProps} />);
    const unionImage = screen.getByAltText("happy-union");
    expect(unionImage).toBeInTheDocument();
  });
});