import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import KnowMore, { KnowMoreUrlProps } from "../KnowMore";

describe("KnowMore Component", () => {
  const mockKnowMoreUrls: KnowMoreUrlProps[] = [
    { page_title: "Page 1", page_link: "https://example.com/page1" },
    { page_title: "Page 2", page_link: "https://example.com/page2" }
  ];

  test("renders KnowMore component", () => {
    render(<KnowMore knowMoreUrls={mockKnowMoreUrls} />);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  test("renders the correct number of URLs", () => {
    render(<KnowMore knowMoreUrls={mockKnowMoreUrls} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(mockKnowMoreUrls.length);
  });

  test("renders URLs with correct titles and links", () => {
    render(<KnowMore knowMoreUrls={mockKnowMoreUrls} />);
    mockKnowMoreUrls.forEach(({ page_title, page_link }) => {
      const linkElement = screen.getByText(page_title);
      expect(linkElement).toBeInTheDocument();
      expect(linkElement.closest('a')).toHaveAttribute('href', page_link);
    });
  });

  test("renders nothing when knowMoreUrls is empty", () => {
    render(<KnowMore knowMoreUrls={[]} />);
    expect(screen.queryByRole('listitem')).toBeNull();
  });
});