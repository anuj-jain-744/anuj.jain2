import { render, screen, fireEvent } from "@testing-library/react";
import { ButtonGroup } from "./index";
// Adjust import path
import "@testing-library/jest-dom";

// Mocking the `responsive` object for testing
jest.mock("../index", () => ({
  responsive: {
    small: { breakpoint: { min: 0, max: 600 }, items: 1, slidesToSlide: 1 },
    medium: { breakpoint: { min: 601, max: 1200 }, items: 3, slidesToSlide: 1 },
    large: {
      breakpoint: { min: 1201, max: Infinity },
      items: 5,
      slidesToSlide: 1,
    },
  },
}));

describe("ButtonGroup Component", () => {
  let mockNext: jest.Mock;
  let mockPrevious: jest.Mock;

  beforeEach(() => {
    mockNext = jest.fn();
    mockPrevious = jest.fn();
  });

  it("renders previous and next buttons when total items exceed max visible items", () => {
    const mockData = {
      currentSlide: 0,
      totalItems: 5,
    };
    render(
      <ButtonGroup
        next={mockNext}
        previous={mockPrevious}
        carouselState={mockData}
      />
    );

    // Check if the previous and next buttons are rendered
    expect(screen.getByTestId("carouselButtonPrevious")).toBeInTheDocument();
    expect(screen.getByTestId("carouselButtonNext")).toBeInTheDocument();
  });

  it("disables the previous button when currentSlide is 0", () => {
    const mockData = {
      currentSlide: 0,
      totalItems: 5,
    };
    render(
      <ButtonGroup
        next={mockNext}
        previous={mockPrevious}
        carouselState={mockData}
      />
    );

    const previousButton = screen.getByTestId("carouselButtonPrevious");
    expect(previousButton).toHaveClass("disable");
    //expect(previousButton).toBeDisabled();
  });

  /*it("disables the next button when currentSlide is the last item", () => {
    const mockData = {
      currentSlide: 4, // Assuming 5 total items, index is 0-based
      totalItems: 5,
    };
    render(
      <ButtonGroup
        next={mockNext}
        previous={mockPrevious}
        carouselState={mockData}
      />
    );

    const nextButton = screen.getByTestId("carouselButtonNext");
    expect(nextButton).toHaveClass("disable");
    expect(nextButton).toBeDisabled();
  });*/

  it("calls next function when the next button is clicked", () => {
    const mockData = {
      currentSlide: 0,
      totalItems: 5,
    };
    render(
      <ButtonGroup
        next={mockNext}
        previous={mockPrevious}
        carouselState={mockData}
      />
    );

    const nextButton = screen.getByTestId("carouselButtonNext");
    fireEvent.click(nextButton);

    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it("calls previous function when the previous button is clicked", () => {
    const mockData = {
      currentSlide: 1,
      totalItems: 5,
    };
    render(
      <ButtonGroup
        next={mockNext}
        previous={mockPrevious}
        carouselState={mockData}
      />
    );

    const previousButton = screen.getByTestId("carouselButtonPrevious");
    fireEvent.click(previousButton);

    expect(mockPrevious).toHaveBeenCalledTimes(1);
  });

  it("does not render buttons if there are fewer items than the visible items per slide", () => {
    const mockData = {
      currentSlide: 0,
      totalItems: 1, // Less than max visible slides (for example, 1 item when the max is 3)
    };
    render(
      <ButtonGroup
        next={mockNext}
        previous={mockPrevious}
        carouselState={mockData}
      />
    );

    // Buttons should not be visible if total items are less than max slides
    expect(
      screen.queryByTestId("carouselButtonPrevious")
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("carouselButtonNext")).not.toBeInTheDocument();
  });

  it("renders buttons with infinite arrows if enableInfiniteArrow is true", () => {
    const mockData = {
      currentSlide: 0,
      totalItems: 5,
    };
    render(
      <ButtonGroup
        next={mockNext}
        previous={mockPrevious}
        carouselState={mockData}
        enableInfiniteArrow={true}
      />
    );

    // Check if the buttons still have the expected behavior (even with infinite arrows enabled)
    const previousButton = screen.getByTestId("carouselButtonPrevious");
    const nextButton = screen.getByTestId("carouselButtonNext");

    // Buttons should not be disabled in the infinite scroll case
    expect(previousButton).not.toHaveClass("disable");
    expect(nextButton).not.toHaveClass("disable");
  });
});
