import React from "react";
import { render, screen } from "@testing-library/react";
import EndorsementSuccess from "./EndorsementSuccess";

// Mock the components that are imported into EndorsementSuccess
jest.mock("./SuccessTopComponent", () => jest.fn(() => <div>SuccessTopComponent</div>));
jest.mock("./EndorsementSuccessLeftComponent", () => jest.fn(() => <div>EndorsementSuccessLeftComponent</div>));
jest.mock("./SuccesRightComponent", () => jest.fn(() => <div>SuccesRightComponent</div>));

describe("EndorsementSuccess Component", () => {
  test("renders EndorsementSuccess with correct structure and props", () => {
    const msg = "Test Success Message";
    
    // Render the component
    render(<EndorsementSuccess msg={msg} />);
    
    // Check if SuccessTopComponent receives the correct prop
    expect(screen.getByText("SuccessTopComponent")).toBeInTheDocument();

    // Check for the SuccessTopComponent message prop
    expect(screen.getByText("Test Success Message")).toBeInTheDocument();
    
    // Check for the EndorsementSuccessLeftComponent rendering
    expect(screen.getByText("EndorsementSuccessLeftComponent")).toBeInTheDocument();
    
    // Check for the SuccesRightComponent rendering
    expect(screen.getByText("SuccesRightComponent")).toBeInTheDocument();
  });

  test("renders correct container structure", () => {
    const msg = "Another test message";

    render(<EndorsementSuccess msg={msg} />);

    // Check if the main container and its inner div elements exist
    const successContainer = screen.getByRole('main'); // Assuming the main container has a role of "main"
    expect(successContainer).toBeInTheDocument();

    const cardsContainer = screen.getByText("SuccesRightComponent").parentElement; // Access the parent container of SuccesRightComponent
    expect(cardsContainer).toHaveClass("cards-container"); // Verify that the cards-container class exists
  });
});
