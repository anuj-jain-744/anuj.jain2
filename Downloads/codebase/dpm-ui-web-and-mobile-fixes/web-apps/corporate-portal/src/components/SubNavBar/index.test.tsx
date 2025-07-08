import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { SubNavBar } from "./index";
import { scrollToElement } from "@dpm/shared-module";

jest.mock("@dpm/shared-module", () => ({
  scrollToElement: jest.fn(),
}));

jest.mock("../../utils/createTableSpring", () => ({
  createTableSpring: jest.fn(() => ({ transform: "mock" })),
}));

jest.mock("../../../../corporate-portal/src/constant", () => ({
  productIDs: {
    services: "services",
    faqs: "faqs",
  },
}));

const mockContent = [
  { value: "Overview" },
  { value: "Services" },
  { value: "FAQs" },
];

const productIDs = {
  services: "services",
  faqs: "faqs",
};

describe("SubNavBar Component", () => {
  it("renders tabs based on content prop", () => {
    render(<SubNavBar content={mockContent} />);
    expect(screen.getByTestId("productToggle-0")).toBeInTheDocument();
    expect(screen.getByTestId("productToggle-services")).toBeInTheDocument();
    expect(screen.getByTestId("productToggle-faqs")).toBeInTheDocument();
  });

  it('applies "active" class when tab is clicked', () => {
    render(<SubNavBar content={mockContent} />);
    const firstTab = screen.getByTestId("productToggle-0");
    fireEvent.click(firstTab);
    expect(firstTab.className).toContain("active");
  });

  it("calls scrollToElement with correct ID on click", () => {
    render(<SubNavBar content={mockContent} />);
    const faqTab = screen.getByTestId("productToggle-faqs");
    fireEvent.click(faqTab);
    expect(scrollToElement).toHaveBeenCalledWith("productToggle-faqs", -90);
  });

  it("handles Enter key press to trigger scroll and tab activation", () => {
    render(<SubNavBar content={mockContent} />);
    const serviceTab = screen.getByTestId("productToggle-services");
    fireEvent.keyDown(serviceTab, { key: "Enter" });
    expect(scrollToElement).toHaveBeenCalledWith("productToggle-services", -90);
  });

  it("applies getQuoteWidget class when hasGetQuoteWidget is true", () => {
    const { container } = render(
      <SubNavBar content={mockContent} hasGetQuoteWidget={true} />
    );
    expect(container.firstChild).toHaveClass("getQuoteWidget");
  });
});
