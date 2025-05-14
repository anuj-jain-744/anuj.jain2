import { render, screen, act, waitFor } from "@testing-library/react";
import { CarouselImages } from "./index";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { RootState } from "@dpm/shared-module";

// Mock the assets
jest.mock("assets/dashboardFooter/Arrow_Right.svg", () => "Arrow_Right_Mock");

// Mock the Redux store for testing
const mockState = {
  dashbaordLanguageData: {
    languageData: {
      dashboardslider: [
        {
          title: "Slider 1 Title",
          description: "Slider 1 Description",
          button_text: "Get a Quote",
          image: "image1.jpg",
        },
        {
          title: "Slider 2 Title",
          description: "Slider 2 Description",
          image: "image2.jpg",
        },
        {
          title: "Slider 3 Title",
          description: "Slider 3 Description",
          image: "image3.jpg",
        },
      ],
    },
  },
};

const mockStore = createStore(
  (state: RootState) => state,
  mockState
);

describe("CarouselImages Component", () => {
  test("renders carousel with images and text", () => {
    render(
      <Provider store={mockStore}>
        <CarouselImages />
      </Provider>
    );

    // Check if the first image and its content is rendered correctly
    expect(screen.getByAltText("Image")).toHaveAttribute("src", "image1.jpg");
    expect(screen.getByText("Slider 1 Title")).toBeInTheDocument();
    expect(screen.getByText("Slider 1 Description")).toBeInTheDocument();
    expect(screen.getByText("Get a Quote")).toBeInTheDocument();
  });

  test("changes image every 3 seconds", async () => {
    jest.useFakeTimers();

    render(
      <Provider store={mockStore}>
        <CarouselImages />
      </Provider>
    );

    // Initially, the first image should be shown
    expect(screen.getByAltText("Image")).toHaveAttribute("src", "image1.jpg");

    // Fast-forward the timers by 3 seconds and check if the next image appears
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    // Now the second image should be shown
    await waitFor(() =>
      expect(screen.getByAltText("Image")).toHaveAttribute("src", "image2.jpg")
    );

    // Fast-forward again and check for the third image
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    await waitFor(() =>
      expect(screen.getByAltText("Image")).toHaveAttribute("src", "image3.jpg")
    );

    jest.useRealTimers();
  });

  test("displays correct number of pagination dots", () => {
    render(
      <Provider store={mockStore}>
        <CarouselImages />
      </Provider>
    );

    // Check the number of pagination dots based on the number of images
    const paginationDots = screen.getAllByRole("dot");
    expect(paginationDots).toHaveLength(3); // 3 images in the slider data
  });

  test("activates the current pagination dot", () => {
    render(
      <Provider store={mockStore}>
        <CarouselImages />
      </Provider>
    );

    // Initially, the first dot should be active
    expect(screen.getByText("dot-0")).toHaveClass("active-dot");

    // Simulate the image change after 3 seconds
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    // After 3 seconds, the second dot should be active
    expect(screen.getByText("dot-1")).toHaveClass("active-dot");
  });

  test("button appears when button text exists", () => {
    render(
      <Provider store={mockStore}>
        <CarouselImages />
      </Provider>
    );

    // Check if the button for the first slider appears
    expect(screen.getByText("Get a Quote")).toBeInTheDocument();
  });

  test("does not display button when no button text", () => {
    // Modify mock data to remove the button text
    const modifiedMockState = {
      dashbaordLanguageData: {
        languageData: {
          dashboardslider: [
            {
              title: "Slider 1 Title",
              description: "Slider 1 Description",
              image: "image1.jpg",
            },
            {
              title: "Slider 2 Title",
              description: "Slider 2 Description",
              image: "image2.jpg",
            },
            {
              title: "Slider 3 Title",
              description: "Slider 3 Description",
              image: "image3.jpg",
            },
          ],
        },
      },
    };
    const modifiedStore = createStore(
      (state: RootState) => state,
      modifiedMockState
    );

    render(
      <Provider store={modifiedStore}>
        <CarouselImages />
      </Provider>
    );

    // The button should not appear for any of the sliders
    const button = screen.queryByText("Get a Quote");
    expect(button).not.toBeInTheDocument();
  });
});
