import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { WalaaObjective } from "./index";
 
describe("WalaaObjective Component", () => {
  const mockProps = {
    title: "Our Objectives",
    cards: [
      { icon: "icon1.png", alt: "Icon 1", description: "Description 1" },
      { icon: "icon2.png", alt: "Icon 2", description: "Description 2" },
      { icon: "icon3.png", alt: "Icon 3", description: "Description 3" },
      { icon: "icon4.png", alt: "Icon 4", description: "Description 4" },
    ],
  };
 
  it("renders the title correctly", () => {
    render(<WalaaObjective {...mockProps} />);
    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
  });
 
  it("renders the initial visible cards correctly", () => {
    render(<WalaaObjective {...mockProps} />);
    mockProps.cards.slice(0, 3).forEach((card) => {
      expect(screen.getByAltText(card.alt)).toBeInTheDocument();
      expect(screen.getByText(card.description)).toBeInTheDocument();
    });
  });
 
  it("disables the previous button on the first slide", () => {
    render(<WalaaObjective {...mockProps} />);
    const previousButton = screen.getByRole("button", { name: /chevronleft/i });
    expect(previousButton).toHaveClass("disable");
    expect(previousButton).toHaveAttribute("style", "pointer-events: none;");
  });
 
  it("disables the next button when there are no more cards to show", () => {
    render(<WalaaObjective {...mockProps} />);
    // Navigate to the last slide
    const nextButton = screen.getByRole("button", { name: /chevronright/i });
    fireEvent.click(nextButton);
 
    // After navigating to the last slide, the next button should be disabled
    expect(nextButton).toHaveClass("disable");
    expect(nextButton).toHaveAttribute("style", "pointer-events: none;");
  });
 
  it("enables the next button when more cards are available", () => {
    render(<WalaaObjective {...mockProps} />);
    const nextButton = screen.getByRole("button", { name: /chevronright/i });
    expect(nextButton).not.toHaveClass("disable");
  });
 
  it("navigates to the next slide when the next button is clicked", () => {
    render(<WalaaObjective {...mockProps} />);
    const nextButton = screen.getByRole("button", { name: /chevronright/i });
    fireEvent.click(nextButton);
 
    expect(screen.getByAltText("Icon 4")).toBeInTheDocument();
    expect(screen.queryByAltText("Icon 1")).not.toBeInTheDocument();
  });
 
  it("navigates to the previous slide when the previous button is clicked", () => {
    render(<WalaaObjective {...mockProps} />);
    const nextButton = screen.getByRole("button", { name: /chevronright/i });
    fireEvent.click(nextButton);
 
    const previousButton = screen.getByRole("button", { name: /chevronleft/i });
    fireEvent.click(previousButton);
 
    expect(screen.getByAltText("Icon 1")).toBeInTheDocument();
    expect(screen.queryByAltText("Icon 4")).not.toBeInTheDocument();
  });
 
  it("does not navigate when the previous button is clicked on the first slide", () => {
    render(<WalaaObjective {...mockProps} />);
    const previousButton = screen.getByRole("button", { name: /chevronleft/i });
    fireEvent.click(previousButton);  // First slide, no change expected
    expect(screen.getByAltText("Icon 1")).toBeInTheDocument();
  });
 
  it("does not navigate when the next button is clicked on the last slide", () => {
    render(<WalaaObjective {...mockProps} />);
    const nextButton = screen.getByRole("button", { name: /chevronright/i });
    fireEvent.click(nextButton);  // Moving to the last slide
    fireEvent.click(nextButton);  // Clicking again should not change the view
 
    expect(screen.getByAltText("Icon 4")).toBeInTheDocument();
  });
 
  // Test edge case for no cards
  it("renders nothing if no cards are passed", () => {
    render(<WalaaObjective title="No Cards" cards={[]} />);
    expect(screen.queryByText("No Cards")).toBeInTheDocument();
    expect(screen.queryByAltText("Icon")).not.toBeInTheDocument();
  });
 
  // Test edge case for a single card
  it("renders only one card if only one card is passed", () => {
    const singleCardProps = { ...mockProps, cards: [mockProps.cards[0]] };
    render(<WalaaObjective {...singleCardProps} />);
    expect(screen.getByAltText("Icon 1")).toBeInTheDocument();
    expect(screen.queryByAltText("Icon 2")).not.toBeInTheDocument();
  });
 
  // Test for exact number of cards equal to max visible cards (3)
  it("renders exactly 3 cards when there are 3 cards", () => {
    const threeCardsProps = { ...mockProps, cards: mockProps.cards.slice(0, 3) };
    render(<WalaaObjective {...threeCardsProps} />);
    expect(screen.getByAltText("Icon 1")).toBeInTheDocument();
    expect(screen.getByAltText("Icon 2")).toBeInTheDocument();
    expect(screen.getByAltText("Icon 3")).toBeInTheDocument();
  });
});
 
 
 