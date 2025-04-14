import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { KnowMoreWidget } from "./index";
import Carousel from "react-multi-carousel";

const mockNavigateTo = jest.fn();

const mockContent = {
  sidebar_data: [
    {
      sidebar_image: {
        url: "https://google.com/",
        alt: "Sample Image",
      },
      image_title: "Sample Title",
      image_description: "Sample Description",
      image_button: "Click Me",
      image_button_link: "/sample-link",
      check_eligibility_link: true,
    },
  ],
};

const mocksliderData = {
  slider: [
    {
      slider_title: "WalaaInsurance",
      slider_description: "Description1",
      slider_image_url: "https://storage.googleapis.com/loginslider1.png",
    },
    {
      slider_title: "Vision",
      slider_description: "Description2",
      slider_image_url: "https://storage.googleapis.com/loginslider2.png",
    },
    {
      slider_title: "Mission",
      slider_description: "Description3 ​",
      slider_image_url: "https://storage.googleapis.com/loginslider3.png",
    },
  ],
  sidebar_data: [{}, {}, {}],
};
describe("KnowMoreWidget", () => {
  beforeEach(() => {
    render(
      <KnowMoreWidget content={mockContent} navigateTo={mockNavigateTo} />
    );
  });

  test("renders the widget with provided content", () => {
    const image = screen.getByTestId("card-image");
    const title = screen.getByTestId("img-title");
    const description = screen.getByTestId("img-desc");
    const button = screen.getByTestId("img-btn");

    expect(image).toHaveAttribute(
      "src",
      mockContent.sidebar_data[0].sidebar_image.url
    );
    expect(image).toHaveAttribute(
      "alt",
      mockContent.sidebar_data[0].sidebar_image.alt
    );
    expect(title).toHaveTextContent(mockContent.sidebar_data[0].image_title);
    expect(description).toHaveTextContent(
      mockContent.sidebar_data[0].image_description
    );
    expect(button).toHaveTextContent(mockContent.sidebar_data[0].image_button);
  });

  test("navigates to the correct URL on button click", () => {
    const button = screen.getByTestId("img-btn");
    fireEvent.click(button);
    expect(mockNavigateTo).toHaveBeenCalledWith(
      mockContent.sidebar_data[0].image_button_link
    );
  });

  test("does not navigate if check_eligibility_link is false", () => {
    const modifiedContent = {
      ...mockContent,
      sidebar_data: [
        {
          ...mockContent.sidebar_data[0],
          check_eligibility_link: false,
        },
      ],
    };
    render(
      <KnowMoreWidget content={modifiedContent} navigateTo={mockNavigateTo} />
    );
  });
});

jest.mock("react-multi-carousel", () => {
  return ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-carousel">{children}</div>
  );
});
describe("Carousel Slider", () => {
  it("renders all carousel items", () => {
    render(
      <KnowMoreWidget content={mocksliderData} navigateTo={mockNavigateTo} />
    );
    expect(screen.getByTestId("mock-carousel")).toBeInTheDocument();

    mocksliderData.slider.forEach((slide, index) => {
      const cardImage = screen.getByTestId(`login-card-image-${index}`);
      expect(cardImage).toHaveAttribute("src", slide.slider_image_url);
      expect(screen.getByText(slide.slider_title)).toBeInTheDocument();
      expect(screen.getByText(slide.slider_description)).toBeInTheDocument();
    });
  });
});
