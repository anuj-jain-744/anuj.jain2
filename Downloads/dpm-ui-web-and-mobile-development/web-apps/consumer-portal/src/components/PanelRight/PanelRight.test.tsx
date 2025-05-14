import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PanelRight from "./index"; // Adjust the import path as needed

describe("PanelRight Component", () => {
  const mockChildren = <div data-testid="mock-children">Mock Children</div>;

  beforeEach(() => {
    // Reset window size before each test
    window.innerWidth = 1024; // Default to desktop view
    window.dispatchEvent(new Event("resize"));
  });

  it("should open the drawer when the sliding panel is clicked on mobile", () => {
    window.innerWidth = 768; // Simulate mobile view
    window.dispatchEvent(new Event("resize"));

    render(<PanelRight>{mockChildren}</PanelRight>);

    const slidingPanel = screen.getByText("Summary Details");
    fireEvent.click(slidingPanel); // Open the drawer

    expect(screen.getByTestId("mock-children")).toBeInTheDocument();
  });

  it("should close the drawer when clicking outside the drawer on mobile", () => {
    window.innerWidth = 768; // Simulate mobile view
    window.dispatchEvent(new Event("resize"));
    
    render(<PanelRight>{mockChildren}</PanelRight>);

    const slidingPanel = screen.getByText("Summary Details");
    fireEvent.click(slidingPanel); // Open the drawer

    // Simulate clicking outside the drawer
    fireEvent.mouseDown(document.body);

    expect(screen.queryByTestId("mock-children")).not.toBeInTheDocument();
  });
});