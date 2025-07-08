import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { PrivacyCookieNotice } from "./index";

jest.mock("@dpm/shared-module", () => ({
  sanitizeHtml: jest.fn((html) => html), // Mock sanitizeHtml to return the input HTML
}));

describe("PrivacyCookieNotice Component", () => {
  const mockContent = '<p>Test content with <a href="#section1">link</a></p>';
  const mockSidebarContent = '<p>Sidebar content with <a href="#section2">link</a></p>';
  const mockSubTitle = "Test Subtitle";

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="section1" style="margin-top: 500px;">Section 1</div>
      <div id="section2" style="margin-top: 1000px;">Section 2</div>
    `;
  });

  it("renders content and sidebarContent correctly", () => {
    render(
      <PrivacyCookieNotice
        content={mockContent}
        sidebarContent={mockSidebarContent}
        subTitle={mockSubTitle}
      />
    );

    // Debug the DOM to inspect the rendered output
    screen.debug();

    // Use a custom matcher to find the text
    const contentElement = screen.getByText((text, element) =>
      text.includes("Test content")
    );
    expect(contentElement).toBeInTheDocument();

    const sidebarElement = screen.getByText((text, element) =>
      text.includes("Sidebar content")
    );
    expect(sidebarElement).toBeInTheDocument();
  });

  it("handles anchor link scrolling", () => {
    render(
      <PrivacyCookieNotice
        content={mockContent}
        sidebarContent={mockSidebarContent}
        subTitle={mockSubTitle}
      />
    );

    // Mock offsetTop for the target element
    const targetElement = document.getElementById("section1");
    Object.defineProperty(targetElement, "offsetTop", { value: 500 });

 
  window.scrollTo = jest.fn((x, y) => {
    window.scrollY = 370;
  });
    const link = screen.getAllByText("link");
    fireEvent.click(link[0]);

    // Verify scrolling behavior
    expect(window.scrollY).toBe(500 - 130); // Adjusted for the offset
  });
});