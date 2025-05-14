import React from "react";
import { render } from "@testing-library/react";
import { Vision } from "./index";

// Mock the navigateTo function
const mockNavigateTo = jest.fn();

// Mock the props for the Vision component
const mockProps = {
  title: "Mock Title",
  description: "Mock Description",
  menu: {
    title: "Mock Menu Title",
    items: [
      { linkName: "Mock Link 1", menuUrl: "/mock-url-1" },
      { linkName: "Mock Link 2", menuUrl: "/mock-url-2" },
    ],
  },
  thankyou: [
    { title: "Mock Thank You 1", subtitle: "Mock Subtitle 1" },
    { title: "Mock Thank You 2", subtitle: "Mock Subtitle 2" },
  ],
  isVisible: true,
  navigateTo: mockNavigateTo,
};

describe("Vision component", () => {
  it("renders correctly", () => {
    const { getByText } = render(<Vision {...mockProps} />);
    
    // Assert that the component renders the correct elements
    expect(getByText("Mock Title")).toBeInTheDocument();
    expect(getByText("Mock Description")).toBeInTheDocument();
    expect(getByText("Mock Menu Title")).toBeInTheDocument();
    expect(getByText("Mock Link 1")).toBeInTheDocument();
    expect(getByText("Mock Link 2")).toBeInTheDocument();
    expect(getByText("Mock Thank You 1")).toBeInTheDocument();
    expect(getByText("Mock Thank You 2")).toBeInTheDocument();
  });

  it("calls navigateTo function when a menu item is clicked", () => {
    const { getByText } = render(<Vision {...mockProps} />);
    
    // Simulate a click on a menu item
    getByText("Mock Link 1").click();
    
    // Assert that the navigateTo function is called with the correct URL
    expect(mockNavigateTo).toHaveBeenCalledWith("/mock-url-1");
  });
});
