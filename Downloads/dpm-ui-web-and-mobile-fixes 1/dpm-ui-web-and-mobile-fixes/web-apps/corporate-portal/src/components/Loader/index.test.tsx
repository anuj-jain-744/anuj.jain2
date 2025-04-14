import React from "react";
import { render, screen } from "@testing-library/react";
import { LoaderOverlay } from "./index";  
import "@testing-library/jest-dom";  

// Mocking react-bootstrap Spinner component to avoid unnecessary complexity in testing
jest.mock("react-bootstrap/Spinner", () => {
  return ({ animation, role, children }: any) => (
    <div role={role} className={`spinner-border ${animation}`}>
      {children}
    </div>
  );
});

describe("LoaderOverlay", () => {
  it("renders the LoaderOverlay component with a spinner", () => {
    render(<LoaderOverlay />);

    // Assert the presence of the spinner in the document
    const spinnerElement = screen.getByRole("status");
    expect(spinnerElement).toBeInTheDocument();
    
    // Check if the visually-hidden text is also present
    const hiddenText = screen.getByText(/loading/i);
    expect(hiddenText).toBeInTheDocument();
  });

  it("should have the correct class for overlay", () => {
    render(<LoaderOverlay />);
    const overlayDiv = screen.getByRole("status").parentElement;  // the div wrapping the spinner
    expect(overlayDiv).toHaveClass("loader-overlay");
  });
});
