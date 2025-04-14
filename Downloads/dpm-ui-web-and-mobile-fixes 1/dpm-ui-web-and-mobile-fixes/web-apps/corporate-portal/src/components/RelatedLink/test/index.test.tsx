import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { RelatedLink } from "../index";
import RelatedStories, { RelatedContentProps } from "../RelatedStories";
import RelatedUrls, { RelatedUrlProps } from "../RelatedUrls";

// Mock of the RelatedStories and RelatedUrls components  
jest.mock("../RelatedStories", () => ({
  __esModule: true,
  default: jest.fn(() => <div>Related Stories Component</div>)
}));

jest.mock("../RelatedUrls", () => ({
  __esModule: true,
  default: jest.fn(() => <div>Related URLs Component</div>)
}));

describe("RelatedLink Component", () => {
  
  const defaultRelatedContent: RelatedContentProps[] = [{
    title: "Story Title",
    created_date: "2024-09-11",
    detail_url: "https://example.com/story"
  }];

  const defaultRelatedUrlContent: RelatedUrlProps[] = [{
    page_title: "Sample Title",
    page_link: "https://example.com",
  }];

  test("renders RelatedStories when type is 'Academy'", () => {
    render(<RelatedLink 
      type="Academy" 
      relatedContent={defaultRelatedContent} 
      relatedUrlContent={defaultRelatedUrlContent} 
    />);
    expect(screen.getByText("Related Stories Component")).toBeInTheDocument();
    expect(screen.queryByText("Related URLs Component")).toBeNull();
  });

  test("renders RelatedUrls when type is 'Privacy'", () => {
    render(<RelatedLink 
      type="Privacy" 
      relatedContent={defaultRelatedContent} 
      relatedUrlContent={defaultRelatedUrlContent} 
    />); 
    expect(screen.getByText("Related URLs Component")).toBeInTheDocument();
    expect(screen.queryByText("Related Stories Component")).toBeNull();
  });

  test("passes correct props to RelatedUrls", () => {
    render(<RelatedLink 
      type="Privacy" 
      relatedContent={defaultRelatedContent} 
      relatedUrlContent={defaultRelatedUrlContent} 
    />);
    expect(RelatedUrls).toHaveBeenCalledWith(
      { relatedUrlContent: defaultRelatedUrlContent },
      {}
    );
  });

});
