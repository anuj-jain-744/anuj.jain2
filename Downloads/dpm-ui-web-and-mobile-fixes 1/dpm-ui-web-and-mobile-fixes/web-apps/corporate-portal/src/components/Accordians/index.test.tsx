import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Accordians } from "./index";  // Assuming the file is in the same directory
import '@testing-library/jest-dom'; // For assertions like toBeInTheDocument

// Mocking the common keywords for testing purposes
jest.mock("../../constant", () => ({
  commonKeywords: {
    noResultTitle: "No results found",
    noResultSubTitle: "We couldn't find any FAQs.",
  },
}));

describe("Accordians Component", () => {
  it("should render FAQs correctly when content is provided", () => {
    const mockContent = [
      {
        qns: "What is React?",
        ans: "React is a JavaScript library for building user interfaces.",
      },
      {
        qns: "What is an Accordion?",
        ans: [
          { label: "Accordion Item 1", url: "/item1" },
          { label: "Accordion Item 2", url: "/item2" },
        ],
      },
    ];

    render(<Accordians content={mockContent} />);

    // Check if question is rendered
    expect(screen.getByText("What is React?")).toBeInTheDocument();
    expect(screen.getByText("What is an Accordion?")).toBeInTheDocument();

    // Check if the answer is rendered
    expect(screen.getByText("React is a JavaScript library for building user interfaces.")).toBeInTheDocument();

    // Check if the iterable accordion items are displayed
    expect(screen.getByText("Accordion Item 1")).toBeInTheDocument();
    expect(screen.getByText("Accordion Item 2")).toBeInTheDocument();
  });

  it("should render the 'NoResultFound' component when there is no content", () => {
    render(<Accordians content={[]} />);

    // Check if the 'NoResultFound' placeholder is shown
    expect(screen.getByText("No results found")).toBeInTheDocument();
    expect(screen.getByText("We couldn't find any FAQs.")).toBeInTheDocument();
  });

  it("should handle navigation on iterable items click", () => {
    const mockNavigate = jest.fn();
    const mockContent = [
      {
        qns: "What is React?",
        ans: [
          { label: "Learn React", url: "/learn-react" },
        ],
      },
    ];

    render(<Accordians content={mockContent} navigateTo={mockNavigate} />);

    // Trigger click event
    const item = screen.getByText("Learn React");
    fireEvent.click(item);

    // Check if navigateTo function was called with the correct URL
    expect(mockNavigate).toHaveBeenCalledWith("/learn-react");
  });

  it("should sanitize HTML in answers correctly", () => {
    const mockContent = [
      {
        qns: "What is HTML sanitization?",
        ans: "<div><b>This is bold</b> and <i>this is italic</i>.</div>",
      },
    ];

    render(<Accordians content={mockContent} />);

    // Check if the sanitized HTML is correctly rendered (no <b> or <i> tags should be present in the DOM)
    expect(screen.getByText("This is bold and this is italic.")).toBeInTheDocument();
    expect(screen.queryByRole("b")).toBeNull();
    expect(screen.queryByRole("i")).toBeNull();
  });
});
 