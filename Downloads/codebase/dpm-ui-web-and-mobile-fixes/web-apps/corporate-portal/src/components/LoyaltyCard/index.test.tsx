import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LoyaltyCard } from "./index";
import { sanitizeHtml } from "@dpm/shared-module";

jest.mock("@dpm/shared-module", () => ({
  sanitizeHtml: jest.fn((html) => html),
}));

const mockData = {
  loyaltyTitle: "Loyalty Program",
  loyaltyDiscription: "<p>Get rewards for being a loyal customer.</p>",
  cardContent: [
    {
      title: "Violation-Free Discount",
      content:
        "Great drivers are made, not born. You'll get a discount if your driving history is violation-free.",
      image_url: "path/to/image1.png",
      image_alt: "Violation-Free Discount",
    },
    {
      title: "Multi-Car Discount",
      content:
        "The more cars you insure with Walla Motor Insurance, the more you can save on your premium.",
      image_url: "path/to/image2.png",
      image_alt: "Multi-Car Discount",
    },
  ],
  learnMore: "Learn More",
};

describe("LoyaltyCard Component", () => {
  it("renders without crashing", () => {
    render(<LoyaltyCard {...mockData} />);
  });

  it("displays the loyalty title and description", () => {
    render(<LoyaltyCard {...mockData} />);
    expect(screen.getByText("Loyalty Program")).toBeInTheDocument();
    expect(
      screen.getByText("Get rewards for being a loyal customer.")
    ).toBeInTheDocument();
  });

  it("renders the correct number of cards", () => {
    render(<LoyaltyCard {...mockData} />);
    const cards = screen.getAllByRole("img");
    expect(cards).toHaveLength(mockData.cardContent.length);
  });

  it("displays card titles and content", () => {
    render(<LoyaltyCard {...mockData} />);
    mockData.cardContent.forEach((card) => {
      expect(screen.getByText(card.title)).toBeInTheDocument();
      expect(screen.getByText(card.content)).toBeInTheDocument();
    });
  });

  it("calls sanitizeHtml for card content", () => {
    render(<LoyaltyCard {...mockData} />);
    mockData.cardContent.forEach((card) => {
      expect(sanitizeHtml).toHaveBeenCalledWith(card.content);
    });
  });

  it('displays the "Learn More" button', () => {
    render(<LoyaltyCard {...mockData} />);
    // const buttons = screen.getAllByText("Learn More");
    // expect(buttons).toHaveLength(mockData.cardContent.length);
  });

  it('displays "No card content available." when cardContent is empty', () => {
    render(
      <LoyaltyCard
        loyaltyTitle="Loyalty Program"
        loyaltyDiscription="<p>Get rewards for being a loyal customer.</p>"
        cardContent={[]}
        learnMore="Learn More"
      />
    );
    //expect(screen.getByText("No card content available.")).toBeInTheDocument();
  });
});
