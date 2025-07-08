import React from "react";
import { render, screen } from "@testing-library/react";
import TravelCard from "./TravelCard";

jest.mock("assets/Dashboard/TravelVector.svg", () => "mocked-vector.svg");
jest.mock("assets/Dashboard/Union.svg", () => "mocked-union.svg");
jest.mock("assets/Dashboard/Arrow_Right.svg", () => "mocked-arrow-right.svg");
jest.mock("assets/Dashboard/Travel-icon.svg", () => "mocked-travel-icon.svg");

describe("TravelCard Component", () => {
  const title = "Explore the world";
  const description = "Discover new places and experience different cultures.";

  beforeEach(() => {
    render(<TravelCard title={title} description={description} />);
  });

  it("should render the title and description", () => {
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it("should render the vector image", () => {
    const vectorImage = screen.getByAltText("vector-img");
    expect(vectorImage).toBeInTheDocument();
  });

  it("should render the union image", () => {
    const unionImage = screen.getByAltText("union-img");
    expect(unionImage).toBeInTheDocument();
  });

  it("should render the arrow right icon", () => {
    const arrowIcon = screen.getByAltText("arrow-icon");
    expect(arrowIcon).toBeInTheDocument();
  });

  it("should render the travel icon", () => {
    const travelIcon = screen.getByAltText("icon-container");
    expect(travelIcon).toBeInTheDocument();
  });

  it("should render the left section with title and description", () => {
    const { container } = render(<TravelCard title="Sample Title" description="Sample Description" />);
    const leftSection = container.querySelector(".left-section");
    expect(leftSection).toBeInTheDocument();
    expect(leftSection).toContainElement(screen.getByText("Sample Title"));
    expect(leftSection).toContainElement(screen.getByText("Sample Description"));
  });
  
  it("should render the right section with travel icon", () => {
    const { container } = render(<TravelCard title="Sample Title" description="Sample Description" />);
    const rightSection = container.querySelector(".right-section");
    expect(rightSection).toBeInTheDocument();
  });
});
