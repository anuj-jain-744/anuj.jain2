import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Cards, ContentProps } from "./index";
import '@testing-library/jest-dom';

describe("src/components/Cards", () => {
  const mockNavigateTo = jest.fn();
  const content: ContentProps = {
    news_category: "Walaa",
    created_date: "2023-10-01",
    title: "Walaa Innovations",
    short_description: "A brief description of Walaa innovations.",
    detail_url: "https://example.com/news/walaa",
    image_url: "https://example.com/images/walaa.jpg",
  };
  const readMoreMockData = "Read More";

  it("renders correctly with given content", () => {
    render(<Cards navigateTo={mockNavigateTo} content={content} readMore={readMoreMockData} />);
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', content.image_url);
    expect(screen.getByText(`${content.news_category} | ${content.created_date}`)).toBeInTheDocument();
    expect(screen.getByText(content.title)).toBeInTheDocument();
    expect(screen.getByText(content.short_description)).toBeInTheDocument();
    expect(screen.getByText("Read More")).toBeInTheDocument();
  });

  it("calls navigateTo with the correct URL when 'Read More' is clicked", () => {
    render(<Cards navigateTo={mockNavigateTo} content={content} readMore={readMoreMockData} />);

    const readMore = screen.getByText("Read More");
    fireEvent.click(readMore);

    expect(mockNavigateTo).toHaveBeenCalledWith(content.detail_url);
  });
});