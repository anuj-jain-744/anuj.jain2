import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import RelatedStories from "../RelatedStories";

describe("RelatedStories Component", () => {

  const defaultProps = {
    relatedContent: [
      {
        title: "Story Title 1",
        created_date: "2024-09-10",
        detail_url: "https://example.com/story1"
      },
      {
        title: "Story Title 2",
        created_date: "2024-09-11",
        detail_url: "https://example.com/story2"
      }
    ]
  };

  test("renders list of related stories with given props", () => {
    render(<RelatedStories {...defaultProps} />);
    
    expect(screen.getByText("Story Title 1")).toBeInTheDocument();
    expect(screen.getByText("2024-09-10")).toBeInTheDocument(); 
 
    const readTimes = screen.getAllByText("4 mins read.");
    expect(readTimes).toHaveLength(2); 
 
    expect(screen.getByRole('link', { name: "Story Title 1" })).toHaveAttribute('href', 'https://example.com/story1');
    
    expect(screen.getByText("Story Title 2")).toBeInTheDocument();
    expect(screen.getByText("2024-09-11")).toBeInTheDocument();
  });

  test("renders nothing if relatedContent is empty", () => {
    render(<RelatedStories relatedContent={[]} />);
    expect(screen.queryByText("Story Title 1")).toBeNull();
    expect(screen.queryByText("Story Title 2")).toBeNull();
  });

  test("renders nothing if relatedContent is not provided", () => {
    render(<RelatedStories />);
    expect(screen.queryByText("Story Title 1")).toBeNull();
    expect(screen.queryByText("Story Title 2")).toBeNull();
  });

});
