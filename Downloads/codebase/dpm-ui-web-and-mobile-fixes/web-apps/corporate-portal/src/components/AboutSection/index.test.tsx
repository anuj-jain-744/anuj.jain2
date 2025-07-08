import React from "react";
import { render, screen } from "@testing-library/react";
import { AboutSection } from "./index";
import { sanitizeHtml } from "@dpm/shared-module";

jest.mock("@dpm/shared-module", () => ({
  sanitizeHtml: jest.fn((html) => html), // Mock sanitizeHtml to return the input HTML
}));

jest.mock("../../components/RelatedLink", () => ({
  RelatedLink: jest.fn(() => <div data-testid="related-link">Mock RelatedLink</div>),
}));

describe("AboutSection Component", () => {
  const mockContent = "<p>Test content</p>";
  const mockRelatedTitle = "Related Title";
  const mockRelatedLink = [{ url: "/test", label: "Test Link" }];

  it("renders correctly with provided props", () => {
    render(
      <AboutSection
        content={mockContent}
        isVisible={true}
        relatedTitle={mockRelatedTitle}
        relatedlink={mockRelatedLink}
      />
    );

    // Verify sanitizeHtml is called with the correct content
    expect(sanitizeHtml).toHaveBeenCalledWith(mockContent);

    // Verify the content is rendered
    const contentElement = screen.getByText("Test content");
    expect(contentElement).toBeInTheDocument();

    // Verify the RelatedLink component is rendered
    const relatedLinkElement = screen.getByTestId("related-link");
    expect(relatedLinkElement).toBeInTheDocument();

    // Verify the related title is rendered
    const relatedTitleElement = screen.getByText(mockRelatedTitle);
    expect(relatedTitleElement).toBeInTheDocument();
  });

  it("applies animation styles when isVisible is true", () => {
    render(
      <AboutSection
        content={mockContent}
        isVisible={true}
        relatedTitle={mockRelatedTitle}
        relatedlink={mockRelatedLink}
      />
    );

    const animatedDiv = screen.getByTestId("aboutsection");
    expect(animatedDiv).toHaveStyle("transform: translateX(0%) translateY(100%)");
  });

  it("does not apply animation styles when isVisible is false", () => {
    render(
      <AboutSection
        content={mockContent}
        isVisible={false}
        relatedTitle={mockRelatedTitle}
        relatedlink={mockRelatedLink}
      />
    );

    const animatedDiv = screen.getByTestId("aboutsection");
    expect(animatedDiv).not.toHaveStyle("transform: translateX(0%) translateY(100%)");
  });
});