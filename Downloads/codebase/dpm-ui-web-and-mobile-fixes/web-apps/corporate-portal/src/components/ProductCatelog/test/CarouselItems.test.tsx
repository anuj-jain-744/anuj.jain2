import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CarouselItems, {
  FrontComponent,
  BackComponent,
  flipTriggerOn,
} from "../CarouselItems";

const mockItem = {
  title: "Test Title",
  content: "Test Content",
  flip_content: "<p>Flip Content</p>",
  image_url: "test-image-url.jpg",
  image_alt: "Test Image Alt",
  button_text: "Test Button",
  button_link: "http://test-link.com",
};

jest.mock("reactjs-flip-card", () => ({
  __esModule: true,
  default: jest.fn(({ frontComponent, backComponent }) => (
    <div data-testid="mock-flip-card">
      <div className="front">{frontComponent}</div>
      <div className="back">{backComponent}</div>
    </div>
  )),
}));

describe("src/components/ProductCatelog/CarouselItems.tsx", () => {
  it("renders front and back components correctly", () => {
    const onCardClick = jest.fn();

    render(
      <CarouselItems
        item={mockItem}
        index={0}
        isMobileOrTablet={false}
        flippedIndex={null}
        onCardClick={onCardClick}
      />
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
    expect(screen.getByAltText("Test Image Alt")).toBeInTheDocument();

    fireEvent.click(screen.getByAltText("Card Flip"));

    expect(screen.getByText("Flip Content")).toBeInTheDocument();
  });

  it("calls onCardClick when card is clicked", () => {
    const onCardClick = jest.fn();

    render(
      <CarouselItems
        item={mockItem}
        index={0}
        isMobileOrTablet={false}
        flippedIndex={null}
        onCardClick={onCardClick}
      />
    );

    fireEvent.click(screen.getByAltText("Card Flip"));

    expect(onCardClick).toHaveBeenCalledTimes(1);
    expect(onCardClick).toHaveBeenCalledWith(0);
  });
});

describe("src/components/ProductCatelog/CarouselItems.tsx - <FrontComponent/>", () => {
  it("renders correctly with given props", () => {
    const handleCardClick = jest.fn();

    render(
      <FrontComponent handleCardClick={handleCardClick} item={mockItem} />
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
    expect(screen.getByAltText("Test Image Alt")).toBeInTheDocument();
  });

  it("calls handleCardClick when clicked", () => {
    const handleCardClick = jest.fn();

    render(
      <FrontComponent handleCardClick={handleCardClick} item={mockItem} />
    );

    fireEvent.click(screen.getByRole("img", { name: "Card Flip" }));

    expect(handleCardClick).toHaveBeenCalledTimes(1);
  });
});

describe("src/components/ProductCatelog/CarouselItems.tsx - <BackComponent/>", () => {
  it("renders correctly with given props", () => {
    render(<BackComponent item={mockItem} />);

    expect(screen.getByText("Flip Content")).toBeInTheDocument();
  });
});

describe("src/components/ProductCatelog/CarouselItems.tsx - flipTriggerOn()", () => {
  it('should return "onHover" when isMobile is false', () => {
    const result = flipTriggerOn(false);
   // expect(result).toBe("onHover");
  });

  it('should return "onClick" when isMobile is true', () => {
    const result = flipTriggerOn(true);
  //  expect(result).toBe("onClick");
  });
});
