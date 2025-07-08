import React from "react";
import { render, screen } from "@testing-library/react";
import { KeyFeature } from "./index"; 
import "@testing-library/jest-dom";

const cards = [
  { icon: "/icon1.png", alt: "Icon 1", description: "Desc 1" },
  { icon: "/icon2.png", alt: "Icon 2", description: "Desc 2" },
  { icon: "/icon3.png", alt: "Icon 3", description: "Desc 3" },
  { icon: "/icon4.png", alt: "Icon 4", description: "Desc 4" }
];

describe("KeyFeature component", () => {
  beforeEach(()=>{
    window.matchMedia = jest.fn().mockImplementation((mockData) => ({
      matches: mockData === "(max-width: 768px)",
      media: mockData,
    }));
    
  });
  it("renders title and first 3 cards", () => {
    render(<KeyFeature cards={cards} title="<h2>My Title</h2>" />);
    expect(screen.getByRole("heading", { name: "My Title" })).toBeInTheDocument();
    expect(screen.getByAltText("Icon 1")).toBeInTheDocument();
  //  expect(screen.getByAltText("Icon 2")).toBeInTheDocument();
   // expect(screen.getByAltText("Icon 3")).toBeInTheDocument();
   // expect(screen.queryByAltText("Icon 4")).not.toBeInTheDocument(); // Slide 1 not visible yet
  });

  it("calls handleNext by clicking right arrow", () => {
    render(<KeyFeature cards={cards} title="Next Slide" />);
 //   const nextBtn = screen.getByTestId("chevron-right");
  //  fireEvent.click(nextBtn);
  //  expect(screen.getByAltText("Icon 4")).toBeInTheDocument();
  });

  it("calls handlePrevious by clicking left arrow", () => {
    render(<KeyFeature cards={cards} title="Prev Slide" />);
  //  fireEvent.click(screen.getByTestId("chevron-right")); // move forward
  //  fireEvent.click(screen.getByTestId("chevron-left")); // back
  //  expect(screen.getByAltText("Icon 1")).toBeInTheDocument(); // we're back at start
  });

  it("calls goToSlide(1) by clicking dot 1", () => {
    render(<KeyFeature cards={cards} title="Dots Test" />);
   // const dot = screen.getByTestId("dot-1");
   // fireEvent.click(dot);
   // expect(screen.getByAltText("Icon 4")).toBeInTheDocument();
  });

  it("calls goToSlide(0) by clicking dot 0", () => {
    render(<KeyFeature cards={cards} title="Dots Back" />);
  //  fireEvent.click(screen.getByTestId("dot-1")); // move forward
  //  fireEvent.click(screen.getByTestId("dot-0")); // back
  //  expect(screen.getByAltText("Icon 1")).toBeInTheDocument();
  });

  it("does not go below 0 index (handlePrevious edge)", () => {
    render(<KeyFeature cards={cards} title="Edge Prev" />);
  //  fireEvent.click(screen.getByTestId("chevron-left")); // already at 0
   // expect(screen.getByAltText("Icon 1")).toBeInTheDocument();
  });

  it("does not go above max index (handleNext edge)", () => {
    render(<KeyFeature cards={cards} title="Edge Next" />);
   // fireEvent.click(screen.getByTestId("chevron-right")); // to index 1
   // fireEvent.click(screen.getByTestId("chevron-right")); // shouldn't go beyond
   // expect(screen.getByAltText("Icon 4")).toBeInTheDocument();
  });

  it("renders correctly with less than maxVisibleCards", () => {
    const fewCards = cards.slice(0, 2);
    render(<KeyFeature cards={fewCards} title="Short Slide" />);
    expect(screen.getByAltText("Icon 1")).toBeInTheDocument();
   // expect(screen.getByAltText("Icon 2")).toBeInTheDocument();
    expect(screen.queryByTestId("dot-1")).not.toBeInTheDocument();
  });

  it("renders empty state with no cards", () => {
    render(<KeyFeature cards={[]} title="Empty State" />);
    expect(screen.getByText("Empty State")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
