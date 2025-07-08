import React from "react";
import { render, screen } from "@testing-library/react";
import RightPanelResp from "./index";

describe("RightPanelResp Component", () => {
  const mockProps = {
    rightClassName: "test-class",
    sumaryTitle: "Test Summary",
    children: <div>Test Child</div>,
  };

  it("should render the component with the provided props", () => {
    render(<RightPanelResp {...mockProps} />);
    
    // Use `getAllByText` to handle multiple elements with the same text
    const summaryElements = screen.getAllByText("Test Summary");
    
    // Assert that the expected elements are present
    expect(summaryElements).toHaveLength(2); // Adjust the number based on your expectation
    expect(summaryElements[0]).toBeInTheDocument();
    expect(summaryElements[1]).toBeInTheDocument();
  
    // Check for the child element
    expect(screen.getByText("Test Child")).toBeInTheDocument();
  
    // Check for the alt text
    expect(screen.getByAltText("summary-details-icon")).toBeInTheDocument();
  });

   
});