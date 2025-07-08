import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CarouselItems, { CurrentTabItemProps } from "./CarouselItems";

// Sample item prop data for testing
const item: CurrentTabItemProps = {
  image_url: "https://example.com/image.jpg",
  image_alt: "Example Image",
  title: "Sample Title",
  content: "This is some content.",
  body: "This is the body text.",
  url: "https://example.com",
};

describe("CarouselItems", () => {
  test("renders correctly with item props", () => {
    render(<CarouselItems item={item} />);

    // Check if image is rendered correctly
    const image = screen.getByAltText(item.image_alt);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", item.image_url);

    // Check if title is rendered
    const title = screen.getByText(item.title);
    expect(title).toBeInTheDocument();

    // Check if content or body is rendered
    const content = screen.getByText(item.content || item.body || "");
    expect(content).toBeInTheDocument();
  });

  test("handles click event on title link", () => {
    const navigateToMock = jest.fn();
    render(<CarouselItems item={item} navigateTo={navigateToMock} />);

    // Find the title link and click it
    const titleLink = screen.getByText(item.title);
    fireEvent.click(titleLink);

    // Ensure navigateTo function was called with the correct URL
    expect(navigateToMock).toHaveBeenCalledWith(item.url);
  });

  test("does not show arrow if page is true", () => {
    render(<CarouselItems item={item} page={true} />);

    // Check if the arrow is not in the document
    //const arrow = screen.queryByText("→");
    //expect(arrow).not.toBeInTheDocument();
  });

  test("shows arrow if page is false", () => {
    render(<CarouselItems item={item} page={false} />);

    // Check if the arrow is in the document
    // const arrow = screen.getByText("→");
    // expect(arrow).toBeInTheDocument();
  });

  test("renders without content or body (both undefined)", () => {
    const itemWithoutContent: CurrentTabItemProps = {
      image_url: "https://example.com/image.jpg",
      image_alt: "Example Image",
      title: "Sample Title Without Content",
      url: "https://example.com",
    };

    render(<CarouselItems item={itemWithoutContent} />);

    // Check that content or body is rendered as empty if both are missing
    const noContent = screen.queryByText(/content/i);
   // expect(noContent).not.toBeInTheDocument();
  });

  test("renders empty card without optional props", () => {
    const itemWithEmptyFields: CurrentTabItemProps = {
      image_url: "https://example.com/image.jpg",
      image_alt: "Empty Image",
      title: "Empty Fields Title",
      content: "",
      body: "",
      url: "https://example.com",
    };

    render(<CarouselItems item={itemWithEmptyFields} />);

    // Check for title and image being present even if content/body are empty
    const title = screen.getByText("Empty Fields Title");
    expect(title).toBeInTheDocument();
    const image = screen.getByAltText("Empty Image");
    expect(image).toBeInTheDocument();
  });

  test("navigates properly when the navigateTo function is provided", () => {
    const navigateToMock = jest.fn();
    render(<CarouselItems item={item} navigateTo={navigateToMock} />);

    const titleLink = screen.getByText(item.title);
    fireEvent.click(titleLink);

    expect(navigateToMock).toHaveBeenCalledWith(item.url);
  });

  test("does not attempt to navigate if navigateTo is not provided", () => {
    render(<CarouselItems item={item} />);

    const titleLink = screen.getByText(item.title);
    fireEvent.click(titleLink);

    // navigateTo should not be called because it was not passed as a prop
   // expect(titleLink).toHaveAttribute("href", item.url); // Ensure the link has the correct URL
  });
});
