import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CustomRightArrow, CustomLeftArrow } from './CustomAnchors';
import CarouselContent from "./CarouselContent";
import { HeroBanner } from ".";

const mockHeroBanner = [
  {
    slider_title: "Slide 1",
    slider_description: "Description 1",
    slider_video_url: "",
    slider_image_url: "Image-url-1",
    slider_type: "Image",
  },
  {
    slider_title: "Slide 2",
    slider_description: "Description 2",
    slider_video_url: "http://somedummyurl/Video-url-2",
    slider_image_url: "",
    slider_type: "Video",
  },
];


describe('CustomAnchors', () => {
  const mockOnClick = jest.fn();
  const carouselState = { currentSlide: 0, deviceType: 'desktop' };

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  test('right arrow is disabled on the last slide', () => {
    render(
      <CustomRightArrow
        onClick={mockOnClick}
        heroBannerLength={1}
        carouselState={{ ...carouselState, currentSlide: 0 }}
      />
    );
    const rightArrow = screen.getByTestId('right-arrow');
    expect(rightArrow).toHaveClass('disabled-navigation');
  });

  test('right arrow is active navigation without passing heroBannerLength', () => {
    render(
      <CustomRightArrow
        onClick={mockOnClick}
        carouselState={{ ...carouselState, currentSlide: 0 }}
      />
    );
    const rightArrow = screen.getByTestId('right-arrow');
    expect(rightArrow).toHaveClass('active-navigation');
  });


  test('left arrow is with d-none', () => {
    render(
      <CustomLeftArrow
        onClick={mockOnClick}
        heroBannerLength={1}
        carouselState={{ ...carouselState, currentSlide: 0 }}
      />
    );
    const rightArrow = screen.getByTestId('left-arrow');
    expect(rightArrow).toHaveClass('d-none');
  });

  test('left arrow is disabled on the first slide', () => {
    render(
      <CustomLeftArrow
        onClick={mockOnClick}
        carouselState={{ ...carouselState, currentSlide: 0 }}
      />
    );
    const leftArrow = screen.getByTestId('left-arrow');
    expect(leftArrow).toHaveClass('disabled-navigation');
  });

  test('right arrow is enabled when not on the last slide', () => {
    render(
      <CustomRightArrow
        onClick={mockOnClick}
        heroBannerLength={2}
        carouselState={{ ...carouselState, currentSlide: 0 }}
      />
    );
    const rightArrow = screen.getByTestId('right-arrow');
    expect(rightArrow).toHaveClass('active-navigation');
  });

  test('left arrow is enabled when not on the first slide', () => {
    render(
      <CustomLeftArrow
        onClick={mockOnClick}
        carouselState={{ ...carouselState, currentSlide: 1 }}
      />
    );
    const leftArrow = screen.getByTestId('left-arrow');
    expect(leftArrow).toHaveClass('active-navigation');
  });

  test('onClick function is called when right arrow is clicked', () => {
    render(
      <CustomRightArrow
        onClick={mockOnClick}
        heroBannerLength={2}
        carouselState={{ ...carouselState, currentSlide: 0 }}
      />
    );
    const rightArrow = screen.getByTestId('right-arrow');
    fireEvent.click(rightArrow);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('onClick function is called when left arrow is clicked', () => {
    render(
      <CustomLeftArrow
        onClick={mockOnClick}
        carouselState={{ ...carouselState, currentSlide: 1 }}
      />
    );
    const leftArrow = screen.getByTestId('left-arrow');
    fireEvent.click(leftArrow);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});


describe("CarouselContent", () => {
  it("renders image content correctly", () => {
    const breadcrumbs = [
      { label: "Home", route: "/" },
      { label: "Careers", route: "/careers" },
    ];
    
    const { getByAltText, getByText, getByRole } = render(
      <CarouselContent slideItem={mockHeroBanner[0]} type="image" buttonLabel="test" breadcrumbs={breadcrumbs} navigateTo={undefined}/>
    );

    const image = getByAltText("Slide 1");
    expect(screen.getByTestId("carousel-content")).toHaveClass('regular-banner')
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", mockHeroBanner[0].slider_image_url);
    expect(getByText("Slide 1")).toBeInTheDocument();
    expect(getByText("Description 1")).toBeInTheDocument();

    const buttonInput = getByRole("button");
    expect(buttonInput).toBeInTheDocument();
    fireEvent.click(buttonInput);
  });

  it("renders video content correctly", async () => {
    const mockOnClick = jest.fn();
    const { getByText, container, getByRole } = render(
      <CarouselContent
        slideItem={mockHeroBanner[1]}
        type="video"
        buttonLabel="Test Label"
        isVisible={true}
        navigateTo={mockOnClick}
        buttonLink="http://somedummyurl/Video-url-2"
      />
    );
    const videoElement = container.querySelector("video");
    expect(videoElement).toBeInTheDocument();
    expect(videoElement?.querySelector("source")?.src).toBe(
      "http://somedummyurl/Video-url-2"
    );
    expect(getByText("Slide 2")).toBeInTheDocument();
    expect(getByText("Description 2")).toBeInTheDocument();

  });

  it("buttonLink with empty", async () => {
    const mockOnClick = jest.fn();
    const { findByRole } = render(
      <CarouselContent
        slideItem={mockHeroBanner[1]}
        type="video"
        buttonLabel="Test Label"
        isVisible={true}
        navigateTo={mockOnClick}
        buttonLink={undefined}
      />
    );

    const buttonInput = await findByRole("button");
    expect(buttonInput).toBeInTheDocument();
    fireEvent.click(buttonInput);
    expect(mockOnClick).toHaveBeenCalledTimes(1);

  });
});


describe("hero-banner", () => {
  test('hero banner', () => {
    render(
      <HeroBanner heroBanner={[{
        slider_title: "",
        slider_description: "",
        slider_video_url: "",
        slider_image_url: "",
        slider_type: "Image",
      }, {
        slider_title: "",
        slider_description: "",
        slider_video_url: "",
        slider_image_url: "",
        slider_type: "Video",
      }]}
      />
    );
    const rightArrow = screen.getByTestId('hero-banner');
    expect(rightArrow).toBeInTheDocument();
  });
});
